/* "חבר לדרך": a close person gets a secret link, sees only what was chosen (no task texts), and can send a heart or a kind word.
   Server: buddy_links (owner's links + the shared snapshot), buddy_cheers, buddy_view()/buddy_cheer() for the buddy's page. */
(function(){
if(!window.TK||!window.TKcloud)return;
const $=id=>document.getElementById(id);
const {G,esc,toast,openSheet,closeSheet,sheetHead}=TK;
const SITE=window.TK_SITE||(location.origin+location.pathname.replace(/[^/]*$/,''));
const sb=TKcloud.client;
const linkOf=t=>SITE+'buddy.html#'+t;
const z=n=>String(n).padStart(2,'0'),ymd=d=>d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());
const conf=()=>{const S=TK.get();return S.buddies||(S.buddies={})};
let links=null,missing=false;

function snapshot(c){
  const S=TK.get(),st=S.settings,T=TK.T(),out={name:st.name||'',address:st.address||'m',pet:st.mascot||'plant',at:Date.now()};
  if(c.day){const L=S.tasks[T]||[];out.today={done:L.filter(t=>t.done).length,total:L.length};
    out.week=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const k=ymd(d);const x={d:k,c:(S.tasks[k]||[]).filter(t=>t.done).length};if(c.mood&&S.moods[k]!=null)x.m=S.moods[k];return x});
    out.good30=Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return ymd(d)}).filter(k=>TK.goodDay(k)).length}
  if(c.mood&&S.moods[T]!=null)out.mood=S.moods[T];
  if(c.goals&&c.goals!=='none'){const pick=c.goals==='all'?S.goals:S.goals.filter(g=>(c.goals||[]).includes(g.id));
    out.goals=pick.map(g=>({e:g.emoji||'🌱',t:g.title,got:g.steps.filter(s=>s.done).length,total:g.steps.length,won:!!g.achievedAt}))}
  return out;
}
let pushT=0;
async function pushAll(){
  if(!TKcloud.user()||!navigator.onLine)return;
  const c=conf(),tokens=Object.keys(c).filter(t=>!c[t].off);if(!tokens.length)return;
  for(const t of tokens){const {error}=await sb.from('buddy_links').update({snapshot:snapshot(c[t]),updated_at:new Date().toISOString()}).eq('token',t);if(error&&/relation|schema cache|does not exist/i.test(error.message||'')){missing=true;return}}
}
const schedule=ms=>{clearTimeout(pushT);pushT=setTimeout(pushAll,ms==null?15000:ms)};
const dirty=TKcloud.dirty;TKcloud.dirty=function(){dirty.apply(this,arguments);if(Object.keys(conf()).length)schedule()};

