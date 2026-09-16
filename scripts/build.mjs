import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
mkdirSync('dist',{recursive:true});
copyFileSync('index.html','dist/index.html');
copyFileSync('src/app.js','dist/app.js');
copyFileSync('src/styles.css','dist/styles.css');
writeFileSync('dist/build-manifest.json',JSON.stringify({name:'FuelPulse Customer',generatedAt:new Date().toISOString(),files:['index.html','app.js','styles.css']},null,2));
console.log('Built dist/');
