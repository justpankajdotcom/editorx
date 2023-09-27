import React, { useState, useEffect } from "react";
import { TypstDocument } from "./lib/TypstDocument";
import { withAccessModel } from "@myriaddreamin/typst.ts/dist/esm/options.init.mjs";
import * as typst from "@myriaddreamin/typst.ts";
import { FsAccessModel } from "@myriaddreamin/typst.ts/dist/esm/internal.types.mjs";
import { FetchAccessOptions } from "@myriaddreamin/typst.ts";
import { withGlobalCompiler } from "../contrib/global-compiler";

export class InMemoryAccessModel implements FsAccessModel {
  public mTimes: Map<string, Date | undefined> = new Map();
  public mData: Map<string, Uint8Array | undefined> = new Map();
  constructor(private root: string, options?: FetchAccessOptions) {
    if (root.endsWith("/")) {
      this.root = this.root.slice(0, this.root.length - 1);
    }
  }

  addFile(path: string, data: Uint8Array, mtime?: Date) {
    this.mTimes.set(path, mtime);
    this.mData.set(path, data);
  }

  addSourceFile(path: string, data: string, mtime?: Date) {
    const encoder = new TextEncoder();
    this.addFile(path, encoder.encode(data), mtime);
  }

  reset() {
    this.mTimes.clear();
    this.mData.clear();
  }

  resolvePath(path: string): string {
    return this.root + path;
  }

  getMTime(path: string): Date | undefined {
    if (this.mTimes.has(path)) {
      return this.mTimes.get(path);
    }
    throw new Error(`no such file ${path}`);
  }

  isFile(): boolean | undefined {
    return true;
  }

  getRealPath(path: string): string | undefined {
    return path;
  }

  readAll(path: string): Uint8Array | undefined {
    if (this.mData.has(path)) {
      return this.mData.get(path);
    }
    throw new Error(`no such file ${path}`);
  }
}

const containerStyle = {
  height: "1200px", // Set the desired height for your editor
  overflow: "scroll", // Enable vertical scrolling
  pointerEvents: "none",
  cursor: "none",
};

TypstDocument.setWasmModuleInitOptions({
  beforeBuild: [
    // You won't need this as the fonts are already loaded from GitHub
    // typst.preloadRemoteFonts([
    //   "http://localhost:20810/assets/fonts/LinLibertine_R.ttf",
    //   "http://localhost:20810/assets/fonts/LinLibertine_RB.ttf",
    //   "http://localhost:20810/assets/fonts/LinLibertine_RBI.ttf",
    //   "http://localhost:20810/assets/fonts/LinLibertine_RI.ttf",
    //   "http://localhost:20810/assets/fonts/NewCMMath-Book.otf",
    //   "http://localhost:20810/assets/fonts/NewCMMath-Regular.otf",
    // ]),
  ],
  getModule: () => "/typst-renderer.wasm",
});

const accessModel = new InMemoryAccessModel("memory");

const moduleInitOptions: typst.InitOptions = {
  beforeBuild: [withAccessModel(accessModel)],
  getModule() {
    return "/typst-compiler.wasm";
  },
};

export default function Compile({ codeAsString }: { codeAsString: string }) {
  const [artifact, setArtifact] = useState<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    // Use a global compiler is okay when you don't want to compile document in parallel
    const doCompile = async (compiler: typst.TypstCompiler) => {
      const t1 = performance.now();
      // Don't forget to reset the compiler, they are caching your source files
      // I think it is bug-prone, I will think of good pattern to avoid this.
      compiler.reset();

      accessModel.addSourceFile("/main.typ", codeAsString, new Date());
      console.log(accessModel);
        // todo: remove optional format
      try {
        const result = await compiler.compile({ mainFilePath: "/main.typ", format: "vector" });
        const t2 = performance.now();
        console.log("compiled", result,
          `compile time: ${t2 - t1}ms`);
        setArtifact(result);
      } catch (e) {
        console.log('compile error', e);
      }
    };

    console.log('createTypstCompiler', codeAsString);
    withGlobalCompiler(
      typst.createTypstCompiler,
      moduleInitOptions,
      doCompile,
    );
  }, [codeAsString]);

  return (
    <>
        <TypstDocument fill="#ffffff" artifact={artifact} />
    </>
  );
}
