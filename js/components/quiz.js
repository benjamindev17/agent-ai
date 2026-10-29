// ── QUIZ PRICING 2026 / PRICING COMPENSATION ──
// Module de formation. Moteur de calcul = source de vérité (règles fournies).

// ---------- Helpers de format (belge : 1 234,56 €) ----------
function qzR2(x){ return Math.round(x*100)/100; }
function qzGroup(intStr){ return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); } // espace fine
function qzNum(n){ var neg=n<0; var s=Math.abs(n).toFixed(2).split('.'); return (neg?'-':'')+qzGroup(s[0])+','+s[1]; }
function qzEUR(n){ return qzNum(n)+' €'; }
function qzPct(n){ return (n>=0?'+':'')+n.toFixed(2).replace('.',',')+' %'; }
function qzRand(min,max,step){ step=step||1; var k=Math.floor(Math.random()*((max-min)/step+1)); return min+k*step; }
function qzShuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; } return a; }

// ---------- Moteur de calcul ----------
// extras = maintenance + Odoo.sh (prix inchangé).
// Au RENOUVELLEMENT la remise commerciale n'est pas reconduite :
// nouveau total = nouveau catalogue − PC = PreTotal Rec+ × 1,07 (soit la remise, soit la PC).
function qzCompute(oldCat,newCat,users,extras){
  var licOld=oldCat*users, licNew=newCat*users;
  var increase=licNew-licOld;                 // uniquement les lignes qui changent (licences)
  var preTotal=licOld+extras;                 // ancien contrat au prix catalogue, SANS remise
  var hausse=0.07*preTotal;                    // hausse autorisée
  var pcMag=increase-hausse;                   // |PC| (ligne négative)
  var pcCap=0.93*increase;                      // plafond (à confirmer)
  var newCatTotal=licNew+extras;               // nouveau catalogue (plein)
  var nouveauTotal=newCatTotal-pcMag;           // = PreTotal Rec+ × 1,07 (remise non reconduite)
  return {licOld:licOld,licNew:licNew,increase:increase,preTotal:preTotal,hausse:hausse,
          pcMag:pcMag,pcCap:pcCap,newCatTotal:newCatTotal,nouveauTotal:nouveauTotal};
}

// ---------- Libellés des erreurs types (pour le feedback) ----------
var QZ_ERR = {
  paid:     {fr:"7 % appliqués sur le prix payé (remisé) au lieu du prix catalogue.", en:"7% applied to the (discounted) paid price instead of the catalog price."},
  increase: {fr:"7 % appliqués sur l'Increase au lieu du PreTotal Rec+.",             en:"7% applied to the Increase instead of PreTotal Rec+."},
  keptDisc: {fr:"Remise conservée EN PLUS de la PC. Au renouvellement, c'est soit la remise, soit la PC : la remise saute.", en:"Discount kept ON TOP of the PC. At renewal it's either the discount or the PC: the discount is dropped."},
  newcat:   {fr:"Nouveau catalogue × 1,07 : on ajoute 7 % AU catalogue au lieu de plafonner l'augmentation.",            en:"New catalog × 1.07: 7% is added ON the catalog instead of capping the increase."},
  gaveAllow:{fr:"C'est la hausse autorisée (7 %), pas la Pricing Compensation.",      en:"That's the allowed increase (7%), not the Pricing Compensation."},
  noAllow:  {fr:"Increase non diminué de la hausse autorisée.",                       en:"Increase not reduced by the allowed increase."}
};

