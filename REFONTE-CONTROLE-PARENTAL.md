# Refonte ControleParental.icu — Note d'analyse et plan

## 1. Stack détectée

- Site **statique pur** (`index.html`, `confidentialite.html`, `conditions-utilisation.html`)
- **Aucune étape de build** — Tailwind CSS chargé via CDN (`cdn.tailwindcss.com`) avec une config inline
- Polices : **Inter** (texte) + **Outfit** (titres) via Google Fonts
- JS vanilla (~360 lignes dans `app.js`) + un IIFE inline dans `index.html` pour la modale de téléchargement
- Backend de prod hors du dépôt : `nginx:alpine` (sert le statique) + `node:20-alpine`
  exposant `POST /api/download` (capture email → Brevo + lien signé HMAC)
- Le `server.js` et `parentalControlMiddleware.js` à la racine ne sont **pas utilisés en prod**
  (le serveur HTTP réel est nginx via Docker). Ils ne sont pas non plus référencés par les
  HTML. On les laisse intacts.
- Déploiement : `git push main` → `git reset --hard origin/main` côté VPS.

## 2. Routes / pages publiques

| URL | Fichier | Rôle |
|---|---|---|
| `/` | `index.html` | Landing principale |
| `/confidentialite.html` | `confidentialite.html` | Politique RGPD |
| `/conditions-utilisation.html` | `conditions-utilisation.html` | CGU |
| `POST /api/download` | externe | Capture email → Brevo, renvoie URL signée HMAC |
| `GET /api/file?token=…` | externe | Téléchargement installateur (`.exe`) |

## 3. Composants / sections existants

- Header flottant (logo SVG ICU, nav desktop, menu burger mobile, CTA "Télécharger")
- Hero (badge, h1 "œil protecteur", sous-titre, double CTA, mockup console PWA avec audio bars)
- Bande stats (compteurs animés via IntersectionObserver)
- Grille de 9 fonctionnalités (streaming, blocage VPN/Tor, DoH, planificateur, etc.)
- "Console Parents en action" + démonstrateur interactif (6 boutons, logs)
- FAQ (6 questions, accordéon accessible, JSON-LD FAQPage)
- CTA final "Reprenez le contrôle"
- Footer (4 colonnes, logos partenaires Tailscale + slgd.fr)
- Modale de téléchargement (capture email + appel API)

## 4. Styles actuels

- Palette : `#0b0f19` fond, `#131b2e` surface, `#223154` bordure, `#38bdf8` cyan, `#34d399` émeraude
- Décor : 3 orbes blur radiaux animés (`floatOrb1/2` 20–25s)
- Fade in cartes, FAQ accordéon avec `transition max-height`, audio bars animées
- `prefers-reduced-motion` correctement géré
- Focus visible ajouté (counters `focus:outline-none` inline)

## 5. Fonctionnalités à PRÉSERVER (critique)

1. **Modale de téléchargement** — IDs : `dl-modal`, `dl-form`, `dl-email`, `dl-error`,
   `dl-submit`, `dl-success`, `dl-manual`, `dl-overlay`, `dl-close`. Sélecteur
   `[data-download]` ouvre la modale. Appel `POST /api/download` inchangé.
2. **JSON-LD** (WebSite, Organization, SoftwareApplication, FAQPage) — il faut
   réécrire la `description` mais conserver la structure.
3. **Stats counter** — IDs avec attributs `data-target` / `data-prefix` / `data-suffix`,
   classe `.stats-number`.
4. **FAQ** — classes `.faq-item`, `.faq-trigger`, `.faq-content`, `.faq-icon`. Doit
   rester synchronisée avec le JSON-LD FAQPage (les questions doivent matcher).
5. **Mockup hero interactif** — IDs `mockup-screen-game`, `mockup-screen-locked`,
   `mockup-indicator`, `mockup-action-lock`, `mockup-action-input`, etc.
6. **Démonstrateur console** — classes `.demo-btn` avec `data-action` / `data-param`,
   `demo-logs-container`, `clear-demo-logs`.
7. **Menu mobile** — IDs `menu-btn`, `mobile-menu`, `btn-line1/2/3`.
8. **SEO** — canonical, OG, Twitter, favicons, manifest, `theme-color`.
9. **Liens** mailto (`support@`, `contact@controleparental.icu`), pages légales,
   slgd.fr, tailscale.com.

## 6. Problèmes visuels identifiés

- Discours trop technique (`DXGI`, `WMI`, `AES-256`, `nistP256`, `Vortice`...) → renforce
  l'image "cybersurveillance" plutôt que "protection familiale"
- Ton "œil protecteur", "Nous voyons pour vous", "I See You" : flirte avec la surveillance
- Hero : message peu rassurant pour un parent novice
- Absence de section émotionnelle / familiale
- Absence d'une vraie section "Comment ça marche"
- Bande de réassurance peu visible (les stats sont surtout techniques)
- Carte de fonctionnalités peu hiérarchisée (9 cartes au même niveau)
- Palette légèrement austère (fond très foncé, peu chaleureux)

## 7. Direction artistique cible

- Palette plus premium et chaleureuse : `#061426` bleu nuit, `#102641` surface,
  `#258bff` bleu électrique, `#22d3c5` turquoise, `#28d39a` succès, `#aab7c9` muted
- Gradient marque : `#258bff → #22d3c5` (bleu vers turquoise, jamais vers vert)
- Conserver Inter + Outfit (déjà cohérents)
- Logo : on garde le SVG ICU (œil) mais on désamorce les références "I See You" /
  "Nous voyons pour vous" dans le copy
