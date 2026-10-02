// Google Analytics 4 : chargé uniquement si le visiteur a accepté les cookies
// (choix enregistré dans localStorage sous "cookieConsent" par le bandeau de chaque page).
(function () {
    var ID_MESURE = 'G-MB2MHCQZXY';
    var charge = false;

    function charger() {
        if (charge) return;
        charge = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_MESURE;
        document.head.appendChild(script);
        gtag('js', new Date());
        gtag('config', ID_MESURE);
    }

    try {
        if (localStorage.getItem('cookieConsent') === 'accepted') charger();
    } catch (e) { /* stockage indisponible : pas de suivi */ }

    // Premier choix du visiteur : on lance le suivi dès le clic sur « Accepter »
    document.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('#btn-accept-cookies')) charger();
    });
})();