// ---------- Banque fixe de questions ----------
var QUIZ_BANK = (function(){
  // Cas A (5 ans, 40 users) — valeurs de référence
  var A = {total:101861.28, pc:10631.52, pre:105264, hausse:7368.48, inc:18000, old:94492.80};
  return [
  // 1 — Increase
  { cat:'Increase',
    q:{fr:"Un contrat passe le catalogue d'une licence de 448,80 à 538,80 €/user/an (1 user). Que vaut l'« Increase » ?",
       en:"A contract moves a licence catalog from 448.80 to 538.80 €/user/yr (1 user). What is the “Increase”?"},
    opts:[qzEUR(90), qzEUR(538.80), qzEUR(58.584), qzEUR(31.416)], a:0,
    hint:{fr:"Increase = nouveau catalogue − ancien catalogue, sur les lignes qui changent.",en:"Increase = new catalog − old catalog, on the lines that change."},
    explain:{fr:"Increase = 538,80 − 448,80 = 90,00 €. C'est la hausse brute du catalogue, uniquement sur les licences.",
             en:"Increase = 538.80 − 448.80 = 90.00 €. It is the gross catalog rise, on licences only."} },
  // 2 — PreTotal Rec+
  { cat:'PreTotal Rec+',
    q:{fr:"Que représente le « PreTotal Rec+ » ?",en:"What does “PreTotal Rec+” represent?"},
    opts:[
      {fr:"L'ancien contrat valorisé au prix catalogue, SANS remise (licences + maintenance + Odoo.sh)",en:"The old contract valued at catalog price, WITHOUT discount (licences + maintenance + Odoo.sh)"},
      {fr:"Le total réellement payé par le client",en:"The total actually paid by the client"},
      {fr:"La somme des remises accordées",en:"The sum of granted discounts"},
      {fr:"Le nouveau total après renouvellement",en:"The new total after renewal"} ], a:0,
    hint:{fr:"« Rec+ » = recurring au prix public, sans remise.",en:"“Rec+” = recurring at public price, no discount."},
    explain:{fr:"PreTotal Rec+ = assiette des 7 % : tout le récurrent au prix catalogue, remises exclues. Il inclut aussi la maintenance et Odoo.sh.",
             en:"PreTotal Rec+ is the 7% base: all recurring at catalog price, discounts excluded. It also includes maintenance and Odoo.sh."} },
  // 3 — Hausse autorisée
  { cat:'Hausse autorisée',
    q:{fr:"Comment calcule-t-on la « hausse autorisée » ?",en:"How is the “allowed increase” computed?"},
    opts:[
      {fr:"7 % × PreTotal Rec+",en:"7% × PreTotal Rec+"},
      {fr:"7 % × prix payé",en:"7% × paid price"},
      {fr:"7 % × Increase",en:"7% × Increase"},
      {fr:"7 % × nouveau catalogue",en:"7% × new catalog"} ], a:0,
    hint:{fr:"Les 7 % portent sur l'assiette catalogue, pas sur le prix remisé.",en:"The 7% apply to the catalog base, not the discounted price."},
    explain:{fr:"Hausse autorisée = 7 % × PreTotal Rec+. C'est ce que le client doit accepter au maximum.",
             en:"Allowed increase = 7% × PreTotal Rec+. It is the maximum the client must accept."} },
  // 4 — PC
  { cat:'Pricing Compensation',
    q:{fr:"Quelle est la formule de la ligne « Pricing Compensation » (PC) ?",en:"What is the formula of the “Pricing Compensation” (PC) line?"},
    opts:[
      {fr:"Increase − hausse autorisée (ligne négative)",en:"Increase − allowed increase (negative line)"},
      {fr:"Hausse autorisée − Increase",en:"Allowed increase − Increase"},
      {fr:"7 % × prix payé",en:"7% × paid price"},
      {fr:"Nouveau catalogue − ancien payé",en:"New catalog − old paid"} ], a:0,
    hint:{fr:"La PC absorbe l'excédent au-delà des 7 % autorisés.",en:"PC absorbs the excess beyond the allowed 7%."},
    explain:{fr:"PC = Increase − hausse autorisée, encodée en prix unitaire négatif. Ex. 90 − 31,416 = 58,584 → ligne −58,584 €.",
             en:"PC = Increase − allowed increase, encoded as a negative unit price. E.g. 90 − 31.416 = 58.584 → line −58.584 €."} },
  // 5 — Max compensation (à confirmer)
  { cat:'Max compensation',
    q:{fr:"Le plafond « Max compensation » indiqué par Odoobot est :",en:"The “Max compensation” cap shown by Odoobot is:"},
    opts:[
      {fr:"PC ≤ 93 % × Increase (comportement exact à confirmer)",en:"PC ≤ 93% × Increase (exact behavior to confirm)"},
      {fr:"PC ≤ 7 % × Increase",en:"PC ≤ 7% × Increase"},
      {fr:"PC ≤ 100 % × prix payé",en:"PC ≤ 100% × paid price"},
      {fr:"Il n'y a pas de plafond",en:"There is no cap"} ], a:0,
    hint:{fr:"Odoobot affiche « Max compensation : 93,00 % ».",en:"Odoobot shows “Max compensation: 93.00%”."},
    explain:{fr:"Max compensation = 93 % × Increase. ⚠️ Le comportement exact du plafond reste à confirmer — ne pas l'enseigner comme un fait.",
             en:"Max compensation = 93% × Increase. ⚠️ The exact cap behavior is to be confirmed — do not teach it as a fact."} },
  // 6 — Previous Compensation (à confirmer)
  { cat:'Previous Compensation',
    q:{fr:"Que faire de la « Previous Compensation » lors des renouvellements suivants ?",en:"What about “Previous Compensation” on subsequent renewals?"},
    opts:[
      {fr:"Comportement non confirmé → à vérifier au cas par cas",en:"Behavior not confirmed → check case by case"},
      {fr:"Toujours la supprimer",en:"Always remove it"},
      {fr:"Toujours l'additionner à la nouvelle PC",en:"Always add it to the new PC"},
      {fr:"La multiplier par 7 %",en:"Multiply it by 7%"} ], a:0,
    hint:{fr:"C'est un point explicitement NON confirmé.",en:"This is an explicitly UNCONFIRMED point."},
    explain:{fr:"Previous Compensation = PC déjà présente lors d'un renouvellement précédent. ⚠️ Son traitement exact n'est pas confirmé : à afficher comme « à confirmer ».",
             en:"Previous Compensation = PC already present at a prior renewal. ⚠️ Its exact handling is not confirmed: show it as “to confirm”."} },
  // 7 — MRR
  { cat:'MRR',
    q:{fr:"Le « MRR » affiché par Odoobot intervient-il dans le calcul de la PC ?",en:"Does the “MRR” shown by Odoobot take part in the PC calculation?"},
    opts:[
      {fr:"Non, c'est un simple affichage = total / nb de mois",en:"No, it is a simple display = total / number of months"},
      {fr:"Oui, c'est l'assiette des 7 %",en:"Yes, it is the 7% base"},
      {fr:"Oui, il remplace l'Increase",en:"Yes, it replaces the Increase"},
      {fr:"Oui, il plafonne la PC",en:"Yes, it caps the PC"} ], a:0,
    hint:{fr:"MRR = Monthly Recurring Revenue.",en:"MRR = Monthly Recurring Revenue."},
    explain:{fr:"MRR = total / nombre de mois du contrat. C'est un simple indicateur, il n'intervient pas dans le calcul. Ex. 37,40 → 40,02.",
             en:"MRR = total / number of contract months. It is a mere indicator, not part of the calculation. E.g. 37.40 → 40.02."} },
  // 8 — 7 % sur catalogue, pas payé (concept)
  { cat:'Concept',
    q:{fr:"Les 7 % plafonnent la hausse de quel montant ?",en:"The 7% cap the rise of which amount?"},
    opts:[
      {fr:"Du prix CATALOGUE (PreTotal Rec+)",en:"The CATALOG price (PreTotal Rec+)"},
      {fr:"Du prix payé (remisé)",en:"The paid (discounted) price"},
      {fr:"De l'Increase",en:"The Increase"},
      {fr:"Du MRR",en:"The MRR"} ], a:0,
    hint:{fr:"Regarde la formule de la hausse autorisée.",en:"Look at the allowed-increase formula."},
    explain:{fr:"Les 7 % portent sur le prix catalogue (PreTotal Rec+), pas sur le prix payé. Et au renouvellement la remise commerciale saute : un client remisé repasse au catalogue × 1,07, donc constate une hausse bien supérieure à 7 % sur son prix payé.",
             en:"The 7% apply to the catalog price (PreTotal Rec+), not the paid price. And at renewal the commercial discount is dropped: a discounted client goes back to catalog × 1.07, so sees a rise well above 7% on their paid price."} },
  // 9 — Odoo.sh / maintenance enlarge base
  { cat:'Concept',
    q:{fr:"Odoo.sh et la maintenance (prix inchangés) jouent quel rôle dans le calcul ?",en:"Odoo.sh and maintenance (unchanged prices): what role do they play?"},
    opts:[
      {fr:"Ils agrandissent l'assiette des 7 % (PreTotal Rec+)",en:"They enlarge the 7% base (PreTotal Rec+)"},
      {fr:"Ils augmentent l'Increase",en:"They increase the Increase"},
      {fr:"Ils n'ont aucun effet",en:"They have no effect"},
      {fr:"Ils réduisent la PC de 93 %",en:"They reduce the PC by 93%"} ], a:0,
    hint:{fr:"Leur prix ne change pas, mais ils comptent dans le PreTotal Rec+.",en:"Their price doesn't change, but they count in PreTotal Rec+."},
    explain:{fr:"Odoo.sh et la maintenance ne changent pas de prix (Increase inchangé) mais entrent dans le PreTotal Rec+, donc augmentent la hausse autorisée (7 % d'une assiette plus grande).",
             en:"Odoo.sh and maintenance don't change price (Increase unchanged) but are part of PreTotal Rec+, so they raise the allowed increase (7% of a bigger base)."} },
  // 10 — soit remise soit PC
  { cat:'Concept',
    q:{fr:"Au renouvellement, pour une remise COMMERCIALE, la règle est :",en:"At renewal, for a COMMERCIAL discount, the rule is:"},
    opts:[
      {fr:"Soit la remise, soit la Pricing Compensation — la remise n'est pas reconduite",en:"Either the discount or the Pricing Compensation — the discount is not carried over"},
      {fr:"On garde la remise ET on ajoute la PC",en:"Keep the discount AND add the PC"},
      {fr:"La remise augmente de 7 %",en:"The discount rises by 7%"},
      {fr:"La remise devient un pourcentage",en:"The discount becomes a percentage"} ], a:0,
    hint:{fr:"On ne cumule jamais remise et PC sur le même écart de prix.",en:"Discount and PC are never stacked on the same price gap."},
    explain:{fr:"Au renouvellement, c'est soit la remise, soit la PC : la remise commerciale saute, remplacée par la Pricing Compensation, et le client repart du catalogue × 1,07. (Le Multi Year Discount, rabais structurel, peut être reconduit avec le réengagement multi-annuel — cas particulier.)",
             en:"At renewal it's either the discount or the PC: the commercial discount is dropped, replaced by the Pricing Compensation, and the client restarts from catalog × 1.07. (The Multi Year Discount, a structural rebate, may be carried over with the multi-year re-commitment — special case.)"} },
  // 11 — Cas A total
  { cat:'Cas A',
    q:{fr:"Cas A (5 ans, 40 users). Ancien total payé 94 492,80 €, PreTotal Rec+ 105 264 €. Quel est le NOUVEAU total ?",
       en:"Case A (5 yrs, 40 users). Old paid total 94,492.80 €, PreTotal Rec+ 105,264 €. What is the NEW total?"},
    opts:[qzEUR(A.total), qzEUR(105264*1.07), qzEUR(112492.80), qzEUR(94492.80*1.07)], a:0,
    hint:{fr:"Ici le Multi Year Discount est reconduit → ancien payé + 7 % × PreTotal Rec+.",en:"Here the Multi Year Discount is carried over → old paid + 7% × PreTotal Rec+."},
    explain:{fr:"Cas multi-annuel : le Multi Year Discount (rabais structurel) est reconduit. 7 % × 105 264 = 7 368,48. Nouveau total = 94 492,80 + 7 368,48 = 101 861,28 € (+7,80 % sur le payé). ⚠️ Pour une remise COMMERCIALE (non reconduite), on partirait du catalogue × 1,07 (112 632,48 €).",
             en:"Multi-year case: the Multi Year Discount (structural rebate) is carried over. 7% × 105,264 = 7,368.48. New total = 94,492.80 + 7,368.48 = 101,861.28 € (+7.80% on paid). ⚠️ For a COMMERCIAL discount (not carried over), you'd start from catalog × 1.07 (112,632.48 €)."} },
  // 12 — Cas A PC
  { cat:'Cas A',
    q:{fr:"Cas A : Increase 18 000 €, hausse autorisée 7 368,48 €. Que vaut la ligne Pricing Compensation ?",
       en:"Case A: Increase 18,000 €, allowed increase 7,368.48 €. What is the Pricing Compensation line?"},
    opts:[qzEUR(-A.pc), qzEUR(-7368.48), qzEUR(-18000), qzEUR(-16740)], a:0,
    hint:{fr:"PC = Increase − hausse autorisée (en négatif).",en:"PC = Increase − allowed increase (negative)."},
    explain:{fr:"PC = 18 000 − 7 368,48 = 10 631,52 → ligne −10 631,52 €. (Max compensation = 93 % × 18 000 = 16 740 € : non atteint.)",
             en:"PC = 18,000 − 7,368.48 = 10,631.52 → line −10,631.52 €. (Max compensation = 93% × 18,000 = 16,740 €: not reached.)"} },
  // 13 — Cas B PC
  { cat:'Cas B',
    q:{fr:"Cas B (annuel, 1 user, sans remise). Ancien 448,80 €, nouveau catalogue 538,80 €. Montant de la ligne PC ?",
       en:"Case B (annual, 1 user, no discount). Old 448.80 €, new catalog 538.80 €. PC line amount?"},
    opts:[qzEUR(-58.584), qzEUR(-90), qzEUR(-31.416), qzEUR(-28.084)], a:0,
    hint:{fr:"Increase 90 ; hausse autorisée 7 % × 448,80.",en:"Increase 90; allowed increase 7% × 448.80."},
    explain:{fr:"Hausse autorisée = 7 % × 448,80 = 31,416. PC = 90 − 31,416 = 58,584 → ligne −58,584 € (arrondi −58,58 € sur le devis). Nouveau total 480,22 € (+7,00 %).",
             en:"Allowed increase = 7% × 448.80 = 31.416. PC = 90 − 31.416 = 58.584 → line −58.584 € (−58.58 € on the quote). New total 480.22 € (+7.00%)."} },
  // 14 — Cas C : remise commerciale non reconduite
  { cat:'Cas C',
    q:{fr:"Cas C : catalogue 1 000 → 1 200 €. Le client a une remise fixe de 200 € (il paie 800 €). Au renouvellement, quel est le nouveau total ?",
       en:"Case C: catalog 1,000 → 1,200 €. The client has a 200 € fixed discount (pays 800 €). At renewal, what is the new total?"},
    opts:[
      {fr:"1 070,00 € (= 1 000 × 1,07, la remise saute)",en:"1,070.00 € (= 1,000 × 1.07, discount dropped)"},
      {fr:"870,00 € (on garde la remise : 800 + 70)",en:"870.00 € (keep the discount: 800 + 70)"},
      {fr:"856,00 € (7 % sur le prix payé)",en:"856.00 € (7% on the paid price)"},
      {fr:"1 284,00 € (1 200 × 1,07)",en:"1,284.00 € (1,200 × 1.07)"} ], a:0,
    hint:{fr:"La remise commerciale n'est pas reconduite : soit la remise, soit la PC.",en:"The commercial discount is not carried over: either the discount or the PC."},
    explain:{fr:"PC = Increase 200 − hausse autorisée 70 = 130 → ligne −130. Nouveau total = 1 200 − 130 = 1 070 € (= 1 000 × 1,07). La remise de 200 € saute : le client passe de 800 à 1 070 €. Garder la remise (870 €) serait l'erreur « remise + PC ».",
             en:"PC = Increase 200 − allowed increase 70 = 130 → line −130. New total = 1,200 − 130 = 1,070 € (= 1,000 × 1.07). The 200 € discount is dropped: the client moves from 800 to 1,070 €. Keeping the discount (870 €) would be the “discount + PC” mistake."} },
  // 15 — raccourci
  { cat:'Raccourci',
    q:{fr:"Pour un client avec une remise COMMERCIALE, le raccourci du nouveau total au renouvellement est :",en:"For a client with a COMMERCIAL discount, the shortcut for the new total at renewal is:"},
    opts:[
      {fr:"Ancien catalogue × 1,07 (= nouveau catalogue − PC)",en:"Old catalog × 1.07 (= new catalog − PC)"},
      {fr:"Ancien payé × 1,07",en:"Old paid × 1.07"},
      {fr:"Nouveau catalogue × 1,07",en:"New catalog × 1.07"},
      {fr:"Ancien payé + 7 % × PreTotal Rec+",en:"Old paid + 7% × PreTotal Rec+"} ], a:0,
    hint:{fr:"La remise saute → on repart du catalogue.",en:"The discount is dropped → start from the catalog."},
    explain:{fr:"Nouveau total = nouveau catalogue − PC = PreTotal Rec+ × 1,07 = ancien catalogue × 1,07 (la remise commerciale n'est pas reconduite). « Ancien payé + 7 % × PreTotal » ne vaut que si la remise est reconduite (ex. Multi Year Discount).",
             en:"New total = new catalog − PC = PreTotal Rec+ × 1.07 = old catalog × 1.07 (the commercial discount is not carried over). “Old paid + 7% × PreTotal” only holds if the discount is carried over (e.g. Multi Year Discount)."} }
  ];
})();

