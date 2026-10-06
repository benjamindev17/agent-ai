// ── INDEXATION 7% ──
// Outil dynamique de renouvellement : plafond +7%/an + Pricing Compensation.
var indexState = {cur:'eur', planChange:'no', toMonthly:'no', years:1, prev:'', catalog:'', catalogTouched:false};
var INDEX_CUR_SYMBOL = {eur:'€', usd:'$'};
var INDEX_CUSTOM_UP = 1.20; // hausse grille Custom : +20%

// Prix catalogue par défaut = prix précédent +20%, formaté selon la langue.
function indexDefaultCatalog(prevStr){
  var p = indexNum(prevStr);
  if(p===null) return '';
  var s = indexR2(p * INDEX_CUSTOM_UP).toFixed(2);
  return (lang==='fr') ? s.replace('.', ',') : s;
}

function indexNum(v){ var n = parseFloat(String(v==null?'':v).replace(',', '.').replace(/[^0-9.\-]/g,'')); return isNaN(n)?null:n; }
function indexR2(x){ return Math.round(x*100)/100; }
function indexFmt(x){ return indexR2(x).toFixed(2) + ' ' + (INDEX_CUR_SYMBOL[indexState.cur]||'€'); }

function indexSetCur(c){ indexState.cur=c; document.querySelectorAll('[data-index-cur]').forEach(function(b){b.classList.toggle('active', b.getAttribute('data-index-cur')===c);}); var pl=el('index-prev-label'); var cl=el('index-catalog-label'); var s=INDEX_CUR_SYMBOL[c]||'€'; var isFR=lang==='fr'; if(pl) pl.textContent=(isFR?'Prix du contrat précédent (':'Previous contract price (')+s+')'; if(cl) cl.textContent=(isFR?'Nouveau prix catalogue (':'New catalog price (')+s+')'; indexCompute(); }
function indexSetPlanChange(v){ indexState.planChange=v; document.querySelectorAll('[data-index-plan]').forEach(function(b){b.classList.toggle('active', b.getAttribute('data-index-plan')===v);}); indexCompute(); }
function indexSetMonthly(v){ indexState.toMonthly=v; document.querySelectorAll('[data-index-monthly]').forEach(function(b){b.classList.toggle('active', b.getAttribute('data-index-monthly')===v);}); indexCompute(); }
function indexSetYears(n){ indexState.years=n; document.querySelectorAll('[data-index-years]').forEach(function(b){b.classList.toggle('active', parseInt(b.getAttribute('data-index-years'),10)===n);}); indexCompute(); }
function indexSetPrev(v){
  indexState.prev=v;
  // Tant que l'utilisateur n'a pas modifié le catalogue à la main, on le pré-remplit à +20%.
  if(!indexState.catalogTouched){
    indexState.catalog = indexDefaultCatalog(v);
    var ci = el('index-catalog'); if(ci) ci.value = indexState.catalog;
  }
  indexCompute();
}
function indexSetCatalog(v){ indexState.catalog=v; indexState.catalogTouched=true; indexCompute(); }