async function load(){
  const {data,error}=await sb.from('buddy_links').select('token,label,revoked,created_at').order('created_at');
  if(error){missing=/relation|schema cache|does not exist/i.test(error.message||'');links=null;return false}
  links=(data||[]).filter(l=>!l.revoked);return true;
}
function shareInvite(l){
  const S=TK.get(),me=S.settings.name;
  const text=G(`היי${l.label?' '+l.label:''} 💛 הוספתי אותך כ"חבר לדרך" שלי באפליקציה צעד קטן 🌱\nבקישור אפשר לראות איך אני {מתקדם|מתקדמת}, ולשלוח לי לב או מילה טובה כשבא לך:\n`)+linkOf(l.token)+(me?'\n'+me:'');
  if(window.TsaadApp&&TsaadApp.shareText){TsaadApp.shareText(text);return}
  if(navigator.share){navigator.share({text}).catch(()=>{});return}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
}
function shareForm(c){
  const S=TK.get();const gsel=c.goals==='all'?S.goals.map(g=>g.id):c.goals==='none'?[]:(c.goals||[]);
  return `<div class="fieldcol">מה לשתף?
    <label class="check-row"><input type="checkbox" id="bd-day" ${c.day?'checked':''}>📊 כמה עשיתי היום והשבוע (בלי מה בדיוק)</label>
    <label class="check-row"><input type="checkbox" id="bd-mood" ${c.mood?'checked':''}>😊 מצב הרוח</label></div>
    ${S.goals.length?`<div class="fieldcol">🎯 אילו מטרות (שם והתקדמות)<div class="bd-goals">${S.goals.map(g=>`<label class="check-row"><input type="checkbox" data-bg="${g.id}" ${gsel.includes(g.id)?'checked':''}>${g.emoji||'🌱'} ${esc(g.title)}</label>`).join('')}</div></div>`:''}
    <p class="hint">${G('המשימות עצמן, היומן והמכתבים לא משותפים אף פעם.')}</p>`;
}
function readForm(){
  const S=TK.get(),ids=[...document.querySelectorAll('[data-bg]')].filter(x=>x.checked).map(x=>x.dataset.bg);
  return {day:$('bd-day').checked,mood:$('bd-mood').checked,goals:ids.length&&ids.length===S.goals.length?'all':ids};
}
async function open(){
  if(!TKcloud.user()){openSheet(sheetHead('🤝 חבר לדרך')+`<p>${G('שולחים קישור לאדם קרוב: חבר, הורה, בן או בת זוג, מטפל. הוא רואה רק מה {שבחרת|שבחרת} לשתף, ויכול לשלוח לך לב או מילה טובה שתקפוץ אצלך כהפתעה 💌')}</p><p>${G('כדי להשתמש בזה צריך להתחבר (זה בחינם).')}</p><button class="btn wide" data-cloud="login">${G('{התחבר|התחברי}')}</button>`);return}
  openSheet(sheetHead('🤝 חבר לדרך')+'<div class="thinking">טוען...</div>');
  const ok=await load();
  if(!ok){openSheet(sheetHead('🤝 חבר לדרך')+`<div class="big-e">🌱</div><p style="text-align:center">${missing?'הפיצ׳ר הזה יופעל ממש בקרוב. עוד רגע זה כאן 💛':navigator.onLine?'🌧️ משהו לא הסתדר. אפשר לנסות שוב עוד רגע.':'📴 צריך אינטרנט בשביל זה.'}</p>`);return}
  const c=conf();
  openSheet(sheetHead('🤝 חבר לדרך')+`<p>${G('אדם קרוב מקבל קישור סודי. הוא רואה רק מה {שבחרת|שבחרת}, ויכול לשלוח לך לב או מילה טובה 💌')}</p>
    ${links.length?`<div class="bd-list">${links.map(l=>{const x=c[l.token]||{};return `<div class="bd-card" data-t="${l.token}"><div class="r"><b>🤝 ${esc(l.label||'חבר לדרך')}</b><span class="hint" style="margin:0">${[x.day&&'📊',x.mood&&'😊',x.goals&&x.goals!=='none'&&(x.goals==='all'||x.goals.length)&&'🎯'].filter(Boolean).join(' ')}</span></div>
      <div class="actions"><button class="btn small" data-bd="share">📤 לשלוח את הקישור</button><button class="btn small ghost" data-bd="edit">✏️ מה משותף</button><button class="btn small ghost" data-bd="stop">✋ להפסיק</button></div></div>`}).join('')}</div>`:''}
    <button class="btn wide" id="bd-new">+ ${links.length?'עוד חבר לדרך':'להוסיף חבר לדרך'}</button>`);
  $('bd-new').onclick=()=>edit(null);
  $('sheet').querySelectorAll('[data-bd]').forEach(b=>b.onclick=async()=>{const t=b.closest('[data-t]').dataset.t,l=links.find(x=>x.token===t);
    if(b.dataset.bd==='share')shareInvite(l);
    else if(b.dataset.bd==='edit')edit(l);
    else{if(b.dataset.armed!=='1'){b.dataset.armed='1';b.textContent='בטוח? הקישור יפסיק לעבוד';return}
      await sb.from('buddy_links').update({revoked:true,snapshot:{}}).eq('token',t);delete conf()[t];TK.save();toast('✋ הקישור הופסק');open()}});
}
function edit(l){
  const c=l?(conf()[l.token]||{day:true,mood:false,goals:'all'}):{day:true,mood:false,goals:'all'};
  openSheet(sheetHead(l?'✏️ מה משותף':'🤝 חבר לדרך חדש')+`<div class="form" style="box-shadow:none;padding:0">
    ${l?'':`<label for="bd-name">${G('למי? (רק {בשבילך|בשבילך}, כדי לזכור)')}<input id="bd-name" placeholder="למשל: אמא, דני, המטפלת" autocomplete="off"></label>`}
    ${shareForm(c)}
    <button class="btn wide" id="bd-save">${l?'לשמור':'ליצור קישור ולשלוח'}</button></div>`);
  $('bd-save').onclick=async()=>{const nc=readForm();$('bd-save').disabled=true;
    let link=l;
    if(!l){const label=($('bd-name').value||'').trim().slice(0,40);
      const {data,error}=await sb.from('buddy_links').insert({label,snapshot:snapshot(nc)}).select('token,label').single();
      if(error){$('bd-save').disabled=false;toast(/relation|schema cache|does not exist/i.test(error.message||'')?'הפיצ׳ר יופעל ממש בקרוב 💛':'🌧️ לא הצלחנו ליצור קישור. אפשר לנסות שוב');return}
      link=data}
    conf()[link.token]=nc;TK.save();
    await sb.from('buddy_links').update({snapshot:snapshot(nc),updated_at:new Date().toISOString()}).eq('token',link.token);
    if(!l){shareInvite(link);toast('🤝 נוצר! עכשיו רק לשלוח את הקישור')}else toast('✅ נשמר');
    open()};
}