// ---------- Générateur d'exercices chiffrés ----------
function qzGenExercise(){
  var users = Math.random()<0.55 ? 1 : qzRand(2,40,1);
  var oldCat = qzRand(300,1200,10);
  var delta = qzRand(70,280,10);
  if(delta < oldCat*0.08) delta = Math.ceil(oldCat*0.08/10)*10;
  var newCat = oldCat + delta;
  var field = Math.random()<0.6 ? 'total' : 'pc';
  // remise actuelle du client (contexte / piège) : non reconduite au renouvellement
  var discount = Math.round(oldCat*users*qzRand(10,25,1)/100);
  var m = qzCompute(oldCat,newCat,users,0);
  var ancienPaye = oldCat*users - discount; // ce que le client paie aujourd'hui, avec sa remise

  var correct, cands, qTxt;
  var ctx = {fr:"Contrat annuel — "+users+" user"+(users>1?"s":"")+", ancien catalogue "+qzEUR(oldCat)+"/user, nouveau catalogue "+qzEUR(newCat)+"/user. Le client bénéficie aujourd'hui d'une remise fixe de "+qzEUR(discount)+" (prix payé "+qzEUR(ancienPaye)+").",
             en:"Annual contract — "+users+" user"+(users>1?"s":"")+", old catalog "+qzEUR(oldCat)+"/user, new catalog "+qzEUR(newCat)+"/user. The client currently has a fixed discount of "+qzEUR(discount)+" (paid price "+qzEUR(ancienPaye)+")."};
  if(field==='total'){
    correct = m.nouveauTotal; // = catalogue × 1,07, remise non reconduite
    cands = [
      {v:ancienPaye+m.hausse, err:QZ_ERR.keptDisc},         // a gardé la remise en plus de la PC
      {v:ancienPaye*1.07, err:QZ_ERR.paid},                  // 7 % sur le prix payé
      {v:m.preTotal+0.07*m.increase, err:QZ_ERR.increase},   // 7 % sur l'Increase
      {v:m.newCatTotal*1.07, err:QZ_ERR.newcat}              // nouveau catalogue × 1,07
    ];
    qTxt = {fr:ctx.fr+" Au renouvellement, quel est le NOUVEAU total ?", en:ctx.en+" At renewal, what is the NEW total?"};
  } else {
    correct = m.pcMag;
    cands = [
      {v:0.07*m.preTotal, err:QZ_ERR.gaveAllow},
      {v:0.93*m.increase, err:QZ_ERR.increase},
      {v:m.increase-0.07*ancienPaye, err:QZ_ERR.paid},
      {v:m.increase, err:QZ_ERR.noAllow}
    ];
    qTxt = {fr:ctx.fr+" Quel est le montant (valeur absolue) de la ligne Pricing Compensation ?",
            en:ctx.en+" What is the (absolute) amount of the Pricing Compensation line?"};
  }

  // options : correct + 3 distracteurs uniques
  var cr = qzR2(correct);
  var seen = {}; seen[cr.toFixed(2)] = true;
  var distract = [];
  qzShuffle(cands).forEach(function(c){
    var v = qzR2(c.v); var key=v.toFixed(2);
    if(!seen[key] && distract.length<3){ seen[key]=true; distract.push({v:v, err:c.err}); }
  });
  while(distract.length<3){ // garde-fou (rare)
    var v = qzR2(cr*(1+(Math.random()*0.1-0.05))); var key=v.toFixed(2);
    if(!seen[key]){ seen[key]=true; distract.push({v:v, err:{fr:"Valeur erronée.",en:"Wrong value."}}); }
  }
  var options = qzShuffle([{v:cr, err:null}].concat(distract)).map(function(o){
    return { text:qzEUR(o.v), correct:o.err===null, err:o.err };
  });

  var core = {
    fr:"Au renouvellement, la remise commerciale saute (soit la remise, soit la PC). PreTotal Rec+ = "+qzEUR(m.preTotal)+" • Increase = "+qzEUR(m.increase)+" • Hausse autorisée (7 %) = "+qzEUR(m.hausse)
      +" • PC = "+qzEUR(-m.pcMag)+" • Nouveau total = nouveau catalogue "+qzEUR(m.newCatTotal)+" − "+qzEUR(m.pcMag)+" = "+qzEUR(m.nouveauTotal)+" (= ancien catalogue × 1,07). Le client passe de "+qzEUR(ancienPaye)+" à "+qzEUR(m.nouveauTotal)+".",
    en:"At renewal the commercial discount is dropped (either the discount or the PC). PreTotal Rec+ = "+qzEUR(m.preTotal)+" • Increase = "+qzEUR(m.increase)+" • Allowed increase (7%) = "+qzEUR(m.hausse)
      +" • PC = "+qzEUR(-m.pcMag)+" • New total = new catalog "+qzEUR(m.newCatTotal)+" − "+qzEUR(m.pcMag)+" = "+qzEUR(m.nouveauTotal)+" (= old catalog × 1.07). The client moves from "+qzEUR(ancienPaye)+" to "+qzEUR(m.nouveauTotal)+"."
  };
  return {
    prompt:qTxt, options:options,
    hint:{fr:"La remise n'est pas reconduite : on part du nouveau catalogue et on applique la PC (7 % sur le PreTotal Rec+, pas sur le prix payé).",
          en:"The discount is not carried over: start from the new catalog and apply the PC (7% on PreTotal Rec+, not on the paid price)."},
    explain:core, generated:true
  };
}

