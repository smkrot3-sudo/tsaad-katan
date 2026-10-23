/* The gentle coach: a ✨ button on every screen, preset questions per screen, answers streamed from the coach Edge Function.
   The conversation stays on this phone; the server keeps only a daily counter. */
(function(){
if(!window.TK||!window.TKcloud)return;
const SB_URL='https://jgqlwuvmwbsgrcqddeyw.supabase.co',SB_KEY='sb_publishable_0LbF_Fxj9W3RbHVri_VFHQ_FCG_GQJy';
const KEY='tsaad-katan-ai';
const $=id=>document.getElementById(id);
const {G,esc,toast,openSheet,closeSheet,sheetHead}=TK;
let chat=[];try{chat=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
const keep=()=>{chat=chat.slice(-30);try{localStorage.setItem(KEY,JSON.stringify(chat))}catch(e){}};
let busy=false,left=null;

const PRESETS={
  today:['מה הדבר הכי קטן שאפשר לעשות עכשיו?','אין לי כוח היום. מה כן אפשר?','{תעזור|תעזרי} לי לבחור במה להתחיל'],
  goals:['{תעזור|תעזרי} לי לבחור מטרה חדשה','הצעד הנוכחי מרגיש גדול מדי','איך שומרים על מוטיבציה בימים קשים?'],
  progress:['מה הלך טוב השבוע?','{תכתוב|תכתבי} לי מילה טובה על הדרך שעשיתי','מה אפשר ללמוד מהשבוע הזה?'],
};
const MOODS=['קשה','לא משהו','בסדר','טוב','מצוין'];

function context(){
  const S=TK.get(),st=S.settings,d=new Date(),k=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
  const T=k(d),L=S.tasks[T]||[];const lines=[];
  lines.push(`שם: ${st.name||'לא ידוע'}. מגדר לפנייה: ${st.address}. היום: ${d.toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})}, שעה ${d.getHours()}:00.`);
  const V=TK.voice&&TK.voice();if(V)lines.push(`סגנון הדיבור שהמשתמש בחר: "${V.n}". לדבר כך: ${V.p} תמיד לשמור על הכללים למעלה, ובמצוקה לחזור לרכות.`);
  if(S.moods[T]!=null)lines.push('מצב רוח היום: '+MOODS[S.moods[T]]);
  if(S.hard&&S.hard[T])lines.push('סימן היום "יום קשה".');
  lines.push('משימות היום:'+(L.length?'':' אין'));
  L.forEach(t=>lines.push(`- ${t.text} [${t.done?'בוצע':t.partial?'התחיל':'פתוח'}, כוח: ${t.energy||'mid'}${t.carried?', עובר כבר '+t.carried+' ימים':''}]`));
  lines.push('מטרות:'+(S.goals.length?'':' אין'));
  S.goals.forEach(g=>{const cur=g.steps.find(s=>!s.done);lines.push(`- ${g.title}${g.why?' (למה: '+g.why+')':''}: ${g.steps.filter(s=>s.done).length}/${g.steps.length} צעדים${cur?', הצעד הנוכחי: '+cur.text:', הושגה'}${g.deadline?', עד '+g.deadline:''}`)});
  const wk=[];for(let i=1;i<=7;i++){const x=new Date(d);x.setDate(x.getDate()-i);const kk=k(x);const n=(S.tasks[kk]||[]).filter(t=>t.done).length;wk.push(`${kk}: ${n} בוצעו${S.moods[kk]!=null?', מצב רוח '+MOODS[S.moods[kk]]:''}`)}
  lines.push('השבוע שעבר:\n'+wk.join('\n'));
  const j=(S.journal||[]).filter(x=>x.type!=='letter').slice(0,8);if(j.length)lines.push('מהיומן:\n'+j.map(x=>'- '+x.text).join('\n'));
  return lines.join('\n');
}

function parse(text){const actions=[];const clean=text.split('\n').filter(l=>{const m=l.trim().match(/^ACTION\s+(\{.*\})\s*$/);if(m){try{actions.push(JSON.parse(m[1]))}catch(e){}return false}return true}).join('\n').trim();return {clean,actions}}
function actionCard(a,i,mi){
  if(a.type==='add_task')return `<div class="ai-act"><span>☀️ להוסיף להיום: <b>${esc(a.text)}</b></span><button class="btn small" data-ai-act="${mi}:${i}">להוסיף</button></div>`;
  if(a.type==='add_goal')return `<div class="ai-act"><span>🎯 מטרה חדשה: <b>${esc(a.title)}</b>${(a.steps||[]).length?'<br><small>'+a.steps.map(esc).join(' · ')+'</small>':''}</span><button class="btn small" data-ai-act="${mi}:${i}">ליצור</button></div>`;
  return '';
}
function bubbles(){
  return chat.map((m,mi)=>{if(m.role==='user')return `<div class="ai-msg me">${esc(m.text)}</div>`;
    const {clean,actions}=parse(m.text);
    return `<div class="ai-msg bot">${esc(clean)||'<span class="thinking">חושב...</span>'}</div>${actions.map((a,i)=>m.done&&m.done.includes(i)?'<div class="ai-act done">✓ נוסף</div>':actionCard(a,i,mi)).join('')}`}).join('');
}
function draw(){
  const user=TKcloud.user();
  const tab=TK.tab?TK.tab():'today';
  openSheet(sheetHead('✨ המאמן העדין')+(!user?`<p>${G('המאמן יכול לעזור לפרק משימה, לבחור צעד, או סתם לדבר על היום. כדי להשתמש בו צריך להתחבר (זה בחינם).')}</p><button class="btn wide" data-cloud="login">${G('{התחבר|התחברי}')}</button>`:
    `<div class="ai-log" id="ai-log">${chat.length?bubbles():`<div class="ai-msg bot">${G('היי'+(TK.get().settings.name?' '+esc(TK.get().settings.name):'')+' 🌱 על מה {תרצה|תרצי} לדבר? אפשר לבחור למטה או לכתוב חופשי.')}</div>`}</div>
    <div class="chiprow" id="ai-pre">${PRESETS[tab].map(q=>`<button class="chipbtn" data-q="${esc(G(q))}">${esc(G(q))}</button>`).join('')}</div>
    <div class="ai-in"><textarea id="ai-text" rows="2" placeholder="${G('{כתוב|כתבי} כאן... (Enter יורד שורה)')}"></textarea><button class="btn" id="ai-send" aria-label="שליחה">שליחה</button></div>
    <div class="ai-foot"><span id="ai-left">${left!=null&&left<100?'נשארו היום '+left+' שאלות':TKcloud.vip()?'👑 בלי הגבלה':''}</span>${chat.length?'<button class="linkbtn" id="ai-clear">שיחה חדשה</button>':''}</div>
    <p class="hint">${G('המאמן הוא עזר, לא טיפול. השיחה נשמרת רק בטלפון הזה.')}</p>`));
  if(!user)return;
  const lg=$('ai-log');lg.scrollTop=lg.scrollHeight;
  $('ai-send').onclick=()=>send($('ai-text').value);
  $('ai-pre').onclick=e=>{const b=e.target.closest('[data-q]');if(b)send(b.dataset.q)};
  if($('ai-clear'))$('ai-clear').onclick=()=>{chat=[];keep();draw()};
  lg.onclick=e=>{const b=e.target.closest('[data-ai-act]');if(!b)return;const [mi,i]=b.dataset.aiAct.split(':').map(Number);const m=chat[mi];const a=parse(m.text).actions[i];
    if(a.type==='add_task'){TK.addTask(a.text,a.energy);toast('☀️ נוסף לרשימה של היום')}else if(a.type==='add_goal'){TK.addGoal(a);toast('🎯 המטרה נוצרה, והצעד הראשון כבר ברשימה')}
    m.done=(m.done||[]).concat(i);keep();draw()};
}
function refresh(){const lg=$('ai-log');if(!lg)return;lg.innerHTML=bubbles();lg.scrollTop=lg.scrollHeight}
async function send(text){
  text=(text||'').trim();if(!text||busy)return;busy=true;
  chat.push({role:'user',text});const bot={role:'model',text:''};chat.push(bot);keep();draw();$('ai-send').disabled=true;
  try{
    const {data:{session}}=await TKcloud.client.auth.getSession();
    const r=await fetch(SB_URL+'/functions/v1/coach',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+session.access_token},
      body:JSON.stringify({messages:chat.slice(0,-1).map(m=>({role:m.role,text:m.text})),context:context()})});
    if(!r.ok){const e=await r.json().catch(()=>({}));
      bot.text=e.error==='limit'?G('היום כבר {שאלת|שאלת} '+e.limit+' שאלות, וזה המון 💛 מחר יש עוד.'):e.error==='no_key'?'המאמן עוד לא הופעל. זה יקרה בקרוב 🌱':'🌧️ המאמן לא זמין כרגע. אפשר לנסות שוב עוד רגע.';
    }else{
      left=+r.headers.get('x-remaining');const rd=r.body.getReader(),dec=new TextDecoder();
      while(true){const {value,done}=await rd.read();if(done)break;bot.text+=dec.decode(value,{stream:true});refresh()}
      if(!bot.text)bot.text='🌧️ לא הגיעה תשובה. אפשר לנסות שוב.';
    }
  }catch(e){if(bot.text)bot.text+='\n…';else bot.text=navigator.onLine?'🌧️ משהו לא הסתדר. אפשר לנסות שוב.':'📴 אין רשת כרגע. המאמן צריך אינטרנט.'}
  busy=false;keep();draw();
}

// short answers the app asks for by itself: steps for a new goal, tiny actions for a stuck task
async function quick(mode,payload){
  if(!TKcloud.user()||!navigator.onLine)throw {code:'unavailable'};
  const {data:{session}}=await TKcloud.client.auth.getSession();if(!session)throw {code:'unavailable'};
  const r=await fetch(SB_URL+'/functions/v1/coach',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+session.access_token},body:JSON.stringify({mode,...payload})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!Array.isArray(d.items)||!d.items.length)throw {code:d.error||'busy'};
  if(d.left!=null)left=+d.left;return d.items;
}
/* ---------- tell the coach about your day: record (or write), and it builds today's list ---------- */
const MAX_SEC=90;
let rec=null; // {ctx,stream,proc,chunks,start,timer}
async function startRec(){
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
  let ctx;try{ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:16000})}catch(e){ctx=new (window.AudioContext||window.webkitAudioContext)()}
  const src=ctx.createMediaStreamSource(stream),proc=ctx.createScriptProcessor(4096,1,1),chunks=[];
  proc.onaudioprocess=e=>chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  src.connect(proc);proc.connect(ctx.destination);
  rec={ctx,stream,proc,src,chunks,start:Date.now()};
}
function stopRec(){
  if(!rec)return null;const r=rec;rec=null;
  try{r.src.disconnect();r.proc.disconnect()}catch(e){}r.stream.getTracks().forEach(t=>t.stop());const rate=r.ctx.sampleRate;r.ctx.close();
  let n=0;r.chunks.forEach(c=>n+=c.length);if(n<rate*0.6)return null;
  const all=new Float32Array(n);let o=0;r.chunks.forEach(c=>{all.set(c,o);o+=c.length});
  // down to 16 kHz mono, 16-bit WAV: small enough to send, clear enough for speech
  const ratio=rate/16000,len=Math.floor(all.length/ratio),pcm=new Int16Array(len);
  for(let i=0;i<len;i++){const a=Math.floor(i*ratio),b=Math.min(all.length,Math.floor((i+1)*ratio));let sum=0;for(let j=a;j<b;j++)sum+=all[j];const v=Math.max(-1,Math.min(1,sum/Math.max(1,b-a)));pcm[i]=v<0?v*0x8000:v*0x7fff}
  const buf=new ArrayBuffer(44+pcm.length*2),dv=new DataView(buf),w=(p,str)=>{for(let i=0;i<str.length;i++)dv.setUint8(p+i,str.charCodeAt(i))};
  w(0,'RIFF');dv.setUint32(4,36+pcm.length*2,true);w(8,'WAVE');w(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,16000,true);dv.setUint32(28,32000,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,pcm.length*2,true);
  new Int16Array(buf,44).set(pcm);
  const bytes=new Uint8Array(buf);let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));
  return {mime:'audio/wav',data:btoa(bin),sec:Math.round(len/16000)};
}
let planAudio=null,planItems=null,planNote='';
const EN={light:'🍃 קל',mid:'🌤️ בינוני',high:'🔥 דורש כוח'};
function openPlanner(){
  const user=TKcloud.user();
  if(!user){openSheet(sheetHead('🎙️ לספר למאמן על היום')+`<p>${G('{מספר|מספרת} למאמן מה יש לך היום, והוא מסדר את זה לרשימה. כדי להשתמש בזה צריך להתחבר (זה בחינם).')}</p><button class="btn wide" data-cloud="login">${G('{התחבר|התחברי}')}</button>`);return}
  planAudio=null;planItems=null;planNote='';drawPlanner();
}
function drawPlanner(){
  if(planItems){
    openSheet(sheetHead('🎙️ הרשימה שהמאמן הציע')+(planNote?`<p>${esc(planNote)}</p>`:'')+
      (planItems.length?`<p class="hint">${G('אפשר לתקן, להוריד סימון ממה שלא {צריך|צריכה}, ולסמן 🔁 למה שחוזר כל יום.')}</p><div class="plan-list" id="pl-list">${planItems.map((x,i)=>`<div class="plan-it${x.on?'':' off'}" data-i="${i}">
        <input type="checkbox" data-on ${x.on?'checked':''} aria-label="להוסיף את זה">
        <input class="t-in" data-text value="${esc(x.text)}" aria-label="המשימה">
        <div class="plan-tags"><button type="button" class="chipbtn" data-en>${EN[x.energy]||EN.mid}</button><button type="button" class="chipbtn${x.daily?' on':''}" data-daily aria-pressed="${!!x.daily}">🔁 כל יום</button></div></div>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn" id="pl-add" style="flex:1">להוסיף לרשימה של היום</button><button class="btn ghost" id="pl-again">לנסות שוב</button></div>`
      :`<button class="btn wide" id="pl-again">לנסות שוב</button>`));
    const list=$('pl-list');
    if(list){
      list.oninput=e=>{const it=e.target.closest('[data-i]');if(it&&e.target.dataset.text!=null)planItems[+it.dataset.i].text=e.target.value};
      list.onchange=e=>{const it=e.target.closest('[data-i]');if(it&&e.target.dataset.on!=null){planItems[+it.dataset.i].on=e.target.checked;it.classList.toggle('off',!e.target.checked)}};
      list.onclick=e=>{const it=e.target.closest('[data-i]');if(!it)return;const x=planItems[+it.dataset.i];
        if(e.target.closest('[data-en]')){x.energy=x.energy==='light'?'mid':x.energy==='mid'?'high':'light';e.target.closest('[data-en]').textContent=EN[x.energy]}
        if(e.target.closest('[data-daily]')){x.daily=!x.daily;const b=e.target.closest('[data-daily]');b.classList.toggle('on',x.daily);b.setAttribute('aria-pressed',x.daily)}};
      $('pl-add').onclick=()=>{const pick=planItems.filter(x=>x.on&&x.text.trim());pick.forEach(x=>x.daily?TK.addDaily(x.text.trim(),x.energy):TK.addTask(x.text.trim(),x.energy));
        closeSheet();toast(pick.length?G('☀️ '+(pick.length===1?'משימה אחת נוספה':pick.length+' משימות נוספו')+' לרשימה של היום'):'לא נוסף כלום, וזה גם בסדר')};
    }
    $('pl-again').onclick=()=>{planItems=null;planAudio=null;drawPlanner()};
    return;
  }
  openSheet(sheetHead('🎙️ לספר למאמן על היום')+`<p>${G('{ספר|ספרי} בחופשיות מה יש לך היום, בלי סדר ובלי לחץ. המאמן יהפוך את זה לרשימה מסודרת, ו{אתה|את} {תחליט|תחליטי} מה להוסיף.')}</p>
    <div class="rec-box"><button type="button" class="rec-btn" id="pl-rec" aria-label="הקלטה">🎙️</button><div id="pl-rec-msg" class="hint">${planAudio?'✓ יש הקלטה של '+planAudio.sec+' שניות. אפשר להקליט שוב.':'ללחוץ כדי להתחיל להקליט (עד דקה וחצי)'}</div></div>
    <label class="fl">או לכתוב כאן<textarea id="pl-text" rows="3" placeholder="${G('למשל: צריך להתקשר לרופא, לקנות חלב, ובערב להתקשר לאמא...')}"></textarea></label>
    <button class="btn wide" id="pl-go" style="margin-top:10px">✨ לסדר לי את היום</button><div id="pl-think" class="thinking" hidden>המאמן מקשיב ומסדר...</div>`);
  const btn=$('pl-rec'),msg=$('pl-rec-msg');
  btn.onclick=async()=>{
    if(rec){clearInterval(rec.timer);btn.classList.remove('on');btn.textContent='🎙️';const a=stopRec();planAudio=a;msg.textContent=a?'✓ יש הקלטה של '+a.sec+' שניות. אפשר ללחוץ "לסדר לי".':'ההקלטה הייתה קצרה מדי. אפשר לנסות שוב.';return}
    try{await startRec()}catch(e){msg.textContent=G('אין גישה למיקרופון. אפשר לאשר מיקרופון לאפליקציה, או ללחוץ על המיקרופון במקלדת ולהכתיב בתיבה למטה.');return}
    btn.classList.add('on');btn.textContent='⏹️';
    rec.timer=setInterval(()=>{if(!rec)return;const s=Math.floor((Date.now()-rec.start)/1000);msg.textContent='🔴 מקליט... '+s+' שניות. ללחוץ שוב כדי לסיים.';if(s>=MAX_SEC)btn.click()},500);
  };
  $('pl-go').onclick=async()=>{
    if(rec)btn.click();
    const text=$('pl-text').value.trim();if(!planAudio&&!text){msg.textContent=G('{ספר|ספרי} או {כתוב|כתבי} משהו קודם 🌱');return}
    $('pl-go').disabled=true;$('pl-think').hidden=false;
    try{
      const {data:{session}}=await TKcloud.client.auth.getSession();
      const r=await fetch(SB_URL+'/functions/v1/coach',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+session.access_token},
        body:JSON.stringify({mode:'plan',text,audio:planAudio?{mime:planAudio.mime,data:planAudio.data}:null,address:TK.get().settings.address})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok){$('pl-go').disabled=false;$('pl-think').hidden=true;msg.textContent=d.error==='limit'?'היום כבר נגמרו השאלות למאמן 💛 מחר יש עוד.':'🌧️ המאמן לא זמין כרגע. אפשר לנסות שוב עוד רגע.';return}
      if(d.left!=null)left=+d.left;planNote=d.note||'';planItems=(d.tasks||[]).map(x=>({...x,on:true}));drawPlanner();
    }catch(e){$('pl-go').disabled=false;$('pl-think').hidden=true;msg.textContent=navigator.onLine?'🌧️ משהו לא הסתדר. אפשר לנסות שוב.':'📴 אין רשת כרגע.'}
  };
}

const pb=document.getElementById('plan-btn');if(pb)pb.onclick=openPlanner;

window.TKai={plan:openPlanner,ready:()=>!!TKcloud.user()&&navigator.onLine,steps:(title,why,days)=>quick('steps',{title,why,days}),smaller:text=>quick('smaller',{text}),open:draw};

const fab=document.createElement('button');fab.className='ai-fab';fab.id='ai-fab';fab.setAttribute('aria-label','המאמן העדין');fab.innerHTML='<span class="e">✨</span><span class="l">המאמן</span>';
fab.onclick=draw;document.body.appendChild(fab);
})();
