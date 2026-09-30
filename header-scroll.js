// Replie le logo du bandeau quand on descend dans la page :
// il ne reste que la ligne du menu. Le logo revient en haut de page.
(function () {
    var header = document.querySelector('header');
    if (!header) return;

    var SEUIL_REPLI = 80;   // on replie au-delà de 80 px de défilement
    var SEUIL_RETOUR = 10;  // on ré-affiche seulement tout en haut (évite les clignotements)

    function majBandeau() {
        var y = window.scrollY;
        if (y > SEUIL_REPLI) {
            header.classList.add('header-reduit');
        } else if (y < SEUIL_RETOUR) {
            header.classList.remove('header-reduit');
        }
    }

    window.addEventListener('scroll', majBandeau, { passive: true });
    majBandeau();
})();
