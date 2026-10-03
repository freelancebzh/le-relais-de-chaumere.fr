# 📚 GUIDE DE MAINTENANCE — Relais de Chaumeré

## Pour Développeurs & Mainteneurs

---

## 🏗️ Architecture du Projet

```
site/
├── index.html, blog.html, contact.html... (Pages HTML)
├── style.css (CSS global : toutes les classes, aucun style inline)
├── cookies.js (bandeau cookies fr/en/de/nl + Google Analytics 4)
├── header-scroll.js (menu réduit au défilement)
├── photos/ (Images par catégorie)
├── includes/ (Composants réutilisables)
│   ├── head.html (Meta tags + cookies.js)
│   ├── header.html (Navigation + ARIA)
│   ├── banner.html (Notification construction)
│   ├── footer.html (Pied de page + ARIA)
│   └── components.css (Styles des composants)
├── TEMPLATE-REFERENCE.html (Template pour nouvelles pages)
├── CHANGELOG-ARCHITECTURE.md (Historique refonte)
└── README-MAINTENANCE.md (Ce fichier)
```

---

## ✅ CHECKLIST : Créer une Nouvelle Page

### 1. Structure HTML de Base
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>[VOTRE TITRE - Relais de Chaumeré]</title>
    
    <!-- Meta tags à personnaliser -->
    <meta charset="UTF-8">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="includes/components.css">
    
    <!-- Bandeau cookies + GA4 (chargé après consentement) : un seul fichier partagé -->
    <script src="cookies.js" defer></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MB2MHCQZXY');
    </script>
    
    <!-- À PERSONNALISER PAR PAGE -->
    <meta name="description" content="[Description courte, max 160 caractères]">
    <link rel="canonical" href="https://www.le-relais-de-chaumere.fr/[nom-page].html">
    
    <meta property="og:type" content="website">
    <meta property="og:title" content="[Titre]">
    <meta property="og:description" content="[Description]">
    <meta property="og:image" content="https://www.le-relais-de-chaumere.fr/photos/[image-1200x630].jpg">
    <meta property="og:url" content="https://www.le-relais-de-chaumere.fr/[nom-page].html">
    <meta property="og:locale" content="fr_FR">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Hreflang (adapter pour votre page) -->
    <link rel="alternate" hreflang="fr" href="https://www.le-relais-de-chaumere.fr/[nom-page].html">
    <link rel="alternate" hreflang="en" href="https://www.le-relais-de-chaumere.fr/english.html">
    <link rel="alternate" hreflang="x-default" href="https://www.le-relais-de-chaumere.fr/[nom-page].html">
</head>

<body>

<!-- Bannière de construction -->
<div class="banner-construction">
    🚧 <strong>Projet validé en mairie le 27 juillet :</strong> Le gîte est actuellement en construction 🚧<br>
    📸 Suivez son avancement sur notre <a href="blog.html">blog</a> !<br>
    📅 <strong>Ouverture en 2027 :</strong> Accessible en <strong>bail mobilité</strong> début 2027 puis en <strong>séjour touristique</strong> d'ici l'été.<br>
    🗺️ Découvrez déjà les <a href="tourisme.html">guides et activités locales</a>.
</div>

<!-- Header (navigation) -->
<header>
    <nav role="navigation" aria-label="Navigation principale">
        <div class="logo">
            <a href="index.html" aria-label="Accueil - Le Relais de Chaumeré">
                <img src="photos/general/logo1.png" alt="Logo le relais de Chaumeré">
            </a>
        </div>
        <ul>
            <li><a href="index.html" aria-current="page">Accueil</a></li> <!-- ← Mettre aria-current="page" sur la page actuelle -->
            <li><a href="offre.html">L'Offre</a></li>
            <li><a href="tarifs.html">Services & Tarifs</a></li>
            <li><a href="tourisme.html">Tourisme</a></li>
            <li><a href="propos.html">À Propos</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="blog.html">Blog & Actu</a></li>
            <li>
                <a href="english.html" style="display: flex; align-items: center; gap: 7px;">
                    <img src="https://flagcdn.com/w20/gb.png" alt="Drapeau Royaume-Uni" style="width: 20px;"> 
                    English
                </a>
            </li>
        </ul>
    </nav>
</header>

<!-- Contenu principal -->
<main>
    <!-- Votre contenu ici -->
</main>

