let recoveryState = {type:null, plan:null, pricelist:'high', users:1, recoverable:null, subRef:'', subPrice:''};
 

function recoverySelect(type){
  recoveryState.type = type;
  recoveryState.subRef = ''; recoveryState.subPrice = '';
  if(el('rec-sub-ref')) el('rec-sub-ref').value='';
  if(el('rec-sub-price')) el('rec-sub-price').value='';
  if(el('rec-manual-fields')) el('rec-manual-fields').style.display='none';
  document.querySelectorAll('[data-recovery]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-recovery="${type}"]`).classList.add('active');
  el('recovery-fields').style.display = 'block';
  calcRecovery();
}
 
function recoverySetPlan(plan){
  recoveryState.plan = plan;
  document.querySelectorAll('[data-rec-plan]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-rec-plan="${plan}"]`).classList.add('active');
  calcRecovery();
}
 
function recoverySetRecoverable(val){
  recoveryState.recoverable = val;
  document.querySelectorAll('[data-rec-recoverable]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-rec-recoverable="${val}"]`).classList.add('active');
  if(el('rec-manual-fields')) el('rec-manual-fields').style.display=(recoveryState.type==='monthly'&&val==='yes')?'block':'none';
  calcRecovery();
}

function recoverySetPl(pl){
  recoveryState.pricelist = pl;
  document.querySelectorAll('[data-rec-pl]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-rec-pl="${pl}"]`).classList.add('active');
  calcRecovery();
}

function recoverySetSubRef(v){recoveryState.subRef=v.trim();calcRecovery();}
function recoverySetSubPrice(v){recoveryState.subPrice=v.replace(/,/g,'.').replace(/€/g,'').trim();calcRecovery();}
 
function calcRecovery(){
  const {type} = recoveryState;
  const day   = parseInt(el('rec-day').value);
  const month = el('rec-month').value;
  const year  = parseInt(el('rec-year').value);
  const isFR  = lang === 'fr';
 
  if(!type || !day || month==='' || !year) return recoveryClearResult();
 
  const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const formatDate = d => `${d.getDate()} ${isFR ? MONTHS_FR[d.getMonth()] : MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
 
  const renewal = new Date(year, parseInt(month), day);
  const today   = new Date(); today.setHours(0,0,0,0);
 
  if(today <= renewal) return recoveryClearResult();
 
  const diffDays = Math.floor((today - renewal) / (1000*60*60*24));
  const over3months = diffDays > 92;
  const diffMonths = Math.round(diffDays / 30);
 
  // Build periods
  let periods = [];
  if(type === 'monthly'){
    let start = new Date(year, parseInt(month), day + 1);
    while(start <= today){
      const end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate() - 1);
      periods.push(`• ${isFR?'du':'from'} ${formatDate(start)} ${isFR?'au':'to'} ${formatDate(end)}`);
      start = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
    }
  } else {
    const start = new Date(year, parseInt(month), day + 1);
    const end   = new Date(year + 1, parseInt(month), day);
    periods.push(`• ${isFR?'du':'from'} ${formatDate(start)} ${isFR?'au':'to'} ${formatDate(end)}`);
  }
 
  // Show/hide placeholder
  el('recovery-placeholder').style.display = 'none';
  const c = el('recovery-result-content');
  c.style.display = 'block';
 
  let html = '';
 
  if(over3months){
    html += `<div class="recovery-warn"><span style="font-size:18px;flex-shrink:0;">⚠️</span><div><strong>${isFR?'Rétention dépassée (> 3 mois)':'Retention exceeded (> 3 months)'}</strong><br>${isFR?'Contacter le support avant de procéder à la réouverture.':'Contact support before proceeding with recovery.'}</div></div>`;
    html += `<a class="iot-link-btn" href="https://www.odoo.com/help" target="_blank" rel="noopener" style="margin-bottom:14px;"><span class="iot-link-icon">🆘</span><span class="iot-link-label">${isFR?'Contacter le support Odoo':'Contact Odoo support'}</span><span class="iot-link-arrow">↗</span></a>`;
  }
 
  const copyText = periods.join('\n');
  html += `<div class="recovery-periods-block">${periods.map(p=>`<div class="recovery-bullet-line">${p}</div>`).join('')}</div>`;
  html += `<button class="tax-copy-btn" style="margin-top:12px;" onclick="copyRecovery(this, \`${copyText.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`)">
    <span class="copy-text">📋 ${isFR?'Copier les périodes':'Copy periods'}</span>
    <span class="copy-icon" style="opacity:0.6;font-size:14px;">↗</span>
  </button>`;

  // Generate payment link for manual mode
  let paymentLink = '';
  if(type==='monthly' && recoveryState.recoverable==='yes' && recoveryState.subRef && recoveryState.subPrice){
    const price = parseFloat(recoveryState.subPrice);
    if(!isNaN(price) && price > 0){
      const total = (periods.length * price).toFixed(2);
      paymentLink = 'https://www.odoo.com/fr_FR/payment/pay?reference='+recoveryState.subRef+'&amount='+total+'&currency_id=1';
      const totalLabel = isFR ? `Total : ${periods.length} × ${recoveryState.subPrice.replace('.',',')}€ = ${total.replace('.',',')}€` : `Total: ${periods.length} × €${recoveryState.subPrice} = €${total}`;
      html += `<div style="margin-top:14px;padding:12px 14px;background:rgba(255,180,0,0.12);border:1.5px solid rgba(255,180,0,0.35);border-radius:8px;font-size:13px;font-weight:600;color:#FFD166;">${totalLabel}</div>`;
      html += `<a class="iot-link-btn" href="${paymentLink}" target="_blank" rel="noopener" style="margin-top:10px;margin-bottom:4px;"><span class="iot-link-icon">💳</span><span class="iot-link-label">${isFR?'Lien de paiement':'Payment link'}</span><span class="iot-link-arrow">↗</span></a>`;
      const safeLink = paymentLink.replace(/`/g,'\\`').replace(/\$/g,'\\$');
      html += `<button class="tax-copy-btn" style="margin-top:8px;" onclick="copyRecovery(this, \`${safeLink}\`)"><span class="copy-text">📋 ${isFR?'Copier le lien':'Copy link'}</span><span class="copy-icon" style="opacity:0.6;font-size:14px;">↗</span></button>`;
    }
  }

  c.innerHTML = html;

  // Update email template
  updateEmailTemplate(renewal, diffMonths, periods, isFR, recoveryState.recoverable, paymentLink);
}
 
function updateEmailTemplate(renewal, diffMonths, periods, isFR, recoverable, paymentLink){
  const tpl = el('email-template-text');
  const ph  = el('email-template-placeholder');

  if(!recoverable){
    if(tpl){ tpl.textContent=''; tpl.style.display='none'; }
    if(ph){ ph.style.display='block'; ph.textContent = isFR ? 'Indiquez si la base est récupérable pour générer le template.' : 'Indicate if the database is recoverable to generate the template.'; }
    return;
  }

  const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const renewalStr = `${renewal.getDate()} ${isFR ? MONTHS_FR[renewal.getMonth()] : MONTHS_EN[renewal.getMonth()]} ${renewal.getFullYear()}`;
  const periodsText = periods.map(p => p.replace(/^• (du|from) /, '• ')).join('\n');

  let template;
  if(recoverable === 'yes'){
    template = isFR
? `Bonjour,

Je reviens vers vous concernant votre base de données Odoo.

Votre abonnement a expiré le ${renewalStr}, ce qui signifie que votre base est inactive depuis environ ${diffMonths} mois. Après vérification, bonne nouvelle : votre base de données est toujours récupérable.

Pour procéder à la réactivation, l'ensemble des périodes écoulées depuis l'expiration devront être régularisées. Odoo ayant assuré la préservation de vos données, la sécurité de votre environnement et la maintenance de l'infrastructure serveur pendant toute la durée d'inactivité, voici les ${periods.length} période${periods.length > 1 ? 's' : ''} concernée${periods.length > 1 ? 's' : ''} :

${periodsText}

Vous pouvez régler directement via ce lien et me revenir une fois le paiement complété afin que je puisse procéder à la réactivation : ${paymentLink||'www.odoo.com/my/subscriptions'}

Bonne journée,`
: `Hello,

I am following up regarding your Odoo database.

Your subscription expired on ${renewalStr}, meaning your database has been inactive for approximately ${diffMonths} month${diffMonths > 1 ? 's' : ''}. After verification, good news: your database is still recoverable.

To proceed with reactivation, all elapsed periods since expiration will need to be regularized. As Odoo has ensured the preservation of your data, the security of your environment and the maintenance of the server infrastructure throughout the entire inactive period, here are the ${periods.length} period${periods.length > 1 ? 's' : ''} concerned:

${periodsText}

You can settle directly via this link and get back to me once the payment is complete so I can proceed with reactivation: ${paymentLink||'www.odoo.com/my/subscriptions'}

Have a great day,`;
  } else {
    template = isFR
? `Bonjour,

Je reviens vers vous concernant votre base de données Odoo.

Votre abonnement a expiré le ${renewalStr}, ce qui signifie que votre base est actuellement inactive depuis environ ${diffMonths} mois. De manière générale, Odoo conserve les bases de données pendant une période de 3 mois après l'expiration du contrat. Au-delà de cette période, la récupération n'est malheureusement pas toujours garantie.

Dans votre cas, je vous invite à contacter notre équipe support technique via https://www.odoo.com/help afin qu'elle puisse vérifier si votre base de données est toujours récupérable. Eux seuls ont la visibilité technique nécessaire pour vous confirmer l'état de vos données.

Si le support confirme que la récupération est possible, voici ce qu'il faudra prévoir pour la réactivation. Odoo ayant assuré la préservation de vos données, la sécurité de votre environnement et la maintenance de l'infrastructure serveur pendant toute la durée d'inactivité, l'ensemble des périodes écoulées depuis l'expiration devront être régularisées.
Concrètement, cela représente ${periods.length} période${periods.length > 1 ? 's' : ''} :

${periodsText}

Dès que vous aurez la confirmation du support, revenez vers moi et je vous ferai parvenir le devis pour procéder à la régularisation et à la réactivation de votre base.

Bonne journée,`
: `Hello,

I am following up regarding your Odoo database.

Your subscription expired on ${renewalStr}, meaning your database has been inactive for approximately ${diffMonths} month${diffMonths > 1 ? 's' : ''}. As a general rule, Odoo retains databases for a period of 3 months after contract expiration. Beyond this period, recovery is unfortunately not always guaranteed.

In your case, I invite you to contact our technical support team via https://www.odoo.com/help so they can verify whether your database is still recoverable. They are the only ones with the technical visibility to confirm the status of your data.

If support confirms that recovery is possible, here is what will need to be arranged for reactivation. As Odoo has ensured the preservation of your data, the security of your environment and the maintenance of the server infrastructure throughout the entire inactive period, all elapsed periods since expiration will need to be regularized.
Concretely, this represents ${periods.length} period${periods.length > 1 ? 's' : ''} :

${periodsText}

Once you have confirmation from support, please come back to me and I will send you a quote to proceed with the regularization and reactivation of your database.

Have a great day,`;
  }

  if(tpl){ tpl.textContent = template; tpl.dataset.fulltext = template; tpl.style.display='block'; }
  if(ph)  ph.style.display = 'none';
}
 
function toggleEmailTemplate(){
  const block = el('email-template-block');
  const icon  = el('email-toggle-icon');
  const lbl   = el('rec-email-toggle-label');
  const open  = block.style.display === 'none';
  block.style.display = open ? 'block' : 'none';
  icon.style.transform = open ? 'rotate(180deg)' : '';
  if(lbl) lbl.textContent = open ? t('recEmailToggleClose') : t('recEmailToggle');
}
 
function copyEmailTemplate(btn){
  const tpl = el('email-template-text');
  if(!tpl||!tpl.dataset.fulltext) return;
  const text = tpl.dataset.fulltext;
  const ta = document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{
    document.execCommand('copy');
    btn.textContent = t('accCopied');
    setTimeout(()=>{ btn.textContent = t('recCopyBtn'); }, 2000);
  } catch(e){ window.prompt('Copy:', text); }
  document.body.removeChild(ta);
}
 
function copyRecovery(btn, text){
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try {
    document.execCommand('copy');
    btn.querySelector('.copy-text').textContent = lang==='fr' ? '✅ Copié !' : '✅ Copied!';
    setTimeout(()=>{ btn.querySelector('.copy-text').textContent = `📋 ${lang==='fr'?'Copier les périodes':'Copy periods'}`; }, 2000);
  } catch(e){ window.prompt('Copy:', text); }
  document.body.removeChild(ta);
}
 
function recoveryClearResult(){
  el('recovery-placeholder').style.display='block';
  el('recovery-result-content').style.display='none';
  el('recovery-result-content').innerHTML='';
  const tpl=el('email-template-text');
  const ph=el('email-template-placeholder');
  if(tpl){ tpl.textContent=''; tpl.style.display='none'; }
  if(ph) ph.style.display='block';
}
 
function recoveryReset(){
  recoveryState={type:null, plan:null, pricelist:'high', users:1, recoverable:null, subRef:'', subPrice:''};
  document.querySelectorAll('[data-recovery]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('[data-rec-recoverable]').forEach(b=>b.classList.remove('active'));
  el('rec-day').value=''; el('rec-month').value=''; el('rec-year').value='2025';
  el('recovery-fields').style.display='none';
  recoveryClearResult();
}
