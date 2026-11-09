/* ================= 7.0 ================= */

/* ---------- calm corner: breathing with the companion, grounding 5-4-3-2-1, soft sound ---------- */
let calmTimer=null,calmAudio=null;
/* soft background sounds, all made right here with WebAudio (no files): a warm pad, rain, waves, a crackling fire, birds */
const SOUNDS=[['pad','🎵','רך'],['rain','🌧️','גשם'],['waves','🌊','גלים'],['fire','🔥','אש'],['birds','🐦','ציפורים']];
function noiseBuf(ctx,kind){
  const n=ctx.sampleRate*3,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let l=0,p0=0,p1=0,p2=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;
    if(kind==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.5}
    else if(kind==='pink'){p0=.997*p0+w*.029591;p1=.985*p1+w*.032534;p2=.95*p2+w*.048056;d[i]=(p0+p1+p2+w*.05)*1.6}
    else d[i]=w}
  return b;
}
function calmSound(on){
  if(!on){if(calmAudio){const a=calmAudio;calmAudio=null;a.timers.forEach(t=>{clearInterval(t);clearTimeout(t)});a.alive=false;try{a.g.gain.cancelScheduledValues(a.ctx.currentTime);a.g.gain.setValueAtTime(a.g.gain.value,a.ctx.currentTime);a.g.gain.linearRampToValueAtTime(0,a.ctx.currentTime+1.2);setTimeout(()=>a.ctx.close(),1500)}catch(e){}}return}
  const kind=typeof on==='string'?on:'pad';
  if(calmAudio&&calmAudio.kind===kind)return;
  if(calmAudio)calmSound(false);
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)(),g=ctx.createGain();g.gain.value=0;g.connect(ctx.destination);
    const A={ctx,g,kind,timers:[],alive:true};calmAudio=A;
    const loop=(type,fType,freq,q,vol,dest)=>{const src=ctx.createBufferSource();src.buffer=noiseBuf(ctx,type);src.loop=true;const f=ctx.createBiquadFilter();f.type=fType;f.frequency.value=freq;if(q)f.Q.value=q;const v=ctx.createGain();v.gain.value=vol;src.connect(f);f.connect(v);v.connect(dest||g);src.start();return {src,f,v}};
    const later=(fn,ms)=>{const t=setTimeout(()=>{if(A.alive)fn()},ms);A.timers.push(t)};
    let target=.16;
    if(kind==='pad'){
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.connect(g);
      const chords=[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[196,246.94,329.63]];
      const oscs=[0,1,2].map(i=>{const o=ctx.createOscillator(),og=ctx.createGain();o.type=i===1?'triangle':'sine';o.frequency.value=chords[0][i];o.detune.value=(i-1)*4;og.gain.value=i===1?.07:.11;o.connect(og);og.connect(lp);o.start();return o});
      const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=.1;lg.gain.value=.035;lfo.connect(lg);lg.connect(g.gain);lfo.start();
      let ci=0;A.timers.push(setInterval(()=>{ci=(ci+1)%chords.length;oscs.forEach((o,i)=>o.frequency.linearRampToValueAtTime(chords[ci][i],ctx.currentTime+4))},10000));
    }else if(kind==='rain'){
      loop('pink','lowpass',5200,0,.55);loop('white','bandpass',2600,.6,.05);
      // single drops on a roof, now and then
      const drop=()=>{const o=ctx.createOscillator(),og=ctx.createGain(),t=ctx.currentTime,f=1800+Math.random()*2400;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.04);og.gain.setValueAtTime(.05*Math.random()+.015,t);og.gain.exponentialRampToValueAtTime(.0005,t+.06);o.connect(og);og.connect(g);o.start(t);o.stop(t+.07);later(drop,40+Math.random()*220)};drop();
      target=.3;
    }else if(kind==='waves'){
      const w=loop('brown','lowpass',600,0,1),sw=ctx.createGain();sw.gain.value=.25;w.v.disconnect();w.v.connect(sw);sw.connect(g);
      const foam=loop('pink','highpass',1400,0,0);
      const wave=()=>{const t=ctx.currentTime,len=7+Math.random()*4;
        sw.gain.cancelScheduledValues(t);sw.gain.setValueAtTime(sw.gain.value,t);sw.gain.linearRampToValueAtTime(1,t+len*.45);sw.gain.linearRampToValueAtTime(.18,t+len);
        w.f.frequency.cancelScheduledValues(t);w.f.frequency.setValueAtTime(w.f.frequency.value,t);w.f.frequency.linearRampToValueAtTime(1300,t+len*.45);w.f.frequency.linearRampToValueAtTime(450,t+len);
        foam.v.gain.cancelScheduledValues(t);foam.v.gain.setValueAtTime(0,t+len*.35);foam.v.gain.linearRampToValueAtTime(.05,t+len*.5);foam.v.gain.linearRampToValueAtTime(0,t+len*.95);
        later(wave,len*1000)};wave();
      target=.32;
    }else if(kind==='fire'){
      loop('brown','lowpass',380,0,.7);loop('pink','bandpass',900,.8,.05);
      const pop=()=>{const t=ctx.currentTime,src=ctx.createBufferSource(),len=.004+Math.random()*.02;const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*len),ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
        src.buffer=b;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1500+Math.random()*4000;f.Q.value=1.2;const v=ctx.createGain();v.gain.value=.08+Math.random()*.35;src.connect(f);f.connect(v);v.connect(g);src.start(t);
        later(pop,Math.random()<.25?20+Math.random()*60:120+Math.random()*700)};pop();
      target=.34;
    }else if(kind==='birds'){
      loop('pink','lowpass',700,0,.12);
      const pan=ctx.createStereoPanner?()=>{const p=ctx.createStereoPanner();p.pan.value=Math.random()*1.6-.8;p.connect(g);return p}:()=>g;
      const song=()=>{const out=pan(),base=2200+Math.random()*1800,n=2+Math.floor(Math.random()*5),sp=.09+Math.random()*.08;let t=ctx.currentTime+.05;
        for(let i=0;i<n;i++){const o=ctx.createOscillator(),og=ctx.createGain(),f=base*(1+(Math.random()-.4)*.25),up=Math.random()<.6;
          o.frequency.setValueAtTime(up?f*.8:f*1.2,t);o.frequency.exponentialRampToValueAtTime(up?f*1.25:f*.85,t+sp*.8);
          og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(.09,t+.012);og.gain.exponentialRampToValueAtTime(.0005,t+sp*.9);o.connect(og);og.connect(out);o.start(t);o.stop(t+sp);t+=sp*1.25}
        later(song,700+Math.random()*2600)};later(song,300);
      target=.5;
    }
    g.gain.linearRampToValueAtTime(target,ctx.currentTime+2.5);
  }catch(e){calmAudio=null}
}
const soundRow=()=>`<div class="snd-row" role="group" aria-label="צליל רקע">${SOUNDS.map(([k,e,n])=>`<button data-snd="${k}" aria-pressed="${!!calmAudio&&calmAudio.kind===k}"><span class="e">${e}</span>${n}</button>`).join('')}</div>`;
function wireSounds(root){root.querySelectorAll('[data-snd]').forEach(b=>b.onclick=()=>{const k=b.dataset.snd;calmSound(calmAudio&&calmAudio.kind===k?false:k);root.querySelectorAll('[data-snd]').forEach(x=>x.setAttribute('aria-pressed',!!calmAudio&&calmAudio.kind===x.dataset.snd))})}
const GROUND=[[5,'👀','דברים {שאתה רואה|שאת רואה} סביבך'],[4,'✋','דברים {שאתה יכול|שאת יכולה} לגעת בהם'],[3,'👂','קולות {שאתה שומע|שאת שומעת} עכשיו'],[2,'👃','ריחות {שאתה מריח|שאת מריחה}, או ריח {שאתה אוהב|שאת אוהבת}'],[1,'💛','דבר אחד טוב {שתגיד|שתגידי} לעצמך']];
const CALM_WORDS=['🌊 הרגש הזה הוא גל. הוא יעלה, ואז הוא ירד.','🫧 לא צריך לעשות שום דבר עכשיו. רק לנשום.','🧸 {אתה בטוח|את בטוחה} כאן, ברגע הזה.','🌙 גם הלילה הכי ארוך נגמר בבוקר.','🍃 מותר לעצור. העולם יחכה.','💛 {אתה לא לבד|את לא לבד}. יש אנשים שרוצים לשמוע אותך.','🌱 {עברת|עברת} רגעים קשים בעבר, ויצאת מהם.','☁️ מחשבות הן עננים. הן עוברות.','🕯️ אור קטן מספיק כדי לראות את הצעד הבא.','🫶 {תניח|תניחי} יד על הלב. {תרגיש|תרגישי} אותו פועם. {אתה|את} כאן.'];
function openCalm(tab){
  tab=tab||'breath';let gi=0,gn=0,wi=Math.floor(Math.random()*CALM_WORDS.length);
  const stop=()=>{clearTimeout(calmTimer);calmTimer=null};
  const draw=()=>{stop();
    const tabs=`<div class="seg calm-tabs">${[['breath','🫧 נשימה'],['ground','🖐️ קרקוע'],['words','💛 מילים'],['people','📲 אנשים שלי']].map(([k,l])=>`<button data-ct="${k}" aria-pressed="${k===tab}">${l}</button>`).join('')}</div>`;
    let body='';
    if(tab==='breath')body=`<div class="breath"><div class="b-stage"><div class="b-ring" id="b-ring"></div><div class="b-pet">${petIcon(S.settings.mascot)}</div></div>
      <div class="b-word" id="b-word">${G('נושמים ביחד, בקצב רגוע')}</div><div class="b-count" id="b-count">${G('שאיפה 4 שניות · להחזיק 4 · נשיפה 6')}</div>
      <div class="actions" style="justify-content:center"><button class="btn" id="b-go">▶️ להתחיל</button></div>
      <p class="hint snd-h">🎧 ${G('צליל רקע (עדיף עם אוזניות)')}</p>${soundRow()}</div>`;
    else if(tab==='ground'){
      if(gi>=GROUND.length)body=`<div class="ground-done"><div class="big-e">🌿</div><h3>${G('{חזרת|חזרת} לכאן ועכשיו')}</h3><p>${G('כל הכבוד. {אתה|את} כאן, נושם'+(S.settings.address==='f'?'ת':'')+', וזה מה שחשוב עכשיו.')}</p><button class="btn ghost" id="g-again">עוד פעם</button></div>`;
      else{const [n,e,t]=GROUND[gi];body=`<div class="ground"><p class="hint" style="text-align:center">${G('תרגיל קרקוע: מחזיר את הגוף לרגע הזה. לא צריך לכתוב, רק לשים לב.')}</p>
        <div class="g-big"><span class="e">${e}</span><b>${n}</b></div><p class="g-t">${G(t)}</p>
        <div class="g-dots">${Array.from({length:n},(_,i)=>`<button data-gd="${i}" aria-pressed="${i<gn}" aria-label="${i+1}"></button>`).join('')}</div>
        <p class="hint" style="text-align:center">${G('{לחץ|לחצי} על עיגול על כל דבר {שמצאת|שמצאת}')}</p></div>`}
    }else if(tab==='people')body=peopleHTML();
    else body=`<div class="calm-words"><p class="cw" id="cw">${esc(G(CALM_WORDS[wi]))}</p><div class="actions" style="justify-content:center"><button class="btn ghost small" id="cw-next">עוד משפט</button><button class="btn ghost small" id="cw-card">🖼️ לכרטיס</button>${S.journal.some(j=>j.type==='letter')?'<button class="btn ghost small" data-act="read-letter">💌 מכתב שכתבתי לעצמי</button>':''}</div>${helpCard()}</div>`;
    openSheet(sheetHead('🫧 פינת הרגעה')+tabs+body+(tab!=='words'?`<p class="hint calm-help">🫂 ${G('צריך לדבר עם מישהו? ער"ן')} <a href="tel:1201" dir="ltr">1201</a> · ${G('סה"ר')} <a href="https://sahar.org.il" target="_blank" rel="noopener">sahar.org.il</a></p>`:''),()=>{stop();calmSound(false)});
    const s=$('sheet');
    s.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{tab=b.dataset.ct;draw()});
    if(tab==='breath'){
      wireSounds(s);
      $('b-go').onclick=()=>{if(calmTimer){stop();draw();return}$('b-go').textContent='⏸️ לעצור';breathe()};
    }
    if(tab==='ground'){
      s.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{b.setAttribute('aria-pressed','true');gn=s.querySelectorAll('[data-gd][aria-pressed="true"]').length;
        try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}
        if(gn>=GROUND[gi][0])setTimeout(()=>{gi++;gn=0;draw()},450)});
      if($('g-again'))$('g-again').onclick=()=>{gi=0;gn=0;draw()};
    }
    if(tab==='people')wirePeople(draw);
    if(tab==='words'){$('cw-next').onclick=()=>{wi=(wi+1)%CALM_WORDS.length;$('cw').textContent=G(CALM_WORDS[wi])};$('cw-card').onclick=()=>openCard($('cw').textContent)}
  };
  const PH=[['שאיפה...',4000,1],['להחזיק',4000,1],['נשיפה...',6000,0]];
  const breathe=()=>{let n=0,pi=0;
    const step=()=>{const r=$('b-ring');if(!r){stop();return}
      const [w,ms,big]=PH[pi];r.style.transitionDuration=ms+'ms';r.classList.toggle('big',!!big);$('b-word').textContent=w;
      if(pi===0){n++;$('b-count').textContent=n<5?'נשימה '+n:G(n===5?'🌿 יפה מאוד. אפשר להמשיך כמה {שתרצה|שתרצי}':'נשימה '+n)}
      try{if(window.TsaadApp&&TsaadApp.vibrate)TsaadApp.vibrate(15)}catch(e){}
      pi=(pi+1)%3;calmTimer=setTimeout(step,ms)};
    step()};
  draw();
}

