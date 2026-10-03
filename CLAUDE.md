# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler sur ce dépôt.

## Langue

Tout le code (commentaires, scripts Python), toute la documentation (`.md`), tous les messages de commit et toute communication avec l'utilisateur doivent être en **français**.

**Exception unique** : le contenu des pages destinées aux touristes étrangers reste dans leur langue : `english.html`, `campsite.html`, `numbers.html` (anglais) et les pages traduites en anglais, allemand et néerlandais (accueil `english.html` / `deutsch.html` / `nederlands.html`, logement `offer.html` / `angebot.html` / `aanbod.html`, tarifs `prices.html` / `preise.html` / `prijzen.html`, tourisme `tourism.html` / `tourismus.html` / `toerisme.html`, contact `contact-us.html` / `kontakt.html` / `neem-contact-op.html`). Ne jamais les traduire en français, et ne jamais écrire de nouvelle page dans une autre langue hors de ce périmètre sans demande explicite.

## Projet

Site vitrine statique pour **Le Relais de Chaumeré**, un studio meublé indépendant (gîte) à Domagné (35), Bretagne, ouverture prévue 2027. HTML/CSS/JS pur — pas de framework, pas de bundler, pas de `package.json`, pas d'étape de build. Les pages sont déployées telles quelles ; on édite directement les fichiers `.html` et on pousse.

Voir [.ai/SPEC_FONCTIONNALITES.md](.ai/SPEC_FONCTIONNALITES.md) pour le contexte fonctionnel (positionnement, inventaire des pages, fonctionnalités) et [.ai/SYSTEM_PROMPT_GARDIEN_ARCHITECTURE.md](.ai/SYSTEM_PROMPT_GARDIEN_ARCHITECTURE.md) pour les règles d'architecture (SSOT, DRY, KISS, YAGNI) à respecter avant toute modification. Ce fichier-ci couvre les conventions techniques.

## Commandes

Pas d'outillage build/lint/test (pas de npm, pas de config de linter). Seuls existent des scripts Python de maintenance ponctuels, lancés manuellement un par un — aucun n'est intégré à un pipeline :

```bash
python3 analyze_internal_links.py   # audite le maillage interne, repère les pages orphelines/sous-liées
python3 check_responsiveness.py     # vérification heuristique statique des patterns responsive CSS/HTML
python3 update_sitemap.py           # régénère les priorités/lastmod de sitemap.xml à partir des pages HTML présentes
python3 optimize_images.py          # convertit photos/**.jpg|png en WebP (nécessite Pillow)
python3 update_html_images.py       # remplace <img> par <picture> avec sources WebP + lazy loading
python3 minify_assets.py            # minifie style.css / includes/components.css (nécessite csscompressor)
```
À lancer depuis la racine du dépôt ; les scripts trouvent les fichiers relativement à leur propre emplacement. `optimize_images.py` et `minify_assets.py` nécessitent `Pillow` / `csscompressor` — il n'y a pas de requirements.txt, donc `pip install Pillow csscompressor` si absents.

Pour valider une modification, ouvrir les fichiers HTML directement dans un navigateur (ex. `start index.html` sous Windows) — il n'y a pas de serveur de dev.

## Architecture

**Pas de moteur de templating — `includes/` est une référence à copier-coller, pas un mécanisme d'inclusion.** `includes/head.html`, `header.html`, `banner.html`, `footer.html` ne sont *pas* injectés dans les pages, ni au runtime ni au build. Chacune des 38 pages `.html` de premier niveau (dont les pages traduites en/de/nl) contient sa propre copie du head/nav/bandeau/footer. Le bandeau cookies n'est plus copié : il est injecté par `cookies.js`. Pour modifier ces éléments communs (liens de nav, liens de footer, texte du bandeau, structure des balises meta), il faut éditer chaque page individuellement — chercher dans `*.html`, ne jamais supposer qu'éditer `includes/` propage quoi que ce soit ailleurs. `includes/components.css` est le seul fichier réellement chargé par les pages et donc réellement partagé. `TEMPLATE-REFERENCE.html` est le point de départ canonique pour une nouvelle page (voir aussi [README-MAINTENANCE.md](README-MAINTENANCE.md) pour la checklist complète de création de page).

