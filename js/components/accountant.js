// ── ACCOUNTANT LOGIC ──
let accState = {scenario:null, added:null, connected:null, contract:null};
 
function accSetScenario(s){
  accState = {scenario:s, added:null, connected:null, contract:null};
  document.querySelectorAll('[data-acc-scenario]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-acc-scenario="${s}"]`).classList.add('active');
  document.querySelectorAll('[data-acc-added],[data-acc-connected],[data-acc-contract]').forEach(b=>b.classList.remove('active'));
  el('acc-sub-added').style.display = s==='B' ? 'block' : 'none';
  el('acc-sub-connected').style.display = 'none';
  el('acc-contract-section').style.display = s==='A' ? 'block' : 'none';
  renderAccResult();
}
 
function accSetAdded(v){
  accState.added=v; accState.connected=null;
  document.querySelectorAll('[data-acc-added]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-acc-added="${v}"]`).classList.add('active');
  document.querySelectorAll('[data-acc-connected]').forEach(b=>b.classList.remove('active'));
  el('acc-sub-connected').style.display = v==='yes' ? 'block' : 'none';
  el('acc-contract-section').style.display = v==='no' ? 'block' : 'none';
  renderAccResult();
}
 
function accSetConnected(v){
  accState.connected=v;
  document.querySelectorAll('[data-acc-connected]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-acc-connected="${v}"]`).classList.add('active');
  el('acc-contract-section').style.display = 'block';
  renderAccResult();
}
 
function accSetContract(c){
  accState.contract=c;
  document.querySelectorAll('[data-acc-contract]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-acc-contract="${c}"]`).classList.add('active');
  renderAccResult();
}
 
function getAccActiveScenario(){
  const {scenario,added,connected} = accState;
  if(scenario==='A') return 'A';
  if(scenario==='B' && added==='no') return 'B';
  if(scenario==='B' && added==='yes' && connected==='no') return 'C';
  if(scenario==='B' && added==='yes' && connected==='yes') return 'D';
  return null;
}
 
function renderAccResult(){
  const active = getAccActiveScenario();
  const isFR = lang==='fr';
  const contract = accState.contract;
 
  // Right panel info
  const c = el('acc-result-content');
  const ph = el('acc-placeholder');
 
  if(!active){ ph.style.display='block'; c.style.display='none'; accUpdateEmail(null,null); return; }
 
  ph.style.display='none'; c.style.display='block';
  el('acc-result-card').classList.add('has-result');
  el('acc-result-icon').textContent='✅';
 
  const titles = {A:isFR?"Scénario A — Comptable non enregistré":"Scenario A — Not registered",B:isFR?"Scénario B — Enregistré, pas ajouté":"Scenario B — Registered, not added",C:isFR?"Scénario C — Ajouté mais pas connecté":"Scenario C — Added but not connected",D:isFR?"Scénario D — Bug technique":"Scenario D — Technical bug"};
  el('acc-result-title').textContent = titles[active];
 
  const conditions = {
    A: isFR ? ['❌ Comptable non enregistré comme fiduciaire agréée','⬜ Ajouté dans la base : inconnu','⬜ Connecté à la base : inconnu']
             : ['❌ Accountant not registered as approved fiduciary','⬜ Added to database: unknown','⬜ Connected to database: unknown'],
    B: isFR ? ['✅ Comptable enregistré comme fiduciaire agréée','❌ Comptable pas encore ajouté dans la base','⬜ Connecté à la base : inconnu']
             : ['✅ Accountant registered as approved fiduciary','❌ Accountant not yet added to database','⬜ Connected to database: unknown'],
    C: isFR ? ['✅ Comptable enregistré comme fiduciaire agréée','✅ Comptable ajouté dans la base','❌ Comptable pas encore connecté à la base']
             : ['✅ Accountant registered as approved fiduciary','✅ Accountant added to database','❌ Accountant not yet connected to database'],
    D: isFR ? ['✅ Comptable enregistré comme fiduciaire agréée','✅ Comptable ajouté dans la base','✅ Comptable connecté à la base','🐛 Upsell toujours présent — bug technique']
             : ['✅ Accountant registered as approved fiduciary','✅ Accountant added to database','✅ Accountant connected to database','🐛 Upsell still present — technical bug'],
  };
 
  const actions = {
    A: isFR ? ['Vérifier sur <a href="https://www.odoo.com/fr_FR/accounting-firms" target="_blank" class="acc-link">accounting-firms</a> si le cabinet apparaît','Demander au comptable de s\'inscrire sur la plateforme','Ne PAS signer le devis d\'upsell']
             : ['Check on <a href="https://www.odoo.com/fr_FR/accounting-firms" target="_blank" class="acc-link">accounting-firms</a> if the firm appears','Ask accountant to register on the platform','Do NOT sign the upsell quote'],
    B: isFR ? ['Confirmer la bonne nouvelle : le comptable est enregistré','Demander d\'ajouter le comptable dans Configuration > Utilisateurs','Prévenir qu\'un upsell va se créer automatiquement — ne pas le signer','Le comptable devra ensuite se connecter avec son compte Odoo fiduciaire']
             : ['Confirm good news: accountant is registered','Ask to add accountant in Configuration > Users','Warn that an upsell will be created automatically — do not sign it','Accountant must then connect with their fiduciary Odoo account'],
    C: isFR ? ['Confirmer que les deux premières étapes sont OK','Il manque juste la connexion du comptable','Le comptable doit se connecter avec le compte Odoo lié à la fiduciaire','Ne PAS signer le devis']
             : ['Confirm first two steps are OK','Only the accountant connection is missing','Accountant must connect with the Odoo account linked to fiduciary','Do NOT sign the quote'],
    D: isFR ? ['Rassurer : ce n\'est pas la faute du client','Vérifier si le compte utilisateur est rattaché à la bonne société fiduciaire','Vérifier que le comptable utilise le bon compte email (celui de l\'inscription)','Créer un ticket support (template ci-dessous)','Ne PAS signer le devis']
             : ['Reassure: it is not the client\'s fault','Check if user account is linked to correct fiduciary company','Verify accountant uses correct email account (registration one)','Create a support ticket (template below)','Do NOT sign the quote'],
  };
 
  let html = `<div class="iot-section-title">${isFR?'STATUT DES 3 CONDITIONS':'STATUS OF 3 CONDITIONS'}</div>`;
  conditions[active].forEach(cond=>{
    const cl = cond.startsWith('✅')?'ok':cond.startsWith('❌')?'ko':'warn';
    html += `<div class="elig-row ${cl}" style="margin-bottom:6px;"><span class="elig-text">${cond}</span></div>`;
  });
 
  html += `<div class="iot-section-title" style="margin-top:16px;">${isFR?'ACTIONS À MENER':'ACTIONS TO TAKE'}</div>`;
  actions[active].forEach((a,i)=>{ html+=`<div class="elig-row ok" style="margin-bottom:6px;"><span class="elig-status" style="font-size:12px;font-weight:700;min-width:20px;">${i+1}.</span><span class="elig-text">${a}</span></div>`; });
 
  // Contract addendum
  if(contract){
    html += `<div class="iot-section-title" style="margin-top:16px;">${isFR?'CLAUSE CONTRAT':'CONTRACT CLAUSE'}</div>`;
    const isAnnual = contract==='annual';
    const isDebited = contract==='monthly-debited';
    if(isAnnual){
      html += `<div class="elig-row warn" style="margin-bottom:6px;"><span class="elig-text">${isFR?'Contrat <strong>annuel</strong> : ne pas signer le devis d\'upsell. Il se retirera automatiquement une fois la situation réglée.':'<strong>Annual</strong> contract: do not sign the upsell quote. It will be removed automatically once the situation is resolved.'}</span></div>`;
    } else if(isDebited){
      html += `<div class="elig-row ko" style="margin-bottom:6px;"><span class="elig-text">${isFR?'Contrat <strong>mensuel déjà débité</strong> : rassurer le client et annoncer un <strong>remboursement</strong> du montant prélevé.':'<strong>Monthly already debited</strong>: reassure client and announce a <strong>refund</strong> of the charged amount.'}</span></div>`;
    } else {
      html += `<div class="elig-row ok" style="margin-bottom:6px;"><span class="elig-text">${isFR?'Contrat <strong>mensuel non encore débité</strong> : rassurer le client, confirmer qu\'il ne sera <strong>pas débité</strong>.':'<strong>Monthly not yet debited</strong>: reassure client, confirm they will <strong>not be charged</strong>.'}</span></div>`;
    }
  }
 
  html += `<div class="iot-section-title" style="margin-top:16px;">${isFR?'LIENS UTILES':'USEFUL LINKS'}</div>`;
  html += `<a class="iot-link-btn" href="https://www.odoo.com/fr_FR/accounting-firms" target="_blank" rel="noopener"><span class="iot-link-icon">🔗</span><span class="iot-link-label">${isFR?'Inscription fiduciaire':'Fiduciary registration'}</span><span class="iot-link-arrow">↗</span></a>`;
  html += `<a class="iot-link-btn" href="https://www.odoo.com/fr_FR/accounting-firms/country/belgique-20" target="_blank" rel="noopener"><span class="iot-link-icon">🇧🇪</span><span class="iot-link-label">${isFR?'Fiduciaires Belgique':'Belgium fiduciaries'}</span><span class="iot-link-arrow">↗</span></a>`;
  if(active==='D') html += `<a class="iot-link-btn" href="https://www.odoo.com/help-form" target="_blank" rel="noopener"><span class="iot-link-icon">🆘</span><span class="iot-link-label">${isFR?'Créer un ticket support':'Create a support ticket'}</span><span class="iot-link-arrow">↗</span></a>`;
 
  c.innerHTML = html;
  accUpdateEmail(active, contract);
}
 
function accUpdateEmail(active, contract){
  const isFR = lang==='fr';
  const emailEl  = el('acc-email-text');
  const phEl     = el('acc-email-placeholder');
  const ticketEl = el('acc-ticket-section');
 
  if(!active || !contract){ emailEl.style.display='none'; phEl.style.display='block'; if(ticketEl) ticketEl.style.display='none'; return; }
 
  emailEl.style.display='block'; phEl.style.display='none';
  const copyBtn = el('acc-copy-email-btn');
  if(copyBtn) copyBtn.style.display='inline-flex';
 
  const isAnnual   = contract==='annual';
  const isDebited  = contract==='monthly-debited';
  const isMonthly  = !isAnnual;
 
  // Contract tail
  let tail = '';
  if(isAnnual){
    tail = isFR
      ? 'En attendant, je vous recommande de ne pas valider le devis d\'upsell que vous avez reçu. Dès que la situation sera régularisée, il se retirera de lui-même.'
      : 'In the meantime, I recommend not validating the upsell quote you received. Once the situation is resolved, it will be removed automatically.';
  } else if(isDebited){
    tail = isFR
      ? 'Je constate que le montant a déjà été prélevé sur votre prochaine facture. Nous allons bien entendu procéder au remboursement de ce montant, vous n\'avez aucune démarche à effectuer de votre côté.'
      : 'I can see that the amount has already been charged to your next invoice. We will of course proceed with the refund of this amount — there is nothing you need to do on your end.';
  } else {
    tail = isFR
      ? 'Le montant n\'a pas encore été prélevé et ne le sera pas. La situation se régularisera automatiquement une fois les étapes complétées.'
      : 'The amount has not yet been charged and will not be. The situation will be resolved automatically once the steps are completed.';
  }
 
  const emails = {
    A: isFR
? `Bonjour,
 
Je reviens vers vous concernant l'accès de votre comptable à votre base de données Odoo.
 
Je viens de me renseigner sur la situation, et il semblerait que votre comptable ne soit pas encore enregistré comme fiduciaire agréée sur notre plateforme. Cette inscription est nécessaire pour que l'accès comptable soit gratuit sur Odoo Online.
 
Pourriez-vous vérifier auprès de votre comptable s'il a déjà entamé le processus d'inscription sur notre plateforme dédiée aux fiduciaires (https://www.odoo.com/fr_FR/accounting-firms), ou s'il s'agit d'une étape qu'il n'a pas encore eu l'occasion de finaliser ?
 
${tail}
 
Bonne journée,`
: `Hello,
 
I am following up regarding your accountant's access to your Odoo database.
 
I have looked into the situation and it appears that your accountant is not yet registered as an approved fiduciary on our platform. This registration is required for accountant access to be free on Odoo Online.
 
Could you check with your accountant whether they have already started the registration process on our dedicated fiduciary platform (https://www.odoo.com/fr_FR/accounting-firms), or whether this is a step they have not yet had the opportunity to complete?
 
${tail}
 
Have a great day,`,
 
    B: isFR
? `Bonjour,
 
Bonne nouvelle, je viens de vérifier et votre comptable est bien enregistré comme fiduciaire agréée sur notre plateforme. L'accès comptable est donc bien gratuit sur votre abonnement Odoo.
 
Pour que tout se passe correctement, il reste deux étapes à compléter. Tout d'abord, il faudrait ajouter votre comptable comme utilisateur dans votre base de données. Pour cela, rendez-vous dans Configuration, puis Utilisateurs, et créez un nouvel utilisateur avec l'adresse email de votre comptable.
 
Je vous préviens d'avance : lorsque vous l'ajouterez, une mise à jour de facturation se créera automatiquement. Ne vous en inquiétez pas, c'est tout à fait normal et cela se corrigera d'elle-même une fois la dernière étape complétée.
 
Cette dernière étape consiste pour votre comptable à se connecter à votre base de données en utilisant son compte Odoo (celui qui est lié à son inscription fiduciaire). Dès qu'il se sera connecté, le système reconnaîtra automatiquement son statut.
 
${tail}
 
Bonne journée,`
: `Hello,
 
Great news — I have just checked and your accountant is registered as an approved fiduciary on our platform. Accountant access is therefore free on your Odoo subscription.
 
For everything to go smoothly, there are two remaining steps. First, you will need to add your accountant as a user in your database. To do this, go to Configuration, then Users, and create a new user with your accountant's email address.
 
I want to let you know in advance: when you add them, a billing update will be generated automatically. Please do not worry, this is completely normal and will correct itself once the final step is completed.
 
This final step is for your accountant to connect to your database using their Odoo account (the one linked to their fiduciary registration). Once they have connected, the system will automatically recognize their status.
 
${tail}
 
Have a great day,`,
 
    C: isFR
? `Bonjour,
 
Je reviens vers vous au sujet de l'accès de votre comptable. Après vérification, votre comptable est bien enregistré comme fiduciaire agréée et a bien été ajouté comme utilisateur dans votre base de données.
 
Il reste une dernière étape : votre comptable doit se connecter à votre base de données en utilisant son compte Odoo, celui qu'il a utilisé lors de son inscription comme fiduciaire. Une fois cette connexion effectuée, le système reconnaîtra automatiquement son statut.
 
${tail}
 
Bonne journée,`
: `Hello,
 
I am following up regarding your accountant's access. After verification, your accountant is registered as an approved fiduciary and has been added as a user in your database.
 
There is one final step remaining: your accountant needs to connect to your database using their Odoo account — the one they used when registering as a fiduciary. Once this connection is made, the system will automatically recognize their status.
 
${tail}
 
Have a great day,`,
 
    D: isFR
? `Bonjour,
 
Après vérification approfondie, votre comptable est bien enregistré comme fiduciaire agréée, il a été ajouté à votre base de données et il s'est bien connecté. Malgré cela, une mise à jour de facturation est toujours présente, ce qui indique un problème technique de notre côté.
 
Je vais me charger de signaler cette situation à notre équipe technique pour qu'elle puisse corriger cela dans les meilleurs délais. En attendant, il n'y a rien à valider de votre côté.
 
Je reviens vers vous dès que la situation sera régularisée.
 
Bonne journée,`
: `Hello,
 
After thorough verification, your accountant is registered as an approved fiduciary, has been added to your database, and has successfully connected. Despite this, a billing update is still present, which indicates a technical issue on our end.
 
I will take care of reporting this situation to our technical team so they can resolve it as soon as possible. In the meantime, there is nothing to validate on your side.
 
I will follow up with you as soon as the situation is resolved.
 
Have a great day,`,
  };
 
  emailEl.textContent = emails[active] || '';
  emailEl.dataset.fulltext = emails[active] || '';
 
  // Ticket for D
  if(ticketEl){
    if(active==='D'){
      ticketEl.style.display='block';
      const ticket = isFR
? `Bonjour,
 
Le client a ajouté son comptable agréé Odoo, cependant ils continuent à générer un upsell, pourriez-vous y jeter un œil ?
 
Voici l'email du comptable :
----`
: `Hello,
 
The client has added their Odoo approved accountant, however they continue to generate an upsell — could you please take a look?
 
Here is the accountant's email:
----`;
      el('acc-ticket-text').textContent = ticket;
      el('acc-ticket-text').dataset.fulltext = ticket;
      const subject = encodeURIComponent(isFR ? 'Accès comptable — upsell persistant malgré fiduciaire agréée' : 'Accountant access — upsell persisting despite approved fiduciary');
      const link = el('acc-ticket-link');
      if(link){ link.href = 'https://www.odoo.com/odoo/project/49/tasks/new'; link.textContent = t('accCreateTicket'); }
    } else {
      ticketEl.style.display='none';
    }
  }
}
 
function toggleAccEmail(){
  const block = el('acc-email-block');
  const icon  = el('acc-email-toggle-icon');
  const lbl   = el('acc-email-toggle-label');
  const open  = block.style.display==='none';
  block.style.display = open ? 'block' : 'none';
  icon.style.transform = open ? 'rotate(180deg)' : '';
  if(lbl) lbl.textContent = open ? t('accEmailToggleClose') : t('accEmailToggle');
}
 
function copyAccEmail(btn){
  const emailEl = el('acc-email-text');
  const text = emailEl.dataset.fulltext || emailEl.textContent;
  const lbl = el('acc-copy-email-label');
  const ta = document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); if(lbl) lbl.textContent=t('accCopied'); setTimeout(()=>{ if(lbl) lbl.textContent=t('accCopyEmail'); },2000); }
  catch(e){ window.prompt('Copy:',text); }
  document.body.removeChild(ta);
}
 
function copyAccTicket(btn){
  const ticketEl = el('acc-ticket-text');
  const text = ticketEl.dataset.fulltext || ticketEl.textContent;
  const lbl = el('acc-copy-ticket-label');
  const ta = document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); if(lbl) lbl.textContent=t('accCopied'); setTimeout(()=>{ if(lbl) lbl.textContent=t('accCopyTicket'); },2000); }
  catch(e){ window.prompt('Copy:',text); }
  document.body.removeChild(ta);
}
 
function accReset(){
  accState={scenario:null,added:null,connected:null,contract:null};
  document.querySelectorAll('[data-acc-scenario],[data-acc-added],[data-acc-connected],[data-acc-contract]').forEach(b=>b.classList.remove('active'));
  ['acc-sub-added','acc-sub-connected','acc-contract-section'].forEach(id=>{el(id).style.display='none';});
  el('acc-placeholder').style.display='block';
  el('acc-result-content').style.display='none';
  el('acc-result-card').classList.remove('has-result');
  el('acc-email-text').style.display='none';
  el('acc-email-placeholder').style.display='block';
  if(el('acc-ticket-section')) el('acc-ticket-section').style.display='none';
}
 
 
 
 
