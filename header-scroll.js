// Cache le menu quand on descend dans la page et le ré-affiche dès qu'on remonte.
// Il reste visible en haut de page, quand le clavier ou le sélecteur de langue l'utilise.
(function () {
    var header = document.querySelector('header');
    if (!header) return;

    var SEUIL_HAUT = 100;   // en haut de page, le menu est toujours visible
    var SEUIL_MOUVEMENT = 6; // ignore les petits mouvements (évite les clignotements)
    var dernierY = window.scrollY;
    var attente = false;

    function afficher(oui) {
        header.classList.toggle('header-cache', !oui);
        document.body.classList.toggle('menu-cache', !oui);
    }

    function majMenu() {
        attente = false;
        var y = window.scrollY;
        var ecart = y - dernierY;
        if (y < SEUIL_HAUT || header.contains(document.activeElement) || header.querySelector('details[open]')) {
            afficher(true);
        } else if (ecart > SEUIL_MOUVEMENT) {
            afficher(false);
        } else if (ecart < -SEUIL_MOUVEMENT) {
            afficher(true);
        } else {
            return;
        }
        dernierY = y;
    }

    window.addEventListener('scroll', function () {
        if (!attente) {
            attente = true;
            window.requestAnimationFrame(majMenu);
        }
    }, { passive: true });
})();
