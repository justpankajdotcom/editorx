import { useEffect, useState } from 'react';
import { TypstDocument } from './lib';
import * as typst from '@myriaddreamin/typst.ts';
import { createTypstCompiler } from '@myriaddreamin/typst.ts';
import { withAccessModel } from '@myriaddreamin/typst.ts/dist/esm/options.init';

TypstDocument.setWasmModuleInitOptions({
  beforeBuild: [
    typst.preloadRemoteFonts([
      'http://localhost:20810/assets/fonts/LinLibertine_R.ttf',
      'http://localhost:20810/assets/fonts/LinLibertine_RB.ttf',
      'http://localhost:20810/assets/fonts/LinLibertine_RBI.ttf',
      'http://localhost:20810/assets/fonts/LinLibertine_RI.ttf',
      'http://localhost:20810/assets/fonts/NewCMMath-Book.otf',
      'http://localhost:20810/assets/fonts/NewCMMath-Regular.otf',
    ]),
    // typst.preloadSystemFonts({
    //   byFamily: ['Segoe UI Symbol'],
    // }),
  ],
  getModule: () =>
    '/typst-renderer.wasm',
});

export const App = () => {
  const [artifact, setArtifact] = useState<Uint8Array>(new Uint8Array(0));

  const getArtifactData = async () => {
    const compiler = createTypstCompiler();
    compiler.init({
      beforeBuild: [
        // todo: we don't need it actually. I remember I did it by default, but why it doesn't work?
        withAccessModel(undefined as any),
      ],
      getModule() {
        return '/typst-compiler.wasm'
      },
    }).then(async () => {
    compiler.addSource('/main.typ', `
#set text(fill: white)
Hello, typst!`);
    const result = await compiler.compile({ mainFilePath: '/main.typ' });
    console.log('/main.typ', result);
    // console.log("response ==> ", artifactData);
    setArtifact(result);
  })


    // please get artifact 
    // const response = await fetch('http://localhost:20810/corpus/skyzh-cv/main.white.artifact.sir.in');
    // const buffer = await response.arrayBuffer();
    // const artifactData = new Uint8Array(buffer);
  
  };
  

  useEffect(() => {
    getArtifactData();
  }, []);

  return (
    <div>
      <h1
        style={{
          color: 'white',
          fontSize: '20px',
          fontFamily: `'Garamond', sans-serif`,
          margin: '20px',
        }}
      >
        Demo: Embed Your Typst Document in React
      </h1>
      <TypstDocument fill="#343541" artifact={artifact} />
    </div>
  );
};