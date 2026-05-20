let callState={phase:null,plan:null,planType:null,sentiment:null,objOpen:{}};

function renderCallFuView(){
  var phase=callState.phase,plan=callState.plan,sentiment=callState.sentiment;
  var phases=[
    {key:'test',  label:'TEST',                                          color:'#3b82f6',bg:'rgba(59,130,246,0.18)', border:'rgba(59,130,246,0.6)'},
    {key:'implem',label:lang==='fr'?'IMPLÉMENTATION':'IMPLEMENTATION',   color:'#f97316',bg:'rgba(249,115,22,0.18)',border:'rgba(249,115,22,0.6)'},
    {key:'prod',  label:'PRODUCTION',                                    color:'#22c55e',bg:'rgba(34,197,94,0.18)', border:'rgba(34,197,94,0.6)'}
  ];
  var scriptsReady=phase&&plan;
  var isFR=lang==='fr';
  var copyLbl=isFR?'📋 Copier':'📋 Copy';
  var h='';
  // ── CHEAT SHEET header
  h+="<div class='card' style='padding:0;margin-bottom:14px;overflow:hidden;'>"
   +"<div style='background:linear-gradient(90deg,rgba(113,75,103,0.35),rgba(0,160,157,0.2));padding:9px 20px;border-bottom:1px solid rgba(255,255,255,0.08);'>"
   +"<span style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:2px;'>📋 CHEAT SHEET</span>"
   +"</div>"
   +"<div style='display:grid;grid-template-columns:1fr 1fr;'>"
   +"<div style='padding:14px 18px;border-right:1px solid rgba(255,255,255,0.07);'>"
   +"<div style='font-size:11px;font-weight:700;color:#FFD166;margin-bottom:6px;'>"+(isFR?'⏱️ Le Moment (J+15)':'⏱️ The Moment (D+15)')+"</div>"
   +"<div style='font-size:12.5px;color:rgba(255,255,255,0.68);line-height:1.65;'>"+(isFR?"C'est la fin de la lune de miel. Le client prend conscience de l'effort impliqué. C'est le moment idéal pour proposer de l'aide <em>(Packs)</em> ou des économies <em>(Annuel)</em>.":'This is the end of the honeymoon phase. The client is realizing the effort involved. This is the perfect moment to offer help <em>(Packs)</em> or savings <em>(Annual)</em>.')+"</div>"
   +"</div>"
   +"<div style='padding:14px 18px;'>"
   +"<div style='font-size:11px;font-weight:700;color:#00E8B0;margin-bottom:6px;'>"+(isFR?'🧠 Pourquoi chercher un &quot;NON&quot;':'🧠 Why We Seek a &quot;NO&quot;')+"</div>"
   +"<div style='font-size:12.5px;color:rgba(255,255,255,0.68);line-height:1.65;'>"+(isFR?"Demander <em>&quot;Ce serait absurde de... ?&quot;</em> pousse le client à répondre <em>&quot;Non, ce ne serait pas absurde&quot;</em> — un <strong style='color:#00E8B0;'>oui déguisé</strong>. Cela crée une <strong style='color:#fff;'>illusion de contrôle</strong> : il a l'impression de refuser plutôt que d'accepter, ce qui <strong style='color:#fff;'>neutralise le réflexe défensif</strong>. &quot;Non, ce ne serait pas absurde&quot; est bien plus facile à prononcer que &quot;Oui, je veux acheter.&quot; Le <strong style='color:#FFD166;'>Non = signal de sécurité</strong> — le client s'engage sans se sentir sous pression.":"Asking <em>&quot;Would you be <strong style='color:#fff;'>against</strong>...?&quot;</em> forces the client to say <em>&quot;No, I'm not against it&quot;</em> — a <strong style='color:#00E8B0;'>soft yes</strong>. It creates an <strong style='color:#fff;'>illusion of control</strong>: they feel they're refusing rather than agreeing, which <strong style='color:#fff;'>kills the defensive reflex</strong>. A &quot;No, I wouldn't be against it&quot; is far easier to say than &quot;Yes, I want to buy.&quot; The <strong style='color:#FFD166;'>No = safety signal</strong> — the client is engaged without feeling pressured.")+"</div>"
   +"</div>"
   +"</div>"
   +"</div>";
  // ── STEP 1 : Plan Actuel (always visible)
  h+="<div class='card' style='padding:20px 22px;margin-bottom:12px;'>"
   +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.38);letter-spacing:2.5px;margin-bottom:14px;'>"+(isFR?'① PLAN ACTUEL':'① CURRENT PLAN')+"</div>"
   +"<div style='display:flex;gap:10px;'>";
  [{key:'mensuel',label:isFR?'MENSUEL':'MONTHLY'},{key:'annuel',label:isFR?'ANNUEL':'ANNUAL'}].forEach(function(p){
    var isAct=plan===p.key;
    h+="<button onclick=\"setCallPlan('"+p.key+"')\" style='flex:1;padding:14px 8px;border-radius:9px;border:2px solid "+(isAct?"#00A09D":"rgba(255,255,255,0.1)")+";background:"+(isAct?"rgba(0,160,157,0.2)":"rgba(255,255,255,0.04)")+";color:"+(isAct?"#00E8B0":"rgba(255,255,255,0.5)")+";font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;letter-spacing:0.8px;'>"+p.label+"</button>";
  });
  h+="</div>";
  if(plan==='mensuel'){
    h+="<div style='margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.07);'>"
     +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.32);letter-spacing:2px;margin-bottom:10px;'>💡 "+(isFR?'ÉCONOMIES ANNUEL (RÉFÉRENCE)':'ANNUAL SAVINGS REFERENCE')+"</div>"
     +"<div style='display:flex;gap:10px;'>"
     +"<div style='flex:1;padding:12px 14px;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-radius:8px;text-align:center;'>"
     +"<div style='font-size:10px;font-weight:800;color:rgba(74,222,128,0.7);letter-spacing:1.5px;margin-bottom:6px;'>STANDARD</div>"
     +"<div style='font-size:20px;font-weight:900;color:#4ade80;line-height:1;'>+70€</div>"
     +"<div style='font-size:10.5px;color:rgba(255,255,255,0.38);margin-top:4px;'>"+(isFR?'par utilisateur / an':'per user / year')+"</div>"
     +"</div>"
     +"<div style='flex:1;padding:12px 14px;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-radius:8px;text-align:center;'>"
     +"<div style='font-size:10px;font-weight:800;color:rgba(74,222,128,0.7);letter-spacing:1.5px;margin-bottom:6px;'>CUSTOM</div>"
     +"<div style='font-size:20px;font-weight:900;color:#4ade80;line-height:1;'>+96€</div>"
     +"<div style='font-size:10.5px;color:rgba(255,255,255,0.38);margin-top:4px;'>"+(isFR?'par utilisateur / an':'per user / year')+"</div>"
     +"</div>"
     +"</div>"
     +"</div>";
  }
  h+="</div>";
  // ── STEP 2 : Phase Client (always visible)
  h+="<div class='card' style='padding:20px 22px;margin-bottom:12px;'>"
   +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.38);letter-spacing:2.5px;margin-bottom:14px;'>"+(isFR?'② PHASE CLIENT':'② CUSTOMER PHASE')+"</div>"
   +"<div style='display:flex;gap:10px;flex-wrap:wrap;"+(phase?"margin-bottom:14px;":"")+"'>";
  phases.forEach(function(p){
    var isAct=phase===p.key;
    h+="<button onclick=\"setCallPhase('"+p.key+"')\" style='flex:1;min-width:110px;padding:14px 8px;border-radius:9px;border:2px solid "+(isAct?p.border:"rgba(255,255,255,0.1)")+";background:"+(isAct?p.bg:"rgba(255,255,255,0.04)")+";color:"+(isAct?p.color:"rgba(255,255,255,0.5)")+";font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;letter-spacing:0.8px;'>"+p.label+"</button>";
  });
  h+="</div>";
  if(phase){
    var th=CALL_THERMO[phase];
    h+="<div style='display:flex;align-items:center;gap:14px;background:"+th.bg+";border:1px solid "+th.border+";border-radius:9px;padding:12px 16px;'>"
     +"<span style='font-size:26px;line-height:1;'>"+th.emoji+"</span>"
     +"<div>"
     +"<div style='font-size:12.5px;font-weight:800;color:"+th.color+";margin-bottom:2px;'>"+cfT(th.label)+"</div>"
     +"<div style='font-size:12px;color:rgba(255,255,255,0.62);'>"+cfT(th.text)+"</div>"
     +"</div>"
     +"</div>";
  }
  h+="</div>";
  // ── STEP 3 : Sentiment Label (when both selected)
  if(scriptsReady){
    h+="<div class='card' style='padding:18px 22px;margin-bottom:12px;'>"
     +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.38);letter-spacing:2.5px;margin-bottom:12px;'>"+(isFR?'③ LABEL DE SENTIMENT':'③ SENTIMENT LABEL')+"</div>"
     +"<div style='display:flex;gap:8px;flex-wrap:wrap;"+(sentiment?"margin-bottom:12px;":"")+"'>";
    CALL_SENTIMENTS.forEach(function(s){
      var isAct=sentiment===s.key;
      h+="<button onclick=\"setCallSentiment('"+s.key+"')\" style='flex:1;min-width:100px;padding:10px 8px;border-radius:8px;border:2px solid "+(isAct?s.border:"rgba(255,255,255,0.1)")+";background:"+(isAct?s.bg:"rgba(255,255,255,0.04)")+";color:"+(isAct?s.color:"rgba(255,255,255,0.5)")+";font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;'>"+cfT(s.label)+"</button>";
    });
    h+="</div>";
    if(sentiment){
      var sentObj=CALL_SENTIMENTS.filter(function(s){return s.key===sentiment;})[0];
      var sentText=cfT(sentObj.text);
      h+="<div style='display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 16px;'>"
       +"<em style='font-size:13.5px;color:rgba(255,255,255,0.82);line-height:1.55;'>&quot;"+sentText+"&quot;</em>"
       +"<button onclick='callFuCopyFromAttr(this)' data-copy=\""+sentText.replace(/"/g,'&quot;')+"\" style='flex-shrink:0;padding:6px 12px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.55);border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;'>"+copyLbl+"</button>"
       +"</div>";
    }
    h+="</div>";
    // ── STEP 4 : Target Questions
    var key=phase+"_"+plan;
    var scripts=CALL_DATA.scripts[key]||{};
    h+="<div style='margin-bottom:12px;'>"
     +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.38);letter-spacing:2.5px;margin-bottom:14px;'>"+(isFR?'④ QUESTIONS CIBLES':'④ TARGET QUESTIONS')+"</div>";
    if(plan==='annuel'){
      h+="<div style='background:rgba(255,209,102,0.1);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:12.5px;color:#FFD166;line-height:1.6;'>"+(isFR?"⭐ Client déjà en annuel — Proposer uniquement un <strong>Pack Expertise</strong>.":'⭐ Client already on annual — Propose an <strong>Expertise Pack</strong> only.')+"</div>";
    }
    if(plan==='mensuel'){
      var stdDsp=isFR?"Seriez-vous contre l'idée d'économiser <strong style='color:#4ade80;'>plus de 70€</strong> par utilisateur cette année en passant simplement à l'annuel dès maintenant ?":"Would you be against the idea of saving <strong style='color:#4ade80;'>more than €70</strong> per user this year by simply switching to annual now?";
      var stdCopy=isFR?"Seriez-vous contre l'idée d'économiser plus de 70€ par utilisateur cette année en passant simplement à l'annuel dès maintenant ?":"Would you be against the idea of saving more than €70 per user this year by simply switching to annual now?";
      var cussDsp=isFR?"Seriez-vous opposé à récupérer <strong style='color:#4ade80;'>plus de 96€</strong> par utilisateur en verrouillant votre abonnement annuel aujourd'hui ?":"Would you be opposed to recovering <strong style='color:#4ade80;'>more than €96</strong> per user by locking in your annual subscription today?";
      var cussCopy=isFR?"Seriez-vous opposé à récupérer plus de 96€ par utilisateur en verrouillant votre abonnement annuel aujourd'hui ?":"Would you be opposed to recovering more than €96 per user by locking in your annual subscription today?";
      h+="<div class='card' style='border-left:4px solid #00A09D;padding:20px 22px;margin-bottom:12px;'>"
       +"<div style='font-size:10px;font-weight:800;color:#00A09D;letter-spacing:2px;margin-bottom:12px;'>📅 "+(isFR?'ANNUEL — STANDARD (-20%)':'ANNUAL — STANDARD (-20%)')+"</div>"
       +"<div style='font-size:15.5px;font-weight:700;color:#d0f7f5;line-height:1.7;margin-bottom:16px;'>&quot;"+stdDsp+"&quot;</div>"
       +"<button onclick='callFuCopyFromAttr(this)' data-copy=\""+stdCopy.replace(/"/g,'&quot;')+"\" style='padding:8px 18px;background:rgba(0,160,157,0.18);border:1.5px solid #00A09D;color:#00E8B0;border-radius:7px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;'>"+copyLbl+"</button>"
       +"</div>";
      h+="<div class='card' style='border-left:4px solid #00C896;padding:20px 22px;margin-bottom:12px;'>"
       +"<div style='font-size:10px;font-weight:800;color:#00C896;letter-spacing:2px;margin-bottom:12px;'>📅 "+(isFR?'ANNUEL — CUSTOM (-20%)':'ANNUAL — CUSTOM (-20%)')+"</div>"
       +"<div style='font-size:15.5px;font-weight:700;color:#d0f7f5;line-height:1.7;margin-bottom:16px;'>&quot;"+cussDsp+"&quot;</div>"
       +"<button onclick='callFuCopyFromAttr(this)' data-copy=\""+cussCopy.replace(/"/g,'&quot;')+"\" style='padding:8px 18px;background:rgba(0,200,150,0.18);border:1.5px solid #00C896;color:#00E8B0;border-radius:7px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;'>"+copyLbl+"</button>"
       +"</div>";
    }
    if(scripts.pack){
      h+="<div class='card' style='border-left:4px solid #8b5cf6;padding:20px 22px;margin-bottom:12px;'>"
       +"<div style='font-size:10px;font-weight:800;color:#a78bfa;letter-spacing:2px;margin-bottom:12px;'>🎓 "+(isFR?'PACK EXPERTISE':'EXPERTISE PACK')+"</div>"
       +"<div style='font-size:15.5px;font-weight:700;color:#ede9fe;line-height:1.7;margin-bottom:16px;'>&quot;"+cfT(scripts.pack)+"&quot;</div>"
       +"<button onclick='callFuCopyFromAttr(this)' data-copy=\""+cfT(scripts.pack).replace(/"/g,'&quot;')+"\" style='padding:8px 18px;background:rgba(139,92,246,0.18);border:1.5px solid #8b5cf6;color:#a78bfa;border-radius:7px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;'>"+copyLbl+"</button>"
       +"</div>";
    }
    h+="</div>";
  }
  // ── Objections accordion
  h+="<div style='margin-top:8px;'>"
   +"<div style='font-size:10px;font-weight:800;color:rgba(255,255,255,0.38);letter-spacing:2.5px;margin-bottom:12px;'>"+(isFR?'GESTION DES OBJECTIONS':'HANDLING OBJECTIONS')+"</div>";
  CALL_DATA.objections.forEach(function(obj){
    var isOpen=callState.objOpen[obj.id];
    h+="<div class='card' style='padding:0;margin-bottom:10px;overflow:hidden;'>"
     +"<button onclick=\"toggleCallObj('"+obj.id+"')\" style='width:100%;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;padding:14px 20px;cursor:pointer;font-family:inherit;color:rgba(255,255,255,0.8);font-size:13.5px;font-weight:600;text-align:left;'>"
     +"<span>"+cfT(obj.label)+"</span>"
     +"<span style='color:rgba(255,255,255,0.32);font-size:12px;display:inline-block;transform:rotate("+(isOpen?"180":"0")+"deg);transition:transform 0.25s;'>▼</span>"
     +"</button>";
    if(isOpen){
      h+="<div style='border-top:1px solid rgba(255,255,255,0.07);padding:16px 20px 18px;'>"
       +"<div style='font-size:14.5px;font-weight:700;color:#e8e8e8;line-height:1.7;margin-bottom:14px;'>&quot;"+cfT(obj.text)+"&quot;</div>"
       +"<button onclick='callFuCopyFromAttr(this)' data-copy=\""+cfT(obj.text).replace(/"/g,'&quot;')+"\" style='padding:7px 16px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.18);color:rgba(255,255,255,0.6);border-radius:7px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;'>"+copyLbl+"</button>"
       +"</div>";
    }
    h+="</div>";
  });
  h+="</div>";
  // ── Reset
  h+="<div style='margin-top:20px;padding-bottom:16px;text-align:center;'>"
   +"<button onclick='resetCallFu()' style='padding:12px 36px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.45);border-radius:10px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;' onmouseover=\"this.style.background='rgba(255,255,255,0.1)';this.style.color='rgba(255,255,255,0.8)'\" onmouseout=\"this.style.background='rgba(255,255,255,0.05)';this.style.color='rgba(255,255,255,0.45)'\">"+(isFR?'🔄 Réinitialiser / Nouvel Appel':'🔄 Reset / New Call')+"</button>"
   +"</div>";
  el('callfu-content').innerHTML=h;
}
function setCallPhase(p){callState.phase=p;callState.sentiment=null;renderCallFuView();}
function setCallPlan(p){callState.plan=p;callState.sentiment=null;renderCallFuView();}
function setCallSentiment(s){callState.sentiment=(callState.sentiment===s)?null:s;renderCallFuView();}
function toggleCallObj(id){callState.objOpen[id]=!callState.objOpen[id];renderCallFuView();}
function callFuCopyFromAttr(btn){_callFuCopy(btn.getAttribute('data-copy')||'',btn);}
function callFuCopyScript(key,type,btn){var s=CALL_DATA.scripts[key];_callFuCopy(s?s[type]||'':'',btn);}
function callFuCopyObj(id,btn){var o=CALL_DATA.objections.filter(function(x){return x.id===id;})[0];_callFuCopy(o?o.text:'',btn);}
function callFuCopySentiment(key,btn){var s=CALL_SENTIMENTS.filter(function(x){return x.key===key;})[0];_callFuCopy(s?s.text:'',btn);}
function _callFuCopy(text,btn){
  if(!text)return;
  var orig=btn.textContent;
  var doneText=lang==='fr'?'✅ Copié !':'✅ Copied!';
  btn.textContent=doneText;
  setTimeout(function(){if(btn.textContent===doneText)btn.textContent=orig;},2000);
  if(navigator.clipboard){navigator.clipboard.writeText(text).catch(function(){});}
  else{var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);}
}
function resetCallFu(){callState={phase:null,plan:null,planType:null,sentiment:null,objOpen:{}};renderCallFuView();}
