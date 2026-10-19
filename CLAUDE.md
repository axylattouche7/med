# med — Simulateur d'examen neuro-ophtalmologique

Site pédagogique d'Axyl (médecine et pharmacie, UdeM). Un patient cartoon sur lequel on fait l'examen à la souris ou au doigt : poursuite oculaire, convergence, réflexes pupillaires, lampe balancée, lunettes de Frenzel. Deux onglets : **Apprendre** (choisir un tableau, lire les signes) et **Quiz** (vignette clinique, 4 choix).

## Fichiers

- `examen-neuro-ophtalmo_11.html` : version actuelle. Un seul fichier autonome (HTML, CSS, JS en ligne), aucune dépendance, aucune police web.
- `examen-neuro-ophtalmo_10.html` : ancienne version, gardée pour référence.
- `tools/smoke-test.js` : test Playwright (voir « Vérifier »).
- Convention : chaque nouvelle version majeure = nouveau fichier `_NN.html`. Ne pas écraser l'ancienne sans qu'Axyl le demande.

## Façon de travailler avec Axyl

- Français, tutoiement. Réponses directes, avis tranché, honnête sur les limites.
- Contenu clinique complet, raisonné à partir des mécanismes (premiers principes), jamais de citation secondaire inventée.
- Régénérer le contenu clinique proprement plutôt que de faire du rechercher-remplacer dans le texte.
- Design : appliquer **d'office** les skills `site`, `animate`, `review-animations` et `break-ui` (synchronisés depuis son compte claude.ai). Suggérer `/prototype` en une ligne quand la direction visuelle hésite.

## Direction visuelle (décidée avec Axyl)

- **Look Apple**, pas de crème ni de beige pour ce site (il l'a refusé). Fond `#f5f5f7`, cartes blanches, encre `#1d1d1f`, accent bleu Apple `#0071e3` (`#0a84ff` en sombre). Mode sombre : noir `#000`, cartes `#1c1c1e`.
- Police système (`-apple-system`, SF Pro), chiffres tabulaires pour les mesures.
- Scène du patient sur fond studio clair (**pas de fond noir**). Patient cartoon avec cheveux, oreilles, petit corps en veston et cravate rouge.
- Logo : œil cartoon avec cils, qui suit le pointeur et cligne de temps en temps (coupé si `prefers-reduced-motion`).
- Barre du haut vitrée et collante, contrôles segmentés à pilule glissante, courbes `cubic-bezier(0.23,1,0.32,1)`, animations d'interface sous 300 ms.

## Modèle clinique (dans le `<script>`)

Vue de face : **l'œil droit (OD) est à gauche de l'écran**.

Chaque pathologie dans `BASE` a : `cat`, `mood` (expression du visage), `OD`/`OS` (via `eyeDef`), `nystagmus`, et le texte `fr` + `en` (`short`, `name`, `vignettes` ×3, `tryIt`, `f` = [motricité, convergence, pupilles, paupières], `loc`, `mech`). Indicateurs de pathologie optionnels : `bilateral`, `cogan`, `convRetract`, `gazeTau`, `blinkScale`.

Paramètres de `eyeDef` (relatifs à l'abduction de **chaque** œil) :
- Motricité : `limits.{abduct,adduct,up,down,downAdduct}`, `baseline.{ab,y,yAdduct}`, `convergenceOK`, `convAmt`, `fatigueMotor`.
- Paupières : `ptosis` (négatif = rétraction), `lowerLid`, `lidFollow` (synergie oculopalpébrale ; ≈0 = retard palpébral thyroïdien), `fatigueLid`.
- Pupilles (mm) : `restBright`, `dimGain`, `dilatorGain` (Horner), `afferentGain` (DPAR), `lightResp` et `nearMM` (voies lumière et proximité **séparées** → dissociation lumière-proximité), `tonic` (Adie), `fixedMM`, `pupilOval`/`pupilRot` (Argyll Robertson).
- Nystagmus : objet ou tableau ; `dir` `pos`/`neg`/`null`, `mode:"gaze"` (évoqué par le regard, à direction changeante), `suppressFactor` (suppression par la fixation, levée par Frenzel), `alexander`.

**Règle du miroir** : on écrit seulement la version **droite** ; la gauche est générée (`mirrorFR`, `mirrorEN`) en échangeant OD/OS et droit↔gauche / right↔left. Donc dans le texte de base d'une pathologie latéralisée, **ne jamais écrire « gauche » ni « left »**. Les muscles « droit médial/latéral… » sont protégés. Les pathologies `bilateral:true` n'ont pas de version gauche.

## 22 tableaux actuels

Contrôle : normal · Nerfs : III complet, III à pupille épargnée, IV, VI, sinus caverneux · Pupilles : Horner, Marcus Gunn, Adie, mydriase pharmacologique, anisocorie physiologique, Argyll Robertson · Regard : OIN, OIN bilatérale, paralysie du regard horizontal, one-and-a-half, Parinaud, PSP · Jonction/orbite : myasthénie oculaire, orbitopathie thyroïdienne · Nystagmus : névrite vestibulaire, nystagmus central. Le quiz tire parmi 37 variantes et propose souvent le même tableau du côté opposé, pour forcer la vérification de la latéralité.

## Ajouter une pathologie

1. Ajouter l'entrée dans `BASE` (FR **et** EN, terminologie anglaise standard), version droite seulement, ou `bilateral:true`.
2. L'ajouter à `ORDER` (et une catégorie à `CATS` + `UI.fr.cat`/`UI.en.cat` si besoin).
3. Si un nouveau signe exige un nouveau mécanisme, l'ajouter au moteur (`constrain`, `targetMM`, boucle `frame`) plutôt que de tricher dans les données.
4. Lancer le test de fumée et regarder le rendu une fois.

## Vérifier

```bash
npm i playwright@1.47.2
node tools/smoke-test.js examen-neuro-ophtalmo_11.html
```

Le test ouvre les 22 tableaux des deux côtés, répond à 40 cas, bascule FR/EN et échoue sur toute erreur JS ou tout défilement horizontal.

## Idées en attente (pas encore faites)

- Nystagmus vertical (battant vers le bas, Chiari), skew deviation, test d'impulsion céphalique (HINTS complet).
- Test de l'écran (cover test), Duane, Brown.
- Vue de profil pour montrer l'exophtalmie thyroïdienne.
- Score du quiz conservé entre les visites.
