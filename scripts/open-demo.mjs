import {execFileSync,spawn} from 'node:child_process';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
execFileSync(process.execPath,[join(root,'scripts/start-demo.mjs')],{cwd:root,windowsHide:true,stdio:'ignore'});
spawn('explorer.exe',['http://127.0.0.1:5173/inicio'],{detached:true,windowsHide:true,stdio:'ignore'}).unref();
