// Bandeau cookies + Google Analytics 4, partagés par toutes les pages.
// - Le bandeau s'affiche tant que le visiteur n'a pas choisi (choix gardé dans localStorage, clé "cookieConsent").
// - GA4 n'est chargé qu'après un clic sur « Accepter » (ou si le choix « accepted » est déjà enregistré).
// - La langue du bandeau suit l'attribut lang de la balise <html> (fr, en, de, nl).
(function () {
    var ID_MESURE = 'G-MB2MHCQZXY';

    var TEXTES = {
        fr: {
            texte: '<strong>Le Relais de Chaumeré</strong> utilise des cookies pour analyser l\'audience de ce site via Google Analytics. Vous pouvez accepter ou refuser ce suivi. Pour en savoir plus, consultez nos <a href="mentions-legales.html">Mentions Légales</a>.',
            refuser: 'Refuser', accepter: 'Accepter tout', titre: 'Cookies'
        },
        en: {
            texte: '<strong>Le Relais de Chaumeré</strong> uses cookies to measure the audience of this site with Google Analytics. You can accept or refuse this tracking. To learn more, see our <a href="mentions-legales.html">Legal Notices</a> (in French).',
            refuser: 'Refuse', accepter: 'Accept all', titre: 'Cookies'
        },
        de: {
            texte: '<strong>Le Relais de Chaumeré</strong> verwendet Cookies, um die Besucherzahlen dieser Website mit Google Analytics zu messen. Sie können dieses Tracking akzeptieren oder ablehnen. Weitere Informationen finden Sie in unseren <a href="mentions-legales.html">Rechtlichen Hinweisen</a> (auf Französisch).',
            refuser: 'Ablehnen', accepter: 'Alle akzeptieren', titre: 'Cookies'
        },
        nl: {
            texte: '<strong>Le Relais de Chaumeré</strong> gebruikt cookies om het bezoek aan deze website te meten met Google Analytics. U kunt deze tracking accepteren of weigeren. Meer informatie vindt u in onze <a href="mentions-legales.html">juridische informatie</a> (in het Frans).',
            refuser: 'Weigeren', accepter: 'Alles accepteren', titre: 'Cookies'
        }
    };

    var chargeGA = false;

    function chargerAnalytics() {
        if (chargeGA) return;
        chargeGA = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_MESURE;
        document.head.appendChild(script);
        gtag('js', new Date());
        gtag('config', ID_MESURE);
    }

    function lireChoix() {
        try { return localStorage.getItem('cookieConsent'); } catch (e) { return null; }
    }

    function ecrireChoix(valeur) {
        try { localStorage.setItem('cookieConsent', valeur); } catch (e) { /* stockage indisponible */ }
    }

    function afficherBandeau() {
        var langue = (document.documentElement.lang || 'fr').slice(0, 2);
        var t = TEXTES[langue] || TEXTES.fr;
        var bandeau = document.createElement('div');
        bandeau.id = 'cookie-banner';
        bandeau.className = 'cookie-banner';
        bandeau.setAttribute('role', 'dialog');
        bandeau.setAttribute('aria-label', t.titre);
        bandeau.innerHTML =
            '<p>🍪 ' + t.texte + '</p>' +
            '<div class="cookie-actions">' +
            '<button type="button" id="btn-refuse-cookies" class="cookie-btn cookie-btn-refuse">' + t.refuser + '</button>' +
            '<button type="button" id="btn-accept-cookies" class="cookie-btn cookie-btn-accept">' + t.accepter + '</button>' +
            '</div>';
        document.body.appendChild(bandeau);

        document.getElementById('btn-accept-cookies').addEventListener('click', function () {
            ecrireChoix('accepted');
            bandeau.remove();
            chargerAnalytics();
        });
        document.getElementById('btn-refuse-cookies').addEventListener('click', function () {
            ecrireChoix('refused');
            bandeau.remove();
        });
    }

    var choix = lireChoix();
    if (choix === 'accepted') chargerAnalytics();

    if (!choix) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afficherBandeau);
        else afficherBandeau();
    }
})();