/* ---------- cheers that arrived: a small surprise ---------- */
let showing=false;
async function cheers(){
  if(showing||!TKcloud.user()||!navigator.onLine||!Object.keys(conf()).length)return;
  const {data,error}=await sb.from('buddy_cheers').select('id,from_name,emoji,body,created_at').is('seen_at',null).order('created_at').limit(10);
  if(error||!data||!data.length)return;
  showing=true;let i=0;
  const next=()=>{
    if(!$('sheet').hidden){setTimeout(next,2500);return}
    const c=data[i];if(!c){showing=false;return}
    const from=c.from_name||'מישהו שאוהב אותך';
    TK.celebrate(null,c.emoji+' '+from+' '+G('{שולח|שולחת}')+' לך עידוד',true);
    openSheet(`<div class="cheer-pop"><div class="big e">${esc(c.emoji||'💛')}</div><h2 id="sheet-title">💌 ${esc(from)} ${G('{חושב|חושבת}')} עליך</h2>
      ${c.body?`<div class="msg">${esc(c.body)}</div>`:`<p>${G('{קיבלת|קיבלת} '+esc(c.emoji||'💛')+' מחבר לדרך')}</p>`}
      <p class="hint">${data.length>1?(i+1)+' מתוך '+data.length+' · ':''}${G('נשמר ביומן, תחת "עידוד"')}</p>
      <button class="btn wide" id="ch-ok">${i+1<data.length?'עוד אחד 💛':'תודה 💛'}</button></div>`);
    TK.addJournal('cheer',(c.emoji||'💛')+' '+from+(c.body?': '+c.body:''));
    sb.from('buddy_cheers').update({seen_at:new Date().toISOString()}).eq('id',c.id).then(()=>{});
    $('ch-ok').onclick=()=>{closeSheet();i++;setTimeout(next,300)};
  };
  next();
}
let tries=0;const wait=setInterval(()=>{if(TKcloud.user()){clearInterval(wait);setTimeout(()=>{cheers();schedule(3000)},2500)}else if(++tries>40)clearInterval(wait)},1500);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(cheers,1500);else{clearTimeout(pushT);pushAll()}});
setInterval(cheers,5*60*1000);

window.TKbuddy={open,push:pushAll};
})();
