// ── NAV ──
function openTool(tool){
  el('view-home').style.display='none';
  el('view-vat').style.display='none';
  el('view-iot').style.display='none';
  el('view-hosting').style.display='none';
  el('view-pricing').style.display='none';
  el('view-recovery').style.display='none';
  el('view-accountant').style.display='none';
  el('view-upsell').style.display='none';
  el('view-pitch').style.display='none';
  el('view-hunting').style.display='none';
  el('view-domain').style.display='none';
  el('view-callfu').style.display='none';el('view-horeca').style.display='none';
  el('btn-back').classList.add('visible');
  el('btn-reset').classList.add('visible');
  document.querySelector('.header').classList.add('in-tool');
  view=tool;
  if(tool==='vat'){el('view-vat').style.display='block';el('header-icon-el').textContent='📋';el('header-title').textContent=t('vatHeaderTitle');}
  else if(tool==='iot'){el('view-iot').style.display='block';el('header-icon-el').textContent='🔌';el('header-title').textContent=t('iotHeaderTitle');}
  else if(tool==='hosting'){el('view-hosting').style.display='block';el('header-icon-el').textContent='🖥️';el('header-title').textContent=t('hostingHeaderTitle');}
  else if(tool==='pricing'){el('view-pricing').style.display='block';el('header-icon-el').textContent='💶';el('header-title').textContent=t('pricingHeaderTitle');}
  else if(tool==='recovery'){el('view-recovery').style.display='block';el('header-icon-el').textContent='🔓';el('header-title').textContent=t('recoveryHeaderTitle');}
  else if(tool==='accountant'){el('view-accountant').style.display='block';el('header-icon-el').textContent='🧾';el('header-title').textContent=t('accHeaderTitle');}
  else if(tool==='upsell'){el('view-upsell').style.display='block';el('header-icon-el').textContent='📈';el('header-title').textContent=t('upsellHeaderTitle');}
  else if(tool==='pitch'){el('view-pitch').style.display='block';el('header-icon-el').textContent='🎯';el('header-title').textContent=t('pitchHeaderTitle');renderPitchView();}
  else if(tool==='hunting'){el('view-hunting').style.display='block';el('header-icon-el').textContent='📅';el('header-title').textContent=t('huntingHeaderTitle');renderHuntingView();}
  else if(tool==='domain'){el('view-domain').style.display='block';el('header-icon-el').textContent='🌐';el('header-title').textContent=t('domainHeaderTitle');renderDomainView();}
  else if(tool==='callfu'){el('view-callfu').style.display='block';el('header-icon-el').textContent='📞';el('header-title').textContent=t('callHeaderTitle');renderCallFuView();}
  else if(tool==='horeca'){el('view-horeca').style.display='block';el('header-icon-el').textContent='🍽️';el('header-title').textContent=t('horecaHeaderTitle');renderHorecaView();}
  setLang(lang);
}
function goHome(){
  el('view-home').style.display='flex';el('view-vat').style.display='none';el('view-iot').style.display='none';el('view-hosting').style.display='none';el('view-pricing').style.display='none';el('view-recovery').style.display='none';el('view-accountant').style.display='none';el('view-upsell').style.display='none';el('view-pitch').style.display='none';el('view-hunting').style.display='none';el('view-domain').style.display='none';el('view-callfu').style.display='none';el('view-horeca').style.display='none';
  el('btn-back').classList.remove('visible');document.querySelector('.header').classList.remove('in-tool');el('header-icon-el').textContent='🧰';el('header-title').textContent=t('headerTitle');view='home';
}
var VIEW_ORIGINALS={};
// Save pristine HTML immediately — script is at end of body so DOM is ready
['vat','iot','hosting','pricing','recovery','accountant','upsell','pitch','hunting','domain','callfu','horeca'].forEach(function(tid){
  var v=el('view-'+tid); if(v) VIEW_ORIGINALS[tid]=v.innerHTML;
});
function resetTool(){
  // Reset ALL JS states regardless of current view
  vatState={location:null,euCountry:'',status:null,vatResult:null}; vatLast=null;
  iotState={type:null,need:null};
  hostingState={type:null};
  pricingState={topic:null,pricelist:'high',billing:'monthly'};
  recoveryState={type:null,plan:null,pricelist:'high',users:1,recoverable:null};
  accState={scenario:null,added:null,connected:null,contract:null};
  upsellState={reason:null,contract:null,multiType:null,discuss:null,codeLinks:''}; upsellEmailOpen=false;
  eligState={target:null,plan:null,billing:null,version:null}; _eligEmailOpen=false;
  pitchCAOpen={};
  huntingDate=new Date();
  callState={phase:null,plan:null,planType:null,sentiment:null,objOpen:{}};
  // If inside a tool, restore the pristine DOM for that tool
  if(view!=='home'){
    var viewEl=el('view-'+view);
    if(viewEl&&VIEW_ORIGINALS[view]) viewEl.innerHTML=VIEW_ORIGINALS[view];
    if(view==='pitch') renderPitchView();
    if(view==='hunting') renderHuntingView();
    if(view==='domain') renderDomainView();
    if(view==='callfu') renderCallFuView();
    if(view==='horeca') renderHorecaView();
  }
  // Re-apply current language
  setLang(lang);
}
