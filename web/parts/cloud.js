/* Cloud: sign-in (email, Google when enabled), one JSON row per user with a version, offline-first sync. */
(function(){
const SB_URL='https://pzrzwilkloksfxsvcwji.supabase.co';
/* publishable key: meant to be public, all access is limited by row-level security */
const SB_KEY='sb_publishable_kTKMU6nUUWtGAgb-SJvYyQ_QweS_o60';
const SITE=window.TK_SITE||(location.origin+location.pathname.replace(/[^/]*$/,''));
const META='tsaad-katan-cloud';
const $=id=>document.getElementById(id);
if(!window.supabase||!window.TK)return;
const sb=supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'tsaad-katan-auth'}});
const inApp=!!window.TsaadApp;
let user=null,isVip=false,isAdmin=false,googleOn=false,busy=false,timer=null,online=navigator.onLine;
let meta={};try{meta=JSON.parse(localStorage.getItem(META))||{}}catch(e){}
const saveMeta=()=>{try{localStorage.setItem(META,JSON.stringify(meta))}catch(e){}};
const {G,esc,toast,openSheet,closeSheet,sheetHead}=TK;

/* ---------- merge two copies of the data (two devices edited offline) ---------- */
function merge(a,b){ /* a = local, b = server; the newer copy wins where both changed the same thing */
  const newer=(a.u||0)>=(b.u||0)?a:b,older=newer===a?b:a;
  const del=Object.assign({},b.del||{},a.del||{});
  const byId=(x,y)=>{const m=new Map();(y||[]).forEach(i=>m.set(i.id,i));(x||[]).forEach(i=>m.set(i.id,i));return [...m.values()].filter(i=>!del[i.id])};
  const out=Object.assign({},older,newer);
  out.del=del;
  out.tasks={};new Set([...Object.keys(a.tasks||{}),...Object.keys(b.tasks||{})]).forEach(k=>{out.tasks[k]=byId((newer.tasks||{})[k],(older.tasks||{})[k])});
  out.goals=byId(newer.goals,older.goals);
  out.journal=byId(newer.journal,older.journal).sort((x,y)=>(y.at||0)-(x.at||0));
  ['moods','hard','reviewed','injectSkip','askNext'].forEach(k=>out[k]=Object.assign({},older[k]||{},newer[k]||{}));
  out.settings=Object.assign({},older.settings||{},newer.settings||{});
  out.onboarded=!!(a.onboarded||b.onboarded);
  out.u=Date.now();
  return out;
}
const hasOwnData=s=>Object.values(s.tasks||{}).some(L=>L.some(t=>!t.sample))||(s.goals||[]).some(g=>!g.sample)||(s.journal||[]).some(j=>!j.sample);
function strip(s){const c=JSON.parse(JSON.stringify(s));delete c.lastSeenPrev;return c}

/* ---------- sync ---------- */
async function pull(){
  if(!user||!online)return;
  const {data,error}=await sb.from('profiles').select('data,version').eq('user_id',user.id).maybeSingle();
  if(error)throw error;
  const local=TK.get();
  if(!data){ /* first time for this account: what was typed before signing up moves into it */
    meta.version=0;meta.dirty=true;saveMeta();return push();
  }
  if(meta.uid!==user.id){ /* this device just signed in to the account */
    const merged=hasOwnData(local)?merge(local,data.data):data.data;
    meta.uid=user.id;meta.version=data.version;meta.dirty=hasOwnData(local);saveMeta();
    TK.replace(merged,true);if(meta.dirty)return push();return;
  }
  if(data.version===meta.version)return meta.dirty?push():undefined;
  if(meta.dirty){const merged=merge(local,data.data);meta.version=data.version;saveMeta();TK.replace(merged,true);meta.dirty=true;saveMeta();return push()}
  meta.version=data.version;saveMeta();TK.replace(data.data,true);
}
async function push(){
  if(!user||!online||busy)return;busy=true;dot();
  try{
    const {data:v,error}=await sb.rpc('save_profile',{p_data:strip(TK.get()),p_expected_version:meta.version||0});
    if(error)throw error;
    if(v==null){busy=false;meta.dirty=true;saveMeta();await pull();return} /* someone else saved first: merge and retry */
    meta.version=v;meta.uid=user.id;meta.dirty=false;saveMeta();
  }catch(e){console.warn('sync',e)}
  finally{busy=false;dot()}
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(()=>push(),ms==null?1500:ms)}
async function sync(){try{await pull()}catch(e){console.warn('pull',e)}dot()}

