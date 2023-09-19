import { useEffect, useState } from 'react';
import { TypstDocument } from './lib';
import * as typst from '@myriaddreamin/typst.ts';

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
    // please get artifact 
    const response = await fetch('http://localhost:20810/corpus/skyzh-cv/main.white.artifact.sir.in');
    const buffer = await response.arrayBuffer();
    const artifactData = new Uint8Array(buffer);
  
    console.log("response ==> ", artifactData);
    setArtifact(artifactData);
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