// ---------- Normalisation banque → question ----------
function qzBankToQuestion(b){
  var opts = b.opts.map(function(o,i){ return { raw:o, correct:i===b.a }; });
  opts = qzShuffle(opts).map(function(o){ return { text:o.raw, correct:o.correct, err:null }; });
  return { prompt:b.q, options:opts, hint:b.hint, explain:b.explain, cat:b.cat };
}

// ---------- État ----------
function quizInitState(){
  return {
    tab:'quiz',
    fiche:{ order:[], idx:0, flipped:false },
    quiz:{ questions:[], idx:0, score:0, answered:false, chosen:-1, finished:false, showHint:false },
    gen:{ ex:null, chosen:-1, answered:false, showHint:false, done:0, good:0 }
  };
}
var quizState = quizInitState();

function qzText(x){ return (x==null)?'' : (typeof x==='string'? x : (x[lang]||x.fr||'')); }

// ---------- Construction des sessions ----------
function qzBuildQuizSession(){
  var qs = qzShuffle(QUIZ_BANK).map(qzBankToQuestion);
  var gen = [];
  for(var i=0;i<5;i++) gen.push(qzGenExercise());
  quizState.quiz = { questions:qzShuffle(qs.concat(gen)), idx:0, score:0, answered:false, chosen:-1, finished:false, showHint:false };
}
function qzBuildFiches(){
  quizState.fiche = { order:qzShuffle(QUIZ_BANK.map(function(_,i){return i;})), idx:0, flipped:false };
}

