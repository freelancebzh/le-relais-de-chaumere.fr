// Filtre les cartes de lieux par thème (page tourisme).
// Sans JavaScript, la barre de filtres reste cachée et tous les lieux sont visibles.
(function () {
    var barre = document.getElementById('filtres-lieux');
    var lieux = document.querySelectorAll('#lieux .lieu');
    if (!barre || !lieux.length) return;

    barre.hidden = false;
    barre.addEventListener('click', function (e) {
        var bouton = e.target.closest('button');
        if (!bouton) return;
        var theme = bouton.getAttribute('data-filtre');
        barre.querySelectorAll('button').forEach(function (b) {
            var actif = b === bouton;
            b.classList.toggle('actif', actif);
            b.setAttribute('aria-pressed', actif ? 'true' : 'false');
        });
        lieux.forEach(function (lieu) {
            lieu.hidden = theme !== 'tout' && lieu.getAttribute('data-theme') !== theme;
        });
    });
})();
