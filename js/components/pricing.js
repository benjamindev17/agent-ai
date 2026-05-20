let pricingState={topic:null, pricelist:'high', billing:'monthly'};

function pricingSelect(topic){
  pricingState.topic = topic;
  document.querySelectorAll('[data-pricing]').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-pricing="${topic}"]`).classList.add('active');
  renderPricingResult();
}
 
function pricingSetPricelist(pl){
  pricingState.pricelist = pl;
  document.querySelectorAll('.pl-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll(`.pl-btn[data-pl="${pl}"]`).forEach(b=>b.classList.add('active'));
  renderPricingResult();
}
 
function pricingClearResult(){
  el('pricing-result-card').classList.remove('has-result');
  el('pricing-result-icon').textContent='ℹ️';
  el('pricing-result-title').textContent=lang==='fr'?'Détails':'Details';
  el('pricing-placeholder').style.display='block';
  el('pricing-result-content').style.display='none';
}
 
function renderPricingResult(){
  const topic = pricingState.topic;
  if(!topic) return pricingClearResult();
  el('pricing-result-card').classList.add('has-result');
  el('pricing-result-icon').textContent='✅';
  const c = el('pricing-result-content');
  c.style.display='block'; el('pricing-placeholder').style.display='none';
 
  let html = '';
  const pl = pricingState.pricelist;
  const d = PRICING_DATA[pl];
  const isFR = lang==='fr';
 
  if(topic === 'tarifs'){
    el('pricing-result-title').textContent = isFR?'Tarifs & Licences':'Pricing & Licences';
    // Pricelist toggle
    html += `<div class="pricing-toggle">
      <button class="pricing-toggle-btn pl-btn${pl==='high'?' active':''}" data-pl="high" onclick="pricingSetPricelist('high')">🌍 Europe High</button>
      <button class="pricing-toggle-btn pl-btn${pl==='low'?' active':''}" data-pl="low" onclick="pricingSetPricelist('low')">🌍 Europe Low</button>
    </div>`;
    // Table
    html += `<table class="pricing-table">
      <thead><tr>
        <th>${isFR?'Plan':'Plan'}</th>
        <th>📅 ${isFR?'Mensuel':'Monthly'} <span class="pricing-tag-fyd">FYD</span></th>
        <th>📆 ${isFR?'Annuel':'Annual'} <span class="pricing-tag-fyd">FYD</span></th>
        <th>📅 ${isFR?'Mensuel':'Monthly'} <span class="pricing-tag-normal">${isFR?'Normal':'Normal'}</span></th>
        <th>📆 ${isFR?'Annuel':'Annual'} <span class="pricing-tag-normal">${isFR?'Normal':'Normal'}</span></th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="plan-name">Standard</td>
          <td class="price-highlight">€${d.monthly_fyd.standard.toFixed(2)}</td>
          <td class="price-highlight">€${d.annual_fyd.standard.toFixed(2)}</td>
          <td class="price-normal">€${d.monthly_norm.standard.toFixed(2)}</td>
          <td class="price-normal">€${d.annual_norm.standard.toFixed(2)}</td>
        </tr>
        <tr>
          <td class="plan-name">Custom</td>
          <td class="price-highlight">€${d.monthly_fyd.custom.toFixed(2)}</td>
          <td class="price-highlight">€${d.annual_fyd.custom.toFixed(2)}</td>
          <td class="price-normal">€${d.monthly_norm.custom.toFixed(2)}</td>
          <td class="price-normal">€${d.annual_norm.custom.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>`;
    // Formula
    html += `<div class="pricing-formula">
      <div class="pricing-formula-title">💡 ${isFR?'Formule de calcul':'Calculation formula'}</div>
      <div class="pricing-formula-row">${isFR?'Mensuel HTVA':'Monthly excl. VAT'} = <code>prix × nb users</code></div>
      <div class="pricing-formula-row">${isFR?'Annuel HTVA':'Annual excl. VAT'} = <code>prix × nb users × 12</code></div>
      <div class="pricing-formula-row">${isFR?'Total TTC':'Total incl. VAT'} = <code>HTVA × (1 + taux TVA)</code></div>
    </div>`;
    // Warnings
 
    html += `<a class="iot-link-btn" href="https://www.odoo.com/pricing" target="_blank" rel="noopener"><span class="iot-link-icon">🔗</span><span class="iot-link-label">Odoo Pricing</span><span class="iot-link-arrow">↗</span></a>`;
 
  } else if(topic === 'plans'){
    el('pricing-result-title').textContent = isFR?'Plans Standard & Custom':'Standard & Custom Plans';
    html += `<div class="iot-section-title">${isFR?'DIFFÉRENCES CLÉS':'KEY DIFFERENCES'}</div>`;
    html += `<div class="user-type-grid">
      <div class="user-type-card"><div class="user-type-icon">📋</div><div>
        <div class="user-type-name">Standard</div>
        <div class="user-type-desc">${isFR?'Accès aux apps standard Odoo. Pas de Studio, pas d\'API, pas de code custom. Hébergement Online uniquement.':'Access to standard Odoo apps. No Studio, no API, no custom code. Online hosting only.'}</div>
      </div></div>
      <div class="user-type-card"><div class="user-type-icon">⚙️</div><div>
        <div class="user-type-name">Custom</div>
        <div class="user-type-desc">${isFR?'Studio, API, code personnalisé, multi-société. Obligatoire pour Odoo.sh et l\u2019auto-hébergement.':'Studio, API, custom code, multi-company. Mandatory for Odoo.sh and On-Premise.'}</div>
      </div></div>
    </div>`;
    html += `<div class="iot-section-title" style="margin-top:18px;">${isFR?'CE QUI NÉCESSITE CUSTOM':'WHAT REQUIRES CUSTOM'}</div>`;
    const requires = isFR
      ? ['Studio installé','Base Automation installée','Code custom (lignes de code)','Multi-société activée','Accès API','Odoo.sh ou auto-hébergement']
      : ['Studio installed','Base Automation installed','Custom code (lines of code)','Multi-company activated','API access','Odoo.sh or On-Premise'];
    requires.forEach(r=>{ html+=`<div class="elig-row warn" style="margin-bottom:6px;"><span class="elig-status">⚠️</span><span class="elig-text">${r}</span></div>`; });
    html += `<div class="pricing-warn"><span style="font-size:18px;flex-shrink:0;">📅</span><div>${isFR?'<strong>Mensuel :</strong> changements à la prochaine facture, pas de prorata.<br><strong>Annuel :</strong> ajout = prorata immédiat, suppression = au prochain renouvellement.':'<strong>Monthly:</strong> changes at next invoice, no prorata.<br><strong>Annual:</strong> add = immediate prorata, removal = at next renewal.'}</div></div>`;
    html += `<a class="iot-link-btn" href="https://www.odoo.com/pricing" target="_blank" rel="noopener"><span class="iot-link-icon">🔗</span><span class="iot-link-label">Odoo Pricing</span><span class="iot-link-arrow">↗</span></a>`;
 
  } else if(topic === 'users'){
    el('pricing-result-title').textContent = isFR?'Types d\'utilisateurs':'User Types';
    html += `<div class="user-type-grid">
      <div class="user-type-card"><div class="user-type-icon">👤</div><div>
        <div class="user-type-name">${isFR?'Utilisateur Payant':'Paid User'}</div>
        <span class="user-type-tag tag-paid">${isFR?'FACTURÉ':'BILLED'}</span>
        <div class="user-type-desc" style="margin-top:6px;">${isFR?'Accès complet au backend Odoo. Compte dans la facturation.':'Full access to Odoo backend. Counted in billing.'}</div>
      </div></div>
      <div class="user-type-card"><div class="user-type-icon">🌐</div><div>
        <div class="user-type-name">${isFR?'Utilisateur Portail':'Portal User'}</div>
        <span class="user-type-tag tag-free">GRATUIT / FREE</span>
        <div class="user-type-desc" style="margin-top:6px;">${isFR?'Accès externe limité (ex: voir ses factures, commandes). Ne compte PAS dans la facturation.':'Limited external access (e.g. view invoices, orders). NOT counted in billing.'}</div>
      </div></div>
      <div class="user-type-card"><div class="user-type-icon">🛒</div><div>
        <div class="user-type-name">POS Employee</div>
        <span class="user-type-tag tag-free">GRATUIT / FREE</span>
        <div class="user-type-desc" style="margin-top:6px;">${isFR?'Accès Point de Vente uniquement via "Login with Employees". Ne compte PAS dans la facturation.':'Point of Sale access only via "Login with Employees". NOT counted in billing.'}</div>
      </div></div>
    </div>`;
    html += `<div class="iot-section-title" style="margin-top:18px;">${isFR?'PROCÉDURE':'PROCEDURE'}</div>`;
    html += `<a class="iot-link-btn" href="https://app.tango.us/app/workflow/How-to-remove-a-user-62c57d736bbf40bfa902782589a1969a" target="_blank" rel="noopener"><span class="iot-link-icon">📋</span><span class="iot-link-label">${isFR?'Archiver un utilisateur (Tango)':'Archive a user (Tango)'}</span><span class="iot-link-arrow">↗</span></a>`;
 
  } else if(topic === 'free'){
    el('pricing-result-title').textContent = isFR?'Version gratuite (One App Free)':'Free Version (One App Free)';

    html += `<div class="iot-section-title" style="margin-bottom:16px;">${isFR?'CONSÉQUENCES':'CONSEQUENCES'}</div>`;
    const cons = isFR
      ? ['Le support technique prend fin','Se connecter tous les 2-3 mois pour maintenir la base active','L\'abonnement payant se ferme automatiquement']
      : ['Technical support ends','Must log in every 2-3 months to keep the database active','Paid subscription closes automatically'];
    cons.forEach(c=>{ html+=`<div class="elig-row warn" style="margin-bottom:6px;"><span class="elig-status">ℹ️</span><span class="elig-text">${c}</span></div>`; });
    html += `<div class="iot-section-title" style="margin-top:18px;margin-bottom:16px;">${isFR?'PROCÉDURE':'PROCEDURE'}</div>`;
    const steps = isFR
      ? ['Se connecter en tant qu\'administrateur','Cliquer sur l\'icône utilisateur → My subscription','Cliquer sur "Change"','Désinstaller les applications non incluses dans la combinaison choisie']
      : ['Log in as administrator','Click user icon → My subscription','Click "Change"','Uninstall applications not included in the chosen combination'];
    steps.forEach((s,i)=>{ html+=`<div class="elig-row ok" style="margin-bottom:6px;"><span class="elig-status" style="font-size:14px;font-weight:700;min-width:24px;">${i+1}.</span><span class="elig-text">${s}</span></div>`; });
    html += `<div style="margin-top:20px;padding:14px 18px;background:rgba(0,200,150,0.08);border:1.5px solid rgba(0,200,150,0.3);border-radius:10px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;">🔗</span>
      <a href="https://www.odoo.com/trial" target="_blank" rel="noopener" style="color:#00E8B0;font-size:13.5px;font-weight:600;text-decoration:none;border-bottom:1.5px solid rgba(0,232,176,0.4);">${isFR?'Tester les combinaisons valides':'Test valid combinations'} ↗</a>
    </div>`;
  }
 
  c.innerHTML = html;
}
 
function pricingReset(){
  pricingState = {topic:null, pricelist:'high', billing:'monthly'};
  document.querySelectorAll('[data-pricing]').forEach(b=>b.classList.remove('active'));
  pricingClearResult();
}
 