function indexCompute(){
  var box = el('index-result'); if(!box) return;
  var isFR = lang==='fr';
  var prev = indexNum(indexState.prev);
  var catalog = indexNum(indexState.catalog);
  var excluded = indexState.planChange==='yes' || indexState.toMonthly==='yes';

  // Placeholder while prices missing
  if(prev===null || catalog===null){
    box.innerHTML = '<div style="padding:30px 20px;text-align:center;color:rgba(255,255,255,0.4);">'
      +'<div style="font-size:32px;margin-bottom:10px;">🔁</div>'
      +'<p style="font-size:13px;line-height:1.55;">'+(isFR
        ?'Saisissez le <strong>prix du contrat précédent</strong> et le <strong>nouveau prix catalogue</strong><br>pour calculer l\'indexation plafonnée à +7%/an.'
        :'Enter the <strong>previous contract price</strong> and the <strong>new catalog price</strong><br>to compute the +7%/year capped indexation.')+'</p>'
      +'</div>';
    return;
  }

  var years = indexState.years;
  var sym = INDEX_CUR_SYMBOL[indexState.cur]||'€';
  var cp = isFR?'Copier':'Copy';
  var h = '';

  // Eligibility verdict banner
  if(excluded){
    var reason = indexState.planChange==='yes'
      ? (isFR?'Passage Standard → Custom/Studio : bascule directe au <strong>tarif catalogue</strong> de la nouvelle grille Custom. Le plafond de 7% ne s\'applique pas.'
             :'Standard → Custom/Studio switch: moves directly to the new Custom <strong>catalog price</strong>. The 7% cap does not apply.')
      : (isFR?'Passage à une facturation <strong>mensuelle</strong> : annule l\'éligibilité à la Pricing Compensation. Tarif catalogue plein.'
             :'Switch to <strong>monthly</strong> billing: cancels Pricing Compensation eligibility. Full catalog price.');
    h += '<div style="background:rgba(255,80,60,0.15);border:1.5px solid rgba(255,80,60,0.5);border-radius:10px;padding:14px 16px;margin-bottom:16px;">'
      +'<div style="font-size:13px;font-weight:700;color:#ff9080;margin-bottom:4px;">⛔ '+(isFR?'Pricing Compensation NON applicable':'Pricing Compensation NOT applicable')+'</div>'
      +'<div style="font-size:12.5px;color:rgba(255,255,255,0.85);line-height:1.55;">'+reason+'</div></div>';
  } else {
    h += '<div style="background:rgba(0,200,150,0.12);border:1.5px solid rgba(0,200,150,0.4);border-radius:10px;padding:14px 16px;margin-bottom:16px;">'
      +'<div style="font-size:13px;font-weight:700;color:#00E8B0;margin-bottom:4px;">✅ '+(isFR?'Pricing Compensation applicable':'Pricing Compensation applicable')+'</div>'
      +'<div style="font-size:12.5px;color:rgba(255,255,255,0.8);line-height:1.55;">'+(isFR
        ?'Augmentation plafonnée à <strong>+7% par an</strong>, calculée sur le tarif du contrat précédent. Encodez la différence sur une ligne <strong>Pricing compensation</strong> (prix unitaire négatif).'
        :'Increase capped at <strong>+7% per year</strong>, based on the previous contract price. Encode the difference on a <strong>Pricing compensation</strong> line (negative unit price).')+'</div></div>';
  }

  // Per-year build
  var rows = [];
  var capPrev = prev;
  for(var y=1; y<=years; y++){
    var cap = indexR2(capPrev * 1.07);           // plafond +7% sur l'année précédente
    capPrev = cap;                                // compounding sur la valeur arrondie (= "Prix Année N-1 × 1,07")
    var charged, comp;
    if(excluded){
      charged = catalog;                          // pas de plafond : tarif catalogue
      comp = 0;
    } else {
      charged = Math.min(cap, catalog);           // le prix ne peut pas dépasser le catalogue
      comp = indexR2(charged - catalog);          // ligne Pricing compensation (≤ 0)
    }
    rows.push({y:y, cap:cap, charged:charged, comp:comp});
  }

  // Results table
  h += '<div style="overflow-x:auto;margin-bottom:6px;">'
    +'<table style="width:100%;border-collapse:collapse;font-size:12.5px;">'
    +'<thead><tr style="color:rgba(255,255,255,0.55);text-align:left;">'
    +'<th style="padding:7px 6px;font-weight:600;">'+(isFR?'Année':'Year')+'</th>'
    +(excluded?'':'<th style="padding:7px 6px;font-weight:600;">'+(isFR?'Plafond +7%':'+7% cap')+'</th>')
    +'<th style="padding:7px 6px;font-weight:600;">'+(isFR?'Catalogue':'Catalog')+'</th>'
    +'<th style="padding:7px 6px;font-weight:600;color:#fff;">'+(isFR?'Prix facturé':'Charged price')+'</th>'
    +'<th style="padding:7px 6px;font-weight:600;">'+(isFR?'Pricing compensation':'Pricing compensation')+'</th>'
    +'</tr></thead><tbody>';

  rows.forEach(function(r){
    var compStr = r.comp.toFixed(2);              // négatif, ex: -58.58
    var reached = (!excluded && r.comp===0);
    var compCell;
    if(excluded){
      compCell = '<span style="color:rgba(255,255,255,0.45);">—</span>';
    } else if(reached){
      compCell = '<span style="color:rgba(255,255,255,0.55);font-size:11.5px;">'+(isFR?'tarif catalogue atteint':'catalog reached')+'</span>';
    } else {
      var btnId = 'idx-cp-'+r.y;
      compCell = '<div style="display:flex;align-items:center;gap:6px;">'
        +'<span style="font-weight:800;color:#FFD166;font-variant-numeric:tabular-nums;white-space:nowrap;">'+compStr+' '+sym+'</span>'
        +'<button id="'+btnId+'" title="'+cp+'" onclick="huntingCopy(\''+compStr+'\',\''+btnId+'\')" style="background:rgba(113,75,103,0.3);border:1.5px solid rgba(143,100,135,0.6);color:rgba(220,180,220,0.95);border-radius:6px;padding:4px 8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;">📋</button>'
        +'</div>';
    }
    h += '<tr style="border-top:1px solid rgba(255,255,255,0.1);">'
      +'<td style="padding:9px 6px;font-weight:700;color:#fff;">'+(isFR?'Année ':'Year ')+r.y+'</td>'
      +(excluded?'':'<td style="padding:9px 6px;color:rgba(255,255,255,0.75);font-variant-numeric:tabular-nums;">'+r.cap.toFixed(2)+' '+sym+'</td>')
      +'<td style="padding:9px 6px;color:rgba(255,255,255,0.75);font-variant-numeric:tabular-nums;">'+indexR2(catalog).toFixed(2)+' '+sym+'</td>'
      +'<td style="padding:9px 6px;font-weight:700;color:#00E8B0;font-variant-numeric:tabular-nums;">'+r.charged.toFixed(2)+' '+sym+'</td>'
      +'<td style="padding:9px 6px;">'+compCell+'</td>'
      +'</tr>';
  });
  h += '</tbody></table></div>';

  // Formula reminder (year 1, user numbers)
  if(!excluded){
    var cap1 = rows[0].cap, comp1 = rows[0].comp;
    h += '<div style="margin-top:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 16px;">'
      +'<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.4);margin-bottom:8px;">💡 '+(isFR?'Détail Année 1':'Year 1 detail')+'</div>'
      +'<div style="font-size:12.5px;color:rgba(255,255,255,0.8);line-height:1.8;font-variant-numeric:tabular-nums;">'
      +'1. '+(isFR?'Prix plafond':'Cap price')+' = '+prev.toFixed(2)+' × 1,07 = <strong style="color:#fff;">'+cap1.toFixed(2)+' '+sym+'</strong><br>'
      +'2. '+(isFR?'Pricing compensation':'Pricing compensation')+' = '+cap1.toFixed(2)+' − '+indexR2(catalog).toFixed(2)+' = <strong style="color:#FFD166;">'+comp1.toFixed(2)+' '+sym+'</strong>'
      +'</div></div>';
  }

  // Quote setup steps
  h += '<div style="margin-top:14px;background:rgba(113,75,103,0.12);border:1px solid rgba(143,100,135,0.35);border-radius:10px;padding:14px 16px;">'
    +'<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(220,180,220,0.9);margin-bottom:8px;">🧾 '+(isFR?'Encodage du devis':'Quote setup')+'</div>'
    +'<div style="font-size:12.5px;color:rgba(255,255,255,0.8);line-height:1.7;">'
    +'① '+(isFR?'Sélectionner la Pricelist de la région du client (ex. ALL: EUR High / Middle…).':'Select the client region Pricelist (e.g. ALL: EUR High / Middle…).')+'<br>'
    +'② '+(isFR?'Ajouter la ligne produit <strong>Pricing compensation</strong>.':'Add the <strong>Pricing compensation</strong> product line.')+'<br>'
    +'③ '+(isFR?'Y encoder la différence en <strong>prix unitaire négatif</strong>.':'Enter the difference as a <strong>negative unit price</strong>.')+'</div></div>';

  if(years>1 && !excluded){
    h += '<div style="margin-top:12px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);border-radius:10px;padding:11px 15px;font-size:12px;color:rgba(255,255,255,0.7);line-height:1.6;">'
      +'⚠️ '+(isFR?'Multi-annuel : l\'indexation s\'applique année par année. Interdit de cumuler une remise multi-annuelle (MY discount) avec la Pricing Compensation. Les remises MY (si applicables) ne concernent jamais Odoo.sh.'
             :'Multi-year: indexation applies year by year. MY (multi-year) discounts can never be combined with Pricing Compensation. MY discounts (if any) never apply to Odoo.sh.')+'</div>';
  }

  box.innerHTML = h;
}