/* ---------- words that need a person, not an app: show the help lines right away ---------- */
const DISTRESS=/להתאבד|התאבדות|לא רוצה לחיות|לא רוצה להמשיך לחיות|לא רוצה להיות (פה|בחיים|קיים|קיימת)|לגמור עם (זה|הכל|החיים)|לשים קץ|לסיים את החיים|לפגוע בעצמי|פוגע בעצמי|פוגעת בעצמי|לחתוך את עצמי|אין לי בשביל מה לחיות|אין טעם לחיות|אין טעם בחיים|עדיף שאמות|עדיף שלא אהיה|רוצה למות|הלוואי שאמות|נמאס לי מהחיים|kill myself|suicid/i;
const isDistress=t=>DISTRESS.test(String(t||''));
function openHelpNow(){
  openSheet(sheetHead('🫂 אנחנו כאן איתך')+`<p>${G('נשמע שעובר עליך משהו ממש כבד. {אתה לא לבד|את לא לבד} בזה, ומגיע לך שמישהו יקשיב לך, עכשיו.')}</p>${helpCard()}
    <p class="hint">בחירום: מד"א <a href="tel:101">101</a> · משטרה <a href="tel:100">100</a></p>
    <div class="actions"><button class="btn" data-act="calm">🫧 לנשום רגע ביחד</button><button class="btn ghost" data-act="sheet-close">סגירה</button></div>`);
}
const distressCheck=t=>{if(!isDistress(t))return false;setTimeout(openHelpNow,350);return true};

