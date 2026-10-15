import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'tests/e2e',fullyParallel:false,use:{baseURL:'http://127.0.0.1:5173',channel:'msedge',headless:true},reporter:'list',webServer:{command:'node node_modules/vite/bin/vite.js --host 127.0.0.1 --configLoader native',url:'http://127.0.0.1:5173',reuseExistingServer:true},timeout:30000});