// ---------- Styles ----------
(function(){
  if(document.getElementById('qz-style')) return;
  var css = ''
   +'.qz-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}'
   +'.qz-tab{flex:1;min-width:120px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.14);border-radius:10px;padding:11px 10px;color:rgba(255,255,255,0.8);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:7px;}'
   +'.qz-tab:hover{border-color:rgba(171,122,159,0.7);background:rgba(113,75,103,0.25);}'
   +'.qz-tab.active{border-color:#714B67;background:rgba(113,75,103,0.4);color:#fff;box-shadow:0 0 0 1px #714B67;}'
   +'.qz-card{background:linear-gradient(160deg,rgba(32,26,49,0.62),rgba(13,10,26,0.72));backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 14px 40px -14px rgba(0,0,0,0.55);padding:22px;}'
   +'.qz-meta{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;font-family:"Space Mono",monospace;}'
   +'.qz-badge{display:inline-block;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#c9a0ff;background:rgba(160,120,180,0.16);border:1px solid rgba(160,120,180,0.35);border-radius:20px;padding:3px 10px;}'
   +'.qz-q{font-size:16px;line-height:1.5;color:#fff;font-weight:600;margin-bottom:16px;}'
   +'.qz-opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.14);border-radius:10px;padding:13px 15px;margin-bottom:9px;color:rgba(255,255,255,0.9);font-family:inherit;font-size:13.5px;cursor:pointer;transition:all .15s;}'
   +'.qz-opt:hover:not(:disabled){border-color:rgba(171,122,159,0.75);background:rgba(113,75,103,0.25);}'
   +'.qz-opt:disabled{cursor:default;}'
   +'.qz-opt.correct{border-color:#00C896;background:rgba(0,180,140,0.18);color:#9ff5d8;}'
   +'.qz-opt.wrong{border-color:#e8553d;background:rgba(232,85,61,0.16);color:#ffb4a3;}'
   +'.qz-opt .qz-mark{float:right;font-weight:800;}'
   +'.qz-fb{margin-top:14px;border-radius:10px;padding:13px 15px;font-size:13px;line-height:1.6;}'
   +'.qz-fb.ok{background:rgba(0,180,140,0.12);border:1px solid rgba(0,200,150,0.35);color:rgba(255,255,255,0.88);}'
   +'.qz-fb.ko{background:rgba(232,85,61,0.12);border:1px solid rgba(232,85,61,0.4);color:rgba(255,255,255,0.88);}'
   +'.qz-hint{margin-top:12px;background:rgba(255,209,102,0.1);border:1px solid rgba(255,209,102,0.3);border-radius:10px;padding:11px 14px;font-size:12.5px;color:rgba(255,255,255,0.8);line-height:1.5;}'
   +'.qz-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;}'
   +'.qz-btn{background:linear-gradient(135deg,#714B67,#5a3b52);border:none;border-radius:10px;padding:11px 20px;color:#fff;font-family:inherit;font-size:13.5px;font-weight:600;cursor:pointer;transition:transform .12s,box-shadow .12s;box-shadow:0 2px 10px rgba(113,75,103,0.4);}'
   +'.qz-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(113,75,103,0.55);}'
   +'.qz-btn.ghost{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.18);box-shadow:none;color:rgba(255,255,255,0.85);}'
   +'.qz-btn.teal{background:linear-gradient(135deg,var(--teal),var(--teal-dark));box-shadow:0 2px 10px rgba(0,160,157,0.4);}'
   +'.qz-progress{height:6px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden;margin-bottom:16px;}'
   +'.qz-progress>div{height:100%;background:linear-gradient(90deg,#714B67,#00C896);transition:width .3s;}'
   +'.qz-flip{cursor:pointer;animation:qzflip .45s ease;}'
   +'@keyframes qzflip{0%{transform:rotateY(0) scale(1);}45%{transform:rotateY(90deg) scale(0.98);}55%{transform:rotateY(90deg) scale(0.98);}100%{transform:rotateY(0) scale(1);}}'
   +'.qz-flip-tag{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:10px;font-family:"Space Mono",monospace;}'
   +'.qz-score{text-align:center;padding:12px 0;}'
   +'.qz-score-n{font-family:"Fraunces",serif;font-size:46px;font-weight:600;color:#fff;}'
   +'.qz-memo-table{width:100%;border-collapse:collapse;font-size:12.5px;margin:10px 0 4px;}'
   +'.qz-memo-table th,.qz-memo-table td{text-align:left;padding:9px 10px;border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top;color:rgba(255,255,255,0.82);}'
   +'.qz-memo-table th{color:rgba(255,255,255,0.55);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;}'
   +'.qz-memo-table code{background:rgba(255,255,255,0.08);padding:1px 6px;border-radius:4px;color:#9ff5d8;font-size:11.5px;}'
   +'.qz-confirm{background:rgba(255,180,0,0.1);border:1px solid rgba(255,180,0,0.35);border-radius:10px;padding:12px 15px;font-size:12.5px;color:rgba(255,255,255,0.82);line-height:1.6;margin:14px 0;}'
   +'.qz-ex-img{width:100%;max-width:560px;display:block;margin:10px auto;border-radius:10px;border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 24px rgba(0,0,0,0.4);}'
   +'.qz-kpts li{margin-bottom:7px;line-height:1.55;}';
  var s=document.createElement('style'); s.id='qz-style'; s.textContent=css; document.head.appendChild(s);
})();

