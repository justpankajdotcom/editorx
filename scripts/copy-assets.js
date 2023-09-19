
const { copyFileSync } = require('fs');

copyFileSync('node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm', 'public/typst-renderer.wasm');
copyFileSync('node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm', 'public/typst-compiler.wasm');
