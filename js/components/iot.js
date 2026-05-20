let iotState={type:null,need:null};

// ── IOT ──
function iotSelectType(type){
  iotState.type=type;iotState.need=null;
  document.querySelectorAll('[data-iot]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-iot="${type}"]`).classList.add('active');
  el('iot-physical-fields').style.display=type==='physical'?'block':'none';
  el('iot-virtual-fields').style.display=type==='virtual'?'block':'none';
  document.querySelectorAll('.iot-need-btn').forEach(b=>b.classList.remove('active'));
  iotClearResult();
}
function iotSelectNeed(need){
  iotState.need=need;
  document.querySelectorAll('.iot-need-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-need="${need}"]`).classList.add('active');
  iotShowResult(need);
}
function iotClearResult(){
  el('iot-result-card').classList.remove('has-result');el('iot-result-icon').textContent='ℹ️';
  el('iot-result-title').textContent=t('iotResultTitle');el('iot-placeholder').style.display='block';el('iot-result-content').style.display='none';
}
function iotShowResult(need){
  const data=IOT[lang][need]; if(!data)return iotClearResult();
  el('iot-result-card').classList.add('has-result');el('iot-result-icon').textContent='✅';
  el('iot-result-title').textContent=t('iotResultTitle');el('iot-placeholder').style.display='none';
  const c=el('iot-result-content');c.style.display='block';
  let html='';
  if(data.contacts){html+=`<div class="iot-section-title">${data.title.toUpperCase()}</div><div class="iot-contacts-grid">`;data.contacts.forEach(ct=>{html+=`<div class="iot-contact-chip"><div class="iot-contact-initials" style="background:${ct.c}">${ct.i}</div><div class="iot-contact-name">${ct.i}</div><div class="iot-contact-role">${ct.r}</div></div>`;});html+='</div>';}
  if(data.sections){data.sections.forEach(s=>{html+=`<div class="iot-section-title">${s.label}</div>`;s.links.forEach(lk=>{html+=`<a class="iot-link-btn" href="${lk.url}" target="_blank" rel="noopener"><span class="iot-link-icon">${lk.icon}</span><span class="iot-link-label">${lk.label}</span><span class="iot-link-arrow">↗</span></a>`;});});}
  html+=`<button class="iot-reset-btn" onclick="iotReset()">${t('iotResetBtn')}</button>`;
  c.innerHTML=html;
}
function iotReset(){
  iotState={type:null,need:null};
  document.querySelectorAll('[data-iot],.iot-need-btn').forEach(b=>b.classList.remove('active'));
  el('iot-physical-fields').style.display='none';el('iot-virtual-fields').style.display='none';iotClearResult();
}
var _iotExplainOpen=false;
function toggleIotExplain(){
  _iotExplainOpen=!_iotExplainOpen;
  var body=el('iot-explain-body'),icon=el('iot-explain-icon'),lbl=el('iot-explain-toggle-label');
  body.style.display=_iotExplainOpen?'block':'none';
  icon.style.transform=_iotExplainOpen?'rotate(180deg)':'rotate(0deg)';
  if(lbl) lbl.textContent=_iotExplainOpen?t('iotExplainToggleClose'):t('iotExplainToggle');
  if(_iotExplainOpen && el('iot-explain-content')) el('iot-explain-content').innerHTML=IOT_EXPLAIN[lang];
}

