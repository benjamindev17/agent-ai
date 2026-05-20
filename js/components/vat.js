let vatState={location:null,euCountry:'',status:null,vatResult:null}, vatLast=null;

// ── VAT ──
function selectLocation(loc){
  vatState={location:loc,euCountry:'',status:null,vatResult:null};vatLast=null;
  document.querySelectorAll('.loc-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.loc-btn[data-loc="${loc}"]`).classList.add('active');
  el('eu-fields').style.display=loc==='eu'?'block':'none';
  el('eu-country').value='';
  const csi=el('country-search-input'); if(csi){csi.value=''; el('country-selected-flag').textContent=''; el('country-clear-btn').style.display='none'; closeCountryDropdown();}
  document.querySelectorAll('.status-btn').forEach(b=>b.classList.remove('active'));
  el('vat-verify-section').style.display='none';
  document.querySelectorAll('.vat-btn').forEach(b=>b.classList.remove('active'));
  highlightCountry({be:'BE',uk:'GB',ch:'CH',row:null,eu:null}[loc]||null);
  if(loc!=='eu')showVatResult(loc); else clearVatResult();
}
function onEuCountryChange(){
  const c=el('eu-country').value; vatState.euCountry=c;vatState.status=null;vatState.vatResult=null;vatLast=null;
  document.querySelectorAll('.status-btn').forEach(b=>b.classList.remove('active'));
  el('vat-verify-section').style.display='none';
  document.querySelectorAll('.vat-btn').forEach(b=>b.classList.remove('active'));
  highlightCountry(c||null);
  if(c&&EU_VAT[c]&&EU_VAT[c].isExport)showVatResult('eu_b2c'); else clearVatResult();
}
function selectStatus(s){
  vatState.status=s;vatState.vatResult=null;vatLast=null;
  document.querySelectorAll('.status-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.status-btn[data-status="${s}"]`).classList.add('active');
  document.querySelectorAll('.vat-btn').forEach(b=>b.classList.remove('active'));
  if(s==='b2b'){el('vat-verify-section').style.display='block';clearVatResult();}
  else{el('vat-verify-section').style.display='none';if(vatState.euCountry)showVatResult('eu_b2c');else clearVatResult();}
}
function selectVatResult(r){
  vatState.vatResult=r;
  document.querySelectorAll('.vat-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.vat-btn.${r}`).classList.add('active');
  showVatResult(r==='valid'?'eu_b2b_valid':'eu_b2b_invalid');
}
function clearVatResult(){
  vatLast=null; el('vat-result-card').classList.remove('has-result');
  el('vat-result-icon').textContent='ℹ️'; el('vat-result-title').textContent=t('vatResultTitle');
  el('vat-placeholder').style.display='block'; el('vat-result-content').style.display='none';
}
function showVatResult(scenario){
  vatLast=scenario;
  let rate,taxName,explanation,taxToCopy;
  const country=vatState.euCountry, ci=EU_VAT[country];
  const cn=lang==='en'?(ci?ci.nameEn:''):(ci?ci.name:'');
  const S=TR[lang].scenarios;
  switch(scenario){
    case 'be':({rate,taxName,taxToCopy,explanation}=S.be);break;
    case 'uk':({rate,taxName,taxToCopy,explanation}=S.uk);break;
    case 'ch':({rate,taxName,taxToCopy,explanation}=S.ch);break;
    case 'row':({rate,taxName,taxToCopy,explanation}=S.row);break;
    case 'eu_b2b_valid':{const d=S.eu_b2b_valid(cn);rate=d.rate;taxName=d.taxName;taxToCopy=d.taxToCopy;explanation=d.explanation;break;}
    case 'eu_b2b_invalid':
      if(ci&&ci.isExport){({rate,taxName,taxToCopy,explanation}=S.eu_b2b_invalid_reunion);}
      else{rate=ci?ci.rate+'%':'—';taxName=ci&&ci.taxLabel?ci.taxLabel:`VAT for EU Services to ${ci?ci.nameEn:''}`;taxToCopy=taxName;explanation=S.eu_b2b_invalid(cn,ci?ci.rate+'%':'—').explanation;}
      break;
    case 'eu_b2c':
      if(!country)return clearVatResult();
      if(ci&&ci.isExport){({rate,taxName,taxToCopy,explanation}=S.eu_b2c_reunion);}
      else{rate=ci?ci.rate+'%':'—';taxName=ci&&ci.taxLabel?ci.taxLabel:`VAT for EU Services to ${ci?ci.nameEn:''}`;taxToCopy=taxName;explanation=S.eu_b2c(cn,ci?ci.rate+'%':'—').explanation;}
      break;
    default:return clearVatResult();
  }
  el('vat-result-card').classList.add('has-result');
  el('vat-result-icon').textContent='✅'; el('vat-result-title').textContent=t('vatResultTitle');
  el('vat-placeholder').style.display='none';
  const c=el('vat-result-content'); c.style.display='block';
  c.innerHTML=`<div class="tax-label">${t('taxLabel')}</div><div class="tax-rate"><span class="rate">${rate}</span><span class="name">${taxName}</span></div><div class="tax-explanation">${explanation}</div><div class="tax-action">ℹ️ ${t('actionLabel')}</div><button class="tax-copy-btn" onclick="copyTax(this,'${taxToCopy.replace(/'/g,"\\'")}')"><span class="copy-text">${taxToCopy}</span><span class="copy-icon">${t('copyBtn')}</span></button><button class="reset-btn" onclick="resetVat()">${t('newSim')}</button>`;
}
function copyTax(btn,text){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');btn.classList.add('copied');btn.querySelector('.copy-text').textContent=t('copiedBtn');btn.querySelector('.copy-icon').textContent='';setTimeout(()=>{btn.classList.remove('copied');btn.querySelector('.copy-text').textContent=text;btn.querySelector('.copy-icon').textContent=t('copyBtn');},2000);}catch(e){window.prompt('Copy:',text);}
  document.body.removeChild(ta);
}
function resetVat(){
  vatState={location:null,euCountry:'',status:null,vatResult:null};vatLast=null;
  document.querySelectorAll('.loc-btn,.status-btn,.vat-btn').forEach(b=>b.classList.remove('active'));
  el('eu-fields').style.display='none';el('eu-country').value='';
  const _csi=el('country-search-input');if(_csi){_csi.value='';el('country-selected-flag').textContent='';el('country-clear-btn').style.display='none';closeCountryDropdown();}
  el('vat-verify-section').style.display='none';
  clearVatResult();highlightCountry(null);
}

let csHighlight = -1;
 
function countrySearchInput(val){
  const q = val.trim().toLowerCase();
  el('country-clear-btn').style.display = val ? 'block' : 'none';
  el('country-selected-flag').textContent = '';
  el('eu-country').value = '';
  csHighlight = -1;
  if(!q){ closeCountryDropdown(); return; }
  const filtered = EU_COUNTRIES.filter(c =>
    c.fr.toLowerCase().includes(q) || c.en.toLowerCase().includes(q) || c.code.toLowerCase() === q
  );
  renderCountryDropdown(filtered);
}
 
function countrySearchFocus(){
  const val = el('country-search-input').value.trim();
  if(val) countrySearchInput(val);
}
 
function countrySearchKey(e){
  const dd = el('country-dropdown');
  const opts = dd.querySelectorAll('.country-option');
  if(e.key === 'ArrowDown'){ e.preventDefault(); csHighlight = Math.min(csHighlight+1, opts.length-1); highlightOption(opts); }
  else if(e.key === 'ArrowUp'){ e.preventDefault(); csHighlight = Math.max(csHighlight-1, 0); highlightOption(opts); }
  else if(e.key === 'Enter'){ e.preventDefault(); if(csHighlight>=0 && opts[csHighlight]) opts[csHighlight].click(); }
  else if(e.key === 'Escape'){ closeCountryDropdown(); }
}
 
function highlightOption(opts){
  opts.forEach((o,i) => o.classList.toggle('highlighted', i===csHighlight));
  if(opts[csHighlight]) opts[csHighlight].scrollIntoView({block:'nearest'});
}
 
function renderCountryDropdown(list){
  const dd = el('country-dropdown');
  const selectedCode = el('eu-country').value;
  if(!list.length){
    dd.innerHTML = `<div class="country-no-result">${lang==='fr'?'Aucun résultat':'No results'}</div>`;
  } else {
    dd.innerHTML = list.map(c => {
      const name = lang==='fr' ? c.fr : c.en;
      const sub  = lang==='fr' ? c.en : c.fr;
      return `<div class="country-option${c.code===selectedCode?' selected':''}" onclick="selectCountryOption('${c.code}')">
        <span class="country-option-flag">${c.flag}</span>
        <span class="country-option-name">${name}</span>
        <span class="country-option-sub">${sub}</span>
      </div>`;
    }).join('');
  }
  dd.style.display = 'block';
}
 
function selectCountryOption(code){
  const c = EU_COUNTRIES.find(x=>x.code===code);
  if(!c) return;
  el('eu-country').value = code;
  el('country-search-input').value = lang==='fr' ? c.fr : c.en;
  el('country-selected-flag').textContent = c.flag;
  el('country-clear-btn').style.display = 'block';
  closeCountryDropdown();
  onEuCountryChange();
}
 
function closeCountryDropdown(){
  el('country-dropdown').style.display = 'none';
  csHighlight = -1;
}
 
function countrySearchClear(){
  el('country-search-input').value = '';
  el('country-selected-flag').textContent = '';
  el('country-clear-btn').style.display = 'none';
  el('eu-country').value = '';
  closeCountryDropdown();
  // reset VAT state
  vatState.euCountry='';
  document.querySelectorAll('.status-btn').forEach(b=>b.classList.remove('active'));
  el('vat-verify-section').style.display='none';
  document.querySelectorAll('.vat-btn').forEach(b=>b.classList.remove('active'));
  clearVatResult();
  highlightCountry(null);
}
 
// Close on outside click
document.addEventListener('click', function(e){
  const wrap = el('country-search-wrap');
  if(wrap && !wrap.contains(e.target)) closeCountryDropdown();
});