// ---------- Rendu : coquille + onglets ----------
function renderQuizView(){
  var c=el('quiz-content'); if(!c) return;
  var isFR=lang==='fr';
  var tabs=[['fiches',isFR?'🃏 Fiches':'🃏 Flashcards'],['quiz',isFR?'❓ Quiz':'❓ Quiz'],
            ['gen',isFR?'🎲 Générateur':'🎲 Generator'],['memo',isFR?'📋 Mémo':'📋 Memo']];
  var h='<div class="qz-tabs">';
  tabs.forEach(function(t){ h+='<button class="qz-tab'+(quizState.tab===t[0]?' active':'')+'" onclick="quizSetTab(\''+t[0]+'\')">'+t[1]+'</button>'; });
  h+='</div><div id="quiz-body"></div>';
  c.innerHTML=h;
  renderQuizBody();
}
function quizSetTab(t){ quizState.tab=t; renderQuizView(); }
function renderQuizBody(){
  if(quizState.tab==='fiches') return renderQuizFiches();
  if(quizState.tab==='quiz')   return renderQuizQuiz();
  if(quizState.tab==='gen')    return renderQuizGen();
  if(quizState.tab==='memo')   return renderQuizMemo();
}

function qzOptionsHTML(q, answered, chosen, onclickName){
  var h='';
  q.options.forEach(function(o,i){
    var cls='qz-opt', mark='';
    if(answered){
      if(o.correct){ cls+=' correct'; mark='<span class="qz-mark">✓</span>'; }
      else if(i===chosen){ cls+=' wrong'; mark='<span class="qz-mark">✕</span>'; }
    }
    h+='<button class="'+cls+'" '+(answered?'disabled':'')+' onclick="'+onclickName+'('+i+')">'+mark+qzText(o.text)+'</button>';
  });
  return h;
}
function qzFeedbackHTML(q, chosen){
  var isFR=lang==='fr';
  var good = q.options[chosen] && q.options[chosen].correct;
  var h='<div class="qz-fb '+(good?'ok':'ko')+'">';
  h+='<strong>'+(good?(isFR?'✅ Correct !':'✅ Correct!'):(isFR?'❌ Pas tout à fait.':'❌ Not quite.'))+'</strong> ';
  if(!good && q.options[chosen] && q.options[chosen].err){ h+=(isFR?'Erreur : ':'Error: ')+qzText(q.options[chosen].err)+'<br>'; }
  h+='<span style="opacity:.92;">'+qzText(q.explain)+'</span></div>';
  return h;
}

// ---------- Onglet QUIZ ----------
function renderQuizQuiz(){
  var isFR=lang==='fr'; var S=quizState.quiz; var body=el('quiz-body'); if(!body) return;
  if(!S.questions.length){ qzBuildQuizSession(); S=quizState.quiz; }
  if(S.finished){
    var pct=Math.round(S.score/S.questions.length*100);
    body.innerHTML='<div class="qz-card"><div class="qz-score">'
      +'<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:4px;">'+(isFR?'Score final':'Final score')+'</div>'
      +'<div class="qz-score-n">'+S.score+' / '+S.questions.length+'</div>'
      +'<div style="font-size:14px;color:'+(pct>=70?'#00E8B0':pct>=40?'#FFD166':'#ff9080')+';font-weight:600;margin-top:4px;">'+pct+' %</div>'
      +'<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:10px;">'+(pct>=70?(isFR?'Solide 💪':'Solid 💪'):pct>=40?(isFR?'À revoir un peu.':'Keep practicing.'):(isFR?'Repasse par les Fiches 🃏':'Review the Flashcards 🃏'))+'</div>'
      +'<div class="qz-actions" style="justify-content:center;"><button class="qz-btn teal" onclick="quizRestart()">'+(isFR?'🔁 Recommencer (ordre aléatoire)':'🔁 Restart (random order)')+'</button></div>'
      +'</div></div>';
    return;
  }
  var q=S.questions[S.idx];
  var h='<div class="qz-card">';
  h+='<div class="qz-progress"><div style="width:'+((S.idx/S.questions.length)*100)+'%"></div></div>';
  h+='<div class="qz-meta"><span>'+(isFR?'Question ':'Question ')+(S.idx+1)+' / '+S.questions.length+'</span><span>'+(isFR?'Score ':'Score ')+S.score+'</span></div>';
  if(q.cat) h+='<div style="margin-bottom:10px;"><span class="qz-badge">'+q.cat+'</span>'+(q.generated?' <span class="qz-badge" style="color:#9ff5d8;background:rgba(0,180,140,0.14);border-color:rgba(0,200,150,0.35);">'+(isFR?'généré':'generated')+'</span>':'')+'</div>';
  else if(q.generated) h+='<div style="margin-bottom:10px;"><span class="qz-badge" style="color:#9ff5d8;background:rgba(0,180,140,0.14);border-color:rgba(0,200,150,0.35);">'+(isFR?'exercice généré':'generated exercise')+'</span></div>';
  h+='<div class="qz-q">'+qzText(q.prompt)+'</div>';
  h+=qzOptionsHTML(q, S.answered, S.chosen, 'quizAnswer');
  if(S.answered){ h+=qzFeedbackHTML(q, S.chosen); }
  else if(S.showHint){ h+='<div class="qz-hint">💡 '+qzText(q.hint)+'</div>'; }
  h+='<div class="qz-actions">';
  if(!S.answered){ h+='<button class="qz-btn ghost" onclick="quizHint()">💡 '+(isFR?'Indice':'Hint')+'</button>'; }
  if(S.answered){ h+='<button class="qz-btn" onclick="quizNext()">'+(S.idx+1<S.questions.length?(isFR?'Suivant →':'Next →'):(isFR?'Voir le score':'See score'))+'</button>'; }
  h+='</div></div>';
  body.innerHTML=h;
}
function quizAnswer(i){ var S=quizState.quiz; if(S.answered) return; S.chosen=i; S.answered=true; if(S.questions[S.idx].options[i].correct) S.score++; renderQuizQuiz(); }
function quizHint(){ quizState.quiz.showHint=true; renderQuizQuiz(); }
function quizNext(){ var S=quizState.quiz; if(S.idx+1<S.questions.length){ S.idx++; S.answered=false; S.chosen=-1; S.showHint=false; } else { S.finished=true; } renderQuizQuiz(); }
function quizRestart(){ qzBuildQuizSession(); renderQuizQuiz(); }