function renderIndexationView(){
  var isFR = lang==='fr';
  var st = indexState;
  var sym = INDEX_CUR_SYMBOL[st.cur]||'€';
  var inputStyle = 'width:100%;box-sizing:border-box;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;padding:10px 12px;font-size:13px;font-family:inherit;outline:none;';

  var yearBtns = '';
  for(var n=1; n<=5; n++){
    yearBtns += '<button class="type-btn'+(st.years===n?' active':'')+'" data-index-years="'+n+'" onclick="indexSetYears('+n+')" style="min-width:0;padding:10px 0;"><span class="t-label">'+n+' '+(isFR?'an':'yr')+(n>1&&isFR?'s':'')+(n>1&&!isFR?'s':'')+'</span></button>';
  }

  var h = '<div class="tool-main" style="align-items:stretch;">'
    // LEFT CARD
    +'<div class="card" style="display:flex;flex-direction:column;">'
    +'<div class="card-header"><span style="font-size:18px;">🔁</span><span>'+(isFR?'Renouvellement de contrat':'Contract renewal')+'</span></div>'
    +'<div class="card-body" style="flex:1;">'

    +'<div class="section-label">'+(isFR?'Devise':'Currency')+'</div>'
    +'<div class="type-grid" style="margin-bottom:14px;">'
    +'<button class="type-btn'+(st.cur==='eur'?' active':'')+'" data-index-cur="eur" onclick="indexSetCur(\'eur\')"><span class="t-icon">💶</span><span class="t-label">Euro (€)</span></button>'
    +'<button class="type-btn'+(st.cur==='usd'?' active':'')+'" data-index-cur="usd" onclick="indexSetCur(\'usd\')"><span class="t-icon">💵</span><span class="t-label">Dollar ($)</span></button>'
    +'</div>'

    +'<div class="section-label" id="index-prev-label">'+(isFR?'Prix du contrat précédent (':'Previous contract price (')+sym+')</div>'
    +'<input type="text" id="index-prev" value="'+(st.prev||'')+'" oninput="indexSetPrev(this.value)" placeholder="'+(isFR?'ex : 448,80':'e.g. 448.80')+'" style="'+inputStyle+'margin-bottom:14px;">'

    +'<div class="section-label" id="index-catalog-label">'+(isFR?'Nouveau prix catalogue (':'New catalog price (')+sym+')</div>'
    +'<input type="text" id="index-catalog" value="'+(st.catalog||'')+'" oninput="indexSetCatalog(this.value)" placeholder="'+(isFR?'ex : 538,80':'e.g. 538.80')+'" style="'+inputStyle+'margin-bottom:5px;">'
    +'<div style="font-size:11px;color:rgba(255,209,102,0.85);margin-bottom:18px;line-height:1.45;">💡 '+(isFR?'Pré-rempli à <strong>+20%</strong> (nouvelle grille Custom). Cliquez pour le modifier.':'Pre-filled at <strong>+20%</strong> (new Custom grid). Click to edit.')+'</div>'

    +'<div class="section-label">'+(isFR?'Durée du renouvellement':'Renewal duration')+'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:18px;">'+yearBtns+'</div>'

    +'<div class="section-label">'+(isFR?'Changement de plan Standard → Custom/Studio ?':'Plan change Standard → Custom/Studio?')+'</div>'
    +'<div class="type-grid" style="margin-bottom:14px;">'
    +'<button class="type-btn'+(st.planChange==='no'?' active':'')+'" data-index-plan="no" onclick="indexSetPlanChange(\'no\')"><span class="t-icon">✅</span><span class="t-label">'+(isFR?'Non':'No')+'</span></button>'
    +'<button class="type-btn'+(st.planChange==='yes'?' active':'')+'" data-index-plan="yes" onclick="indexSetPlanChange(\'yes\')"><span class="t-icon">⚠️</span><span class="t-label">'+(isFR?'Oui':'Yes')+'</span></button>'
    +'</div>'

    +'<div class="section-label">'+(isFR?'Passage à une facturation mensuelle ?':'Switch to monthly billing?')+'</div>'
    +'<div class="type-grid" style="margin-bottom:0;">'
    +'<button class="type-btn'+(st.toMonthly==='no'?' active':'')+'" data-index-monthly="no" onclick="indexSetMonthly(\'no\')"><span class="t-icon">✅</span><span class="t-label">'+(isFR?'Non':'No')+'</span></button>'
    +'<button class="type-btn'+(st.toMonthly==='yes'?' active':'')+'" data-index-monthly="yes" onclick="indexSetMonthly(\'yes\')"><span class="t-icon">⚠️</span><span class="t-label">'+(isFR?'Oui':'Yes')+'</span></button>'
    +'</div>'

    +'</div></div>'

    // RIGHT CARD
    +'<div class="result-card has-result" style="display:flex;flex-direction:column;">'
    +'<div class="result-header"><span>📊</span><span>'+(isFR?'Résultat du renouvellement':'Renewal result')+'</span></div>'
    +'<div class="result-body" style="overflow-y:auto;max-height:calc(100vh - 160px);display:flex;flex-direction:column;gap:0;">'
    // Static explanation
    +'<div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">'
    +'<div class="iot-section-title" style="margin-bottom:8px;">ℹ️ '+(isFR?'RÈGLE DES 7%':'THE 7% RULE')+'</div>'
    +'<p style="font-size:12.5px;color:rgba(255,255,255,0.72);line-height:1.6;margin:0;">'+(isFR
      ?'Au renouvellement d\'un contrat existant (ancienne grille, souscrit avant le 19/12/2025 / &lt; 09/2026) dont le tarif est <strong style="color:#fff;">inférieur</strong> à la nouvelle grille, l\'augmentation est <strong style="color:#FFD166;">plafonnée à +7%/an</strong>. La différence avec le catalogue est encodée en <strong style="color:#fff;">prix unitaire négatif</strong> sur une ligne « Pricing compensation ».'
      :'When renewing an existing contract (old pricelist, subscribed before 19/12/2025 / &lt; 09/2026) whose price is <strong style="color:#fff;">below</strong> the new pricelist, the increase is <strong style="color:#FFD166;">capped at +7%/year</strong>. The gap to catalog is encoded as a <strong style="color:#fff;">negative unit price</strong> on a "Pricing compensation" line.')+'</p>'
    +'</div>'
    +'<div id="index-result" style="padding:18px 20px;"></div>'
    +'</div></div>'

    +'</div>';

  el('indexation-content').innerHTML = h;
  indexCompute();
}
