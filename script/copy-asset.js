
const { copyFileSync } = require('fs');

copyFileSync('node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm', 'public/typst-renderer.wasm');