/* ---------- top bar: avatar, sync dot, sign-in ---------- */
function dot(){
  const box=$('acct-top');if(!box)return;
  if(!user){box.innerHTML=`<button class="login-btn" data-cloud="login">☁️ ${G('{התחבר|התחברי}')}</button>`;return}
  const m=user.user_metadata||{};const name=m.full_name||m.name||TK.get().settings.name||user.email;
  const st=!online?'off':meta.dirty||busy?'pending':'';
  box.innerHTML=`<button class="avatar-btn" data-cloud="menu" aria-label="החשבון שלי, ${esc(name)}">${m.avatar_url?`<img src="${esc(m.avatar_url)}" alt="" referrerpolicy="no-referrer">`:esc((name||'?').trim()[0]||'?')}${isVip?'<span class="vip-crown">👑</span>':''}<span class="sync ${st}"></span></button>`;
  const off=$('offline-note');if(off)off.hidden=online;
}

/* ---------- sign-in sheet ---------- */
const ERR={
  'Invalid login credentials':'המייל או הסיסמה לא נכונים. אפשר לנסות שוב, או לבחור "שכחתי סיסמה".',
  'Email not confirmed':'עוד לא אישרת את המייל. שלחנו לך קישור, כדאי לבדוק גם בספאם.',
  'User already registered':'כבר יש חשבון עם המייל הזה. אפשר פשוט להתחבר.',
  'Password should be at least 6 characters':'הסיסמה צריכה להיות לפחות 6 תווים.',
  'Unable to validate email address: invalid format':'נראה שהמייל לא כתוב נכון.',
  'Email rate limit exceeded':'נשלחו יותר מדי מיילים בזמן קצר. אפשר לנסות שוב בעוד כמה דקות.',
  'Failed to fetch':'אין חיבור לאינטרנט כרגע. אפשר לנסות כשיש רשת.',
};
const heErr=e=>{const m=(e&&e.message)||String(e);const k=Object.keys(ERR).find(x=>m.includes(x));return k?ERR[k]:(/rate limit/i.test(m)?ERR['Email rate limit exceeded']:/password/i.test(m)&&/weak|least/i.test(m)?ERR['Password should be at least 6 characters']:'משהו לא הסתדר: '+m)};
function openAuth(mode){
  mode=mode||'login';
  const draw=()=>{
    openSheet(sheetHead(mode==='signup'?'☁️ חשבון חדש':mode==='reset'?'🔑 שכחתי סיסמה':'☁️ התחברות')+`<div class="auth">
      <p style="margin:0">${mode==='reset'?'נשלח לך מייל עם קישור לבחירת סיסמה חדשה.':G('עם חשבון, כל מה {שכתבת|שכתבת} נשמר בענן ועובר איתך לכל מכשיר. מה שכבר יש כאן יעבור לחשבון.')}</p>
      ${googleOn&&mode!=='reset'?`<button class="gbtn" id="au-google"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>המשך עם Google</button><div class="or">או עם מייל</div>`:''}
      ${mode==='signup'?`<input id="au-name" placeholder="השם שלך (רשות)" autocomplete="given-name" value="${esc(TK.get().settings.name||'')}">`:''}
      <input id="au-email" type="email" placeholder="מייל" autocomplete="email" dir="ltr">
      ${mode!=='reset'?`<input id="au-pass" type="password" placeholder="סיסמה (לפחות 6 תווים)" autocomplete="${mode==='signup'?'new-password':'current-password'}" dir="ltr">`:''}
      <div id="au-msg" hidden></div>
      <button class="btn wide" id="au-go">${mode==='signup'?'ליצור חשבון':mode==='reset'?'לשלוח קישור':'להתחבר'}</button>
      <div class="actions" style="justify-content:space-between">
        ${mode==='login'?`<button class="linkbtn" data-m="signup">אין לי חשבון עדיין</button><button class="linkbtn" data-m="reset">שכחתי סיסמה</button>`:`<button class="linkbtn" data-m="login">יש לי כבר חשבון</button>`}
      </div></div>`);
    const msg=(t,ok)=>{const m=$('au-msg');m.className=ok?'ok':'err';m.textContent=t;m.hidden=false};
    $('sheet').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw()});
    if($('au-google'))$('au-google').onclick=google;
    $('au-go').onclick=async()=>{
      const email=$('au-email').value.trim(),pass=$('au-pass')&&$('au-pass').value;
      if(!email){$('au-email').focus();return}
      $('au-go').disabled=true;
      try{
        if(mode==='reset'){const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:SITE});if(error)throw error;msg('📬 שלחנו מייל. הקישור יפתח דף לבחירת סיסמה חדשה.',true)}
        else if(mode==='signup'){const name=$('au-name').value.trim();
          const {data,error}=await sb.auth.signUp({email,password:pass,options:{data:{full_name:name},emailRedirectTo:SITE}});if(error)throw error;
          if(data.session){closeSheet();toast('🌱 החשבון נוצר. הכל נשמר עכשיו בענן')}
          else msg('📬 כמעט! שלחנו לך מייל עם קישור לאישור. אחרי האישור אפשר להתחבר כאן.',true)}
        else{const {error}=await sb.auth.signInWithPassword({email,password:pass});if(error)throw error;closeSheet();toast('☁️ התחברת. מסנכרן...')}
      }catch(e){msg(heErr(e))}
      $('au-go').disabled=false;
    };
  };
  draw();
}
async function google(){
  if(inApp){ /* Google does not allow sign-in inside an app's WebView: go through the browser and come back with a link */
    const {data,error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:SITE+'auth-return.html',skipBrowserRedirect:true}});
    if(error){toast(heErr(error));return}
    TsaadApp.openExternal(data.url);toast('🌐 ממשיכים בדפדפן, ושם יש כפתור לחזרה לאפליקציה');
  }else{const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:SITE}});if(error)toast(heErr(error))}
}
/* the app gets the tokens back from auth-return.html through a tsaadkatan:// link */
window.onAndroidAuth=async(access_token,refresh_token)=>{const {error}=await sb.auth.setSession({access_token,refresh_token});toast(error?heErr(error):'☁️ התחברת עם Google')};

