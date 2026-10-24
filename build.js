const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
const gTxt=src.slice(src.indexOf('const G = ')+10, src.indexOf('};',src.indexOf('const G = '))+1);
const eTxt=src.slice(src.indexOf('const E = ')+10, src.indexOf('];',src.indexOf('const E = '))+1);
const G=eval('('+gTxt+')'), E=eval('('+eTxt+')');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let html='',cur=null;
for(const e of E){
  if(e.day!==cur){ if(cur!==null) html+='</div></section>'; cur=e.day; html+=`<section class="day"><h2>${esc(e.day)}</h2><div class="list">`; }
  const g=G[e.g];
  html+=`<article class="ev${e.pick?' pick':''}"><div class="time">${esc(e.t||'–')}</div><div class="main"><p class="title">${esc(e.title)}</p><div class="meta">${esc(e.place)}</div><div class="tags"><span class="genre" style="--c:var(${g.c})">${esc(e.genre)}</span><span class="price">${esc(e.price)}</span>${e.pick?'<span class="star">★ Vinkki</span>':''}</div></div>${e.note?`<div class="note">${esc(e.note)}</div>`:''}</article>`;
}
html+='</div></section>';
let out=src.replace('<main id="out"></main>',`<main id="out">${html}</main>`);
out=`<!doctype html>\n<html lang="fi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n`+
  out.replace('<style>','<style>\nbody{margin:0}').replace('</style>','</style>\n</head>\n<body>')+'\n</body>\n</html>\n';
fs.writeFileSync(process.argv[3],out);
