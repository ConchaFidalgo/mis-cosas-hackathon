import {createRequire} from 'node:module';
const {build}=createRequire(import.meta.resolve('vite'))('esbuild');
await build({entryPoints:['supabase/functions/collection-api/index.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',external:['https://*'],outfile:'.qa/collection-api/index.ts'});
