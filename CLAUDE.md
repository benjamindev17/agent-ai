# CLAUDE.md

Guide de maintenance de la CCM Toolbox, pour les mainteneurs et pour Claude Code.

## Ce que c'est

Boîte à outils des agents Customer Care d'Odoo : 13 assistants qui guident une situation client (TVA, réouverture d'abonnement, upsell, indexation...) et produisent des montants, des périodes et des emails prêts à copier. Interface bilingue FR/EN.

Créée par Ben (benjamindev17), maintenue par Gabriel Roekens depuis octobre 2026. Ben a changé d'équipe mais reste joignable chez Odoo.

Le nom du dépôt (`agent-ai`) ne correspond pas au produit : il n'y a aucune IA dans l'outil.

## Déploiement

- **Pas de build.** HTML, CSS et JavaScript vanilla servis tels quels.
- **`main` = production.** GitHub Pages publie `main` sur `ccm-toolbox.be` (fichier `CNAME`) en une minute environ après chaque merge. Tout ce qui est mergé est immédiatement visible par l'équipe.
- **Cache-busting manuel :** tous les `<script>` et `<link>` de `index.html` portent `?v=N`. Incrémenter N partout à chaque modification de JS ou CSS, sinon les agents gardent l'ancienne version en cache :
  `sed -i '' 's/?v=10"/?v=11"/g' index.html`
- Le dépôt, les réglages Pages et le domaine sont sur le compte personnel de Ben : les réglages GitHub et le domaine passent par lui.
- ⚠ **Le dépôt et le site sont publics.** Ne jamais y ajouter de données client, de credential ou d'information plus sensible que ce qui s'y trouve déjà.

## Architecture

```
index.html                 toutes les vues (div#view-<outil>) + cartes de l'accueil + chargement des scripts
css/variables.css          variables de couleur et de taille
css/styles.css             tout le style
js/utils/helpers.js        el(id), t(clé), cfT(objet {fr,en})
js/data/translations.js    TR.fr / TR.en, sur une seule ligne très longue
js/data/constants.js       données métier : taux de TVA, grille tarifaire, hébergement, emails upsell, scripts d'appel
js/components/<outil>.js   un fichier par outil
js/components/nav.js       openTool(), goHome(), resetTool()
js/components/globe.js     fond animé (globe, ISS), purement décoratif
js/main.js                 setLang() : réapplique tous les libellés à chaque changement de langue
```

**Tout est global.** Pas de modules : les scripts sont chargés dans l'ordre de `index.html` et partagent `lang`, `view`, les `xxxState` et toutes les fonctions. Une fonction d'un outil peut servir à un autre (`indexation.js` utilise `huntingCopy()` de `hunting.js`).

**Deux familles d'outils :**
- **Statiques** (vat, iot, hosting, pricing, recovery, accountant, upsell) : le HTML est écrit dans `index.html` et `setLang()` réécrit chaque libellé par son id. Un libellé oublié dans `setLang()` reste en français quand on passe en anglais.
- **Dynamiques** (indexation, pitch, hunting, domain, callfu, triangle) : une fonction `render<Outil>View()` génère tout le HTML en JS, avec `isFR` en ligne. `setLang()` se contente de rappeler le rendu. **À privilégier pour un nouvel outil**, c'est beaucoup moins de fichiers à toucher.

**Reset :** `nav.js` mémorise le HTML d'origine de chaque vue au chargement (`VIEW_ORIGINALS`) et le restaure dans `resetTool()`. Tout ce qu'un script modifie dans le DOM après le chargement (attributs, valeurs par défaut) doit donc être réappliqué à l'ouverture de l'outil, pas une seule fois au démarrage.

## Ajouter un outil

1. `index.html` : la carte sur l'accueil (`onclick="openTool('x')"`), un `<div id="view-x" style="display:none;">` et le `<script>` avant `nav.js`.
2. `js/components/x.js` : l'état `xState` et, pour un outil dynamique, `renderXView()`.
3. `nav.js` : masquer `view-x` dans `openTool()` **et** dans `goHome()`, ajouter la branche `else if(tool==='x')`, ajouter `'x'` à la liste de `VIEW_ORIGINALS`, réinitialiser `xState` dans `resetTool()`.
4. `main.js` : le titre d'en-tête dans la grande ternaire de `setLang()`, les libellés de la carte (`badge-x`, `tool-x-label`, `tool-x-sub`), et le rappel de `renderXView()`.
5. `translations.js` : les clés FR **et** EN.
6. Incrémenter `?v=N`.

## Données métier et sources de vérité

Les règles chiffrées sont écrites en dur et vieillissent sans prévenir. Avant de modifier une valeur, la vérifier à sa source.

| Donnée | Où dans le code | Source de vérité |
|---|---|---|
| Taux de TVA UE | `EU_VAT` dans `constants.js` | à confirmer avec Ben |
| Grille Standard / Custom (High, Low, FYD) | `PRICING_DATA` dans `constants.js` | à confirmer avec Ben |
| Maintenance 16 € / 100 lignes, fins de support Odoo.sh | `HOSTING` dans `constants.js` | à confirmer avec Ben |
| Règle d'indexation +7% et ses exclusions | `indexation.js` | à confirmer avec Ben |
| Rétention des bases expirées (3 mois) | `recovery.js` | à confirmer avec Ben |
| Liens Knowledge, Tango, référents IoT | `constants.js` | liens internes Odoo |

## Tester

Il n'y a pas de tests automatiques, alors que plusieurs outils calculent des montants recopiés dans des devis. Toujours vérifier dans un navigateur avant de merger :

```bash
python3 -m http.server 8765 --bind 127.0.0.1   # depuis la racine du dépôt
# puis http://127.0.0.1:8765
```

Points à vérifier à chaque fois : l'outil modifié en FR **et** en EN, le bouton reset, la console sans erreur, et un ou deux cas chiffrés recalculés à la main.

## Pièges connus

- **Code mort**, sans effet mais trompeur : `recoveryReset()` dans `recovery.js` n'est jamais appelée (c'est `resetTool()` qui sert), et `main.js` cherche un `#recovery-today-date` qui n'existe plus.
- **Le HTML est construit par concaténation de chaînes** : une apostrophe non échappée dans un texte FR (`l'abonnement`) casse la chaîne JS et tout l'outil. Échapper (`\'`) ou utiliser `’`.
- **Emails destinés aux clients** : pas de tiret long (em dash) dans les nouveaux textes.