function openNewPassword(){
  openSheet(sheetHead('🔑 סיסמה חדשה')+`<div class="auth"><input id="np" type="password" placeholder="סיסמה חדשה (לפחות 6 תווים)" autocomplete="new-password" dir="ltr"><div id="np-msg" class="err" hidden></div><button class="btn wide" id="np-go">לשמור</button></div>`);
  $('np-go').onclick=async()=>{const {error}=await sb.auth.updateUser({password:$('np').value});if(error){$('np-msg').textContent=heErr(error);$('np-msg').hidden=false;return}closeSheet();toast('🔑 הסיסמה עודכנה')};
}

/* ---------- account menu + settings section ---------- */
async function signOut(){
  if(meta.dirty&&online){toast('☁️ שומר לפני יציאה...');await push()}
  if(inApp&&TsaadApp.setAdminFeed)TsaadApp.setAdminFeed('');
  await sb.auth.signOut();
  meta={};saveMeta();
  /* the data belongs to the account: leave a clean page on this device */
  const s=TK.get();TK.replace({v:3,tasks:{},goals:[],moods:{},journal:[],hard:{},onboarded:true,seenNew:s.seenNew,settings:{address:s.settings.address,mascot:s.settings.mascot,theme:s.settings.theme}},true);
  closeSheet();toast('👋 יצאת מהחשבון. הנתונים שמורים בענן');
}
function acctHTML(){
  if(!user)return `<div class="acct"><b>☁️ גיבוי בענן</b><span style="font-size:.9rem">${G('כרגע הכל נשמר רק במכשיר הזה. עם חשבון, הנתונים שמורים גם בענן ועוברים איתך לכל מכשיר.')}</span><button class="btn" data-cloud="login">${G('{התחבר|התחברי} או {צור|צרי} חשבון')}</button></div>`;
  const m=user.user_metadata||{};
  return `<div class="acct"><div class="who"><span class="avatar-btn" style="pointer-events:none">${m.avatar_url?`<img src="${esc(m.avatar_url)}" alt="">`:esc(((m.full_name||user.email)[0])||'?')}</span><div><b>${esc(m.full_name||m.name||'החשבון שלי')}${isVip?' 👑':''}</b><div style="font-size:.85rem;color:var(--muted)" dir="ltr">${esc(user.email||'')}</div></div></div>
    <span style="font-size:.85rem">${!online?'📴 אין רשת כרגע. הכל נשמר במכשיר ויעלה לענן כשהרשת תחזור.':meta.dirty?'⏳ יש שינויים שמחכים לעלות לענן':'✅ הכל שמור בענן'}</span>
    <div class="actions"><button class="btn small ghost" data-cloud="sync">🔄 לסנכרן עכשיו</button><button class="btn small ghost" data-cloud="logout">👋 יציאה</button>${isAdmin?'<a class="btn small ghost" href="admin.html">🛠️ ניהול</a>':''}</div>
    <button class="linkbtn" data-cloud="delete" style="align-self:flex-start;color:var(--muted)">מחיקת החשבון</button></div>`;
}
function openMenu(){openSheet(sheetHead('☁️ החשבון שלי')+acctHTML())}
function openDelete(){
  openSheet(sheetHead('מחיקת החשבון')+`<div class="auth"><p>${G('זה ימחק את החשבון ואת כל מה ששמור בענן: מטרות, משימות, יומן ומכתבים. אי אפשר לבטל את זה.')}</p>
    <p>${G('כדאי קודם לעשות גיבוי לקובץ (בהגדרות). כדי לאשר, {כתוב|כתבי}')} <b>מחק</b>:</p><input id="del-w" autocomplete="off"><div id="del-msg" class="err" hidden></div>
    <button class="btn wide" id="del-go" style="background:#D9534F">למחוק לתמיד</button><button class="btn ghost wide" data-act="sheet-close">ביטול</button></div>`);
  $('del-go').onclick=async()=>{if($('del-w').value.trim()!=='מחק'){$('del-w').focus();return}
    $('del-go').disabled=true;const {error}=await sb.rpc('delete_my_account');
    if(error){$('del-msg').textContent=/function|schema cache|not find/i.test(error.message||'')?'מחיקת חשבון מתוך האפליקציה עוד לא פעילה. אפשר לכתוב לנו ונמחק ידנית 💛':heErr(error);$('del-msg').hidden=false;$('del-go').disabled=false;return}
    await sb.auth.signOut();meta={};saveMeta();try{localStorage.removeItem('tsaad-katan-v2')}catch(e){}
    closeSheet();toast('החשבון נמחק. שמחנו ללכת איתך 💛');setTimeout(()=>location.reload(),1500)};
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cloud]');if(!b)return;
  const a=b.dataset.cloud;
  if(a==='login')openAuth();else if(a==='menu')openMenu();else if(a==='logout')signOut();else if(a==='delete')openDelete();
  else if(a==='sync'){sync().then(()=>{toast('✅ מסונכרן');const s=$('acct-slot');s&&(s.innerHTML=acctHTML())})}
  else if(a==='msg-ok'){ackMsg(b.dataset.id,b.closest('.msgcard'))}
  else if(a==='bc-ok'){dismissBroadcast(b.dataset.id,b.closest('.msgcard'))}});

