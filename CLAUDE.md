# CLAUDE.md — controleparental.icu

Documentation projet pour Claude Code (et les humains). Conçu et développé en France par
[slgd.fr](https://slgd.fr).

## Présentation

`controleparental.icu` est la **landing page** d'une application de contrôle parental pour
Windows 10/11 (surveillance d'écran temps réel, blocage de sites/jeux, « Console Parents »
accessible depuis mobile). Ce dépôt contient **uniquement le site statique** ; l'installateur
Windows et le backend de téléchargement vivent côté serveur (voir plus bas).

## Contenu du dépôt (site statique pur, pas de build)

- `index.html` — landing page (Tailwind via CDN). Contient le SEO complet (meta, Open Graph,
  Twitter Cards, JSON-LD WebSite/Organization/SoftwareApplication/FAQPage) et la **modale de
  téléchargement à email obligatoire** (HTML + JS inline en bas de page).
- `confidentialite.html` — politique de confidentialité (RGPD).
- `conditions-utilisation.html` — CGU (droit français, éditeur = slgd.fr).
- `app.js`, `styles.css` — JS/CSS de la landing.
- `sitemap.xml`, `robots.txt` — SEO. `site.webmanifest` — PWA.
- `favicon.svg`, `favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `icon-192/512.png`,
  `og-image.png` (1200×630) — icônes & image sociale.
- `CNAME` — `controleparental.icu` (héritage GitHub Pages ; le site est servi ailleurs, voir infra).

### Conventions

- **Pas de build, pas de framework** : on édite directement le HTML/CSS/JS. Tailwind est chargé
  via CDN (`cdn.tailwindcss.com`), pas de compilation.
- Palette : fond `#0b0f19`, accents `#38bdf8` (cyan) → `#34d399` (émeraude). Polices Inter + Outfit.
- La fonctionnalité « Console Parents » s'appelle ainsi partout (anciennement « Console Web »).
- Les pages légales partagent le même header/footer ; le footer porte la mention
  « Conçu et développé en France 🇫🇷 par slgd.fr ».

## Hébergement & déploiement

Le site **n'est pas servi par GitHub Pages** mais par le VPS de slgd.fr (IONOS, Ubuntu 24.04,
IP `217.160.48.193`), derrière **Traefik v3** (TLS Let's Encrypt automatique). Voir
`beuss91@gmail.com` comme compte ACME.

```
GitHub (main)  ──push──>  déployé via:  ssh root@serveur
                          cd /var/www/controleparental.icu
                          git fetch origin && git reset --hard origin/main
```

- **Mettre à jour le site** = pousser sur `main` puis, sur le serveur,
  `git -C /var/www/controleparental.icu fetch origin && git reset --hard origin/main`.
  (On utilise `reset --hard` car le déploiement suit strictement `origin/main`.)
- Push GitHub : via **SSH** (la clé de l'utilisateur est autorisée sur le compte `beuss06`).
  `git remote set-url origin git@github.com:beuss06/controleparental.icu.git`.

### Stack serveur (hors dépôt)

Projet Docker dans `/root/controleparental/` :

- **`controleparental_nginx`** (nginx:alpine) — sert `/var/www/controleparental.icu` (ce dépôt,
  cloné) en lecture seule. Config dans `/root/controleparental/nginx.conf` (gzip, cache long sur
  les assets, types MIME corrects pour webmanifest/sitemap, en-têtes de sécurité).
- **`controleparental_api`** (node:20-alpine, `/root/controleparental/api/server.js`, sans
  dépendance) — gère le **téléchargement à email obligatoire** :
  - `POST /api/download {email}` → valide l'email, enregistre le lead dans
    `/root/controleparental/data/leads.csv`, le pousse vers **Brevo** (best-effort, non bloquant),
    et renvoie une URL signée HMAC (token TTL 15 min).
  - `GET /api/file?token=…` → vérifie le token et sert l'installateur.
  - `GET /api/health` → état.
  - Secrets dans `/root/controleparental/.env` (`DOWNLOAD_SECRET`, `BREVO_API_KEY`,
    `BREVO_LIST_ID` optionnel) — **jamais committés**.
- **Installateur Windows** auto-hébergé : `/root/controleparental/data/controleparental.icu.Setup.exe`
  (~366 Mo, récupéré de la release GitHub `v1.0.0`). Hors git, hors `/var/www`.

### Routage Traefik (file provider `/root/traefik/dynamic/apps.yml`)

- `controleparental` (priority 10) : `Host(controleparental.icu) || Host(www…)` → `controleparental_nginx`.
- `controleparental-api` (priority 100) : même hôte `&& PathPrefix(/api)` → `controleparental_api:3000`.

### DNS (IONOS)

Zone `controleparental.icu` (gérée via l'API IONOS, clé dans le `.env` du projet slgd) :
A apex + A `www` → `217.160.48.193` (TTL 300). **Pas d'AAAA** (le serveur n'a pas d'IPv6).
MX/DKIM/DMARC IONOS intacts (mail géré par IONOS).

## Capture des leads (emails)

Tout email saisi pour télécharger est :
1. enregistré dans `/root/controleparental/data/leads.csv` (date, email, ip, user_agent) — source de vérité ;
2. envoyé à **Brevo** en best-effort.

⚠️ L'API Brevo est **restreinte par IP** : l'IP du serveur `217.160.48.193` doit être autorisée sur
<https://app.brevo.com/security/authorised_ips>, sinon la synchro renvoie 401 (les leads restent dans
le CSV). Une fois l'IP autorisée, on peut créer une liste dédiée et renseigner `BREVO_LIST_ID`.

## SEO

Déjà en place : titres/descriptions optimisés, canonical, robots, Open Graph + Twitter Cards
(image `og-image.png`), JSON-LD (dont `FAQPage` → rich snippets), `sitemap.xml`, `robots.txt`,
favicons, `site.webmanifest`. Toute nouvelle page doit : avoir un `<title>`/description uniques,
un `<link rel="canonical">`, et être ajoutée au `sitemap.xml`.
