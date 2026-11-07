/* Android app side: gentle reminders (quiet at night, Shabbat and holidays), app updates. In a phone browser: an install link. */
(function(){
if(!window.TK)return;
const $=id=>document.getElementById(id);
const SITE=window.TK_SITE||(location.origin+location.pathname.replace(/[^/]*$/,''));
const app=window.TsaadApp;
const {G,toast}=TK;

if(!app){
  /* phone browser on Android: offer the app (only there) */
  if(/Android/i.test(navigator.userAgent)){const box=$('get-app');if(box){box.hidden=false;box.querySelector('a').href=SITE+'apk/tsaad-katan.apk'}}
  return;
}

/* ---------- Shabbat and holiday windows, from Hebcal (Jerusalem times), cached ---------- */
const z=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());
async function holyWindows(){
  const key='tsaad-katan-holy',today=ymd(new Date());
  try{const c=JSON.parse(localStorage.getItem(key));if(c&&c.day===today)return c.w}catch(e){}
  try{
    const end=new Date(Date.now()+16*864e5);
    const r=await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&c=on&geonameid=281184&start=${today}&end=${ymd(end)}`);
    const items=(await r.json()).items||[];const w=[];let open=null;
    items.forEach(i=>{if(i.category==='candles'&&!open)open=Date.parse(i.date);else if(i.category==='havdalah'&&open){w.push([open,Date.parse(i.date)]);open=null}});
    if(open)w.push([open,open+26*36e5]);
    localStorage.setItem(key,JSON.stringify({day:today,w}));return w;
  }catch(e){ /* offline: Friday 16:00 to Saturday 20:00 */
    const w=[];for(let i=0;i<16;i++){const d=new Date();d.setDate(d.getDate()+i);if(d.getDay()===5){d.setHours(16,0,0,0);w.push([+d,+d+28*36e5])}}return w;
  }
}

/* ---------- reminders for the next week ---------- */
const NOON=['☀️ איך הולך היום? אפילו צעד אחד קטן נחשב','🌱 רגע קטן בשבילך: מה הדבר הכי קל ברשימה?','💛 תזכורת עדינה: {אתה|את} לא {צריך|צריכה} להספיק הכל','🍀 אולי כוס מים ונשימה, ואז צעד קטן?'];
const EVE=['🌙 רגע לסקירת ערב? לראות מה כן {עשית|עשית} היום','✨ הערב כאן. מה היה טוב היום?','🌸 לפני השינה: אפשר לסמן מה {עשית|עשית}, ומה עובר למחר'];
async function reschedule(){
  const S=TK.get(),st=S.settings,list=[];const w=await holyWindows();
  const holy=t=>w.some(([a,b])=>t>=a&&t<b);
  const quiet=t=>{const h=new Date(t).getHours();return h<9||h>=22||(!st.shabbatOn&&holy(t))};
  const now=Date.now();
  for(let i=0;i<7;i++){
    const d=new Date();d.setDate(d.getDate()+i);
    const at=(h,m)=>{const x=new Date(d);x.setHours(h,m,0,0);return +x};
    if(st.noon!==false){const t=at(12,30);if(t>now&&!quiet(t))list.push({id:100+i,at:t,title:'צעד קטן',body:G(NOON[(d.getDate()+i)%NOON.length])})}
    const eh=st.eveningHour||19;const t2=at(eh,0);if(t2>now&&!quiet(t2))list.push({id:200+i,at:t2,title:'צעד קטן',body:G(EVE[d.getDate()%EVE.length])});
  }
  // morning note: today's small step (the app writes a fuller note inside)
  const T0=ymd(new Date()),L0=(S.tasks[T0]||[]),step=(L0.find(t=>!t.done&&t.auto)||{}).text||((S.goals||[]).map(g=>!g.achievedAt&&(g.steps||[]).find(x=>!x.done)).find(Boolean)||{}).text;
  const name=st.name?' '+st.name:'';
  const MORN=['☀️ בוקר טוב'+name+'. אין לחץ, רק צעד קטן אחד','🌱 בוקר טוב'+name+'. מה הדבר הכי קטן שאפשר היום?','💛 בוקר טוב'+name+'. {אתה|את} לא {צריך|צריכה} להספיק הכל','🌤️ בוקר טוב'+name+'. יום חדש, דף חדש'];
  if(st.morning!==false)for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()+i);d.setHours(9,15,0,0);const t=+d;
    if(t>now&&!quiet(t))list.push({id:500+i,at:t,title:'💌 הודעת בוקר',body:G(i<=1&&step?'☀️ בוקר טוב'+name+'. הצעד הקטן של היום: '+step:MORN[(d.getDate()+i)%MORN.length])})}
  // "we thought of you": these are pushed forward on every visit, so they only arrive after a few days away
  if(st.missYou!==false){const away=(days,id,title,body)=>{let t=new Date();t.setDate(t.getDate()+days);t.setHours(12,0,0,0);t=+t;let n=0;while(quiet(t)&&n++<8)t+=36e5*3;list.push({id,at:t,title,body:G(body)})};
    away(3,400,'חשבנו עליך 💛','אין מה להשלים ואין מה להסביר. אפשר לחזור מתי {שתרצה|שתרצי}, אפילו רק לסמן איך {אתה מרגיש|את מרגישה} 🌱');
    away(7,401,'עדיין כאן בשבילך 🤗','הגינה שלך מחכה, בלי שום לחץ. צעד אחד קטן מספיק כדי להתחיל מחדש.')}
  w.forEach(([a],i)=>{const t=a-36e5;if(t>now&&new Date(a).getDay()===5)list.push({id:300+i,at:t,title:'שבת שלום 🕯️',body:G('עוד מעט שבת. כל מה {שעשית|שעשית} השבוע נחשב. מגיע לך לנוח 💛')})});
  try{app.schedule(JSON.stringify(list))}catch(e){}
}

/* ---------- update check: app-version.json on the site ---------- */
async function checkUpdate(){
  try{
    const r=await fetch(SITE+'app-version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();
    const mine=+app.versionCode();if(!(v.versionCode>mine))return;
    const box=$('update-bar');if(!box)return;
    box.innerHTML=`<span>🎁 ${G('יש גרסה חדשה לאפליקציה')} (${v.versionName})${v.notes?'<br><small>'+TK.esc(v.notes)+'</small>':''}</span><button class="btn small" id="upd-go">לעדכן</button>`;
    box.hidden=false;
    const url=v.url||SITE+'apk/tsaad-katan.apk';
    $('upd-go').onclick=()=>{
      if(!app.installUpdate){app.openExternal(url);toast('⬇️ ההורדה נפתחת בדפדפן. אחרי שהיא נגמרת, לפתוח את הקובץ ולאשר עדכון');return}
      /* inside the app: download with progress, then Android asks to confirm */
      $('upd-go').disabled=true;$('upd-go').textContent='מוריד...';
      window.onUpdateProgress=p=>{const b=$('upd-go');if(!b)return;
        if(p===-2){b.disabled=false;b.textContent='לנסות שוב';toast('🌧️ ההורדה לא הצליחה. אפשר לנסות שוב');return}
        b.textContent=p>=100?'מתקין...':p>=0?'מוריד '+p+'%':'מוריד...';
        if(p>=100)toast('📲 עוד רגע Android ישאל אם לעדכן. ללחוץ "עדכון"')};
      app.installUpdate(url)};
  }catch(e){}
}

/* data from app version 3 (kept inside the app) moves to the site once */
try{const st=app.takeStash&&app.takeStash();if(st){const d=JSON.parse(st),cur=TK.get();
  const own=x=>Object.values(x.tasks||{}).some(L=>L.some(t=>!t.sample))||(x.goals||[]).some(g=>!g.sample);
  if(own(d)&&!own(cur)){TK.replace(d);toast('💛 כל מה שהיה לך באפליקציה עבר איתך')}}}catch(e){}

window.TKnative={reschedule};
setTimeout(()=>{
  const S=TK.get();
  let asked=null;try{asked=localStorage.getItem('tsaad-katan-notif')}catch(e){}
  if(S.onboarded&&!asked){try{localStorage.setItem('tsaad-katan-notif','1');app.askNotifications()}catch(e){}}
  reschedule();checkUpdate();
},1500);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){reschedule();checkUpdate()}});
})();