// ---------- Onglet FICHES ----------
function renderQuizFiches(){
  var isFR=lang==='fr'; var F=quizState.fiche; var body=el('quiz-body'); if(!body) return;
  if(!F.order.length) qzBuildFiches();
  var b=QUIZ_BANK[F.order[F.idx]];
  var correctOpt=b.opts[b.a];
  var h='<div class="qz-card qz-flip" onclick="quizFlip()">';
  if(!F.flipped){
    h+='<div class="qz-flip-tag">'+(isFR?'Question — cliquez pour retourner':'Question — click to flip')+'</div>';
    if(b.cat) h+='<div style="margin-bottom:12px;"><span class="qz-badge">'+b.cat+'</span></div>';
    h+='<div class="qz-q" style="margin-bottom:0;">'+qzText(b.q)+'</div>';
  } else {
    h+='<div class="qz-flip-tag">'+(isFR?'Réponse':'Answer')+'</div>';
    h+='<div style="font-size:15px;font-weight:700;color:#9ff5d8;margin-bottom:12px;">✓ '+qzText(correctOpt)+'</div>';
    h+='<div style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.82);">'+qzText(b.explain)+'</div>';
  }
  h+='</div>';
  h+='<div class="qz-meta" style="margin-top:14px;"><span>'+(F.idx+1)+' / '+F.order.length+'</span><span>'+(isFR?'🃏 Fiches':'🃏 Flashcards')+'</span></div>';
  h+='<div class="qz-actions"><button class="qz-btn ghost" onclick="quizFichePrev()">← '+(isFR?'Précédent':'Previous')+'</button>'
    +'<button class="qz-btn" onclick="quizFicheNext()">'+(isFR?'Suivant':'Next')+' →</button>'
    +'<button class="qz-btn ghost" onclick="quizFicheShuffle()">🔀 '+(isFR?'Mélanger':'Shuffle')+'</button></div>';
  body.innerHTML=h;
}
function quizFlip(){ quizState.fiche.flipped=!quizState.fiche.flipped; renderQuizFiches(); }
function quizFicheNext(){ var F=quizState.fiche; F.idx=(F.idx+1)%F.order.length; F.flipped=false; renderQuizFiches(); }
function quizFichePrev(){ var F=quizState.fiche; F.idx=(F.idx-1+F.order.length)%F.order.length; F.flipped=false; renderQuizFiches(); }
function quizFicheShuffle(){ qzBuildFiches(); renderQuizFiches(); }

// ---------- Onglet GÉNÉRATEUR ----------
function renderQuizGen(){
  var isFR=lang==='fr'; var G=quizState.gen; var body=el('quiz-body'); if(!body) return;
  if(!G.ex) G.ex=qzGenExercise();
  var q=G.ex;
  var h='<div class="qz-card">';
  h+='<div class="qz-meta"><span>'+(isFR?'Entraînement illimité':'Unlimited practice')+'</span><span>'+(isFR?'Réussis ':'Correct ')+G.good+' / '+G.done+'</span></div>';
  h+='<div class="qz-q">'+qzText(q.prompt)+'</div>';
  h+=qzOptionsHTML(q, G.answered, G.chosen, 'genAnswer');
  if(G.answered){ h+=qzFeedbackHTML(q, G.chosen); }
  else if(G.showHint){ h+='<div class="qz-hint">💡 '+qzText(q.hint)+'</div>'; }
  h+='<div class="qz-actions">';
  if(!G.answered) h+='<button class="qz-btn ghost" onclick="genHint()">💡 '+(isFR?'Indice':'Hint')+'</button>';
  h+='<button class="qz-btn teal" onclick="genNew()">🎲 '+(isFR?'Nouvel exercice':'New exercise')+'</button>';
  h+='</div></div>';
  body.innerHTML=h;
}
function genAnswer(i){ var G=quizState.gen; if(G.answered) return; G.chosen=i; G.answered=true; G.done++; if(G.ex.options[i].correct) G.good++; renderQuizGen(); }
function genHint(){ quizState.gen.showHint=true; renderQuizGen(); }
function genNew(){ var G=quizState.gen; G.ex=qzGenExercise(); G.chosen=-1; G.answered=false; G.showHint=false; renderQuizGen(); }

