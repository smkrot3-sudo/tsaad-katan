import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const svg=fs.readFileSync('tools/icon.svg','utf8');
const b=await chromium.launch();
const sizes={mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192};
for(const [d,s] of Object.entries({...sizes,store:512})){
  const p=await b.newPage({viewport:{width:s,height:s}});
  await p.setContent('<html><body style="margin:0;background:transparent">'+svg.replace('<svg ','<svg width="'+s+'" height="'+s+'" ')+'</body></html>');
  const out=d==='store'?'tools/icon-512.png':'res/mipmap-'+d+'/ic_launcher.png';
  fs.mkdirSync(out.replace(/\/[^/]+$/,''),{recursive:true});
  await p.screenshot({path:out,omitBackground:true,clip:{x:0,y:0,width:s,height:s}});
  await p.close();
}
await b.close();