- Réduire les références à la furtivité / cybersurveillance dans le copy
- Ajouter un sens de progression (badge → titre → preuve → bénéfice → essai)

## 8. Modifications prévues

### `styles.css`
- Ajouter un bloc `:root` avec **tokens design** (couleurs, rayons, ombres, gradient)
- Ajouter classes utilitaires partageables : `.cp-card`, `.cp-button-primary`,
  `.cp-button-secondary`, `.cp-badge`, `.cp-section-heading`, `.cp-status-dot`
- Conserver les animations existantes mais adoucir (réduction `floatOrb` durée,
  `audioBar` ralenti)
- Ajouter classe `.cp-grid-bg` (trame radiale très discrète pour le hero)

### `index.html`
- Mettre à jour `<title>`, `meta description`, `og:*`, `twitter:*` avec la nouvelle accroche
- Réécrire le JSON-LD `description` mais conserver structure et `featureList`
- Remplacer la palette dans toutes les classes Tailwind arbitraires (`bg-[#xxx]`) :
  `#0b0f19 → #061426`, `#131b2e → #102641`, `#223154 → #1a3a5e`,
  `#38bdf8 → #48b7ff`, `#34d399 → #22d3c5`. **Conserver** `#34d399` quand il s'agit
  spécifiquement d'un état "succès" visuel (validation, en ligne) → mappé sur `#28d39a`.
- **Hero** : badge "PROTECTION NUMÉRIQUE POUR TOUTE LA FAMILLE",
  titre "La confiance n'exclut pas le contrôle." (avec partie en gradient),
  sous-titre familial, double CTA, micro-trust (`Compatible Windows 10/11`,
  `Installation rapide`, `Données chez vous`)
- **TrustBar** (NOUVEAU) : 4 piliers (Protection temps réel / Console parents /
  Réglages par enfant / Accompagnement)
- **Fonctionnalités** : nouveau titre "Une protection complète, sans complexité.",
  reformulation des descriptions (bénéfice avant détail technique)
- **Section émotionnelle** (NOUVEAU) : "Protéger ne signifie pas espionner."
- **Comment ça marche** (NOUVEAU) : 4 étapes
- **Console Parents** (existant amélioré) : titre "Tout comprendre en un seul regard."
- **Protection avancée** (NOUVEAU) : section technique secondaire pour profil avancé
- **FAQ** : nettoyage des questions (formulation moins anxiogène, garder mêmes IDs)
- **CTA final** : "Protégez aujourd'hui leur avenir numérique."
- **Footer** : structure conservée, copy adouci

### `confidentialite.html` / `conditions-utilisation.html`
- Mise à jour palette uniquement (mêmes hex codes remplacés)
- Conserver tout le contenu juridique tel quel

### `app.js`
- Aucune modification de logique, mais éventuellement ajustement des couleurs
  hardcodées dans les classes JS (ex. `bg-emerald-500`, `text-red-400`) → reste
  cohérent puisque ces classes Tailwind existent toujours
- Mise à jour des libellés des logs si la copy change ("œil protecteur" → autre)

## 9. Fichiers modifiés (récap)

- `index.html` — restructuration + palette + copy
- `styles.css` — tokens + utilitaires
- `app.js` — ajustement mineur des libellés
- `confidentialite.html` — palette
- `conditions-utilisation.html` — palette
- `REFONTE-CONTROLE-PARENTAL.md` (ce fichier)

## 10. Risques techniques

1. **Tailwind CDN JIT** : compile à la volée selon les classes utilisées dans le HTML.
   Toute classe arbitraire (`bg-[#xxx]`) doit rester valide → on vérifie par sondage
   après refonte.
2. **Modale download** : si on déplace les IDs ou supprime un sélecteur `[data-download]`
   par erreur, le téléchargement casse. → On vérifie la liste finale des éléments
   avec `[data-download]` (au moins : CTA header, CTA hero, CTA footer, CTA final).
3. **JSON-LD FAQPage** : le contenu doit correspondre **mot pour mot** aux questions
   visibles dans le DOM (sinon dégradation SEO). → Synchronisation après réécriture.
4. **Compteur stats** : l'IntersectionObserver lit `data-target` / `data-prefix` /
   `data-suffix` → conservation strictement.
5. **Mockup interactif** : `setMockupState` repose sur des IDs précis → conservés.
6. **Pas de Lighthouse en CI** : on s'appuie sur la revue manuelle responsive et sur
   le respect WCAG (contrastes, focus, prefers-reduced-motion).

## 11. Critères d'acceptation

- ✅ Identité bleu nuit / bleu électrique / turquoise cohérente
- ✅ Hero porte le message "La confiance n'exclut pas le contrôle"
- ✅ Modale email + API `/api/download` intactes
- ✅ Mockup console et démonstrateur fonctionnels (états sync ok)
- ✅ FAQ + JSON-LD synchronisés
- ✅ Pas de scroll horizontal de 320 px à 1920 px
- ✅ `prefers-reduced-motion` respecté
- ✅ Focus clavier visible
- ✅ Discours moins technique sur les sections commerciales, technique conservé
  dans une section dédiée (profil avancé)
- ✅ Pages légales harmonisées
- ✅ Aucune promesse exagérée ajoutée

## 12. Lancement local

Le projet n'a pas de build. Pour prévisualiser localement :

```powershell
# Option 1 : serveur statique Python
python -m http.server 5500

# Option 2 : Node (sert aussi /api stub si on veut)
node server.js
```

Le rendu de production est servi par nginx via Docker côté VPS (cf. `CLAUDE.md`).