// ---------- Onglet MÉMO ----------
function renderQuizMemo(){
  var isFR=lang==='fr'; var body=el('quiz-body'); if(!body) return;
  var rows = isFR ? [
    ['Increase',"Hausse brute du catalogue, uniquement sur les lignes qui changent (licences).","nouveau prix catalogue − ancien prix catalogue"],
    ['PreTotal Rec+',"Ancien contrat valorisé au prix catalogue, SANS remise (licences + maintenance + Odoo.sh).","somme des lignes au prix public"],
    ['Hausse autorisée',"Ce que le client doit accepter.","7 % × PreTotal Rec+"],
    ['Pricing Compensation (PC)',"Ligne négative qui absorbe l'excédent.","Increase − hausse autorisée"],
    ['Max compensation',"Plafond de la PC.","PC ≤ 93 % × Increase"],
    ['Previous Compensation',"PC déjà présente lors d'un renouvellement précédent.","—"],
    ['MRR',"Simple affichage, n'intervient pas dans le calcul.","total / nombre de mois"]
  ] : [
    ['Increase',"Gross catalog rise, only on the lines that change (licences).","new catalog price − old catalog price"],
    ['PreTotal Rec+',"Old contract valued at catalog price, WITHOUT discount (licences + maintenance + Odoo.sh).","sum of lines at public price"],
    ['Allowed increase',"What the client must accept.","7% × PreTotal Rec+"],
    ['Pricing Compensation (PC)',"Negative line absorbing the excess.","Increase − allowed increase"],
    ['Max compensation',"Cap of the PC.","PC ≤ 93% × Increase"],
    ['Previous Compensation',"PC already present at a prior renewal.","—"],
    ['MRR',"Display only, not part of the calculation.","total / number of months"]
  ];
  var h='<div class="qz-card">';
  h+='<div class="qz-flip-tag">'+(isFR?'Contexte':'Context')+'</div>';
  h+='<p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.8);margin:0 0 6px;">'+(isFR
    ?"Le prix public a augmenté d'environ 20 % en septembre 2026 (Custom Plan : <strong>448,80 → 538,80 €/user/an</strong>). Les clients ayant signé <strong>avant décembre 2025</strong> ont une clause qui plafonne la hausse au renouvellement à <strong style=\"color:#FFD166;\">7 %</strong>."
    :"The public price rose ~20% in September 2026 (Custom Plan: <strong>448.80 → 538.80 €/user/yr</strong>). Clients who signed <strong>before December 2025</strong> have a clause capping the renewal rise at <strong style=\"color:#FFD166;\">7%</strong>.")+'</p>';
  h+='<div class="qz-flip-tag" style="margin-top:16px;">'+(isFR?'Champs affichés par Odoobot':'Fields shown by Odoobot')+'</div>';
  h+='<table class="qz-memo-table"><thead><tr><th>'+(isFR?'Champ':'Field')+'</th><th>'+(isFR?'Définition':'Definition')+'</th><th>'+(isFR?'Formule':'Formula')+'</th></tr></thead><tbody>';
  rows.forEach(function(r){ h+='<tr><td><strong style="color:#fff;">'+r[0]+'</strong></td><td>'+r[1]+'</td><td><code>'+r[2]+'</code></td></tr>'; });
  h+='</tbody></table>';
  // Raccourci
  h+='<div style="margin-top:12px;background:rgba(0,160,157,0.1);border:1px solid rgba(0,200,150,0.3);border-radius:10px;padding:12px 15px;font-size:12.5px;color:rgba(255,255,255,0.85);line-height:1.6;">'
    +'⚡ <strong>'+(isFR?'Raccourci :':'Shortcut:')+'</strong> '+(isFR?'nouveau total = nouveau catalogue − PC = PreTotal Rec+ × 1,07 (= ancien catalogue × 1,07). Au renouvellement, la remise commerciale n\'est pas reconduite : soit la remise, soit la PC.':'new total = new catalog − PC = PreTotal Rec+ × 1.07 (= old catalog × 1.07). At renewal the commercial discount is not carried over: either the discount or the PC.')+'</div>';
  // Points clés
  h+='<div class="qz-flip-tag" style="margin-top:18px;">'+(isFR?'Points clés':'Key points')+'</div>';
  var kp = isFR ? [
    "Les 7 % plafonnent la hausse du prix <strong>catalogue</strong> (PreTotal Rec+), pas du prix payé.",
    "Au renouvellement, la remise commerciale <strong>saute</strong> : soit la remise, soit la Pricing Compensation (jamais les deux). Un client remisé repasse au <strong>catalogue × 1,07</strong>.",
    "Odoo.sh et la maintenance ne changent pas de prix : ils <strong>agrandissent l'assiette</strong> des 7 %.",
    "Le <strong>Multi Year Discount</strong> (rabais structurel) peut être reconduit avec le réengagement multi-annuel — distinct d'une remise commerciale.",
    "Le plafond 93 % et la Previous Compensation lors des renouvellements suivants sont <strong>à confirmer</strong>."
  ] : [
    "The 7% cap the rise of the <strong>catalog</strong> price (PreTotal Rec+), not the paid price.",
    "At renewal the commercial discount is <strong>dropped</strong>: either the discount or the Pricing Compensation (never both). A discounted client goes back to <strong>catalog × 1.07</strong>.",
    "Odoo.sh and maintenance don’t change price: they <strong>enlarge the 7% base</strong>.",
    "The <strong>Multi Year Discount</strong> (structural rebate) may be carried over with the multi-year re-commitment — distinct from a commercial discount.",
    "The 93% cap and Previous Compensation on subsequent renewals are <strong>to confirm</strong>."
  ];
  h+='<ul class="qz-kpts" style="font-size:12.5px;color:rgba(255,255,255,0.82);padding-left:20px;margin:8px 0 0;">';
  kp.forEach(function(k){ h+='<li>'+k+'</li>'; });
  h+='</ul>';
  // À confirmer
  h+='<div class="qz-confirm">⚠️ <strong>'+(isFR?'À confirmer (non enseigné comme un fait) :':'To confirm (not taught as fact):')+'</strong> '
    +(isFR?"le comportement exact du plafond de 93 % et de la Previous Compensation lors des renouvellements suivants."
          :"the exact behavior of the 93% cap and of Previous Compensation on subsequent renewals.")+'</div>';
  h+='</div>';

  // Exemple concret — Cas B avec images
  h+='<div class="qz-card" style="margin-top:16px;">';
  h+='<div class="qz-flip-tag">'+(isFR?'Exemple concret — Cas B (annuel, 1 user, sans remise)':'Worked example — Case B (annual, 1 user, no discount)')+'</div>';
  h+='<p style="font-size:13px;line-height:1.7;color:rgba(255,255,255,0.84);margin:4px 0 10px;">'
    +'1. Increase = 538,80 − 448,80 = <strong>'+qzEUR(90)+'</strong><br>'
    +'2. PreTotal Rec+ = <strong>'+qzEUR(448.80)+'</strong>'+(isFR?' (1 user, pas d\'extras, sans remise)':' (1 user, no extras, no discount)')+'<br>'
    +'3. '+(isFR?'Hausse autorisée':'Allowed increase')+' = 7 % × 448,80 = <strong>'+qzEUR(31.416)+'</strong><br>'
    +'4. PC = 90 − 31,416 = 58,584 → '+(isFR?'ligne':'line')+' <strong style="color:#FFD166;">−58,584 €</strong> ('+(isFR?'arrondi':'rounded')+' −58,58 €)<br>'
    +'5. '+(isFR?'Nouveau total':'New total')+' = 448,80 + 31,416 = <strong style="color:#00E8B0;">'+qzEUR(480.216)+'</strong> ('+qzPct(7)+')<br>'
    +'6. MRR = 448,80/12 → 480,22/12 = <strong>37,40 → 40,02</strong></p>';
  h+='<img class="qz-ex-img" src="images/pc-example-odoobot.png" alt="Odoobot — New Pricing 2026" loading="lazy">';
  h+='<img class="qz-ex-img" src="images/pc-example-quote.png" alt="Devis — Custom Plan 538,80 / Pricing Compensation −58,584 / Total 480,22" loading="lazy">';
  h+='<p style="font-size:11.5px;color:rgba(255,255,255,0.5);text-align:center;margin:6px 0 0;">'+(isFR?'Message Odoobot et lignes du devis correspondant au Cas B.':'Odoobot message and quote lines for Case B.')+'</p>';
  h+='</div>';
  body.innerHTML=h;
}
