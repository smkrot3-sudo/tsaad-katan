/* A gentle donation note from the developer, shown on every app open until END (owner asked: 48 hours from 13.10.2026 23:08). */
(function(){
const END=Date.parse('2026-10-15T20:10:00Z');
const BIT='https://www.bitpay.co.il/app/me/FA4F8726-85D1-3F0D-E1FE-9D227477881C0742';
if(Date.now()>END||!window.TK)return;
let shownAt=0,hiddenAt=0;
function show(){
  if(Date.now()>END||document.getElementById('donate'))return;
  // wait for any open sheet (onboarding, what's new) to close first
  const sh=document.getElementById('sheet');if(sh&&!sh.hidden){setTimeout(show,1500);return}
  shownAt=Date.now();
  const d=document.createElement('div');d.id='donate';d.className='don-bg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','don-h');
  d.innerHTML=`<div class="don-card"><div class="don-art" aria-hidden="true">🌱💛</div>
    <h2 id="don-h">מילה קטנה מהיוצר</h2>
    <p>אפליקציה זו נוצרה באופן עצמאי על ידי <b>שמואל רוט</b>. הושקעו בה זמן, מחשבה וכסף.</p>
    <p>אם היא משמשת אתכם, נשמח לתרומות להמשך תחזוקה ועדכונים 🙏</p>
    <button class="don-bit" id="don-bit"><span class="b">bit</span> לתרומה בביט לחצו כאן</button>
    <button class="linkbtn don-skip" id="don-skip">דלג</button></div>`;
  document.body.appendChild(d);
  const close=()=>{d.classList.add('out');setTimeout(()=>d.remove(),250)};
  d.querySelector('#don-skip').onclick=close;
  d.onclick=e=>{if(e.target===d)close()};
  d.querySelector('#don-bit').onclick=()=>{
    if(window.TsaadApp&&TsaadApp.openExternal)TsaadApp.openExternal(BIT);else window.open(BIT,'_blank','noopener');
    close();setTimeout(()=>TK.toast('💛 תודה רבה!'),400)};
  setTimeout(()=>d.querySelector('#don-skip').focus(),50);
}
setTimeout(show,1200);
// coming back to the app after a while counts as a new entry
document.addEventListener('visibilitychange',()=>{if(document.hidden)hiddenAt=Date.now();else if(hiddenAt&&Date.now()-hiddenAt>10*60*1000)setTimeout(show,600)});
})();