/* ---------- messages from the team (broadcasts + personal messages) ---------- */
async function loadMessages(){
  if(!user||!online)return;const box=$('cloud-msgs');if(!box)return;
  const now=new Date().toISOString();
  const [{data:bc},{data:dis},{data:pm}]=await Promise.all([
    sb.from('broadcasts').select('id,title,body').eq('active',true).order('created_at',{ascending:false}).limit(3),
    sb.from('broadcast_dismissals').select('broadcast_id'),
    sb.from('personal_msgs').select('id,title,body,starts_at,ends_at,action_label,action_url,acked_at').eq('user_id',user.id).is('acked_at',null)]);
  const gone=new Set((dis||[]).map(d=>d.broadcast_id));
  const card=(id,t,body,kind,al,au)=>`<div class="msgcard"><b>${esc(t||'')}</b><span style="white-space:pre-wrap">${esc(body||'')}</span><div class="actions">${au?`<a class="btn small" href="${esc(au)}" target="_blank" rel="noopener">${esc(al||'לפתיחה')}</a>`:''}<button class="btn small ghost" data-cloud="${kind}" data-id="${id}">הבנתי 💛</button></div></div>`;
  box.innerHTML=(pm||[]).filter(m=>(!m.starts_at||m.starts_at<=now)&&(!m.ends_at||m.ends_at>=now)).map(m=>card(m.id,m.title,m.body,'msg-ok',m.action_label,m.action_url)).join('')
    +(bc||[]).filter(b=>!gone.has(b.id)).map(b=>card(b.id,b.title,b.body,'bc-ok')).join('');
}
async function ackMsg(id,el){el&&el.remove();await sb.rpc('ack_personal_msg',{p_id:id})}
async function dismissBroadcast(id,el){el&&el.remove();await sb.from('broadcast_dismissals').insert({broadcast_id:id,user_id:user.id})}

