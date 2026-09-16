import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
mkdirSync('dist',{recursive:true});
for (const file of ['index.html','src/app.js','src/styles.css','src/scanfix.js','manifest.json','sw.js','icon-192.svg','icon-512.svg']) {
  const out=file.startsWith('src/')?file.slice(4):file;
  copyFileSync(file,`dist/${out}`);
}
writeFileSync('dist/build-manifest.json',JSON.stringify({name:'FuelPulse Customer',generatedAt:new Date().toISOString(),files:['index.html','app.js','styles.css','scanfix.js','manifest.json','sw.js','icon-192.svg','icon-512.svg']},null,2));
console.log('Built dist/');
