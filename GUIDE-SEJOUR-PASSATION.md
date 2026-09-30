# Passation — Guide du séjour (`guide-sejour.html`)

Document de suivi pour un projet **en parallèle du site public**, à part des 23 pages du site vitrine. À garder à jour tant que la page n'est pas finalisée.

## Objectif

Page pratique destinée aux **voyageurs sur place**, une fois le gîte ouvert : wifi, règlement intérieur, modes d'emploi des équipements, numéros utiles, idées de sorties. Accès prévu **uniquement par QR code** affiché dans le logement — pas de lien depuis le site public.

## Pourquoi elle est isolée du reste du site

- **Pas de lien dans le menu principal** ni dans aucune page (vérifié : seule `guide-sejour.html` et `.ai/SPEC_FONCTIONNALITES.md` la mentionnent).
- **Absente de `sitemap.xml`** — ne doit pas y être ajoutée.
- **`<meta name="robots" content="noindex, nofollow">`** dans le `<head>` — ne jamais indexer (contient à terme le mot de passe wifi).
- Pas d'entrée dédiée nécessaire dans `robots.txt` : la meta `noindex` suffit à empêcher l'indexation.
- Choix assumé : simple page web, pas d'appli mobile ni de mode hors-ligne (PWA) — voir `.ai/SPEC_FONCTIONNALITES.md` section 3.5 pour le raisonnement complet.

**Point de vigilance pour la suite** : si un jour cette page est incluse dans un script de maintenance (ex. `analyze_internal_links.py`, `update_sitemap.py`), il faudra l'exclure explicitement — elle est *volontairement* orpheline et hors sitemap, ce n'est pas un oubli.

## État du code

- Styles propres à la page nettoyés : classes `.guide-section`, `.guide-section-cta`, `.guide-section-final`, `.guide-disclaimer` ajoutées dans `style.css` (plus de `style="..."` inline sur le contenu spécifique à cette page).
- **Header/footer volontairement différents des 22 autres pages.** Contrairement à la règle générale du projet (copier le header/footer identique depuis `TEMPLATE-REFERENCE.html`), cette page utilise un header/footer minimalistes (`.guide-app-header`, `.guide-app-footer`) : juste le logo/nom en lien retour vers `index.html`, et en pied de page un lien retour + mentions légales + copyright sur une ligne. Décision : cette page est consultée comme une appli par un voyageur déjà sur place, pas comme une page du site vitrine — le menu marketing complet (Offre, Tarifs, Tourisme, Contact, Blog...) n'a pas sa place ici. **Si le header/footer canonique du site change, ne pas répercuter ici automatiquement** — vérifier d'abord si ça s'applique à ce header minimal.
- Navigation interne en gros boutons (`.guide-tiles` / `.guide-tile`) façon écran d'accueil d'appli mobile, un par pôle (Wifi, Règlement, Modes d'emploi, Numéros utiles, Sorties), qui pointent vers les ancres de la page.

## Reste à faire avant l'ouverture (2027)

Tout est marqué `[À COMPLÉTER]` dans le fichier :

- [ ] Nom et mot de passe du réseau wifi (section `#wifi`)
- [ ] Horaires réels d'arrivée / départ (section `#reglement`)
- [ ] Emplacement des bacs de tri
- [ ] Retirer la phrase d'avertissement « modèle à adapter » une fois le règlement définitif validé
- [ ] Instructions : borne de recharge, chauffage, gestion des déchets, télévision, machine à café, lit escamotable au plafond, volets, brumisateur (section `#modes-emploi`)
- [ ] Ajouter d'autres modes d'emploi au fil de l'équipement du logement (dupliquer un bloc `.logement-card` dans `#modes-emploi`)
- [ ] **Figer le nom de fichier** (`guide-sejour.html` est provisoire) avant impression du QR code physique — un changement de nom après impression rendrait le QR code obsolète

## Pour reprendre ce travail

1. Ouvrir `guide-sejour.html`, remplacer les `[À COMPLÉTER]` un par un avec les informations réelles.
2. Une fois le nom de fichier figé, générer le QR code pointant vers `https://www.le-relais-de-chaumere.fr/<nom-final>.html`.
3. Mettre à jour ce document et `.ai/SPEC_FONCTIONNALITES.md` section 3.5 en conséquence.
