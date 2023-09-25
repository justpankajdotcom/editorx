import React, { useState, useEffect } from "react";
import { TypstDocument } from "./lib/TypstDocument";
import * as typst from "@myriaddreamin/typst.ts";
import { createTypstCompiler } from "@myriaddreamin/typst.ts";
import { withAccessModel } from "@myriaddreamin/typst.ts/dist/esm/options.init";
import { FsAccessModel } from "@myriaddreamin/typst.ts/dist/esm/internal.types";
import { FetchAccessOptions } from "@myriaddreamin/typst.ts";

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
    typst.preloadRemoteFonts([
      "http://localhost:20810/assets/fonts/LinLibertine_R.ttf",
      "http://localhost:20810/assets/fonts/LinLibertine_RB.ttf",
      "http://localhost:20810/assets/fonts/LinLibertine_RBI.ttf",
      "http://localhost:20810/assets/fonts/LinLibertine_RI.ttf",
      "http://localhost:20810/assets/fonts/NewCMMath-Book.otf",
      "http://localhost:20810/assets/fonts/NewCMMath-Regular.otf",
    ]),
  ],
  getModule: () => "/typst-renderer.wasm",
});

export default function Compile({ codeAsString }: { codeAsString: string }) {
  const [artifact, setArtifact] = useState<Uint8Array>(new Uint8Array(0));

  const accessModel = new InMemoryAccessModel("memory");

  const getArtifactData = async (codeAsString: string) => {
    const compiler = createTypstCompiler();
    await compiler
      .init({
        beforeBuild: [withAccessModel(accessModel)],
        getModule() {
          return "/typst-compiler.wasm";
        },
      })
      .then(async () => {
        accessModel.addSourceFile("/main.typ", codeAsString, new Date());
      });
    const result = await compiler.compile({ mainFilePath: "/main.typ" });
    console.log("/main.typ", result);
    setArtifact(result);
  };

  useEffect(() => {
    getArtifactData(codeAsString);
  }, [codeAsString]);

  useEffect(() => {
    getArtifactData(codeAsString);
  }, []);

  return (
    <>
        <TypstDocument fill="#ffffff" artifact={artifact} />
    </>
  );
}
