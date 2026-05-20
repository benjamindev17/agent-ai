let upsellState={reason:null,contract:null,multiType:null,discuss:null,codeLinks:''};let upsellEmailOpen=false;

function upsellSelect(r){upsellState.reason=r;upsellState.contract=null;upsellState.multiType=null;upsellState.discuss=null;document.querySelectorAll('[data-upsell]').forEach(function(b){b.classList.remove('active')});document.querySelector('[data-upsell="'+r+'"]').classList.add('active');document.querySelectorAll('[data-upsell-contract],[data-upsell-multitype],[data-upsell-discuss]').forEach(function(b){b.classList.remove('active')});el('upsell-contract-section').style.display='block';el('upsell-multi-sub').style.display=r==='multi'?'block':'none';el('upsell-code-links-section').style.display=r==='code'?'block':'none';if(r==='code'&&el('upsell-code-links-input'))el('upsell-code-links-input').value='';upsellState.codeLinks='';el('upsell-discuss-section').style.display='none';renderUpsellResult();renderUpsellEmail();}
function upsellSetContract(c){upsellState.contract=c;upsellState.discuss=null;document.querySelectorAll('[data-upsell-contract]').forEach(function(b){b.classList.remove('active')});document.querySelector('[data-upsell-contract="'+c+'"]').classList.add('active');document.querySelectorAll('[data-upsell-discuss]').forEach(function(b){b.classList.remove('active')});el('upsell-discuss-section').style.display=c==='annual'?'block':'none';renderUpsellEmail();}
function upsellSetDiscuss(v){upsellState.discuss=v;document.querySelectorAll('[data-upsell-discuss]').forEach(function(b){b.classList.remove('active')});document.querySelector('[data-upsell-discuss="'+v+'"]').classList.add('active');renderUpsellEmail();}
function upsellSetMultiType(mt){upsellState.multiType=mt;document.querySelectorAll('[data-upsell-multitype]').forEach(function(b){b.classList.remove('active')});document.querySelector('[data-upsell-multitype="'+mt+'"]').classList.add('active');renderUpsellEmail();}
function upsellSetCodeLinks(v){upsellState.codeLinks=v.trim();renderUpsellEmail();}
function renderUpsellResult(){var r=upsellState.reason;if(!r){el('upsell-placeholder').style.display='block';el('upsell-result-content').style.display='none';el('upsell-result-card').classList.remove('has-result');return;}var d=UPSELL_DATA[lang][r];if(!d)return;el('upsell-result-card').classList.add('has-result');el('upsell-result-icon').textContent='✅';el('upsell-result-title').textContent=d.title;el('upsell-placeholder').style.display='none';var c=el('upsell-result-content');c.style.display='block';c.innerHTML='<div style="padding:18px 20px;">'+d.explanation+'</div>';}
function renderUpsellEmail(){
  var r=upsellState.reason,c=upsellState.contract,mt=upsellState.multiType,discuss=upsellState.discuss;
  var isFR=lang==='fr';
  var phEl=el('upsell-email-placeholder'),txtEl=el('upsell-email-text'),btnEl=el('upsell-copy-email-btn');
  function showPh(msg){txtEl.style.display='none';phEl.style.display='block';phEl.textContent=msg;btnEl.style.display='none';}
  if(!r||!c){showPh(isFR?'Sélectionnez une raison et un type de contrat pour générer le template.':'Select a reason and contract type to generate the template.');return;}
  if(r==='multi'&&!mt){showPh(isFR?'Sélectionnez le type d\'ajout pour générer le template.':'Select the addition type to generate the template.');return;}
  if(c==='annual'&&!discuss){showPh(isFR?'Indiquez si vous proposez la signature du devis pour générer le template.':'Indicate whether you propose signing the quote to generate the template.');return;}
  var txt=buildUpsellEmail(r,c,mt,discuss,isFR,upsellState.codeLinks);
  txtEl.textContent=txt;txtEl.style.display='block';phEl.style.display='none';btnEl.style.display='inline-flex';
}
function buildUpsellEmail(reason,contract,multiType,discuss,isFR,codeLinks){
  var isAnnual=contract==='annual',discussYes=discuss==='yes';
  var greeting=isFR?'Bonjour,':'Hello,';
  var closing=isFR?'Bonne journée,':'Best regards,';
  var label='',context='',option1='',monthlyBilling='',alternative='';
  codeLinks=codeLinks||'';

  if(reason==='add-users'){
    label=isFR?"Il semblerait que des utilisateurs aient été récemment ajoutés sur votre base de données Odoo.":"It seems that users were recently added to your Odoo database.";
    context=isFR?"Dans le cadre d'un abonnement standard, chaque utilisateur ayant accès au backend est facturé, les profils Portail et Employé PDV restent, eux, gratuits.":"Under a standard subscription, each user with backend access is billed, Portal and POS Employee profiles remain free of charge.";
    option1=isFR?"• Réduire le nombre d'utilisateurs en archivant les profils concernés dans Configuration → Utilisateurs.":"• Reduce the number of users by archiving the relevant profiles in Configuration → Users.";
    monthlyBilling=isFR?"Cette régularisation interviendra au prochain renouvellement de votre contrat, sans calcul de prorata.":"This adjustment will apply at your next contract renewal, without proration.";
  }else if(reason==='studio'){
    label=isFR?"Il semblerait que l'application Studio ait été installée sur votre base de données.":"It seems that the Studio application was installed on your database.";
    context=isFR?"Studio est un outil de personnalisation visuelle très puissant, mais il nécessite un plan Custom pour fonctionner. Un point important : Studio installe automatiquement Base Automation, et si vous souhaitez revenir à un plan Standard, ces deux applications devront être désinstallées ensemble.":"Studio is a very powerful visual customization tool, but it requires a Custom plan to operate. One important point: Studio automatically installs Base Automation, and if you wish to return to a Standard plan, both applications will need to be uninstalled together.";
    option1=isFR?"• Désinstaller Studio et Base Automation :\n   - Studio : https://app.tango.us/app/workflow/How-to-remove-Studio-App-e8e9feb460744179b9b6a9eb4403b73e\n   - Base Automation : https://app.tango.us/app/workflow/Uninstall-base-automation-in-Odoo-945b1120fd4d45fcb2c92e742857c7c6":"• Uninstall Studio and Base Automation:\n   - Studio: https://app.tango.us/app/workflow/How-to-remove-Studio-App-e8e9feb460744179b9b6a9eb4403b73e\n   - Base Automation: https://app.tango.us/app/workflow/Uninstall-base-automation-in-Odoo-945b1120fd4d45fcb2c92e742857c7c6";
    monthlyBilling=isFR?"Si vous souhaitez conserver Studio, la mise à niveau vers le plan Custom sera effective au prochain renouvellement.":"If you wish to keep Studio, the upgrade to the Custom plan will take effect at your next renewal.";
  }else if(reason==='base-auto'){
    label=isFR?"Il semblerait que Base Automation ait été installé sur votre base de données.":"It seems that Base Automation was installed on your database.";
    context=isFR?"Il s'agit d'un module d'automatisation avancée qui nécessite un plan Custom. Il est fréquemment installé automatiquement avec Studio, si c'est le cas, pensez à désinstaller les deux ensemble.":"This is an advanced automation module that requires a Custom plan. It is frequently auto-installed alongside Studio, if that is the case, be sure to uninstall both together.";
    option1=isFR?"• Désinstaller Base Automation :\n   https://app.tango.us/app/workflow/Uninstall-base-automation-in-Odoo-945b1120fd4d45fcb2c92e742857c7c6":"• Uninstall Base Automation:\n   https://app.tango.us/app/workflow/Uninstall-base-automation-in-Odoo-945b1120fd4d45fcb2c92e742857c7c6";
    monthlyBilling=isFR?"La mise à niveau vers le plan Custom sera effective au prochain renouvellement.":"The upgrade to the Custom plan will take effect at your next renewal.";
  }else if(reason==='code'){
    label=isFR?"Il semblerait que des lignes de code personnalisé aient été détectées sur votre base de données Odoo.":"It seems that custom code lines were detected on your Odoo database.";
    if(codeLinks){label+='\n'+(isFR?'Voici leur provenance :':'Here is their origin:')+'\n'+codeLinks;}
    context=isFR?"Dans le cadre d'un hébergement Cloud Odoo, la maintenance de ce code est facturée par tranche de 100 lignes. Toute modification du système Odoo standard crée des obligations techniques supplémentaires : Odoo doit s'assurer que vos modules personnalisés ne compromettent pas la sécurité ou la stabilité de la plateforme, et qu'ils restent compatibles avec les futures mises à jour. Ce travail supplémentaire représente un coût opérationnel, couvert par les frais de maintenance.":"Under Odoo Cloud hosting, maintenance for this code is billed per 100-line block. Any modification to the standard Odoo system creates additional technical obligations: Odoo must ensure that your custom modules do not break security or stability and remain compatible with future upgrades. This extra work represents an operational cost, which is covered by the maintenance fee.";
    alternative=isFR?"Cela dit, si votre objectif est de développer des fonctionnalités sur mesure, il existe peut-être des solutions d'hébergement mieux adaptées à votre situation. Des options comme Odoo.sh ou l'auto-hébergement n'engendrent pas ce type de facturation et offrent davantage de flexibilité pour les projets de développement, ça pourrait valoir la peine d'en discuter.":"That said, if your goal is to develop custom features, there may be hosting solutions better suited to your situation. Options like Odoo.sh or On-Premise hosting do not incur this type of billing and offer greater flexibility for development projects, it might be worth exploring.";
    option1=isFR?"• Migrer vers Odoo.sh ou l'auto-hébergement, qui n'engendrent pas ce type de facturation.":"• Migrate to Odoo.sh or On-Premise hosting, which do not incur this type of billing.";
    monthlyBilling=isFR?"Pour ce cycle, la facturation interviendra au prochain renouvellement de votre contrat.":"For this cycle, billing will apply at your next contract renewal.";
  }else if(reason==='multi'){
    var isCompany=multiType==='company';
    label=isFR?("Il semblerait qu'une "+(isCompany?'société':'branche')+" supplémentaire ait été ajoutée sur votre base de données Odoo."):("It seems that an additional "+(isCompany?'company':'branch')+" was added to your Odoo database.");
    context=isFR?"La fonctionnalité Multi-société nécessite un plan Custom pour être activée.":"The Multi-company feature requires a Custom plan to be activated.";
    option1=isFR?("• Retirer la "+(isCompany?'société':'branche')+" concernée : Configuration → Sociétés."):("• Remove the "+(isCompany?'company':'branch')+" in question: Configuration → Companies.");
    monthlyBilling=isFR?"La mise à niveau vers le plan Custom sera effective au prochain renouvellement.":"The upgrade to the Custom plan will take effect at your next renewal.";
  }

  var parts=[greeting,'',label,'',context];
  if(alternative){parts.push('',alternative);}

  var codeOption3=reason==='code'&&codeLinks?(isFR?"• Supprimer les lignes de code concernées en vous rendant sur les liens ci-dessus.":"• Remove the relevant code lines by visiting the links above."):'';

  if(isAnnual){
    var option2=isFR?'• Conserver la configuration actuelle et signer le devis attaché au dessus de ce mail':'• Keep the current configuration and sign the quote attached above this email';
    if(discussYes){
      var count=2+(codeOption3?1:0);
      var optionsHeader=isFR?(count===3?"Trois options s'offrent à vous :":"Deux options s'offrent à vous :"):(count===3?"Three options are available to you:":"Two options are available to you:");
      var bullets=codeOption3?(option1+'\n'+codeOption3+'\n'+option2):(option1+'\n'+option2);
      var outro=isFR?"Je reste bien entendu disponible si vous souhaitez en discuter ou si vous avez des questions.":"I am of course available if you would like to discuss this or if you have any questions.";
      parts.push('',optionsHeader,'',bullets,'',outro);
    }else{
      var optionsHeader=isFR?"Pour régulariser votre situation, voici ce que nous vous conseillons :":"To resolve this, here is what we recommend:";
      var bullets=codeOption3?(option1+'\n'+codeOption3):option1;
      var outro=isFR?"Je reste disponible si vous avez des questions.":"Feel free to reach out if you have any questions.";
      parts.push('',optionsHeader,'',bullets,'',outro);
    }
  }else{
    var outro=isFR?"Je reste disponible si vous avez des questions.":"Feel free to reach out if you have any questions.";
    parts.push('',monthlyBilling,'',outro);
  }

  parts.push('',closing);
  return parts.join('\n');
}
function toggleUpsellEmail(){var b=el('upsell-email-block'),i=el('upsell-email-toggle-icon'),l=el('upsell-email-toggle-label');if(b.style.display==='none'){b.style.display='block';i.style.transform='rotate(180deg)';l.textContent=t('upsellEmailToggleClose');upsellEmailOpen=true;}else{b.style.display='none';i.style.transform='rotate(0deg)';l.textContent=t('upsellEmailToggle');upsellEmailOpen=false;}}
function copyUpsellEmail(btn){var txt=el('upsell-email-text').textContent;var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');btn.querySelector('span').textContent=t('upsellCopied');setTimeout(function(){btn.querySelector('span').textContent=t('upsellCopyEmail');},2000);}catch(e){}document.body.removeChild(ta);}