async function seen(){
  if(!user||!online)return;
  const platform=inApp?'android':(/Android/i.test(navigator.userAgent)?'android-web':/iPhone|iPad/i.test(navigator.userAgent)?'ios-web':'web');
  await sb.from('app_seen').upsert({user_id:user.id,version:TK.version+(inApp&&TsaadApp.versionName?' / app '+TsaadApp.versionName():''),platform,device:navigator.userAgent.slice(0,160),last_seen:new Date().toISOString()});
}
async function roles(){
  if(!user)return;
  const [{data:v},{data:a}]=await Promise.all([sb.rpc('is_vip'),sb.rpc('is_admin')]);isVip=!!v;isAdmin=!!a;
  document.documentElement.classList.toggle('vip',isVip);dot();
  if(isAdmin&&inApp&&TsaadApp.setAdminFeed){const {data:tk}=await sb.rpc('admin_feed_token');if(tk)TsaadApp.setAdminFeed(tk)}
  let welcomed=null;try{welcomed=localStorage.getItem('tsaad-katan-vip')}catch(e){}
  if(isVip&&!isAdmin&&!welcomed){try{localStorage.setItem('tsaad-katan-vip','1')}catch(e){}
    openSheet(sheetHead('👑 ברוכים הבאים ל-VIP')+`<div style="text-align:center;font-size:3.4rem" class="e">👑</div>
      <p>${G('{אתה|את} חלק מהחוג הקרוב של צעד קטן 💛 מה מחכה לך:')}</p>
      <ul class="newlist"><li>✨ המאמן העדין בלי הגבלת שאלות</li><li>🎨 ערכת צבעים זהובה</li><li>🎁 גישה ראשונה לדברים חדשים</li></ul>
      <div class="actions"><button class="btn" id="vip-gold" style="flex:1">להפעיל את הזהב</button><button class="btn ghost" data-act="sheet-close">אחר כך</button></div>`);
    document.getElementById('vip-gold').onclick=()=>{TK.setAccent('gold');closeSheet();toast('👑 זהב!')}}
}

/* ---------- start ---------- */
async function onUser(u,event){
  const was=user&&user.id;user=u;dot();
  if(user&&was!==user.id){await sync();roles();seen();loadMessages()}
}
sb.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY')setTimeout(openNewPassword,300);
  setTimeout(()=>onUser(session?session.user:null,event),0);
});
fetch(SB_URL+'/auth/v1/settings',{headers:{apikey:SB_KEY}}).then(r=>r.json()).then(s=>{googleOn=!!(s.external&&s.external.google)}).catch(()=>{});
addEventListener('online',()=>{online=true;dot();sync()});
addEventListener('offline',()=>{online=false;dot()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&user)sync().then(loadMessages);else if(document.hidden&&meta.dirty)push()});

window.TKcloud={
  dirty(){meta.dirty=true;saveMeta();dot();if(user)schedule()},
  user:()=>user,vip:()=>isVip,admin:()=>isAdmin,client:sb,
  renderSettings(el){el.innerHTML=acctHTML()},
  async feedback(kind,body){const {error}=await sb.from('feedback').insert({kind,body,user_id:user.id,app_version:TK.version,platform:inApp?'android':'web'});return !error},
};
dot();
})();
