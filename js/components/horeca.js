function renderHorecaView(){
  var isFR=lang==='fr';
  var c=el('horeca-content'); if(!c) return;
  function bubble(n,col){return "<span style='display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;min-width:26px;background:"+col+";color:#fff;border-radius:50%;font-size:12px;font-weight:800;margin-right:10px;'>"+n+"</span>";}
  function step(n,col,txt){return "<div style='display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);'>"+bubble(n,col)+"<div style='font-size:13.5px;color:rgba(255,255,255,0.85);line-height:1.6;'>"+txt+"</div></div>";}
  function check(txt){return "<label style='display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);cursor:pointer;'><input type='checkbox' style='margin-top:3px;accent-color:#00A09D;width:15px;height:15px;flex-shrink:0;'><span style='font-size:13.5px;color:rgba(255,255,255,0.85);line-height:1.6;'>"+txt+"</span></label>";}
  function contact(init,role,col){return "<div style='display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.14);border-radius:8px;padding:8px 14px;margin:4px;'><span style='background:"+col+";color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;'>"+init+"</span><span style='font-size:12px;color:rgba(255,255,255,0.65);'>"+role+"</span></div>";}
  var html='';
  // ── SECTION 1 : CONDITIONS DU PACK ──
  html+="<div class='iot-section-title' style='margin-bottom:14px;display:flex;align-items:center;'>"+bubble('🍽','#e85d04')+(isFR?'CONDITIONS DU PACK HORECA':'HORECA PACK CONDITIONS')+"</div>";
  html+="<div style='background:rgba(232,93,4,0.12);border:1.5px solid rgba(232,93,4,0.35);border-radius:12px;padding:18px 20px;margin-bottom:28px;'>";
  // ── offers
  html+="<div style='font-size:11px;font-weight:700;color:#ff8c42;letter-spacing:1.2px;margin-bottom:14px;'>"+(isFR?'CE QU\'ON PROPOSE':'WHAT WE OFFER')+"</div>";
  html+="<div style='display:flex;flex-direction:column;gap:10px;margin-bottom:16px;'>";
  // offer 1 — 8h pack
  html+="<div style='background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:14px 16px;'>";
  html+="<div style='display:flex;align-items:flex-start;gap:12px;'>";
  html+="<span style='font-size:20px;line-height:1.3;'>✅</span><div>";
  html+="<div style='font-size:13.5px;font-weight:700;color:#fff;margin-bottom:4px;'>"+(isFR?"Pack <strong style='color:#ff8c42;'>8h Succès</strong> — Installation Point of Sales":"<strong style='color:#ff8c42;'>8-Hour Success Pack</strong> — Point of Sales Installation")+"</div>";
  html+="<div style='font-size:12px;color:rgba(255,255,255,0.5);font-style:italic;margin-bottom:10px;'>"+(isFR?'Import produits · Config PoS · Connexion hardware · Formation':'Product import · PoS config · Hardware plugging · Training')+"</div>";
  html+="<span style='display:inline-flex;align-items:center;gap:6px;background:rgba(232,93,4,0.2);border:1px solid rgba(232,93,4,0.45);border-radius:6px;padding:4px 10px;font-size:11.5px;color:#ff8c42;font-weight:600;'>Consulting Fixed Price &nbsp;·&nbsp; 1 "+(isFR?'jour':'day')+" &nbsp;·&nbsp; <strong>950 €</strong></span>";
  html+="</div></div></div>";
  // offer 2 — Black Box 2
  html+="<div style='background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:14px 16px;display:flex;align-items:center;gap:12px;'>";
  html+="<span style='font-size:20px;line-height:1;'>✅</span>";
  html+="<div style='font-size:13.5px;color:#fff;'>"+(isFR?"Proposer la <strong>Black Box 2 gratuite</strong>":"Propose the <strong>Black Box 2 for free</strong>")+"</div>";
  html+="</div></div>";
  // ── requirements
  html+="<div style='padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);margin-bottom:14px;'>";
  html+="<div style='font-size:10px;font-weight:700;color:rgba(255,255,255,0.38);letter-spacing:1.5px;margin-bottom:10px;'>💡 "+(isFR?'PRÉREQUIS':'REQUIREMENTS')+"</div>";
  html+="<div style='display:flex;gap:8px;flex-wrap:wrap;'>";
  [{icon:'🇧🇪',fr:'BE / LUX',en:'BE / LUX'},{icon:'🖥️',fr:'Hardware compatible',en:'Hardware compatible'},{icon:'📅',fr:'Abonnement Annuel',en:'Yearly subscription'}].forEach(function(r){
    html+="<span style='display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:5px 10px;font-size:12px;color:rgba(255,255,255,0.78);'>"+(r.icon+" ")+(isFR?r.fr:r.en)+"</span>";
  });
  html+="</div></div>";
  // ── accordion : exemple de devis
  html+="<details style='border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;'>";
  html+="<summary style='cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);user-select:none;'>";
  html+="<span>📋 "+(isFR?'Exemple de devis':'Quotation example')+"</span>";
  html+="<span style='font-size:11px;color:rgba(255,255,255,0.3);'>▼</span>";
  html+="</summary>";
  html+="<img src='horeca-pos-offer.png' alt='"+(isFR?'Exemple de devis Horeca':'Horeca quotation example')+"' style='width:100%;border-radius:8px;margin-top:12px;display:block;' onerror=\"this.style.display='none'\"/>";
  html+="</details>";
  html+="</div>";

  // ── SECTION 2 : PROCESSUS DE VENTE ──
  html+="<div class='iot-section-title' style='margin-bottom:14px;display:flex;align-items:center;'>"+bubble('📋','#6366f1')+(isFR?'PROCESSUS DE VENTE':'SALES PROCESS')+"</div>";
  html+="<div class='card' style='padding:18px 20px;margin-bottom:28px;'>";
  if(isFR){
    html+=step(1,'#6366f1','<strong>Collecte et qualification</strong> des informations : restaurant neuf ou matériel existant.');
    html+=step(2,'#6366f1','<strong>Envoi et validation</strong> du questionnaire d\'éligibilité.');
    html+=step(3,'#6366f1','<strong>Vérification de la compatibilité</strong> du matériel.');
    html+=step(4,'#6366f1','<strong>Création du devis</strong> — le matériel peut être optionnel.');
    html+=step(5,'#8b5cf6','<strong>Création et complétion</strong> de la tâche "Horeca" après paiement.');
    html+=step(6,'#8b5cf6','Activité <strong>"signature"</strong> sur la tâche pour envoyer l\'accord client.');
    html+=step(7,'#00A09D','Tagger <strong>WTA</strong> pour l\'affectation du projet une fois le contrat signé.');
  }else{
    html+=step(1,'#6366f1','<strong>Collect and qualify</strong> information: new restaurant or existing equipment.');
    html+=step(2,'#6366f1','<strong>Send and validate</strong> the eligibility questionnaire.');
    html+=step(3,'#6366f1','<strong>Verify hardware compatibility</strong>.');
    html+=step(4,'#6366f1','<strong>Create the quote</strong> — hardware can be optional.');
    html+=step(5,'#8b5cf6','<strong>Create and complete</strong> the "Horeca" task after payment.');
    html+=step(6,'#8b5cf6','<strong>"Signature" activity</strong> on the task to send the client agreement.');
    html+=step(7,'#00A09D','Tag <strong>WTA</strong> for project assignment once the contract is signed.');
  }
  html+="</div>";

  // ── SECTION 3 : CHECKLIST RECEPTION CCM ──
  html+="<div class='iot-section-title' style='margin-bottom:14px;display:flex;align-items:center;'>"+bubble('✅','#00A09D')+(isFR?'CHECKLIST RÉCEPTION — CCM':'RECEPTION CHECKLIST — CCM')+"</div>";
  html+="<div class='card' style='padding:18px 20px;margin-bottom:28px;'>";
  html+="<div style='font-size:11px;font-weight:700;color:#00C8C4;letter-spacing:1.2px;margin-bottom:10px;'>"+(isFR?'À VÉRIFIER À RÉCEPTION DU PACK':'TO VERIFY UPON RECEIVING THE PACK')+"</div>";
  if(isFR){
    html+=check("Vérifier le tag <strong>\"Horeca\"</strong> sur le pack.");
    html+=check("S'assurer que la <strong>tâche est complète</strong> (équipement spécifié).");
    html+=check("Confirmer que le pack est <strong>entièrement complété</strong> — sinon, tagger le consultant pour clarification.");
    html+=check("S'ajouter comme <strong>\"follower\"</strong> de la tâche et informer le consultant.");
    html+=check("Envoyer l'<strong>email de bienvenue</strong>.");
  }else{
    html+=check("Check the <strong>\"Horeca\"</strong> tag on the pack.");
    html+=check("Ensure the <strong>task is complete</strong> (equipment specified).");
    html+=check("Confirm the pack is <strong>fully completed</strong> — if not, tag the consultant for clarification.");
    html+=check("Add yourself as a <strong>\"follower\"</strong> of the task and notify the consultant.");
    html+=check("Send the <strong>welcome email</strong>.");
  }
  html+="</div>";

  // ── SECTION 4 : RESSOURCES & CONTACTS ──
  html+="<div class='iot-section-title' style='margin-bottom:14px;display:flex;align-items:center;'>"+bubble('📞','#FFD166')+(isFR?'RESSOURCES &amp; CONTACTS':'RESOURCES &amp; CONTACTS')+"</div>";
  html+="<div class='card' style='padding:18px 20px;margin-bottom:16px;'>";
  // Matériel
  html+="<div style='font-size:11px;font-weight:700;color:#FFD166;letter-spacing:1.2px;margin-bottom:10px;'>"+(isFR?'MATÉRIEL SUPPLÉMENTAIRE':'ADDITIONAL HARDWARE')+"</div>";
  html+="<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;'>";
  html+="<a class='iot-link-btn' href='https://www.boxapos.com' target='_blank' rel='noopener'><span class='iot-link-icon'>🏪</span><span class='iot-link-label'>BoxaPOS — "+(isFR?'Commander du matériel':'Order hardware')+"</span><span class='iot-link-arrow'>↗</span></a>";
  html+="<div style='background:rgba(255,255,255,0.05);border-radius:8px;padding:10px 12px;font-size:12.5px;color:rgba(255,255,255,0.70);line-height:1.5;'>"+(isFR?'Via Odoo : temps facturable':'Via Odoo: billable time')+"</div>";
  html+="</div>";
  // Contacts
  html+="<div style='font-size:11px;font-weight:700;color:#FFD166;letter-spacing:1.2px;margin-bottom:10px;'>"+(isFR?'CONTACTS CLÉS':'KEY CONTACTS')+"</div>";
  html+="<div style='margin-bottom:12px;'>";
  html+=contact('VINA',isFR?'Personne de contact':'Point of contact','#714B67');
  html+=contact('JEDE',isFR?'DS team TL':'DS Team Lead','#017E84');
  html+=contact('WTA',isFR?'Consultant team TL':'Consultant Team Lead','#6366f1');
  html+=contact('MOBT','Product Owner','#e85d04');
  html+=contact('YASO',isFR?'IoT specialist (urgence)':'IoT specialist (urgent only)','#8b5cf6');
  html+="</div>";
  html+="<div style='background:rgba(255,209,102,0.1);border:1.5px solid rgba(255,209,102,0.3);border-radius:8px;padding:10px 14px;font-size:12.5px;color:rgba(255,255,255,0.75);line-height:1.5;margin-bottom:12px;'>⚠️ "+(isFR?'Toujours contacter un <strong style=\"color:#fff;\">BA</strong> en cas de problème.':'Always contact a <strong style="color:#fff;">BA</strong> in case of an issue.')+"</div>";
  html+="<div style='background:rgba(99,102,241,0.1);border:1.5px solid rgba(99,102,241,0.3);border-radius:8px;padding:10px 14px;font-size:12.5px;color:rgba(255,255,255,0.75);line-height:1.5;'>💬 "+(isFR?'Feuille de questions partagée pour les cas complexes — tagger <strong style=\"color:#a78bfa;\">DMAR</strong> ou <strong style=\"color:#a78bfa;\">MITO</strong>.':'Shared question sheet for complex cases — tag <strong style="color:#a78bfa;">DMAR</strong> or <strong style="color:#a78bfa;">MITO</strong>.')+"</div>";
  html+="</div>";

  c.innerHTML=html;
}