**Styles** : tous les styles partagés vivent dans `style.css` (global) + `includes/components.css` (composants). Les blocs `<style>` des pages ont été déplacés dans `style.css` (règles propres à une page préfixées par la classe du `<body>`, ex. `body.page-blog`) et les `style="..."` répétés sont devenus des classes (noms sémantiques comme `pied-lien-fort`, `fig-img`, ou `st-xxxxxx` générés ; préfixe `html body` pour garder la priorité de l'ancien style inline). Il reste une cinquantaine de `style="..."` uniques ; `culture.html`, `insolite.html` et `mentions-legales.html` gardent encore leur bloc `<style>` propre. Tout nouveau travail ajoute des classes à `style.css`, jamais de style inline ni de bloc `<style>`. Couleurs/typographie sont des custom properties CSS définies en tête de `style.css` (`--bg-color`, `--text-color`, `--accent-color`, etc.) — les réutiliser plutôt que coder des valeurs hexadécimales en dur.

**Analytics et cookies** : GA4 uniquement (`G-MB2MHCQZXY`), géré par `cookies.js` (chargé dans le `<head>` de chaque page sauf `guide-sejour.html`). Ce fichier affiche le bandeau cookies dans la langue de `<html lang>` (fr/en/de/nl) et ne charge GA4 qu'après un clic sur « Accepter ». Google Tag Manager a été volontairement retiré partout (voir CHANGELOG-ARCHITECTURE.md) — ne jamais le réintroduire.

**SEO/données structurées** : chaque page porte son propre `<title>`, sa meta description, son canonical, ses balises Open Graph, `hreflang` (fr/en/x-default), et — sur les pages clés — un bloc JSON-LD `schema.org` (ex. `LodgingBusiness` sur `index.html`). En ajoutant ou renommant une page, mettre à jour `sitemap.xml` (ou lancer `update_sitemap.py`) et vérifier le maillage avec `analyze_internal_links.py`.

**Modèle de réservation** : pas de moteur de réservation ni de paiement en ligne. Les demandes passent par un formulaire de contact (`contact.html`), qui poste vers `https://api.web3forms.com/submit` — le différenciateur du site est la réservation directe (sans commission plateforme), l'équivalent de la commission étant reversé à des associations locales (voir `solidaires.html`).

**i18n** : pas de framework i18n. Les pages traduites (en/de/nl) sont des copies écrites une fois pour toutes des pages françaises correspondantes, reliées par `hreflang` et par un sélecteur de langue (drapeaux) dans le menu : toute modification d'une page française de ces cinq groupes (accueil, offre, tarifs, tourisme, contact) doit être répercutée à la main dans ses trois traductions.

## Conventions (issues de README-MAINTENANCE.md)

- Utiliser des éléments sémantiques (`<section>`, `<article>`, `<nav>`, `<main>`) — ne pas envelopper le contenu dans un `<div class="container">`.
- Chaque `<nav>` nécessite un `aria-label` ; le lien de nav de la page active nécessite `aria-current="page"` (remplace une ancienne classe `.active` — certaines pages plus anciennes peuvent encore l'utiliser, préférer `aria-current` sur tout balisage nouveau/modifié).
- `alt` descriptif sur toutes les images.
- Ne pas dupliquer le motif header/footer au-delà du nécessaire — copier une fois depuis `TEMPLATE-REFERENCE.html`, ne pas inventer une nouvelle structure.
- Cibles Lighthouse : Accessibilité ≥ 90, SEO ≥ 95, Bonnes pratiques ≥ 90 (la performance est plafonnée par le poids des images).

## Agents

Ne jamais lancer de sous-agents ni de workflow multi-agents sans demander d'abord. Obligatoire, sans exception.

## Niveaux d'action

Les demandes sont préfixées par un tag. Sans tag, appliquer `[strict]` par défaut.

- `[consultatif]` — Ne modifier aucun fichier. Expliquer ce qui serait fait et attendre validation.
- `[strict]` — Avant de coder : dire quoi, pourquoi, comment, et dans quels fichiers. Puis coder.
- `[rapide]` — Coder directement, explication minimale. Interdit de toucher à l'architecture (découpage des fichiers, structure des composants partagés, dépendances). Si le changement l'exige, s'arrêter et repasser en `[strict]`.

## Mise à jour de la spec

Après tout ajout ou modification de fonctionnalité visible par les visiteurs du site, mettre à jour [.ai/SPEC_FONCTIONNALITES.md](.ai/SPEC_FONCTIONNALITES.md) dans la même intervention. Ne pas documenter les refactos internes sans impact fonctionnel.

## Explication du code

Codeur novice. Ne pas être trop technique dans les explications de code.

## Remote Git

`origin` est configuré en **SSH** (`git@github.com:clarteweb35/relais.git`), pas en HTTPS — les push HTTPS échouent sur cette machine avec `HTTP 408` (probablement un proxy antivirus d'inspection HTTPS qui interfère avec les gros push). Ne pas repasser le remote en HTTPS.

### Déploiement : le domaine est sur `freelancebzh`

Le site en ligne (le-relais-de-chaumere.fr) est servi par le dépôt `freelancebzh/le-relais-de-chaumere.fr`, remote **`site`** (branche `main`). `origin` (`clarteweb35/relais`, branche `master`) n'est que la sauvegarde de travail : **pousser sur `origin` ne met pas le site en ligne**.

Les deux historiques n'ont aucun ancêtre commun. Ne jamais forcer le push. Pour déployer : créer un commit de déploiement au-dessus de `site/main` (worktree sur `site/main`, `git checkout master -- .`, retirer ce qui ne doit pas partir comme `index09_2026.html`, garder `CNAME`), puis `git push site HEAD:main`.
