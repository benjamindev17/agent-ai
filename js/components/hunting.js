var huntingDate=new Date();
function huntingFmt(d){return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();}
function huntingShift(d,months,days){var r=new Date(d);r.setMonth(r.getMonth()+months);r.setDate(r.getDate()+days);return r;}
function huntingCopy(text,btnId){var btn=el(btnId);if(navigator.clipboard){navigator.clipboard.writeText(text).catch(function(){});}else{var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);}if(btn){var orig=btn.innerHTML;btn.innerHTML='✅ '+(lang==='fr'?'Copié !':'Copied!');setTimeout(function(){btn.innerHTML=orig;},2000);}}
function huntingSetDate(val){if(!val)return;var p=val.split('-');huntingDate=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));renderHuntingView();}
function huntingToggleMail(bodyId,btnId){var el2=document.getElementById(bodyId),btn=document.getElementById(btnId);if(!el2||!btn)return;var open=el2.style.display==='block';el2.style.display=open?'none':'block';btn.innerHTML='📧 '+(open?(lang==='fr'?'Déplier le mail':'Expand email'):(lang==='fr'?'Replier le mail':'Collapse email'));}
function renderHuntingView(){var isFR=lang==='fr';var D=huntingDate;var s3s=huntingShift(D,-3,-15),s3e=huntingShift(D,-2,0);var _12s=huntingShift(D,-14,0);_12s.setDate(1);var s12s=_12s,s12e=huntingShift(D,-12,0);var f=huntingFmt,dv=D.getFullYear()+'-'+String(D.getMonth()+1).padStart(2,'0')+'-'+String(D.getDate()).padStart(2,'0');
window._hTpl3S=isFR?'Voulez-vous continuer à payer plein tarif pour Odoo ? 🎯':'Do you want to keep paying full price for Odoo? 🎯';
window._hTpl3B=isFR?"Bonjour,\n\nÊtes-vous satisfait(e) de votre utilisation d'Odoo jusqu'à présent ? 🙂\n\nJe me permets de vous contacter car beaucoup de nos clients testent Odoo durant les premiers mois avant de passer à un abonnement annuel, qui est 20% plus avantageux.\n\nNous souhaitons donc proposer une offre spéciale à ces nouveaux clients, leur permettant de conserver leur remise première année, soit une réduction de 20%.\n\nCela vous permet de bénéficier de 15 mois de remise au lieu de 12, tout en profitant de tous les avantages de l'abonnement annuel.\n\nEn résumé, vous bénéficiez de :\n\n💰 20% de réduction en passant à l'abonnement annuel\n🧘‍♂️ Tranquillité d'esprit : un paiement annuel unique, plus besoin de gérer des factures mensuelles\n🎉 Remise première année (20%) appliquée sur toute la durée du contrat — soit un total de 15 mois avec remise\n\nVous trouverez le devis correspondant à cette offre ici : Voir le devis\n\nJe reste à votre disposition pour en discuter ou répondre à vos questions.\n\nBonne journée,"
:"Hello,\n\nAre you satisfied with your use of Odoo so far? 🙂\n\nI'm reaching out because many of our clients test Odoo during the first few months before switching to an annual plan, as it is 20% more advantageous.\n\nWe would therefore like to offer a special deal to these new clients, giving them the opportunity to keep their first-year discount, which represents a 20% reduction.\n\nThis allows you to benefit from 15 months of discount instead of 12, while enjoying all the advantages of the annual plan.\n\nIn summary, you benefit from:\n\n💰 20% discount by switching to the annual plan\n🧘‍♂️ Peace of mind: a single annual payment, no need to manage monthly invoices\n🎉 First-year discount (20%) applied to the entire contract period — meaning a total of 15 months with a discount\n\nYou will find the quote corresponding to this offer here: View the quote\n\nI remain at your disposal to discuss this or answer any questions.\n\nHave a nice day,";
window._hTpl12S=isFR?'Voulez-vous continuer à payer plein tarif pour Odoo ? 🎯':'Do you want to keep paying full price for Odoo ? 🎯';
window._hTpl12B=isFR?"Bonjour,\n\nJe me permets de vous contacter car j'ai une opportunité intéressante pour vous aider à réduire vos coûts sur votre abonnement Odoo,\n\nDepuis votre dernier paiement mensuel, vous ne bénéficiez plus de la remise première année, ce qui a entraîné une augmentation de votre tarif. En passant à un abonnement de plus longue durée, vous pourriez éviter immédiatement cette hausse de 20% sur votre formule.\n\nPourquoi choisir l'abonnement annuel ?\n\n💰 Économies garanties : un tarif plus avantageux que les paiements mensuels\n🎉 Moins de gestion : un seul paiement pour l'année, sans surprises\n🧘‍♂️ Tranquillité d'esprit : vous sécurisez votre prix et évitez toute future augmentation\n\nPour vous simplifier la démarche, j'ai généré un devis que vous pouvez consulter ici :\n\nJe reste disponible pour toute question ou pour activer votre offre dès aujourd'hui,\n\nDans l'attente de vous lire,"
:"Hello,\n\nI am reaching out to you because I have an interesting opportunity to help you reduce your costs on your Odoo subscription,\n\nSince your last monthly payment, you are no longer benefiting from the first-year discount, which has resulted in an increase in your rate. By switching to a longer-term subscription, you could avoid this 20% increase on your plan immediately.\n\nWhy choose the annual plan?\n\n💰 Guaranteed savings: A more advantageous rate compared to monthly payments\n🎉 Less management: A single payment for the year, no surprises\n🧘‍♂️ Peace of mind: You secure your price and avoid any future increases\n\nTo simplify the process for you, I have generated a quote that you can view here:\n\nI remain at your disposal for any questions or to activate your offer today,\n\nLooking forward to speaking with you,";
function escH(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
var cp=isFR?'Copier':'Copy';
var bBase='border-radius:8px;padding:7px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;';
var h='<div style="max-width:680px;margin:0 auto;">'
+'<div style="background:rgba(255,255,255,0.25);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.35);border-radius:14px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">'
+'<span style="font-size:13px;color:rgba(255,255,255,0.45);">'+(isFR?'Date de référence :':'Reference date:')+'</span>'
+'<input type="date" value="'+dv+'" oninput="huntingSetDate(this.value)" style="background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.2);border-radius:10px;color:#fff;padding:9px 14px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;color-scheme:dark;outline:none;">'
+'</div>'
+'<div style="background:rgba(255,255,255,0.25);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.35);border-radius:14px;padding:20px 24px;margin-bottom:14px;">'
+'<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><div style="width:30px;height:30px;min-width:30px;background:#6366f1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;box-shadow:0 2px 10px rgba(99,102,241,0.5);">3</div>'
+'<div style="font-size:15px;font-weight:700;color:#a5b4fc;">'+(isFR?'Cible 3 mois':'3-Month Target')+'</div></div>'
+'<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:12px;padding-left:40px;line-height:1.5;">'+(isFR?'Envoi après la 3ème facture · 3 à 4 mois d\'ancienneté':'Send after 3rd invoice · 3 to 4 months tenure')+'</div>'
+'<div style="display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;">'
+'<div><div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">'+(isFR?'Début':'Start')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;">'
+'<div style="background:rgba(255,255,255,0.07);border:1.5px solid rgba(99,102,241,0.4);border-radius:10px;padding:10px 18px;font-size:17px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">'+f(s3s)+'</div>'
+'<button onclick="huntingCopy(\''+f(s3s)+'\',\'h3-sb\')" id="h3-sb" style="background:rgba(99,102,241,0.2);border:1.5px solid rgba(99,102,241,0.4);color:#a5b4fc;'+bBase+'">📋 '+cp+'</button>'
+'</div></div>'
+'<div style="font-size:22px;color:rgba(255,255,255,0.2);padding-bottom:12px;">→</div>'
+'<div><div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">'+(isFR?'Fin':'End')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;">'
+'<div style="background:rgba(255,255,255,0.07);border:1.5px solid rgba(99,102,241,0.4);border-radius:10px;padding:10px 18px;font-size:17px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">'+f(s3e)+'</div>'
+'<button onclick="huntingCopy(\''+f(s3e)+'\',\'h3-eb\')" id="h3-eb" style="background:rgba(99,102,241,0.2);border:1.5px solid rgba(99,102,241,0.4);color:#a5b4fc;'+bBase+'">📋 '+cp+'</button>'
+'</div></div>'
+'</div>'
+'<div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(99,102,241,0.2);">'
+'<div style="font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">✉️ '+(isFR?'Modèle email':'Email template')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">'
+'<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:7px 13px;font-size:12.5px;color:rgba(255,255,255,0.8);flex:1;min-width:0;">'+escH(window._hTpl3S)+'</div>'
+'<button onclick="huntingCopy(window._hTpl3S,\'h3-ts\')" id="h3-ts" style="background:rgba(99,102,241,0.2);border:1.5px solid rgba(99,102,241,0.4);color:#a5b4fc;'+bBase+'">📋 '+(isFR?'Objet':'Subject')+'</button>'
+'</div>'
+'<button onclick="huntingToggleMail(\'h3-body\',\'h3-body-btn\')" id="h3-body-btn" style="margin-top:6px;background:transparent;border:1px solid rgba(99,102,241,0.35);color:rgba(165,180,252,0.7);border-radius:7px;padding:5px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;">📧 '+(isFR?'Déplier le mail':'Expand email')+'</button>'
+'<div id="h3-body" style="display:none;margin-top:8px;position:relative;">'
+'<div style="background:rgba(0,0,0,0.2);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:12px 44px 12px 14px;font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6;white-space:pre-wrap;max-height:160px;overflow-y:auto;font-family:inherit;">'+escH(window._hTpl3B)+'</div>'
+'<button onclick="huntingCopy(window._hTpl3B,\'h3-tb\')" id="h3-tb" style="position:absolute;top:8px;right:8px;background:rgba(99,102,241,0.3);border:1.5px solid rgba(99,102,241,0.5);color:#a5b4fc;border-radius:7px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">📋 '+cp+'</button>'
+'</div>'
+'</div>'
+'</div>'
+'<div style="background:rgba(255,255,255,0.25);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.35);border-radius:14px;padding:20px 24px;margin-bottom:14px;">'
+'<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><div style="width:30px;height:30px;min-width:30px;background:#00C896;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;box-shadow:0 2px 10px rgba(0,200,150,0.5);">12</div>'
+'<div style="font-size:15px;font-weight:700;color:#00E8B0;">'+(isFR?'Cible 12 mois':'12-Month Target')+'</div></div>'
+'<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:12px;padding-left:40px;line-height:1.5;">'+(isFR?'Renouvellement anniversaire · ~1 an d\'ancienneté':'Anniversary renewal · ~1 year tenure')+'</div>'
+'<div style="display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;">'
+'<div><div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">'+(isFR?'Début':'Start')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;">'
+'<div style="background:rgba(255,255,255,0.07);border:1.5px solid rgba(0,200,150,0.35);border-radius:10px;padding:10px 18px;font-size:17px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">'+f(s12s)+'</div>'
+'<button onclick="huntingCopy(\''+f(s12s)+'\',\'h12-sb\')" id="h12-sb" style="background:rgba(0,200,150,0.12);border:1.5px solid rgba(0,200,150,0.35);color:#00E8B0;'+bBase+'">📋 '+cp+'</button>'
+'</div></div>'
+'<div style="font-size:22px;color:rgba(255,255,255,0.2);padding-bottom:12px;">→</div>'
+'<div><div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">'+(isFR?'Fin':'End')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;">'
+'<div style="background:rgba(255,255,255,0.07);border:1.5px solid rgba(0,200,150,0.35);border-radius:10px;padding:10px 18px;font-size:17px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">'+f(s12e)+'</div>'
+'<button onclick="huntingCopy(\''+f(s12e)+'\',\'h12-eb\')" id="h12-eb" style="background:rgba(0,200,150,0.12);border:1.5px solid rgba(0,200,150,0.35);color:#00E8B0;'+bBase+'">📋 '+cp+'</button>'
+'</div></div>'
+'</div>'
+'<div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(0,200,150,0.15);">'
+'<div style="font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">✉️ '+(isFR?'Modèle email':'Email template')+'</div>'
+'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">'
+'<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:7px 13px;font-size:12.5px;color:rgba(255,255,255,0.8);flex:1;min-width:0;">'+escH(window._hTpl12S)+'</div>'
+'<button onclick="huntingCopy(window._hTpl12S,\'h12-ts\')" id="h12-ts" style="background:rgba(0,200,150,0.12);border:1.5px solid rgba(0,200,150,0.35);color:#00E8B0;'+bBase+'">📋 '+(isFR?'Objet':'Subject')+'</button>'
+'</div>'
+'<button onclick="huntingToggleMail(\'h12-body\',\'h12-body-btn\')" id="h12-body-btn" style="margin-top:6px;background:transparent;border:1px solid rgba(0,200,150,0.3);color:rgba(0,232,176,0.6);border-radius:7px;padding:5px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;">📧 '+(isFR?'Déplier le mail':'Expand email')+'</button>'
+'<div id="h12-body" style="display:none;margin-top:8px;position:relative;">'
+'<div style="background:rgba(0,0,0,0.2);border:1px solid rgba(0,200,150,0.15);border-radius:10px;padding:12px 44px 12px 14px;font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6;white-space:pre-wrap;max-height:160px;overflow-y:auto;font-family:inherit;">'+escH(window._hTpl12B)+'</div>'
+'<button onclick="huntingCopy(window._hTpl12B,\'h12-tb\')" id="h12-tb" style="position:absolute;top:8px;right:8px;background:rgba(0,200,150,0.2);border:1.5px solid rgba(0,200,150,0.4);color:#00E8B0;border-radius:7px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">📋 '+cp+'</button>'
+'</div>'
+'</div>'
+'</div>'
+'<div style="background:rgba(255,209,102,0.07);border:1px solid rgba(255,209,102,0.2);border-radius:12px;padding:12px 16px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;">'
+'ℹ️ '+(isFR?'Génère les plages de dates à coller dans Odoo Subscriptions → filtre <strong style="color:rgba(255,209,102,0.8);">Custom Range → Start Date</strong> pour identifier les clients éligibles à la conversion mensuel → annuel selon leur ancienneté.':'Generates date ranges to paste into Odoo Subscriptions → <strong style="color:rgba(255,209,102,0.8);">Custom Range → Start Date</strong> filter to identify clients eligible for monthly → annual conversion based on their subscription age.')
+'</div>'
+'</div>';
el('hunting-content').innerHTML=h;}