/* ---------- a summary for the therapist: mood, what was done, goals, the journal ---------- */
function periodKeys(days){return Array.from({length:days},(_,i)=>addDays(T,i-days+1))}
function moodChart(keys,w,h){
  w=w||600;h=h||150;const pad=34,iw=w-pad-8,ih=h-26,step=keys.length>1?iw/(keys.length-1):0;
  const pts=keys.map((k,i)=>S.moods[k]!=null?[pad+i*step,8+ih-(S.moods[k]/4)*ih,S.moods[k],k]:null);
  let path='',on=false;pts.forEach(p=>{if(!p){on=false;return}path+=(on?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);on=true});
  const cols=['#B58BDE','#8FB4E8','#9FD7B5','#FFC861','#FF9A73'];
  const grid=[0,1,2,3,4].map(m=>{const y=8+ih-(m/4)*ih;return `<line x1="${pad}" x2="${w-8}" y1="${y}" y2="${y}" stroke="#eadfd3" stroke-width="1"/><text x="${pad-6}" y="${y+5}" font-size="13" text-anchor="end" font-family="sans-serif">${MOODS[m][0]}</text>`}).join('');
  const hard=keys.map((k,i)=>S.hard[k]?`<rect x="${pad+i*step-Math.max(step/2,2)}" y="8" width="${Math.max(step,4)}" height="${ih}" fill="#DCCBFF" opacity=".35"/>`:'').join('');
  const lab=[0,Math.floor((keys.length-1)/2),keys.length-1].filter((v,i,a)=>a.indexOf(v)===i).map(i=>`<text x="${pad+i*step}" y="${h-4}" font-size="11" text-anchor="middle" fill="#7D708A" font-family="sans-serif">${kdate(keys[i]).toLocaleDateString('he-IL',{day:'numeric',month:'numeric'})}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="מצב הרוח לאורך התקופה">${grid}${hard}<path d="${path}" fill="none" stroke="#C9B6E8" stroke-width="2" stroke-linejoin="round"/>${pts.filter(Boolean).map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${keys.length>40?3:4.5}" fill="${cols[p[2]]}"/>`).join('')}${lab}</svg>`;
}
function reportData(days){
  const keys=periodKeys(days),from=keys[0],inP=k=>k>=from&&k<=T,atIn=at=>at&&inP(dkey(new Date(at)));
  const moods=keys.filter(k=>S.moods[k]!=null).map(k=>S.moods[k]);
  const dist=[0,0,0,0,0];moods.forEach(m=>dist[m]++);
  const done=[];keys.forEach(k=>(S.tasks[k]||[]).forEach(t=>{if(t.done)done.push(t)}));
  const active=keys.filter(goodDay).length,hard=keys.filter(k=>S.hard[k]).length;
  const cats={};done.forEach(t=>{const k=GOAL_KINDS.find(([,r])=>r.test(t.text));const n=k?k[0]:'אחר';cats[n]=(cats[n]||0)+1});
  const goals=S.goals.map(g=>({g,got:g.steps.filter(s=>s.done).length,total:g.steps.length,inP:g.steps.filter(s=>atIn(s.doneAt)).length,achieved:atIn(g.achievedAt)}));
  const j=type=>S.journal.filter(x=>x.type===type&&inP(x.date)).sort((a,b)=>(a.at||0)-(b.at||0));
  return {keys,from,moods,dist,avg:moods.length?moods.reduce((a,b)=>a+b,0)/moods.length:null,done,active,hard,cats,goals,feel:j('feel'),good:j('good'),thanks:j('thanks'),letters:j('letter'),wins:j('win'),insight:j('insight')};
}
function reportHTML(days,inc,forPrint){
  const D=reportData(days),nm2=S.settings.name||'';
  const sec=(t,b)=>`<section><h2>${t}</h2>${b}</section>`;
  const li=a=>a.length?`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`:'<p class="mut">אין רישומים בתקופה הזאת.</p>';
  const per=fmtDate(D.from)+' עד '+fmtDate(T)+' '+kdate(T).getFullYear();
  let h=`<header><div class="logo">🌱 צעד קטן</div><h1>סיכום ${days===7?'שבועי':days===30?'חודשי':'של 3 חודשים'}${nm2?' · '+esc(nm2):''}</h1><p class="mut">${per} · הופק מתוך האפליקציה "צעד קטן"</p></header>`;
  h+=`<div class="kpis"><div><b>${D.active}</b><span>ימים עם פעולה</span></div><div><b>${D.done.length}</b><span>דברים שבוצעו</span></div><div><b>${D.goals.reduce((a,x)=>a+x.inP,0)}</b><span>צעדים במטרות</span></div><div><b>${D.hard}</b><span>ימים שסומנו "יום קשה"</span></div></div>`;
  if(inc.mood)h+=sec('😊 מצב רוח',D.moods.length?moodChart(D.keys)+`<p>דווח ב-${D.moods.length} מתוך ${days} ימים. ממוצע: <b>${MOODS[Math.round(D.avg)][0]} ${MOODS[Math.round(D.avg)][1]}</b> (${(D.avg+1).toFixed(1)} מתוך 5).</p>
    <p class="dist">${D.dist.map((n,i)=>n?`<span>${MOODS[i][0]} ${MOODS[i][1]}: ${n}</span>`:'').join('')}</p>${D.hard?'<p class="mut">רקע סגול בגרף = ימים שסומנו "יום קשה".</p>':''}`:'<p class="mut">לא דווח מצב רוח בתקופה הזאת.</p>');
  if(inc.tasks){const top=Object.entries(D.cats).sort((a,b)=>b[1]-a[1]).slice(0,6);
    h+=sec('✅ מה נעשה',`<p>${D.done.length} דברים בוצעו ב-${D.active} ימים${D.active?` (בממוצע ${(D.done.length/Math.max(1,D.active)).toFixed(1)} ביום פעיל)`:''}.</p>${top.length?`<p class="dist">${top.map(([n,c])=>`<span>${n}: ${c}</span>`).join('')}</p>`:''}
      ${D.done.length?`<details${forPrint?' open':''}><summary>כל הפעולות</summary>${li(D.done.slice(-80).map(t=>esc(t.text)))}</details>`:''}`)}
  if(inc.goals)h+=sec('🎯 מטרות',D.goals.length?`<table><tr><th>מטרה</th><th>התקדמות</th><th>בתקופה</th></tr>${D.goals.map(x=>`<tr><td>${x.g.emoji||'🎯'} ${esc(x.g.title)}${x.g.why?`<div class="mut">למה: ${esc(x.g.why)}</div>`:''}</td><td>${x.got}/${x.total}${x.g.achievedAt?' 🏆':''}</td><td>${x.inP?x.inP+' צעדים':''}${x.achieved?' · הושגה':''}</td></tr>`).join('')}</table>`:'<p class="mut">אין מטרות.</p>');
  if(inc.feel)h+=sec('💓 בדיקות דופק בין שלבים',li(D.feel.map(x=>`<span class="mut">${fmtDate(x.date)}:</span> ${esc(x.text.replace(/^בדיקת דופק ב/,''))}`)));
  if(inc.good)h+=sec('🌼 דברים טובים ותודה',li([...D.good.map(x=>['🌼',x]),...D.thanks.map(x=>['🙏',x]),...D.wins.map(x=>['🏆',x])].sort((a,b)=>(a[1].at||0)-(b[1].at||0)).map(([e,x])=>`<span class="mut">${fmtDate(x.date)}:</span> ${e} ${esc(x.text)}`)));
  if(inc.letters)h+=sec('💌 מכתבים לעצמי',li(D.letters.map(x=>`<span class="mut">${fmtDate(x.date)}:</span> ${esc(x.text)}`)));
  if(inc.note&&inc.note.trim())h+=sec('📝 מה חשוב לי לספר',`<p style="white-space:pre-wrap">${esc(inc.note.trim())}</p>`);
  h+=`<footer>כל צעד נחשב 🌱</footer>`;
  return h;
}
const REPORT_CSS=`body{font-family:"Varela Round",Arial,sans-serif;direction:rtl;color:#3B2F4A;background:#fff;margin:0;padding:24px;line-height:1.55}
.rep{max-width:760px;margin:0 auto}header{border-bottom:3px solid #FFE1D3;padding-bottom:10px;margin-bottom:14px}.logo{color:#FF7F50;font-weight:bold}
h1{font-size:1.5rem;margin:.2em 0}h2{font-size:1.1rem;margin:1.2em 0 .4em;color:#5a4670}.mut{color:#7D708A;font-size:.9rem}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.kpis div{background:#FFF7EF;border-radius:12px;padding:10px;text-align:center}.kpis b{display:block;font-size:1.5rem;color:#FF7F50}.kpis span{font-size:.8rem}
.dist{display:flex;flex-wrap:wrap;gap:6px}.dist span{background:#F4EEF8;border-radius:99px;padding:2px 10px;font-size:.88rem}
table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #F2E2D2;padding:6px;text-align:right;vertical-align:top}th{font-size:.85rem;color:#7D708A}
ul{padding-inline-start:20px;margin:.3em 0}li{margin:.2em 0}footer{margin-top:24px;text-align:center;color:#FF7F50}
section{break-inside:avoid}@media print{body{padding:0}details>summary{display:none}}@media(max-width:520px){.kpis{grid-template-columns:repeat(2,1fr)}}`;
const reportDoc=(days,inc)=>`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>סיכום צעד קטן</title><style>${REPORT_CSS}</style></head><body><div class="rep">${reportHTML(days,inc,true)}</div></body></html>`;
function reportText(days,inc){
  const D=reportData(days),L=['🌱 סיכום מצעד קטן'+(S.settings.name?' · '+S.settings.name:''),fmtDate(D.from)+' עד '+fmtDate(T),''];
  L.push(`✅ ${D.done.length} דברים ב-${D.active} ימים · 🌱 ${D.goals.reduce((a,x)=>a+x.inP,0)} צעדים במטרות · 💜 ${D.hard} ימים קשים`);
  if(inc.mood&&D.moods.length)L.push(`😊 מצב רוח ממוצע: ${MOODS[Math.round(D.avg)][0]} ${MOODS[Math.round(D.avg)][1]} (${D.moods.length} ימים דווחו)`);
  if(inc.goals&&D.goals.length){L.push('','🎯 מטרות:');D.goals.forEach(x=>L.push(`${x.g.emoji||'🎯'} ${x.g.title}: ${x.got}/${x.total}${x.g.achievedAt?' 🏆':''}`))}
  if(inc.feel&&D.feel.length){L.push('','💓 בדיקות דופק:');D.feel.slice(-8).forEach(x=>L.push('• '+x.text.replace(/^בדיקת דופק ב/,'')))}
  if(inc.good&&(D.good.length||D.thanks.length)){L.push('','🌼 דברים טובים:');[...D.good,...D.thanks].slice(-10).forEach(x=>L.push('• '+x.text))}
  if(inc.note&&inc.note.trim())L.push('','📝 '+inc.note.trim());
  return L.join('\n');
}
function shareTextOut(text){
  if(window.TsaadApp&&TsaadApp.shareText){TsaadApp.shareText(text);return}
  if(navigator.share){navigator.share({text}).catch(()=>{});return}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
}
function printDoc(html,name){
  if(window.TsaadApp&&TsaadApp.printHtml){try{TsaadApp.printHtml(html,name);return}catch(e){}}
  if(window.TsaadApp&&TsaadApp.saveFile){TsaadApp.saveFile(name+'.html','text/html',html);toast(G('💾 נשמר כקובץ. {עדכן|עדכני} את האפליקציה כדי לשמור ישר כ-PDF'));return}
  const f=document.createElement('iframe');f.style.cssText='position:fixed;width:0;height:0;border:0;left:0;bottom:0';document.body.appendChild(f);
  f.contentDocument.open();f.contentDocument.write(html);f.contentDocument.close();
  setTimeout(()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){}setTimeout(()=>f.remove(),60000)},400);
}
function openReport(){
  let days=30;const inc={mood:true,tasks:true,goals:true,feel:true,good:true,letters:false,note:''};
  const draw=()=>{
    openSheet(sheetHead('📄 סיכום למטפל')+`<p>${G('סיכום מסודר של התקופה האחרונה, לשתף עם מטפל, רופא או מישהו קרוב. {אתה בוחר|את בוחרת} מה נכנס.')}</p>
      <div class="seg" id="rp-days">${[[7,'שבוע'],[30,'חודש'],[90,'3 חודשים']].map(([d,l])=>`<button data-d="${d}" aria-pressed="${d===days}">${l}</button>`).join('')}</div>
      <div class="rp-inc">${[['mood','😊 מצב רוח וגרף'],['tasks','✅ מה עשיתי'],['goals','🎯 מטרות'],['feel','💓 בדיקות דופק'],['good','🌼 דברים טובים ותודה'],['letters','💌 מכתבים לעצמי']].map(([k,l])=>`<label class="check-row"><input type="checkbox" data-inc="${k}" ${inc[k]?'checked':''}>${l}</label>`).join('')}</div>
      <label class="fieldcol" for="rp-note">📝 משהו שחשוב לי לספר (רשות)<textarea id="rp-note" placeholder="${G('למשל: מה עזר לי החודש, מה קשה לי, על מה {הייתי רוצה|הייתי רוצה} לדבר')}">${esc(inc.note)}</textarea></label>
      <div class="rp-prev" id="rp-prev"><div class="rep">${reportHTML(days,inc)}</div></div>
      <div class="rp-actions"><button class="btn" id="rp-pdf">🖨️ ${window.TsaadApp&&!TsaadApp.printHtml?'לשמור כקובץ':'PDF או הדפסה'}</button><button class="btn ghost" id="rp-share">📤 לשתף כטקסט</button></div>`);
    $('rp-days').onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;days=+b.dataset.d;inc.note=$('rp-note').value;draw()};
    $('sheet').querySelectorAll('[data-inc]').forEach(c=>c.onchange=()=>{inc[c.dataset.inc]=c.checked;inc.note=$('rp-note').value;draw()});
    $('rp-note').oninput=e=>{inc.note=e.target.value};
    $('rp-note').onblur=()=>{const p=$('rp-prev');if(p)p.querySelector('.rep').innerHTML=reportHTML(days,inc)};
    $('rp-pdf').onclick=()=>{inc.note=$('rp-note').value;printDoc(reportDoc(days,inc),'tsaad-katan-summary-'+T)};
    $('rp-share').onclick=()=>{inc.note=$('rp-note').value;shareTextOut(reportText(days,inc))};
  };
  draw();
}

/* ---------- weekly letter of insights: patterns from mood, tasks and the journal ---------- */
function patterns(){
  const N=35,keys=Array.from({length:N},(_,i)=>addDays(T,-i-1)),md=keys.filter(k=>S.moods[k]!=null);
  const lines=[],av=x=>x.reduce((s,k)=>s+S.moods[k],0)/x.length;
  const doneSome=(k,r)=>(S.tasks[k]||[]).some(t=>t.done&&r.test(t.text));
  const test=(fn,txt,tip)=>{const a=md.filter(fn),b=md.filter(k=>!fn(k));if(a.length<3||b.length<3)return;const d=av(a)-av(b);if(d>=.45)lines.push({d,t:G(txt),tip:G(tip)})};
  test(k=>doneSome(k,/לצאת|הליכה|ללכת|בחוץ|טיול|מרפסת|פארק|לים /),'בימים {שיצאת|שיצאת} מהבית, מצב הרוח שלך היה טוב יותר','אולי השבוע לשלב עוד יציאה קטנה, אפילו 5 דקות');
  test(k=>(S.tasks[k]||[]).some(t=>t.done&&t.goalId),'בימים {שעשית|שעשית} צעד קטן למטרה, {הרגשת|הרגשת} טוב יותר','הצעד היומי למטרה עושה לך טוב, גם כשהוא קטן');
  test(k=>doneSome(k,/חבר|אמא|אבא|להתקשר|שיחה|משפחה|להיפגש|הודעה|סבא|סבתא|אח|אחות/),'בימים שהיה לך קשר עם אנשים קרובים, מצב הרוח עלה','אולי הודעה קטנה למישהו קרוב השבוע?');
  test(k=>doneSome(k,/ספורט|כושר|הליכ|ריצה|לרוץ|יוגה|להתאמן|אימון|לזוז|לרקוד/),'בימים {שזזת|שזזת} קצת, היה לך יותר טוב','תנועה קטנה עושה לך טוב');
  test(k=>S.journal.some(j=>j.date===k&&(j.type==='good'||j.type==='thanks')),'בימים {שכתבת|שכתבת} בערב משהו טוב, מצב הרוח היה גבוה יותר','סקירת הערב שווה את הדקה שהיא לוקחת');
  test(k=>doneSome(k,/לישון|שינה|מוקדם|מסכים/),'בימים שהקפדת על שינה, הרגשת טוב יותר','שגרת ערב רגועה יכולה לעזור');
  lines.sort((a,b)=>b.d-a.d);
  const wk=Array.from({length:7},(_,i)=>addDays(T,-i-1)),pw=Array.from({length:7},(_,i)=>addDays(T,-i-8));
  const cnt=L=>L.reduce((a,k)=>a+(S.tasks[k]||[]).filter(t=>t.done).length,0);
  const byDay=[0,0,0,0,0,0,0];keys.forEach(k=>byDay[kdate(k).getDay()]+=(S.tasks[k]||[]).filter(t=>t.done).length);
  const best=byDay.indexOf(Math.max(...byDay)),names=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const steps=S.goals.reduce((a,g)=>a+g.steps.reduce((b,s)=>b+(s.doneDays||[]).filter(d=>wk.includes(d)).length,0),0);
  const wm=wk.filter(k=>S.moods[k]!=null);
  return {lines:lines.slice(0,3),done:cnt(wk),prev:cnt(pw),good:wk.filter(goodDay).length,steps,hard:wk.filter(k=>S.hard[k]).length,mood:wm.length?av(wm):null,
    bestDay:Math.max(...byDay)>=4&&byDay.filter(x=>x===Math.max(...byDay)).length===1?names[best]:null,
    goodThings:S.journal.filter(j=>(j.type==='good'||j.type==='thanks')&&wk.includes(j.date)).map(j=>j.text).slice(0,4)};
}
function localLetter(P){
  const nm3=S.settings.name,pet=MASCOTS[S.settings.mascot]||MASCOTS.plant;
  const L=[(nm3?nm3+' '+G('{יקר|יקרה}'):G('{חבר יקר|חברה יקרה}'))+',',''];
  L.push(P.done?G('השבוע {עשית|עשית} '+(P.done===1?'דבר אחד':P.done+' דברים')+', ב-'+P.good+' ימים טובים.')+(P.prev&&P.done>P.prev?' זה יותר מהשבוע שעבר 📈':''):G('השבוע היה שקט יותר, וגם זה בסדר. לפעמים צריך לנוח.'));
  if(P.steps)L.push(G('{התקדמת|התקדמת} '+P.steps+' צעדים קטנים בדרך למטרות שלך 🌱'));
  if(P.hard)L.push(G('היו גם '+(P.hard===1?'יום קשה אחד':P.hard+' ימים קשים')+'. {עברת|עברת} '+(P.hard===1?'אותו':'אותם')+', וזה לא מובן מאליו 💜'));
  if(P.lines.length){L.push('','🔍 שמתי לב לכמה דברים:');P.lines.forEach(x=>L.push('• '+x.t))}
  if(P.bestDay)L.push('• '+G('היום שבו הכי הולך לך הוא יום '+P.bestDay));
  if(P.goodThings.length){L.push('',G('🌼 ומהדברים הטובים {שכתבת|שכתבת}')+': "'+P.goodThings[0]+'"')}
  L.push('',P.lines.length?'💡 '+P.lines[0].tip+'.':G('💡 לשבוע הבא: מספיק צעד אחד קטן ביום.'),'',G('גאה {בך|בך},'),pet.n.split(',')[0]+' '+pet.e);
  return L.join('\n');
}
async function makeInsight(){
  const P=patterns();let text=null;
  if(coachOn()&&window.TKai&&TKai.ask){
    const facts=`נתוני השבוע: ${P.done} דברים בוצעו (שבוע קודם: ${P.prev}), ${P.good} ימים טובים, ${P.steps} צעדים למטרות, ${P.hard} ימים קשים${P.mood!=null?', מצב רוח ממוצע '+(P.mood+1).toFixed(1)+' מתוך 5':''}.
דפוסים שהאפליקציה זיהתה (מחושבים מהנתונים, אפשר לסמוך עליהם):\n${P.lines.map(x=>'- '+x.t).join('\n')||'- לא נמצאו דפוסים ברורים'}${P.bestDay?'\n- היום הכי פעיל: '+P.bestDay:''}
דברים טובים שהמשתמש כתב השבוע: ${P.goodThings.join(' | ')||'אין'}`;
    try{text=await TKai.ask(`כתוב/י לי "מכתב השבוע": מכתב חם ואישי (6 עד 10 שורות) שמסכם את השבוע שלי ומשקף לי דפוסים שאולי לא שמתי לב אליהם. להתבסס רק על הנתונים, בלי להמציא. לפתוח בפנייה בשם (אם ידוע), לציין משהו אחד שאני יכול/ה להיות גאה בו, 1 עד 3 תובנות מהדפוסים, הצעה עדינה אחת לשבוע הבא, ולחתום בשם הדמות המלווה "${(MASCOTS[S.settings.mascot]||MASCOTS.plant).n.split(',')[0]}". בלי ACTION, בלי כותרות.\n\n${facts}`)}catch(e){text=null}
  }
  if(!text||text.length<40)text=localLetter(P);
  addJournal('insight',text);S.insightAt=T;save();return text;
}
function insightDue(){
  if(S.seeded)return false;if(S.insightAt&&between(S.insightAt,T)<7)return false;
  const wk=Array.from({length:7},(_,i)=>addDays(T,-i-1));return wk.filter(k=>goodDay(k)||S.moods[k]!=null).length>=3;
}
async function openInsight(fresh){
  const last=S.journal.find(j=>j.type==='insight');
  const show=(text,date)=>openSheet(sheetHead('🔍 מכתב השבוע')+`<div class="letter insight">${esc(text)}</div><p class="hint">${date?'נכתב ב-'+fmtDate(date)+' · ':''}${G('המכתב נשמר ביומן, תחת "תובנות".')}</p>
    <div class="actions"><button class="btn" data-act="sheet-close" style="flex:1">תודה 💛</button><button class="btn ghost" id="in-share">📤 לשתף</button></div>`);
  const wire=t=>{const b=$('in-share');if(b)b.onclick=()=>shareTextOut('🔍 מכתב השבוע שלי מצעד קטן\n\n'+t)};
  if(last&&!fresh&&!insightDue()){show(last.text,last.date);wire(last.text);return}
  openSheet(sheetHead('🔍 מכתב השבוע')+`<div class="big-e">${petIcon(S.settings.mascot)}</div><div class="thinking" style="text-align:center">${G('קורא את השבוע שלך וכותב לך מכתב...')}</div>`);
  const text=await makeInsight();renderAll();if($('sheet').hidden)return;show(text,T);wire(text);
}

/* ---------- the coach speaks first: a morning note ---------- */
function morningLocal(){
  const y=addDays(T,-1),ym=S.moods[y],yd=(S.tasks[y]||[]).filter(t=>t.done).length,V=voice();
  const g=S.goals.find(x=>!x.achievedAt&&curStep(x)),s=g&&curStep(g);
  const L=[];
  if(S.hard[y]||ym===0||ym===1)L.push(G('אתמול היה קשה. היום אפשר להתחיל ממש בקטן, ואני פה איתך 💜'));
  else if(yd>=3)L.push(G('אתמול {עשית|עשית} '+yd+' דברים. זה נשאר שלך 🌸'));
  else if(yd)L.push(G('אתמול {עשית|עשית} '+(yd===1?'דבר אחד':yd+' דברים')+'. גם זה נחשב 🌱'));
  else L.push(G('יום חדש, דף חדש. בלי חובות מאתמול 🌤️'));
  if(s)L.push(G('הצעד הקטן של היום בדרך אל "'+g.title+'": '+s.text+'.'));
  else L.push(G(V.start));
  return L.join(' ');
}
let morningBusy=false;
function morningAI(){
  if(morningBusy||S.settings.morning===false||!coachOn()||!window.TKai||!TKai.ask)return;
  if(S.morning&&S.morning.date===T)return;
  morningBusy=true;
  TKai.ask('כתוב/י לי הודעת בוקר אישית וקצרה (2 עד 3 משפטים), כאילו את/ה פונה אליי ראשון/ה הבוקר. להתייחס בעדינות לאיך היה אתמול (מצב רוח, מה עשיתי), ולהזכיר את הצעד הקטן של היום באחת המטרות אם יש. חם, בלי לחץ, בסגנון הדיבור שבחרתי. בלי ACTION ובלי כותרת.',true)
    .then(t=>{if(t&&t.length>15){S.morning={date:T,text:t.slice(0,600)};save();renderToday()}}).catch(()=>{}).then(()=>{morningBusy=false});
}
function morningCard(){
  const h=new Date().getHours();
  if(S.settings.morning===false||S.seeded||!S.onboarded||h<5||h>=13||S.morningSeen===T)return '';
  setTimeout(morningAI,1200);
  const text=S.morning&&S.morning.date===T?S.morning.text:morningLocal();
  return `<div class="banner morning"><div class="row1"><span class="bico pet-mini">${petIcon(S.settings.mascot)}</span><div><h3>💌 ${G('בוקר טוב'+(S.settings.name?' '+esc(S.settings.name):''))}</h3><p class="sub" style="white-space:pre-wrap">${esc(text)}</p></div><button class="del" data-act="morning-ok" aria-label="סגירה">${X}</button></div>
    <div class="actions"><button class="btn small" data-act="morning-ok">תודה 💛</button>${coachOn()?'<button class="btn small ghost" data-act="coach">✨ לענות למאמן</button>':''}</div></div>`;
}

/* ---------- the living garden: every goal is a plant that grows with each step ---------- */
const hashN=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return h>>>0};
function plantG(stage,col,em,seed){
  const sway=noMotion()?'':' class="sway"';const fl=(x,y,r)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="${-r}" rx="${r*.6}" ry="${r}" fill="var(--petal)" transform="rotate(${a})"/>`).join('')}<circle r="${r*.7}" fill="var(--core)"/></g>`;
  let p='';
  if(stage===0)p=`<ellipse cx="0" cy="0" rx="13" ry="4" fill="var(--soil)"/><ellipse cx="0" cy="-3" rx="3.5" ry="2.6" fill="#8B5E3C"/>`;
  else if(stage===1)p=`<ellipse cx="0" cy="0" rx="12" ry="3.5" fill="var(--soil)"/><g${sway}><path d="M0 0 V-14" stroke="var(--stem)" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-5" cy="-14" rx="6" ry="3" fill="var(--leaf)" transform="rotate(-30 -5 -14)"/><ellipse cx="5" cy="-15" rx="6" ry="3" fill="var(--leaf)" transform="rotate(30 5 -15)"/></g>`;
  else if(stage===2)p=`<ellipse cx="0" cy="0" rx="12" ry="3.5" fill="var(--soil)"/><g${sway}><path d="M0 0 Q-2 -14 0 -30" stroke="var(--stem)" stroke-width="2.6" fill="none" stroke-linecap="round"/>${[[-7,-10,-30],[7,-16,30],[-7,-22,-35],[6,-27,35]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="8" ry="3.8" fill="var(--leaf)" transform="rotate(${r} ${x} ${y})"/>`).join('')}<circle cx="0" cy="-32" r="3.5" fill="${col}"/></g>`;
  else if(stage===3)p=`<ellipse cx="0" cy="0" rx="18" ry="4" fill="var(--soil)"/><path d="M0 0 V-12" stroke="#8B5E3C" stroke-width="3"/><g${sway}><circle cx="-10" cy="-18" r="11" fill="var(--leaf)"/><circle cx="10" cy="-18" r="11" fill="var(--leaf)"/><circle cx="0" cy="-28" r="13" fill="var(--hill1)"/>${fl(-8,-26,3)}${fl(9,-17,3)}${fl(2,-36,2.6)}</g>`;
  else if(stage===4)p=`<ellipse cx="0" cy="0" rx="18" ry="4" fill="var(--soil)"/><path d="M-3 0 Q-2 -18 0 -30 Q2 -18 3 0Z" fill="#9A6B45"/><g${sway}><circle cx="-12" cy="-34" r="13" fill="var(--leaf)"/><circle cx="12" cy="-34" r="13" fill="var(--leaf)"/><circle cx="0" cy="-46" r="16" fill="var(--hill1)"/><circle cx="-6" cy="-50" r="5" fill="#fff" opacity=".18"/></g>`;
  else p=`<ellipse cx="0" cy="0" rx="22" ry="4.5" fill="var(--soil)"/><path d="M-4 0 Q-3 -22 0 -38 Q3 -22 4 0Z" fill="#9A6B45"/><g${sway}><circle cx="-16" cy="-42" r="15" fill="var(--leaf)"/><circle cx="16" cy="-42" r="15" fill="var(--leaf)"/><circle cx="0" cy="-58" r="19" fill="var(--hill1)"/>
    ${fl(-14,-46,3.6)}${fl(12,-40,3.4)}${fl(-2,-66,3.8)}${fl(10,-58,3)}${fl(-12,-60,3)}<text x="0" y="-38" font-size="13" text-anchor="middle" style="font-family:var(--emoji)">${em}</text></g>
    <text x="20" y="-70" font-size="11" class="twinkle" style="font-family:var(--emoji)">✨</text>`;
  return p;
}
function gardenStage(g){const total=g.steps.length,got=g.steps.filter(s=>s.done).length;if(g.achievedAt)return 5;if(!total||!got)return (g.steps.some(s=>(s.doneDays||[]).length)?1:0);const r=got/total;return r<.25?1:r<.5?2:r<.75?3:4}
function gardenHTML(){
  const goals=S.goals.slice().sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  const per=3,rows=Math.max(1,Math.ceil(goals.length/per)),RH=118,W=320,H=rows*RH+40;
  const flowers=Math.min(40,Array.from({length:60},(_,i)=>addDays(T,-i)).filter(goodDay).length);
  let f='';for(let i=0;i<flowers;i++){const h=hashN('f'+i),x=8+h%304,y=56+((h>>>9)%(H-62)),c=['var(--petal)','var(--joy1)','var(--joy3)','var(--joy5)','#fff'][i%5];f+=`<g transform="translate(${x} ${y})"><circle r="3" fill="${c}"/><circle r="1" fill="var(--core)"/></g>`}
  const plants=goals.map((g,i)=>{const r=Math.floor(i/per),c=i%per,x=262-c*102-(r%2?22:0),y=r*RH+128;const st=gardenStage(g);
    return `<g class="gp" data-gp="${g.id}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="${esc(g.title)}"><rect x="-44" y="-112" width="88" height="130" fill="transparent"/><g transform="scale(1.3)">${plantG(st,JOYS[(g.color||0)%JOYS.length],g.emoji||'🌱',g.id)}</g>
      <g transform="translate(0 12)"><rect x="-16" y="-7" width="32" height="14" rx="4" fill="var(--surface)" opacity=".9"/><text x="0" y="4" font-size="10" text-anchor="middle" style="font-family:var(--emoji)">${g.emoji||'🌱'}</text></g></g>`}).join('');
  return `<svg class="garden-svg" viewBox="0 0 ${W} ${H}" aria-label="הגינה שלי">
    <defs><linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky1)"/><stop offset="1" stop-color="var(--sky2)"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#gsky)"/><circle cx="286" cy="26" r="13" fill="var(--sun)"/>
    <g class="cloud drift" fill="var(--cloud)"><ellipse cx="70" cy="24" rx="20" ry="8"/><ellipse cx="82" cy="19" rx="12" ry="9"/></g>
    <path d="M0 50 Q80 34 160 46 T320 42 V${H} H0Z" fill="var(--hill2)"/>${f}${plants}
    ${goals.length?'':`<text x="160" y="${H-20}" text-anchor="middle" font-size="12" fill="var(--fg)">כל מטרה חדשה תהפוך כאן לצמח 🌱</text>`}</svg>`;
}
function renderGarden(){const box=$('garden-big');if(!box)return;
  const got=S.goals.filter(g=>g.achievedAt).length;
  box.innerHTML=`<div class="gb-head"><h2 style="font-size:1.1rem"><span class="e">🌳</span> הגינה שלי</h2><span class="hint" style="margin:0">${S.goals.length?(got?got+' עצים פורחים · ':'')+G('{לחץ|לחצי} על צמח'):''}</span></div>${gardenHTML()}
    <p class="hint">${G('כל מטרה היא צמח שגדל עם כל צעד, ומטרה שהושגה פורחת לתמיד. כל יום טוב מוסיף פרח קטן לדשא.')}</p>`}
function openGardenGoal(g){
  const total=g.steps.length,got=g.steps.filter(s=>s.done).length,cur=curStep(g),st=gardenStage(g);
  const names=['זרע שמחכה לצעד הראשון','נבט קטן','שתיל שגדל','שיח פורח','עץ צעיר','עץ פורח 🌸'];
  openSheet(sheetHead((g.emoji||'🌱')+' '+esc(g.title))+`<svg viewBox="-60 -95 120 110" style="width:150px;display:block;margin:0 auto">${plantG(st,JOYS[(g.color||0)%JOYS.length],g.emoji||'🌱',g.id)}</svg>
    <p style="text-align:center"><b>${names[st]}</b> · ${got} מתוך ${total} צעדים</p>
    ${g.createdAt?`<p class="hint" style="text-align:center">🌱 ניטע ב-${fmtDate(dkey(new Date(g.createdAt)))}${g.achievedAt?' · 🏆 פרח ב-'+fmtDate(dkey(new Date(g.achievedAt))):''}</p>`:''}
    ${g.why?`<div class="why-big"><span class="e">💛</span> <b>למה זה חשוב לי:</b> ${esc(g.why)}</div>`:''}
    ${cur?`<div class="next"><span>👣 הצעד הבא: <b>${esc(cur.text)}</b></span></div>`:''}
    <button class="btn wide" id="gg-open">לראות את המטרה</button>`);
  $('gg-open').onclick=()=>{closeSheet();open.add(g.id);showTab('goals');renderGoals();setTimeout(()=>{const el=document.querySelector(`.goal[data-g="${g.id}"]`);el&&el.scrollIntoView({block:'center'})},50)};
}

/* ---------- home screen widget (Android app): today's step and mood ---------- */
let widgetT=0;
function pushWidget(){
  if(!window.TsaadApp||!TsaadApp.setWidget)return;clearTimeout(widgetT);
  widgetT=setTimeout(()=>{try{
    const L=today(),done=L.filter(t=>t.done).length,next=L.find(t=>!t.done&&t.auto)||L.find(t=>!t.done&&t.energy==='light')||L.find(t=>!t.done);
    const g=next&&next.goalId&&goalOf(next.goalId);
    TsaadApp.setWidget(JSON.stringify({date:T,title:next?(g?(g.emoji||'🎯')+' הצעד של היום':'☀️ הבא בתור'):(L.length?'🌸 הכל סומן להיום':'🌤️ יום חדש'),
      text:next?next.text:(L.length?G('{עשית|עשית} את כל מה {שתכננת|שתכננת}'):G('מה {תרצה|תרצי} לעשות היום?')),
      progress:L.length?'✨ '+done+' מתוך '+L.length:'🌱 צעד קטן',mood:S.moods[T]==null?-1:S.moods[T],ask:G('איך {אתה מרגיש|את מרגישה}?')}))}catch(e){}},400);
}
function takeWidgetMood(){
  if(!window.TsaadApp||!TsaadApp.takeWidgetMood)return;
  try{const r=TsaadApp.takeWidgetMood();if(!r)return;const o=JSON.parse(r);if(o&&o.date&&o.m>=0&&o.m<=4&&between(o.date,T)<=2&&S.moods[o.date]!==o.m){S.moods[o.date]=o.m;save();renderAll()}}catch(e){}
}

/* ---------- what's new in 7.0: each item can be tried right away ---------- */
const NEW_TRY={calm:()=>openCalm(),report:()=>openReport(),insight:()=>openInsight(),garden:()=>{showTab('progress');setTimeout(()=>{const el=$('garden-big');el&&el.scrollIntoView({block:'start'})},60)},buddy:()=>window.TKbuddy&&TKbuddy.open(),morning:()=>{S.morningSeen='';save();showTab('today');renderToday()}};

/* ---------- choosing a companion: a big grouped gallery with a live preview ---------- */
function openPetPicker(){
  let pet=S.settings.mascot;
  const draw=()=>{const m=MASCOTS[pet]||MASCOTS.plant;
    openSheet(sheetHead('🧸 מי ילווה אותך?')+`<div class="pet-prev"><div class="pp-art">${petIcon(pet)}</div><b>${esc(m.n)}</b></div>
      <div class="pet-gallery">${petPickHTML(pet)}</div>
      <button class="btn wide pet-save" id="pp-save">${G('{בחרתי|בחרתי}, שומרים 💛')}</button>`);
    const s=$('sheet'),top=s.querySelector('.pet-gallery');
    s.querySelectorAll('[data-masc]').forEach(b=>b.onclick=()=>{pet=b.dataset.masc;const y=s.scrollTop;draw();$('sheet').scrollTop=y});
    $('pp-save').onclick=()=>{S.settings.mascot=pet;save();closeSheet();lastStage=-1;renderAll();toast('💛 '+(MASCOTS[pet]||MASCOTS.plant).n.split(',')[0]+' '+G('{מלווה|מלווה}')+' אותך מעכשיו')};
  };
  draw();
}
NEW_TRY.pets=()=>openPetPicker();
NEW_TRY.sos=()=>openCalm('people');

/* ---------- my people: one tap sends "I'm having a hard day" on WhatsApp ---------- */
const SOS_DEFAULT='{היי, עובר עליי יום קשה היום 💛 אשמח אם תתקשר או תשלח לי הודעה כשאתה יכול.|היי, עובר עליי יום קשה היום 💛 אשמח אם תתקשרי או תשלחי לי הודעה כשאת יכולה.}';
const waNum=p=>{let d=String(p||'').replace(/[^\d+]/g,'');if(d.startsWith('+'))d=d.slice(1);else if(d.startsWith('00'))d=d.slice(2);else if(d.startsWith('0'))d='972'+d.slice(1);return /^\d{8,15}$/.test(d)?d:''};
const sosList=()=>S.settings.sos||(S.settings.sos=[]);
function sendSOS(c,text){
  const url='https://wa.me/'+waNum(c.p)+'?text='+encodeURIComponent(text);
  if(window.TsaadApp&&TsaadApp.openExternal)TsaadApp.openExternal(url);else window.open(url,'_blank','noopener');
  toast(G('💛 כל הכבוד {שביקשת|שביקשת} תמיכה. זה צעד אמיץ'));
}
function peopleHTML(){
  const L=sosList(),msg=S.settings.sosText||G(SOS_DEFAULT);
  return `<div class="sos">
    <p class="hint" style="margin:0">${G('אנשים קרובים שאפשר לפנות אליהם ביום קשה. לחיצה אחת פותחת וואטסאפ עם הודעה מוכנה, ו{אתה|את} {שולח|שולחת} בעצמך.')}</p>
    ${L.length?`<label class="fieldcol" for="sos-text">💬 ההודעה<textarea id="sos-text" rows="3">${esc(msg)}</textarea></label>
      <div class="sos-list">${L.map((c,i)=>`<div class="sos-it"><button class="btn sos-send" data-sos="${i}">📲 לשלוח ל${esc(c.n)}</button><button class="del" data-sosdel="${i}" aria-label="להסיר את ${esc(c.n)}">${X}</button></div>`).join('')}</div>
      ${L.length>1?`<button class="btn ghost wide" id="sos-all">💛 לשלוח לכולם (${L.length})</button>`:''}`
      :`<div class="big-e">🫂</div><p style="text-align:center">${G('עוד לא {הוספת|הוספת} אף אחד. מספיק אדם אחד שאכפת לו.')}</p>`}
    <details class="sos-add"${L.length?'':' open'}><summary>+ ${L.length?'להוסיף עוד מישהו':'להוסיף איש קשר'}</summary>
      <div class="sos-form"><input id="sos-n" placeholder="שם (למשל: אמא, דני)" autocomplete="off" maxlength="30"><input id="sos-p" type="tel" dir="ltr" placeholder="מספר טלפון, 050-1234567" autocomplete="tel" maxlength="20">
      <div id="sos-err" class="hint" style="color:#C0392B;margin:0" hidden></div><button class="btn" id="sos-save">לשמור</button></div></details>
  </div>`;
}
function wirePeople(redraw){
  const L=sosList(),txt=()=>($('sos-text')?$('sos-text').value.trim():'')||G(SOS_DEFAULT);
  if($('sos-text'))$('sos-text').onchange=e=>{const v=e.target.value.trim();S.settings.sosText=v&&v!==G(SOS_DEFAULT)?v:'';save()};
  $('sheet').querySelectorAll('[data-sos]').forEach(b=>b.onclick=()=>sendSOS(L[+b.dataset.sos],txt()));
  $('sheet').querySelectorAll('[data-sosdel]').forEach(b=>b.onclick=()=>{if(b.dataset.armed!=='1'){b.dataset.armed='1';b.textContent='?';return}L.splice(+b.dataset.sosdel,1);save();redraw()});
  if($('sos-all'))$('sos-all').onclick=()=>{let i=0;const next=()=>{if(i>=L.length)return;const c=L[i++];sendSOS(c,txt());if(i<L.length)openSheet(sheetHead('💛 לשלוח לכולם')+`<p>${G('נשלח ל'+esc(c.n)+'? אפשר להמשיך לבא בתור.')}</p><button class="btn wide" id="sos-next">📲 לשלוח ל${esc(L[i].n)}</button><button class="btn ghost wide" data-act="sheet-close">מספיק להיום</button>`),$('sos-next').onclick=next};next()};
  $('sos-save').onclick=()=>{const n=$('sos-n').value.trim(),p=$('sos-p').value.trim(),err=$('sos-err');
    if(!n){err.textContent='צריך שם';err.hidden=false;return}
    if(!waNum(p)){err.textContent='המספר לא נראה תקין. למשל 050-1234567';err.hidden=false;return}
    L.push({n,p});save();toast('🫂 '+n+' '+G('נוסף לאנשים שלך'));redraw()};
}

/* ================= 7.3: look and feel ================= */

/* ---------- color palettes (on top of the theme; the accent color stays the user's own) ---------- */
const PALETTES={
  pastel:{n:'פסטל',sw:['#FFF7EF','#FFC6DC','#BFE0FF']},
  forest:{n:'יער',sw:['#F3F8EE','#B4E3B8','#6FB58A']},
  sea:{n:'ים',sw:['#EFF8FB','#A9DDF0','#5AA9D6']},
  sunset:{n:'שקיעה',sw:['#FFF4EA','#FFC29E','#E98AA8']},
  lilac:{n:'לילך',sw:['#F8F4FF','#D9C9FF','#A88BEB']},
};

/* ---------- small helpers ---------- */
function haptic(p){try{if(window.TsaadApp&&TsaadApp.vibrate)TsaadApp.vibrate(Array.isArray(p)?30:p);else if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
const gardenEl=()=>document.querySelector('#v-today .garden');
const tod=h=>h>=5&&h<11?'morning':h>=11&&h<17?'day':h>=17&&h<20?'eve':'night';

/* ---------- Hebrew date, holidays and seasons ---------- */
const HEB_FMT=(()=>{try{return new Intl.DateTimeFormat('en-u-ca-hebrew',{day:'numeric',month:'long'})}catch(e){return null}})();
function hebDate(d){if(!HEB_FMT)return null;try{const p=HEB_FMT.formatToParts(d);return {d:+p.find(x=>x.type==='day').value,m:p.find(x=>x.type==='month').value}}catch(e){return null}}
// after 17:00 the Hebrew day (and the holiday) already begins
function holiday(now){
  now=now||new Date();const eff=new Date(now);if(now.getHours()>=17)eff.setDate(eff.getDate()+1);
  const h=hebDate(eff);if(!h)return null;const {d,m}=h,is=(mm,a,b)=>m===mm&&d>=a&&d<=(b||a);
  for(let k=0;k<8;k++){const x=new Date(eff);x.setDate(x.getDate()-k);const y=hebDate(x);if(y&&y.m==='Kislev'&&y.d===25)return {k:'hanukkah',n:k+1,e:'🕎',t:'חנוכה שמח, נר '+['ראשון','שני','שלישי','רביעי','חמישי','שישי','שביעי','שמיני'][k]}}
  if(is('Tishri',1,2))return {k:'rosh',e:'🍎',t:'שנה טובה ומתוקה'};
  if(is('Tishri',10))return {k:'kippur',e:'🤍',t:'גמר חתימה טובה',quiet:1};
  if(is('Tishri',15,21))return {k:'sukkot',e:'🌿',t:'חג סוכות שמח'};
  if(is('Tishri',22))return {k:'torah',e:'📜',t:'שמחת תורה שמחה'};
  if(is('Shevat',15))return {k:'tubishvat',e:'🌳',t:'ט״ו בשבט, חג לעצים'};
  if(is('Adar',14,15)||is('Adar II',14,15))return {k:'purim',e:'🎭',t:'פורים שמח'};
  if(is('Nisan',15,21))return {k:'pesach',e:'🌾',t:'חג פסח שמח'};
  if(m==='Iyar'&&d>=3&&d<=6){const dow=eff.getDay();const ok=(d===5&&dow>=2&&dow<=4)||(d===4&&dow===4)||(d===3&&dow===4)||(d===6&&dow===2);if(ok)return {k:'atzmaut',e:'🇮🇱',t:'חג עצמאות שמח'}}
  if(is('Iyar',18))return {k:'lag',e:'🔥',t:'ל״ג בעומר שמח'};
  if(is('Sivan',6))return {k:'shavuot',e:'🌸',t:'חג שבועות שמח'};
  return null;
}
const season=(d=new Date())=>{const m=d.getMonth();return m===11||m<2?'winter':m<5?'spring':m<8?'summer':'autumn'};
let decorKey='';
function decorOn(){return S.settings.seasons!==false}
// behind the plant: flowers on the hills in spring, and the holiday's little picture
function sceneExtras(){
  if(!decorOn()){decorKey='off';return ''}
  const hd=holiday(),se=season();decorKey=se+'|'+(hd?hd.k+(hd.n||''):'');
  let out='';
  if(se==='spring')out+=[[18,124],[44,118],[120,126],[168,120],[214,127],[248,118],[300,121]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-2.6" rx="1.8" ry="2.8" fill="${['#FF8FB1','#FFD24D','#FFFFFF','#C9A7FF'][i%4]}" transform="rotate(${a})"/>`).join('')}<circle r="1.4" fill="#FFC93C"/></g>`).join('');
  if(se==='winter')out+=`<g class="cloud rainc"><ellipse cx="66" cy="44" rx="20" ry="8"/><ellipse cx="78" cy="38" rx="12" ry="9"/></g>`;
  if(hd&&!hd.quiet){
    if(hd.k==='hanukkah'){const xs=[232,242,252,262,277,287,297,307],sh=270;
      out+=`<g class="menorah" transform="translate(-112 52) scale(.5)"><rect x="248" y="128" width="44" height="5" rx="2.5" fill="#E2B33C"/><path d="M270 128 V100" stroke="#E2B33C" stroke-width="3"/><path d="M232 100 Q232 116 270 116 Q308 116 308 100" stroke="#E2B33C" stroke-width="2.4" fill="none"/>`+
        `<path d="M242 100 Q242 110 270 110 Q298 110 298 100 M252 100 Q252 104 270 104 Q288 104 288 100" stroke="#E2B33C" stroke-width="2" fill="none"/>`+
        [...xs,sh].map((x,i)=>{const isSh=x===sh,lit=isSh||i>=8-hd.n;const top=isSh?88:96;return `<rect x="${x-1.6}" y="${top}" width="3.2" height="${isSh?12:6}" rx="1" fill="#FFFFFF" stroke="#E7D7B0" stroke-width=".5"/>${lit?`<ellipse class="flame" cx="${x}" cy="${top-3}" rx="2.2" ry="3.6" fill="#FFB020"/><ellipse cx="${x}" cy="${top-2.4}" rx="1" ry="1.8" fill="#FFF3B0"/>`:''}`}).join('')+'</g>';}
    else{const E={rosh:'🍎🍯',sukkot:'🌿🍋',torah:'📜✨',tubishvat:'🌳🌰',purim:'🎭🎉',pesach:'🌾🍷',atzmaut:'🇮🇱🎈',lag:'🔥',shavuot:'🌸🥛'}[hd.k]||hd.e;
      out+=`<text class="holi" x="4" y="138" font-size="${[...E].length>2?13:16}" style="font-family:var(--emoji);direction:ltr" text-anchor="start">${E}</text>`}
  }
  return out;
}
// in front: falling leaves in autumn, soft drops in winter, a butterfly in spring and summer
function sceneFront(){
  if(!decorOn())return '';
  const se=season(),R=(i,a,b)=>a+((i*7919)%97)/97*(b-a);
  if(se==='autumn')return `<g class="fall">${[0,1,2,3,4].map(i=>`<ellipse class="fl" cx="${R(i,20,140)}" cy="-6" rx="4" ry="2.2" fill="${['#F2A541','#E07A3F','#F6C344','#C8553D','#E9B44C'][i]}" style="animation-delay:${(i*1.7).toFixed(1)}s;animation-duration:${(7+i%3*1.5).toFixed(1)}s"/>`).join('')}</g>`;
  if(se==='winter')return `<g class="rain">${Array.from({length:9},(_,i)=>`<path class="dr" d="M${R(i,50,92).toFixed(0)} 50 l-2 7" style="animation-delay:${(i*.33).toFixed(2)}s"/>`).join('')}</g>`;
  return `<g class="bfly"><g class="bf-in"><ellipse cx="-3" cy="0" rx="3.6" ry="2.6" fill="#FFB3D9"/><ellipse cx="3" cy="0" rx="3.6" ry="2.6" fill="#BFE0FF"/><path d="M0 -3 V3" stroke="#6B4E71" stroke-width="1" stroke-linecap="round"/></g></g>`;
}

/* ---------- a line for the day, under the greeting ---------- */
const DAY_LINES=['כל צעד נחשב','היום מתחיל בנשימה אחת','מותר ללכת לאט','מספיק להתחיל קטן','{אתה|את} עושה יותר ממה {שאתה חושב|שאת חושבת}','יום חדש, דף חדש','גם מנוחה היא צעד','לאט לאט, אבל קדימה','{אתה לא לבד|את לא לבד} בזה','הנה עוד הזדמנות קטנה','קודם כל, כוס מים 💧','לא חייבים מושלם, רק קצת','{תהיה עדין|תהיי עדינה} עם עצמך היום','כל דבר קטן מצטבר','{אתה|את} בדרך הנכונה','מותר לבקש עזרה','גם יום רגיל הוא יום טוב','חיוך קטן זה גם התחלה','צעד אחד, ואז עוד אחד','הגינה שלך גדלה בשקט','{מגיע לך|מגיע לך} יום רך','אין לחץ, יש כיוון','{אתה חשוב|את חשובה} פה','עוד יום שאפשר לצמוח בו','גם עננים עוברים','{תהיה גאה|תהיי גאה} בכל ניסיון','מה הדבר הכי קטן שאפשר היום?','{אתה מספיק|את מספיקה} בדיוק כמו {שאתה|שאת}','השמש עוד תצא','לפעמים ההישג הוא פשוט לקום','לב פתוח, צעד קטן'];
function dayLine(){
  if(decorOn()){const hd=holiday();if(hd)return hd.t+' '+hd.e}
  const n=new Date(),dw=n.getDay(),h=n.getHours();
  if((dw===5&&h>=12)||(dw===6&&h<19))return 'שבת שלום 🕯️';
  return DAY_LINES[between('2026-01-01',T)%DAY_LINES.length];
}

/* ---------- the companion lives: blinks, sleeps at night, jumps for joy, hugs on a hard day ---------- */
let joyT=0;
function petMood(){
  const g=gardenEl();if(!g)return;const h=new Date().getHours(),t=tod(h);
  ['morning','day','eve','night'].forEach(x=>g.classList.toggle('tod-'+x,x===t));
  const sleep=(h>=22||h<6)&&!g.classList.contains('pet-joy'),hug=isHard();
  g.classList.toggle('pet-sleep',sleep);g.classList.toggle('pet-hug',hug&&!sleep);
  const m=$('mascot');if(m){m.querySelectorAll('.pz,.phg').forEach(x=>x.remove());
    if(sleep)m.insertAdjacentHTML('beforeend','<i class="pz" aria-hidden="true">z</i><i class="pz" aria-hidden="true">z</i>');
    else if(hug)m.insertAdjacentHTML('beforeend','<i class="phg" aria-hidden="true">💜</i>');
    if(!m.dataset.tap){m.dataset.tap='1';m.setAttribute('role','button');m.tabIndex=0;m.setAttribute('aria-label','ללטף את החבר שלך');
      m.addEventListener('click',petTap);m.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();petTap()}})}}
  // the day or the season changed: draw the scene again
  const wantKey=decorOn()?season()+'|'+((x=>x?x.k+(x.n||''):'')(holiday())):'off';
  if(wantKey!==decorKey){lastStage=-1;renderToday()}
}
function petJoy(){
  const g=gardenEl();if(!g||noMotion())return;
  g.classList.remove('pet-sleep');g.classList.remove('pet-joy');void g.offsetWidth;g.classList.add('pet-joy');
  clearTimeout(joyT);joyT=setTimeout(()=>{g.classList.remove('pet-joy');petMood()},1300);
}
const PET_TAP=['💛 נעים לי איתך','🐾 אני כאן {איתך|איתך}','✨ {אתה עושה|את עושה} עבודה יפה','🌱 גדלים ביחד','🤗 חיבוק קטן','😊 היי! שמחתי {שבאת|שבאת}','💤 רגע, נרדמתי קצת...','🍃 {בוא|בואי} ננשום ביחד','🌸 {אתה מיוחד|את מיוחדת}','🎈 יאללה, צעד קטן?'];
let tapI=-1;
function petTap(){
  const g=gardenEl(),h=new Date().getHours(),asleep=g&&g.classList.contains('pet-sleep');
  petJoy();haptic(12);
  const m=$('mascot');if(m&&!noMotion()){const hrt=document.createElement('i');hrt.className='pheart';hrt.textContent=pick(['💛','💗','💜','✨','🌸']);hrt.setAttribute('aria-hidden','true');m.appendChild(hrt);setTimeout(()=>hrt.remove(),1100)}
  let line;if(asleep)line=pick(['😴 ששש... אני ישן קצת. לילה טוב 🌙','💤 גם {אתה צריך|את צריכה} לנוח. לילה טוב']);
  else if(isHard())line=pick(['💜 אני פה {איתך|איתך}. יום קשה עובר','🫂 חיבוק גדול. מספיק משהו אחד קטן היום']);
  else{do{tapI=Math.floor(Math.random()*PET_TAP.length)}while(PET_TAP.length>1&&PET_TAP[tapI].startsWith('💤')&&h>8&&h<20);line=PET_TAP[tapI]}
  toast(line);
}

/* ---------- little things when a task is checked: the check pops and leaves fly ---------- */
function leaves(el,big){
  if(!el||noMotion()||S.settings.confetti===false)return;
  el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  const r=el.getBoundingClientRect();if(!r.width)return;const x=r.left+r.width/2,y=r.top+r.height/2;
  const se=decorOn()?season():'spring',E=se==='autumn'?['🍂','🍁','🍃','✨']:se==='winter'?['🍃','💧','✨','🌿']:['🍃','🌿','✨','🌸'];
  const n=big?12:7;
  for(let i=0;i<n;i++){const s=document.createElement('span');s.className='leafp';s.textContent=E[i%E.length];s.setAttribute('aria-hidden','true');
    const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.1,d=40+Math.random()*(big?110:60);
    s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',(Math.cos(a)*d).toFixed(0)+'px');s.style.setProperty('--dy',(Math.sin(a)*d).toFixed(0)+'px');s.style.setProperty('--r',((Math.random()-.5)*260).toFixed(0)+'deg');s.style.animationDelay=(i*25)+'ms';
    document.body.appendChild(s);setTimeout(()=>s.remove(),1400)}
}

/* ---------- a small personal greeting when the app opens (once a day) ---------- */
function splash(){
  if(!S.onboarded||S.settings.splash===false||S.splashDay===T)return;
  S.splashDay=T;save();
  const h=new Date().getHours(),greet=(h<5?'לילה טוב':h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב')+(S.settings.name?', '+S.settings.name:'');
  const sky={morning:'🌤️',day:'☀️',eve:'🌇',night:'🌙'}[tod(h)];
  const d=document.createElement('div');d.className='splash tod-'+tod(h);d.setAttribute('role','status');
  d.innerHTML=`<div class="sp-in"><div class="sp-pet">${petIcon(S.settings.mascot)}</div><h2>${esc(greet)} ${sky}</h2><p>${esc(G(dayLine()))}</p></div>`;
  const bye=()=>{if(!d.isConnected)return;d.classList.add('out');setTimeout(()=>d.remove(),noMotion()?0:450)};
  d.onclick=bye;document.body.appendChild(d);setTimeout(bye,2300);
}

/* ---------- "a beautiful moment": any line becomes a designed card to keep or send ---------- */
const CARD_BG={
  garden:{n:'🌿 גינה',c:['#E8F8EE','#BFE6CF','#8FD3B0'],ink:'#23402F',dots:'#FFFFFF'},
  dawn:{n:'🌸 זריחה',c:['#FFF2E6','#FFD0DD','#FFB8A3'],ink:'#4A2B3A',dots:'#FFFFFF'},
  sea:{n:'🌊 ים',c:['#EAF7FF','#B9E2F7','#86C7EA'],ink:'#1F3A52',dots:'#FFFFFF'},
  sunset:{n:'🌇 שקיעה',c:['#FFE0B8','#FFB59A','#D98BB5'],ink:'#3E2236',dots:'#FFF1D6'},
  night:{n:'🌙 לילה',c:['#2A2A5C','#4B3F86','#7A5DA8'],ink:'#FFF8F2',dots:'#FFF3B0'},
};
function wrapLines(ctx,text,maxW){const words=text.split(/\s+/),out=[];let line='';
  words.forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t});if(line)out.push(line);return out}
async function drawCard(cv,text,who,bgk){
  const W=1080,H=1350,ctx=cv.getContext('2d'),B=CARD_BG[bgk]||CARD_BG.garden;cv.width=W;cv.height=H;
  try{await Promise.all([document.fonts.load('64px "Suez One"','שלום'),document.fonts.load('40px "Varela Round"','שלום')])}catch(e){}
  const gr=ctx.createLinearGradient(0,0,W*.4,H);gr.addColorStop(0,B.c[0]);gr.addColorStop(.55,B.c[1]);gr.addColorStop(1,B.c[2]);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
  // soft light circles
  let sd=hashN(text);const rnd=()=>(sd=(sd*1103515245+12345)>>>0)/4294967296;
  for(let i=0;i<14;i++){ctx.globalAlpha=.08+rnd()*.14;ctx.fillStyle=B.dots;ctx.beginPath();ctx.arc(rnd()*W,rnd()*H,20+rnd()*120,0,Math.PI*2);ctx.fill()}
  ctx.globalAlpha=1;
  // the companion on top
  const pet=MASCOTS[S.settings.mascot]?S.settings.mascot:'plant';
  if(hasArt(pet)){const svg=petSVG(pet).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" ');
    await new Promise(res=>{const im=new Image();im.onload=()=>{ctx.drawImage(im,W/2-130,120,260,260);res()};im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
  else{ctx.font='200px "Noto Color Emoji","Apple Color Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(MASCOTS[pet].e,W/2,250)}
  // the words
  ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle=B.ink;
  let fs=84,lines;do{ctx.font=`${fs}px "Suez One","Varela Round",sans-serif`;lines=wrapLines(ctx,text,W-200);fs-=4}while((lines.length*fs*1.35>620)&&fs>44);
  fs+=4;const lh=fs*1.38,top=440+(620-lines.length*lh)/2+fs;
  lines.forEach((l,i)=>ctx.fillText(l,W/2,top+i*lh));
  if(who){ctx.font='42px "Varela Round",sans-serif';ctx.globalAlpha=.8;ctx.fillText('· '+who+' ·',W/2,top+lines.length*lh+30);ctx.globalAlpha=1}
  ctx.font='38px "Varela Round",sans-serif';ctx.globalAlpha=.75;ctx.fillText('צעד קטן · כל צעד נחשב 🌱',W/2,H-80);ctx.globalAlpha=1;
}
function cardB64(cv){return cv.toDataURL('image/png').split(',')[1]}
function openCard(text,who){
  text=String(text||'').trim();if(!text)return;let bg=Object.keys(CARD_BG)[hashN(text)%5];
  const draw=()=>{
    openSheet(sheetHead('🖼️ רגע יפה')+`<div class="card-prev"><canvas id="card-cv" aria-label="כרטיס עם המשפט"></canvas></div>
      <div class="card-bgs" role="group" aria-label="רקע">${Object.entries(CARD_BG).map(([k,v])=>`<button data-cbg="${k}" aria-pressed="${k===bg}" style="background:linear-gradient(135deg,${v.c.join(',')})" aria-label="${v.n}"></button>`).join('')}</div>
      <div class="actions" style="justify-content:center"><button class="btn" id="card-share">📤 לשלוח למישהו</button><button class="btn ghost" id="card-save">💾 לשמור</button></div>
      <p class="hint" style="text-align:center">${G('אפשר לשים כרקע לטלפון, או לשלוח למישהו שצריך את זה היום 💛')}</p>`);
    const cv=$('card-cv');drawCard(cv,text,who,bg);
    $('sheet').querySelectorAll('[data-cbg]').forEach(b=>b.onclick=()=>{bg=b.dataset.cbg;$('sheet').querySelectorAll('[data-cbg]').forEach(x=>x.setAttribute('aria-pressed',x===b));drawCard(cv,text,who,bg)});
    const name='tsaad-katan-'+T+'.png';
    const needUpdate=()=>{toast('📲 כדי לשמור תמונות צריך לעדכן את האפליקציה');return true};
    $('card-save').onclick=()=>{
      if(window.TsaadApp){if(!TsaadApp.saveImage)return needUpdate();TsaadApp.saveImage(cardB64(cv),name);return}
      const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=name;document.body.appendChild(a);a.click();a.remove();toast('💾 הכרטיס נשמר')};
    $('card-share').onclick=()=>{
      if(window.TsaadApp){if(!TsaadApp.shareImage)return needUpdate();TsaadApp.shareImage(cardB64(cv),name);return}
      cv.toBlob(async b=>{const f=new File([b],name,{type:'image/png'});
        if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],text:'💛'})}catch(e){}return}
        $('card-save').click()},'image/png')};
  };
  draw();
}
$('q-card').onclick=e=>{e.stopPropagation();openCard($('quote').textContent,$('quote-who').hidden?'':$('quote-who').textContent)};

/* what's new: try it */
NEW_TRY.petlive=()=>{showTab('today');setTimeout(()=>{window.scrollTo({top:0,behavior:'smooth'});petTap()},200)};
NEW_TRY.sky=()=>openSettings();
NEW_TRY.pal=()=>openSettings();
NEW_TRY.access=()=>openSettings();
NEW_TRY.bell=()=>{if(!S.settings.sound){S.settings.sound=true;save()}chime(true);petJoy();toast('🔔 '+G('הפעלנו צליל פעמון רך. אפשר לכבות בהגדרות'))};
NEW_TRY.sounds=()=>openCalm('breath');
NEW_TRY.seasons=()=>{showTab('today');window.scrollTo({top:0,behavior:'smooth'})};
NEW_TRY.card=()=>{showTab('today');openCard($('quote').textContent,$('quote-who').hidden?'':$('quote-who').textContent)};
setInterval(()=>{if(!document.hidden)petMood()},5*60*1000);

/* ================= 7.4: Nivi the walrus says hello (once, right after the update) ================= */
function openNivi(){
  const was=S.settings.mascot;
  openSheet(`<div class="nivi-pop"><div class="nv-sea"><span class="nv-b" style="--x:18%;--d:0s">🫧</span><span class="nv-b" style="--x:78%;--d:1.1s">🫧</span><span class="nv-b" style="--x:60%;--d:2s">🫧</span><span class="nv-ice e">🧊</span><div class="nv-pet">${petSVG('nivi')}</div></div>
    <h2 id="sheet-title">${G('שלום! אני ניבי הניבתן! 🦭')}</h2>
    <p>${G('הרגע הגעתי מהקוטב הצפוני. שחיתי 4,000 קילומטר רק כדי לפגוש {אותך|אותך}! (טוב, את חצי הדרך עשיתי על קרחון שהתבלבל בכיוון 🧊)')}</p>
    <p>${G('אני מומחה עולמי בשלושה דברים: לשכב על הצד, לאכול דגים, ולהאמין {בך|בך} בלי הפסקה 💙')}</p>
    <p>${G('השפם מסורק, הניבים מצוחצחים, ואני מוכן ללוות {אותך|אותך} בכל צעד קטן. גם בצעדים ממש־ממש קטנים. סמכו עליי, אני ניבתן, אני מבין בזחילה 😄')}</p>
    <div class="nv-tip">🐟 ${G('טיפ מניבי: אף ניבתן לא שוחה את כל האוקיינוס בבת אחת. סנפיר אחד, ועוד סנפיר. ופתאום {אתה|את} כבר בצד השני!')}</div>
    <button class="btn wide" id="nv-yes">${G('🦭 {בחר|בחרי} בי ללוות {אותך|אותך}!')}</button>
    <button class="linkbtn" id="nv-later" style="align-self:center">${G('אולי אחר כך, ניבי')}</button></div>`);
  $('nv-yes').onclick=()=>{S.settings.mascot='nivi';save();closeSheet();lastStage=-1;renderAll();
    setTimeout(()=>{celebrate(document.querySelector('.garden'),G('🦭 ניבי: יששש! {בחרת|בחרת} בי! כבר מצחצח את הניבים לכבוד זה 🦷✨'),true)},150)};
  $('nv-later').onclick=()=>{closeSheet();toast(G('🐟 ניבי מבין לגמרי. הוא יחכה בגלריית החברים, ויאכל דג בינתיים'))};
}
NEW_TRY.nivi=()=>openNivi();
