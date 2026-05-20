// ── HOSTING LOGIC ──
let hostingState={type:null};
function hostingSelect(type){
  hostingState.type=type;
  document.querySelectorAll('[data-hosting]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-hosting="${type}"]`).classList.add('active');
  hostingShowResult(type);
}
function hostingClearResult(){
  el('hosting-result-card').classList.remove('has-result');
  el('hosting-result-icon').textContent='ℹ️';
  el('hosting-result-title').textContent=t('hostingResultTitle');
  el('hosting-placeholder').style.display='block';
  el('hosting-result-content').style.display='none';
}
function hostingShowResult(type){
  const data=HOSTING[lang][type]; if(!data)return hostingClearResult();
  el('hosting-result-card').classList.add('has-result');
  el('hosting-result-icon').textContent='✅';
  el('hosting-result-title').textContent=data.title;
  el('hosting-placeholder').style.display='none';
  const c=el('hosting-result-content'); c.style.display='block';
  let html='';
  if(data.warning){html+=`<div class="hosting-warning"><span style="font-size:18px;flex-shrink:0;">ℹ️</span><span>${data.warning}</span></div>`;}
  data.rows.forEach(row=>{
    if(row.links){
      html+=`<div class="hosting-info-row"><span class="hosting-info-icon">${row.icon}</span><div><div class="hosting-info-label">${row.label}</div>`;
      row.links.forEach(lk=>{html+=`<a class="iot-link-btn" href="${lk.url}" target="_blank" rel="noopener" style="margin-top:6px;"><span class="iot-link-icon">🔗</span><span class="iot-link-label">${lk.label}</span><span class="iot-link-arrow">↗</span></a>`;});
      html+=`</div></div>`;
    } else {
      html+=`<div class="hosting-info-row"><span class="hosting-info-icon">${row.icon}</span><div><div class="hosting-info-label">${row.label}</div><div class="hosting-info-value">${row.value}</div></div></div>`;
    }
  });
  html+=`<button class="hosting-reset-btn" onclick="hostingReset()">${t('hostingResetBtn')}</button>`;
  c.innerHTML=html;
}
function hostingReset(){
  hostingState={type:null};
  document.querySelectorAll('[data-hosting]').forEach(b=>b.classList.remove('active'));
  hostingClearResult();
}
 
// ── ELIGIBILITY ──
let eligState={target:null,plan:null,billing:null,version:null};
 
function eligSelect(field, value){
  eligState[field]=value;
  document.querySelectorAll(`[data-elig-${field}]`).forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-elig-${field}="${value}"]`).classList.add('active');
  runEligibility();
}
function eligSelectVersion(v){
  eligState.version=v||null;
  runEligibility();
}
 
function runEligibility(){
  const host=eligState.target;
  const {plan,billing,version}=eligState;
  if(!host&&!plan&&!billing&&!version){el('elig-result').style.display='none';var s=el('elig-email-section');if(s)s.style.display='none';return;}
 
  const rows=[];
 
  // ── PLAN ──
  if(plan){
    if(host==='sh'){
      if(plan==='standard') rows.push({ok:'warn',icon:'⚠️',text:lang==='fr'?'Plan <strong>Standard</strong> : un abonnement <strong>personnalisé</strong> est obligatoire sur Odoo.sh.':'Plan <strong>Standard</strong>: a <strong>Custom</strong> subscription is mandatory on Odoo.sh.'});
      else rows.push({ok:'ok',icon:'✅',text:lang==='fr'?'Plan <strong>Custom</strong> : requis et compatible avec Odoo.sh.':'Plan <strong>Custom</strong>: required and compatible with Odoo.sh.'});
    } else if(host==='onprem'){
      if(plan==='standard') rows.push({ok:'warn',icon:'⚠️',text:lang==='fr'?'Plan <strong>Standard</strong> : un abonnement <strong>personnalisé</strong> est obligatoire pour l\u2019auto-hébergement.':'Plan <strong>Standard</strong>: a <strong>Custom</strong> subscription is mandatory for On Premise.'});
      else rows.push({ok:'ok',icon:'✅',text:lang==='fr'?'Plan <strong>Custom</strong> : requis et compatible avec l\u2019auto-hébergement.':'Plan <strong>Custom</strong>: required and compatible with On Premise.'});
    }
  }
 
  // ── BILLING ──
  if(billing){
    if(host==='sh'){
      if(billing==='monthly') rows.push({ok:'ok',icon:'✅',text:lang==='fr'?'Facturation <strong>mensuelle</strong> : compatible avec Odoo.sh.':'<strong>Monthly</strong> billing: compatible with Odoo.sh.'});
      else rows.push({ok:'ok',icon:'✅',text:lang==='fr'?'Facturation <strong>annuelle</strong> : compatible avec Odoo.sh.':'<strong>Yearly</strong> billing: compatible with Odoo.sh.'});
    } else if(host==='onprem'){
      if(billing==='monthly') rows.push({ok:'ko',icon:'❌',text:lang==='fr'?'Facturation <strong>mensuelle</strong> : non compatible avec l\u2019auto-hébergement. Un abonnement <strong>annuel</strong> est requis.':'<strong>Monthly</strong> billing: not compatible with On Premise. A <strong>yearly</strong> subscription is required.'});
      else rows.push({ok:'ok',icon:'✅',text:lang==='fr'?'Facturation <strong>annuelle</strong> : compatible avec l\u2019auto-hébergement.':'<strong>Yearly</strong> billing: compatible with On Premise.'});
    }
  }
 
  // ── VERSION ──
  if(version){
    const vMap={'19x':'19.x','19':'19.0','18':'18.0','17':'17.0','16':'16.0','15':'15.0','14':'14.0','older':lang==='fr'?'Antérieure à v14':'Older than v14'};
    const vLabel=vMap[version]||version;
    const shSupported=['19','18','17','16','15','14'];
    const shEndDates={'14':'31/10/2026','15':'31/10/2027','16':'31/10/2028','17':'31/10/2029','18':'31/10/2030','19':'31/10/2031'};
 
    if(host==='sh'){
      if(version==='19x') rows.push({ok:'ko',icon:'❌',text:lang==='fr'?`Version <strong>${vLabel}</strong> : les versions mineures ne sont <strong>pas compatibles</strong> avec Odoo.sh. Deux options : ouvrir une nouvelle base en version majeure, ou attendre la mise à jour de fin d\u2019année.`:`Version <strong>${vLabel}</strong>: minor versions are <strong>not compatible</strong> with Odoo.sh. Two options: open a new database on a major version, or wait for the end-of-year upgrade.`});
      else if(version==='older') rows.push({ok:'ko',icon:'❌',text:lang==='fr'?`Version <strong>${vLabel}</strong> : non supportée sur Odoo.sh. Seules les 6 dernières versions sont acceptées.`:`Version <strong>${vLabel}</strong>: not supported on Odoo.sh. Only the last 6 versions are accepted.`});
      else if(shSupported.includes(version)){
        const end=shEndDates[version];
        rows.push({ok:'ok',icon:'✅',text:lang==='fr'?`Version <strong>${vLabel}</strong> : compatible avec Odoo.sh${end?' (retrait prévu le '+end+')':''}.`:`Version <strong>${vLabel}</strong>: compatible with Odoo.sh${end?' (removal planned '+end+')':''}.`});
      }
    } else if(host==='onprem'){
      if(version==='19x') rows.push({ok:'ko',icon:'❌',text:lang==='fr'?`Version <strong>${vLabel}</strong> : les versions mineures ne sont <strong>pas compatibles</strong> avec l\u2019auto-hébergement. Deux options : ouvrir une nouvelle base en version majeure, ou attendre la mise à jour de fin d\u2019année.`:`Version <strong>${vLabel}</strong>: minor versions are <strong>not compatible</strong> with On Premise. Two options: open a new database on a major version, or wait for the end-of-year upgrade.`});
      else rows.push({ok:'ok',icon:'✅',text:lang==='fr'?`Version <strong>${vLabel}</strong> : toutes les versions majeures sont acceptées en auto-hébergement.`:`Version <strong>${vLabel}</strong>: all versions are accepted on On Premise.`});
    }
  }
 
  if(rows.length===0){
    el('elig-result').style.display='none';
    // Still show email if target is selected, even with no other criteria yet
    if(host){
      var sec0=el('elig-email-section');if(sec0)sec0.style.display='block';
      var txt0=el('elig-email-text');if(txt0)txt0.textContent=buildEligEmail();
      var lbl0=el('elig-email-toggle-label');if(lbl0)lbl0.textContent=t('eligEmailToggle');
    } else {
      var s2=el('elig-email-section');if(s2)s2.style.display='none';
    }
    return;
  }
 
  // Verdict
  const koCount=rows.filter(r=>r.ok==='ko').length;
  const warnCount=rows.filter(r=>r.ok==='warn').length;
  let verdict, vClass, vIcon;
  if(koCount>0){verdict=lang==='fr'?'Non éligible — des points bloquants ont été détectés':'Not eligible — blocking issues detected';vClass='ineligible';vIcon='🚫';}
  else if(warnCount>0){verdict=lang==='fr'?'Éligible avec conditions — vérifiez les points d\'attention':'Eligible with conditions — check warnings';vClass='partial';vIcon='⚠️';}
  else{verdict=lang==='fr'?'Éligible — migration compatible':'Eligible — compatible migration';vClass='eligible';vIcon='✅';}
 
  let html=rows.map(r=>`<div class="elig-row ${r.ok}"><span class="elig-status">${r.icon}</span><span class="elig-text">${r.text}</span></div>`).join('');
  html+=`<div class="elig-verdict ${vClass}"><span class="elig-verdict-icon">${vIcon}</span><span>${verdict}</span></div>`;
 
  const res=el('elig-result');
  res.style.display='block';
  res.innerHTML=html;
  // Show email section
  var sec=el('elig-email-section');if(sec)sec.style.display='block';
  var txt=el('elig-email-text');if(txt)txt.textContent=buildEligEmail();
  var lbl=el('elig-email-toggle-label');if(lbl)lbl.textContent=t('eligEmailToggle');
  _eligEmailOpen=false;
  var body=el('elig-email-body');if(body)body.style.display='none';
  var icon=el('elig-email-toggle-icon');if(icon)icon.style.transform='';
}
 
function eligReset(){
  eligState={target:null,plan:null,billing:null,version:null};
  document.querySelectorAll('[data-elig-target],[data-elig-plan],[data-elig-billing]').forEach(b=>b.classList.remove('active'));
  el('elig-version').value='';
  el('elig-result').style.display='none';
  el('elig-email-section').style.display='none';
  _eligEmailOpen=false;
  var icon=el('elig-email-toggle-icon');if(icon)icon.style.transform='';
  var body=el('elig-email-body');if(body)body.style.display='none';
}
var _eligEmailOpen=false;
function toggleEligEmail(){
  _eligEmailOpen=!_eligEmailOpen;
  var body=el('elig-email-body'),icon=el('elig-email-toggle-icon'),lbl=el('elig-email-toggle-label');
  if(body)body.style.display=_eligEmailOpen?'block':'none';
  if(icon)icon.style.transform=_eligEmailOpen?'rotate(180deg)':'rotate(0deg)';
  if(lbl)lbl.textContent=_eligEmailOpen?t('eligEmailToggleClose'):t('eligEmailToggle');
}
function buildEligEmail(){
  var isFR=lang==='fr';
  var host=eligState.target,plan=eligState.plan,billing=eligState.billing,version=eligState.version;
  if(!host) return isFR?'Sélectionnez une cible de migration pour générer l\'email.':'Select a migration target to generate the email.';
  var vMap={'19x':'19.x','19':'19.0','18':'18.0','17':'17.0','16':'16.0','15':'15.0','14':'14.0','older':isFR?'antérieure à v14':'older than v14'};
  var vLabel=version?vMap[version]||version:'';
  var shEnd={'14':'31/10/2026','15':'31/10/2027','16':'31/10/2028','17':'31/10/2029','18':'31/10/2030','19':'31/10/2031'};
  var shOK=['19','18','17','16','15','14'];
  var needCustom=plan==='standard';
  var needYearly=billing==='monthly'&&host==='onprem';
  var isMinor=version==='19x';
  var isOld=version==='older'&&host==='sh';
  var hasKO=needYearly||isMinor||isOld;
  var hasInfo=!!(plan||billing||version);
  var chooseLink='https://www.odoo.com/fr_FR/blog/business-hacks-1/odoo-online-odoo-sh-on-premise-quelle-est-la-meilleure-solution-pour-vous-593';
  var trialLink='https://www.odoo.com/fr_FR/trial';
  var shPrLink='https://www.odoo.sh/pricing';
  if(isFR){
    var h=host==='sh'?'Odoo.sh':'l\'hébergement self-hosted';
    var shPricing='\n\nSachez également qu\'accéder à Odoo.sh nécessite un abonnement séparé, dont le tarif varie selon la quantité de mémoire RAM, le nombre de workers et le nombre de branches de staging. Le prix est donc variable selon le besoin. Les détails sont disponibles ici : '+shPrLink;
    if(!hasInfo){
      return 'Bonjour,\n\nJe reviens vers vous concernant votre demande de migration vers '+h+'.\n\nPour pouvoir évaluer votre éligibilité, j\'aurais besoin de quelques informations : votre type de plan actuel (Standard ou Custom), votre mode de facturation (mensuel ou annuel), ainsi que la version de votre base de données.\n\nRevenez vers moi avec ces éléments et je pourrai vous donner un retour complet.\n\nBonne journée,';
    }
    if(!hasKO&&!needCustom){
      var lines='';
      if(plan) lines+='\n- Plan '+(plan==='custom'?'Custom':'Standard');
      if(billing) lines+='\n- Facturation '+(billing==='monthly'?'mensuelle':'annuelle');
      if(version&&shOK.includes(version)){var e=shEnd[version];lines+='\n- Version '+vLabel+(e?' (supportée jusqu\'au '+e+')':'');}
      else if(version) lines+='\n- Version '+vLabel;
      if(host==='sh'){
        return 'Bonjour,\n\nJe reviens vers vous au sujet de votre migration vers Odoo.sh.\n\nBonne nouvelle : votre configuration est entièrement compatible.'+lines+shPricing+'\n\nSi vous souhaitez comparer les différentes options d\'hébergement avant de confirmer, ce guide vous donnera une vue d\'ensemble : '+chooseLink+'\n\nNous pouvons dès lors planifier la migration selon vos disponibilités.\n\nBonne journée,';
      }
      return 'Bonjour,\n\nJe reviens vers vous au sujet de votre migration vers l\'hébergement self-hosted.\n\nBonne nouvelle : votre configuration est entièrement compatible.'+lines+'\n\nSi vous souhaitez confirmer que l\'hébergement self-hosted est la solution la plus adaptée à votre situation, ce guide compare les différentes options : '+chooseLink+'\n\nNous pouvons dès lors planifier la migration selon vos disponibilités.\n\nBonne journée,';
    }
    if(hasKO){
      var body='';
      if(isOld){
        body='Après vérification, votre base de données est en version '+vLabel+', qui n\'est plus dans le périmètre supporté par Odoo.sh. Cette plateforme ne prend en charge que les 6 dernières versions majeures, ce qui exclut votre version actuelle. Une mise à jour de version serait donc nécessaire avant d\'envisager la migration. Je vous recommande de contacter notre support technique pour évaluer la faisabilité : https://www.odoo.com/help.';
        if(needCustom) body+='\n\nPar ailleurs, un upgrade de votre plan Standard vers Custom serait également requis avant la migration.';
        body+=shPricing;
      } else if(isMinor){
        body='Après vérification, votre base est actuellement en version 19.x, une version mineure. '+(host==='sh'?'Odoo.sh':'L\'hébergement self-hosted')+' n\'accepte que les versions majeures (19.0, 18.0...). Deux options s\'offrent à vous : patienter jusqu\'à la mise à jour annuelle qui basculera votre base vers la version 19.0, ou créer une nouvelle base directement en version 19.0 via ce lien : ➡️ '+trialLink;
        if(needCustom) body+='\n\nPar ailleurs, un upgrade de votre plan Standard vers Custom serait également requis.';
        if(needYearly) body+='\n\nEt comme votre facturation est actuellement mensuelle, il faudra également passer sur un contrat annuel, l\'hébergement self-hosted ne fonctionnant pas en mensuel.';
        if(host==='sh') body+=shPricing;
      } else if(needYearly){
        body='Après vérification, un point bloquant a été identifié : l\'hébergement self-hosted est uniquement disponible avec un contrat annuel. Votre facturation étant actuellement mensuelle, une conversion du contrat serait nécessaire avant de pouvoir procéder à la migration.';
        if(needCustom) body+='\n\nEn parallèle, un upgrade de votre plan Standard vers Custom serait également nécessaire.';
      }
      return 'Bonjour,\n\nJe reviens vers vous au sujet de votre migration vers '+h+'.\n\n'+body+'\n\nN\'hésitez pas à revenir vers nous pour qu\'on étudie ensemble les options disponibles. Si vous souhaitez également comparer les types d\'hébergement, ce guide peut vous aider : '+chooseLink+'\n\nBonne journée,';
    }
    if(host==='sh'){
      return 'Bonjour,\n\nJe reviens vers vous au sujet de votre migration vers Odoo.sh.\n\nOdoo.sh est une plateforme d\'hébergement distincte, avec sa propre facturation en plus de votre abonnement Odoo, et elle fonctionne exclusivement avec un plan Custom. Votre plan actuel étant Standard, un upgrade du contrat serait nécessaire avant de procéder à la migration. Cela implique un ajustement tarifaire, mais la migration reste tout à fait envisageable.'+shPricing+'\n\nJe vous propose qu\'on passe en revue les options ensemble pour que la transition se passe dans les meilleures conditions. Si vous souhaitez d\'abord comparer les types d\'hébergement, ce guide peut vous aider : '+chooseLink+'\n\nBonne journée,';
    }
    return 'Bonjour,\n\nJe reviens vers vous au sujet de votre migration vers l\'hébergement self-hosted.\n\nL\'hébergement self-hosted fonctionne exclusivement avec un plan Custom côté Odoo. Votre plan actuel étant Standard, il faudra procéder à un upgrade du contrat avant la migration, ce qui implique un ajustement tarifaire.\n\nÇa reste tout à fait faisable. Je vous propose qu\'on en discute ensemble pour que la transition se passe dans les meilleures conditions. Si vous souhaitez d\'abord comparer les différentes options d\'hébergement, ce lien vous donnera un aperçu complet : '+chooseLink+'\n\nBonne journée,';
  } else {
    var h=host==='sh'?'Odoo.sh':'self-hosted';
    var shPricing='\n\nPlease also note that accessing Odoo.sh requires a separate subscription, with pricing that varies based on the amount of RAM, the number of workers, and the number of staging branches, so the cost depends on your specific needs. You can find the pricing details here: '+shPrLink;
    if(!hasInfo){
      return 'Hello,\n\nI am following up regarding your migration request to '+h+'.\n\nTo assess your eligibility, I would need a few details: your current plan type (Standard or Custom), your billing cycle (monthly or annual), and your database version.\n\nGet back to me with this information and I will be able to give you a full picture.\n\nHave a great day,';
    }
    if(!hasKO&&!needCustom){
      var lines='';
      if(plan) lines+='\n- '+(plan==='custom'?'Custom':'Standard')+' plan';
      if(billing) lines+='\n- '+(billing==='monthly'?'Monthly':'Annual')+' billing';
      if(version&&shOK.includes(version)){var e=shEnd[version];lines+='\n- Version '+vLabel+(e?' (supported until '+e+')':'');}
      else if(version) lines+='\n- Version '+vLabel;
      if(host==='sh'){
        return 'Hello,\n\nI am following up regarding your migration to Odoo.sh.\n\nGood news: your configuration is fully compatible.'+lines+shPricing+'\n\nIf you want to compare all hosting options before confirming, this guide gives a full overview: '+chooseLink+'\n\nWe can now plan the migration at your convenience.\n\nHave a great day,';
      }
      return 'Hello,\n\nI am following up regarding your migration to self-hosted.\n\nGood news: your configuration is fully compatible.'+lines+'\n\nIf you want to confirm that self-hosted is the right fit for your situation, this guide compares the different options: '+chooseLink+'\n\nWe can now plan the migration at your convenience.\n\nHave a great day,';
    }
    if(hasKO){
      var body='';
      if(isOld){
        body='After checking your configuration, your database is on version '+vLabel+', which is outside Odoo.sh\'s supported range. This platform only covers the last 6 major versions, which excludes your current version. A version upgrade would be required before migration can be considered. I recommend reaching out to our technical support to assess feasibility: https://www.odoo.com/help.';
        if(needCustom) body+='\n\nOn top of that, upgrading your plan from Standard to Custom would also be required before the migration.';
        body+=shPricing;
      } else if(isMinor){
        body='After checking your configuration, your database is on version 19.x, a minor version. '+(host==='sh'?'Odoo.sh':'Self-hosted')+' only accepts major versions (19.0, 18.0...). Two options are available: wait for the annual update that will automatically move your database to version 19.0, or create a new database directly on version 19.0 via this link: ➡️ '+trialLink;
        if(needCustom) body+='\n\nOn top of that, upgrading your plan from Standard to Custom would also be required.';
        if(needYearly) body+='\n\nAdditionally, since your billing is currently monthly, switching to an annual contract would also be needed, as self-hosted does not work on a monthly basis.';
        if(host==='sh') body+=shPricing;
      } else if(needYearly){
        body='After checking your configuration, one blocking issue was identified: self-hosted is only available with an annual contract. Since your billing is currently monthly, converting your contract would be necessary before the migration can go ahead.';
        if(needCustom) body+='\n\nAlongside that, upgrading your plan from Standard to Custom would also be needed.';
      }
      return 'Hello,\n\nI am following up regarding your migration to '+h+'.\n\n'+body+'\n\nDo not hesitate to get back to us so we can look at the available options together. If you would also like to compare hosting types, this guide can help: '+chooseLink+'\n\nHave a great day,';
    }
    if(host==='sh'){
      return 'Hello,\n\nI am following up regarding your migration to Odoo.sh.\n\nOdoo.sh is a separate hosting platform with its own billing on top of your Odoo subscription, and it works exclusively with a Custom plan. Since your current plan is Standard, an upgrade would be required before the migration. This does involve a pricing adjustment, but the migration is entirely feasible.'+shPricing+'\n\nI suggest we go over the options together to make the transition as smooth as possible. If you would like to compare hosting types first, this guide is a good starting point: '+chooseLink+'\n\nHave a great day,';
    }
    return 'Hello,\n\nI am following up regarding your migration to self-hosted.\n\nSelf-hosted works exclusively with a Custom Odoo plan. Since your current plan is Standard, an upgrade would be needed before the migration, which involves a pricing adjustment.\n\nThat said, it is entirely doable. I suggest we discuss the options together to make the transition as smooth as possible. If you would like to compare hosting types first, this link gives a complete overview: '+chooseLink+'\n\nHave a great day,';
  }
}

function copyEligEmail(btn){
  var txt=el('elig-email-text');if(!txt)return;
  navigator.clipboard.writeText(txt.textContent).then(function(){
    var lbl=el('elig-copy-email-label');
    var orig=t('eligCopyEmail');
    if(lbl){lbl.textContent=t('eligCopied');setTimeout(function(){lbl.textContent=orig;},2000);}
  });
}
 
 
