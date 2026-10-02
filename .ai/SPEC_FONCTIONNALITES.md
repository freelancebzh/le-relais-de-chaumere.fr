# Spécification Fonctionnelle — Le Relais de Chaumeré

## 1. Contexte

Site vitrine pour **Le Relais de Chaumeré**, un studio meublé indépendant (gîte, ~20 m²) situé à Domagné (35113), en Haute-Bretagne près de Rennes. Le logement est **en cours de construction** (projet validé en mairie le 27 juillet) ; ouverture prévue **2027**, d'abord en **bail mobilité** (début 2027), puis en **séjour touristique** (été 2027). Le site sert donc aujourd'hui à la fois de vitrine anticipée, de blog de suivi de chantier, et de guide touristique local — pas encore de moteur de réservation actif.

Le projet est réalisé par **Clarté Web** (agence, clarte-web.fr), créditée en pied de page de chaque page.

## 2. Positionnement & différenciateur

- **Réservation directe et solidaire** : pas de plateforme intermédiaire (Airbnb/Booking). La commission normalement prélevée par ces plateformes est reversée à des associations locales (page dédiée `solidaires.html`, rappelé dans `tarifs.html`, `propos.html`, `index.html`). L'accueil détaille trois engagements : autonomie énergétique (panneaux photovoltaïques en place, autres solutions à l'étude), économie locale (soutien à l'association A3PC) et logement solidaire pour les jeunes en formation/alternance (tarif adapté, sans bail mobilité).
- **Éco-responsabilité** : mise en avant dans les meta descriptions et le schema.org (`LodgingBusiness`) — borne de recharge véhicule électrique, équipements modernes.
- **Ancrage local** : le site fait aussi office de guide touristique complet du territoire (Domagné et alentours, axe Rennes–Vitré–Châteaugiron), indépendamment de la réservation du gîte.

## 3. Fonctionnalités

### 3.1 Vitrine du logement
- Présentation du studio (`index.html`, `offre.html`) : conception par Émilie Leparoux (Ambiance Maison), équipements (wifi fibre, parking sécurisé, borne recharge électrique, terrasse privée, linge fourni).
- Grille tarifaire saisonnière (`tarifs.html`) : de 54,27 €/nuit à 68,55 €/nuit selon saison, option recharge véhicule électrique (10 €/séjour), tarif adapté (jeunes en formation, séjours réguliers) sur devis via contact.
- Bannière de construction persistante sur toutes les pages, rappelant le calendrier d'ouverture et renvoyant vers le blog de suivi de chantier et le guide tourisme.

### 3.2 Prise de contact / pré-réservation
- Formulaire de contact (`contact.html`) posté vers **Web3Forms** (`https://api.web3forms.com/submit`) — pas de backend propre, pas de stockage de données côté site.
- Rappel gratuit proposé par WhatsApp (mentionné dans `contact.html`).
- Aucun moteur de réservation/calendrier de disponibilité ni paiement en ligne à ce stade — toute demande passe par le formulaire ou le contact direct.

### 3.3 Blog / suivi de chantier
- `blog.html` : actualités et avancement du chantier du gîte (photos, étapes de construction), filtrable par thématique (Actu du Gîte / Actu Locale / Développement Durable). Article du 29/09/2026 sur la création de l'association A3PC (demande d'enregistrement déposée le 27/09/2026, site : clarteweb35.github.io/a3pc).
- `construction.html` : page dédiée qui reprend, dans l'ordre chronologique, les articles et photos racontant l'histoire de la construction du studio (du lancement du projet en 2020 à la dalle coulée en septembre 2026). Les liens « En savoir plus sur la construction du studio » de `blog.html` y renvoient (ils pointaient auparavant vers une ancre `#construction` inexistante). Contenu dupliqué depuis `blog.html` (pas de mécanisme d'inclusion) : toute nouvelle étape du chantier ajoutée au blog avec ce lien doit être répercutée manuellement sur `construction.html` pour rester à jour.

### 3.4 Guide touristique local (contenu indépendant de la réservation)
Pages thématiques listées dans `tourisme.html` (page hub, 44 liens entrants) :
- `culture.html` — Culture & divertissement
- `patrimoine.html` — Histoire & patrimoine local ; paragraphe de présentation de l'A3PC (~100 mots) avec lien vers a3pc.fr/infos-pratiques/#histoire (« Histoire de Chaumeré »), repris en bas de la section tourisme de l'accueil
- `insolite.html` — Insolite & expériences uniques
- `escapades.html` — Escapades & randonnées
- `detente.html` — Détente, baignade & beauté
- `gastronomie.html` — Art & gastronomie, où manger
- `camping.html` — Camping chez l'habitant à Domagné
- `campingoff.html` — Camping à la ferme à Domagné (page identifiée comme orpheline dans `RAPPORT_MAILLAGE_INTERNE.md`, à relier)
- `campsite.html` / `numbers.html` — équivalents anglais de camping / numéros utiles
- `numeros.html` — numéros utiles & urgences

### 3.5 Guide du séjour (page voyageur)
- `guide-sejour.html` — page pratique destinée aux voyageurs **sur place** (accès prévu par QR code affiché dans le gîte, pas de lien dans le menu principal, `noindex` — non référencée sur Google).
- Contenu : code wifi, règlement intérieur, "modes d'emploi" des équipements (section conçue pour être complétée au fil du temps — chaque entrée est une carte indépendante, facile à dupliquer), et liens vers `numeros.html` et `tourisme.html` plutôt que duplication de leur contenu.
- **Statut** : squelette en place, contenu à finaliser avant l'ouverture (wifi, règlement, modes d'emploi marqués `[À COMPLÉTER]`). Nom de fichier provisoire — à figer avant impression du QR code physique.
- Choix assumé : page web simple (pas d'appli mobile native) — moins de points de défaillance, pas de store, HTTPS suffisant pour la confiance de l'utilisateur. Mode hors-ligne (PWA) volontairement non implémenté pour l'instant, à ajouter si besoin réel.

### 3.6 Institutionnel
- `propos.html` — présentation de l'hôte / philosophie du projet
- `solidaires.html` — détail de l'engagement solidaire (reversement des commissions)
- `mentions-legales.html` — mentions légales
- `plan-du-site.html` — plan du site
- `english.html` — traduction anglaise de la page d'accueil (seule page traduite ; le reste du guide tourisme reste en français, sauf `campsite.html`/`numbers.html`)

### 3.7 SEO & données structurées
- Chaque page : title unique, meta description, canonical, Open Graph, Twitter card, `hreflang` (fr/en/x-default).
- `index.html` porte un balisage `schema.org` `LodgingBusiness` (adresse, téléphone, `priceRange`, équipements) — **téléphone et adresse précise encore à compléter** (placeholders `[À COMPLÉTER]` dans le JSON-LD).
- `sitemap.xml` (24 URLs) et `robots.txt` à la racine.
- Suivi analytics via **GA4 uniquement** (`G-MB2MHCQZXY`), chargé par `analytics.js` seulement après un clic sur « Accepter » dans le bandeau cookies (rien n'est chargé avant ou en cas de refus ; `guide-sejour.html`, sans bandeau, n'est donc pas suivie) — GTM volontairement retiré (voir `CHANGELOG-ARCHITECTURE.md`).

### 3.8 Accessibilité
- Conformité visée **WCAG AA** : contrastes retravaillés (`--text-light: #555555`), `role="navigation"`/`role="contentinfo"`, `aria-label` sur les nav, `aria-current="page"` sur le lien actif, focus clavier visible.

### 3.9 Bandeau réduit au défilement
- Le bandeau (logo + menu) reste collé en haut de l'écran. Dès qu'on descend de ~80 px, le logo disparaît et seule la ligne du menu reste visible ; le logo revient quand on remonte tout en haut de la page (`header-scroll.js`, chargé par chaque page ayant un bandeau).

### 3.10 Règle : date de mise à jour dans le pied de page

Dès qu'une page est modifiée, même très légèrement, y compris indirectement via `style.css` ou un autre fichier partagé (dans ce cas, toutes les pages concernées), la date du jour doit être mise à jour dans leur pied de page. Toutes les pages doivent avoir cette date, au même format, dans la langue de la page :

- pages françaises : `© 2026 Le Relais de Chaumeré - JJ/MM/AAAA - Tous droits réservés.` suivi de « Site Réalisé par Clarté Web » ;
- pages anglaises (`english.html`, `campsite.html`, `numbers.html`) : `© 2026 Le Relais de Chaumeré - October 2nd 2026 - All Rights Reserved.` suivi de « Website Realised by Clarté Web » (mois en toutes lettres, jour avec suffixe 1st / 2nd / 3rd / 4th…).

## 4. Hors périmètre actuel (connu, non implémenté)

- Pas de moteur de réservation ni de calendrier de disponibilité en temps réel.
- Pas de paiement en ligne.
- Pas de back-office / CMS — toutes les pages sont éditées en HTML statique à la main.
- Migration des styles inline vers `style.css` incomplète (chantier en cours, voir `CHANGELOG-ARCHITECTURE.md` § À FAIRE).
- Optimisation images (WebP, `srcset`, lazy loading) partiellement outillée (`optimize_images.py`, `update_html_images.py`) mais pas systématiquement appliquée à toutes les pages.
- Maillage interne à renforcer sur certaines pages (`campingoff.html` orpheline, `patrimoine.html`/`culture.html` sous-liées) — voir `RAPPORT_MAILLAGE_INTERNE.md`.

## 5. Documents de référence associés

- [CLAUDE.md](../CLAUDE.md) — conventions techniques et architecture pour un agent IA travaillant sur le code.
- [README-MAINTENANCE.md](../README-MAINTENANCE.md) — checklist de création de page, palette de couleurs, bonnes pratiques.
- [CHANGELOG-ARCHITECTURE.md](../CHANGELOG-ARCHITECTURE.md) — historique de la refonte architecturale (composants, GA4, WCAG AA) et chantiers restants.
- [RAPPORT_MAILLAGE_INTERNE.md](../RAPPORT_MAILLAGE_INTERNE.md) — analyse du maillage interne et plan d'amélioration SEO.