<!-- Footer -->
<footer role="contentinfo" aria-label="Pied de page">
    <nav aria-label="Navigation secondaire">
        <div style="margin-bottom: 1.5rem; line-height: 1.8;">
            <a href="offre.html">L'Offre</a> | 
            <a href="tarifs.html">Services & Tarifs</a> | 
            <a href="solidaires.html">Solidaires</a> | 
            <a href="propos.html">À Propos</a> | 
            <a href="blog.html">Blog & Actu</a> | 
            <a href="numeros.html">☎️ Numéros Utiles</a> |
            <a href="mentions-legales.html">Mentions Légales</a>
        </div>
    </nav>
    <p style="color: #999; font-size: 0.9rem; margin: 0;">&copy; 2026 Le Relais de Chaumeré - Tous droits réservés.<br>Site Réalisé par <a href="https://www.clarte-web.fr" target="_blank" rel="noopener">Clarté Web</a></p>
</footer>

</body>
</html>
```

### 2. Points Clés à Adapter
- [ ] Remplacer `[VOTRE TITRE]` avec le titre SEO de la page
- [ ] Mettre `aria-current="page"` sur le lien de navigation actif
- [ ] Personnaliser `og:title`, `og:description`, `og:image`
- [ ] Adapter canonical URL
- [ ] Adapter hreflang si version EN existe

### 3. Styles
- ✅ Tous les styles communs sont dans `style.css`
- ❌ **NE PAS ajouter de `<style>` inline** — utiliser CSS global
- ✅ Ajouter classes CSS à votre contenu
- ✅ Réutiliser styles existants (`.btn`, `.hero`, `.logement-card`, etc.)

---

## 🎨 Système de Couleurs & Typographie

### Palette de couleurs CSS
```css
--bg-color: #ffffff;          /* Fond blanc */
--text-color: #111111;        /* Texte principal (gris très foncé) */
--text-light: #555555;        /* Texte secondaire (gris moyen — WCAG AA) */
--border-color: #eaeaea;      /* Bordures */
--accent-color: #000000;      /* Accent principal */
--accent-hover: #333333;      /* Survol accent */
```

### Typographie
- **Font :** Inter (sans-serif modernes et lisible)
- **Poids :** 300 (light), 400 (normal), 600 (semibold), 800 (bold)
- **Hiérarchie :**
  - `h1` : 3rem, font-weight 600
  - `h2` : 2rem, font-weight 600
  - `h3` : 1.2rem, font-weight 600
  - Body : 1rem, font-weight 400, line-height 1.6

---

## 🚀 Meilleures Pratiques

### DO ✅
- ✅ Utiliser `<section>`, `<article>`, `<nav>`, `<main>` sémantiques
- ✅ Ajouter `alt=""` descriptif à toutes les images
- ✅ Utiliser `<strong>` pour accent gras, `<em>` pour italique
- ✅ Garder HTML simple et structuré
- ✅ Tester sur mobile avant de pusher
- ✅ Mettre `aria-label` sur tous les `<nav>`

### DON'T ❌
- ❌ Ne PAS ajouter de styles inline — utiliser CSS
- ❌ Ne PAS dupliquer header/footer — copier le code une fois
- ❌ Ne PAS ajouter Google Tag Manager — GA4 uniquement
- ❌ Ne PAS créer des `<div class="container">` — utiliser `<main>`
- ❌ Ne PAS oublier `aria-current="page"` sur lien actif

---

## 🧪 Vérification Avant Publication

### Checklist
- [ ] Titre page unique et descriptif (60 caractères max)
- [ ] Meta description présente (150-160 caractères)
- [ ] Image OG présente et taille 1200×630px
- [ ] `aria-current="page"` sur le bon lien menu
- [ ] Pas de console errors (F12)
- [ ] Tester sur mobile (responsive)
- [ ] Liens internes fonctionnent
- [ ] Images chargent correctement
- [ ] Formulaires (si présents) fonctionnent

### Lighthouse Checks
```
Accesibility: ≥ 90/100
Performance: ≥ 50/100 (peut être limité par images)
SEO: ≥ 95/100
Best Practices: ≥ 90/100
```

---

## 🐛 Troubleshooting

### Le menu n'est pas mises à jour sur ma page
→ Vérifiez que vous avez mis `aria-current="page"` sur le bon lien

### Mes styles inline ne s'appliquent pas
→ C'est intentionnel ! Ajoutez une classe CSS dans style.css à la place

### Google Analytics ne trackent pas
→ Vérifiez que la page charge `cookies.js` (GA4 ne démarre qu'après un clic sur « Accepter » dans le bandeau) et qu'il n'y a pas de GTM

### Page ne s'affiche pas sur mobile
→ Vérifiez que vous avez `<meta name="viewport">`

---

## 📞 Support & Questions

Pour toute question ou amélioration :
- Lire `CHANGELOG-ARCHITECTURE.md` pour historique
- Consulter `TEMPLATE-REFERENCE.html` pour exemple complet
- Vérifier `style.css` pour styles disponibles

