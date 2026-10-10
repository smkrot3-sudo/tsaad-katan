/* The gentle coach: a ✨ button on every screen, preset questions per screen, answers streamed from the coach Edge Function.
   The conversation stays on this phone; the server keeps only a daily counter. */
(function(){
if(!window.TK||!window.TKcloud)return;
const SB_URL='https://pzrzwilkloksfxsvcwji.supabase.co',SB_KEY='sb_publishable_kTKMU6nUUWtGAgb-SJvYyQ_QweS_o60';
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
window.TKai={ready:()=>!!TKcloud.user()&&navigator.onLine,steps:(title,why,days)=>quick('steps',{title,why,days}),smaller:text=>quick('smaller',{text}),open:draw};

const fab=document.createElement('button');fab.className='ai-fab';fab.id='ai-fab';fab.setAttribute('aria-label','המאמן העדין');fab.innerHTML='<span class="e">✨</span><span class="l">המאמן</span>';
fab.onclick=draw;document.body.appendChild(fab);
})();
