// Visionneuse de la galerie « aménagement » : agrandit les photos sur la page et permet de les faire défiler
// (flèches à l'écran, touches ← →, glissement du doigt), sans ouvrir d'autre fenêtre.
// Sans JavaScript, chaque vignette reste un lien vers l'image seule.
(function () {
    var liens = Array.prototype.slice.call(document.querySelectorAll('.amenagement-photo a'));
    if (!liens.length || typeof HTMLDialogElement === 'undefined') return;

    var TEXTES = {
        fr: { fermer: 'Fermer', prec: 'Photo précédente', suiv: 'Photo suivante', credit: 'Illustrations :' },
        en: { fermer: 'Close', prec: 'Previous photo', suiv: 'Next photo', credit: 'Illustrations:' },
        de: { fermer: 'Schließen', prec: 'Vorheriges Foto', suiv: 'Nächstes Foto', credit: 'Illustrationen:' },
        nl: { fermer: 'Sluiten', prec: 'Vorige foto', suiv: 'Volgende foto', credit: 'Illustraties:' }
    };
    var t = TEXTES[(document.documentElement.lang || 'fr').slice(0, 2)] || TEXTES.fr;
    var titre = document.querySelector('.amenagement h2');
    var index = 0;
    var departX = null;

    var dialogue = document.createElement('dialog');
    dialogue.className = 'visionneuse';
    dialogue.setAttribute('aria-label', titre ? titre.textContent : '');
    dialogue.innerHTML =
        '<button class="visionneuse-fermer" type="button" aria-label="' + t.fermer + '">×</button>' +
        '<button class="visionneuse-nav visionneuse-prec" type="button" aria-label="' + t.prec + '">‹</button>' +
        '<figure class="visionneuse-figure"><img alt="">' +
        '<figcaption><span class="visionneuse-compteur"></span><span class="visionneuse-legende"></span></figcaption></figure>' +
        '<button class="visionneuse-nav visionneuse-suiv" type="button" aria-label="' + t.suiv + '">›</button>' +
        '<p class="visionneuse-credit">' + t.credit +
        ' <a href="https://www.ambiance-maison.com/" target="_blank" rel="noopener">Emilie Leparoux, Ambiance Maison</a></p>';
    document.body.appendChild(dialogue);

    var image = dialogue.querySelector('img');
    var compteur = dialogue.querySelector('.visionneuse-compteur');
    var legende = dialogue.querySelector('.visionneuse-legende');

    function legendeDe(lien) {
        var f = lien.parentNode.querySelector('figcaption');
        return f ? f.textContent : '';
    }

    function afficher(i) {
        index = (i + liens.length) % liens.length;
        image.src = liens[index].href;
        image.alt = legendeDe(liens[index]);
        compteur.textContent = (index + 1) + ' / ' + liens.length;
        legende.textContent = legendeDe(liens[index]);
        // charge d'avance les photos voisines pour un défilement sans attente
        [index - 1, index + 1].forEach(function (j) {
            new Image().src = liens[(j + liens.length) % liens.length].href;
        });
    }

    liens.forEach(function (lien, i) {
        lien.addEventListener('click', function (e) {
            e.preventDefault();
            afficher(i);
            dialogue.showModal();
        });
    });

    dialogue.querySelector('.visionneuse-fermer').addEventListener('click', function () { dialogue.close(); });
    dialogue.querySelector('.visionneuse-prec').addEventListener('click', function () { afficher(index - 1); });
    dialogue.querySelector('.visionneuse-suiv').addEventListener('click', function () { afficher(index + 1); });

    // un clic à côté de la photo (sur le fond sombre) ferme la visionneuse
    dialogue.addEventListener('click', function (e) { if (e.target === dialogue) dialogue.close(); });

    dialogue.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') afficher(index - 1);
        if (e.key === 'ArrowRight') afficher(index + 1);
    });

    dialogue.addEventListener('touchstart', function (e) { departX = e.touches[0].clientX; }, { passive: true });
    dialogue.addEventListener('touchend', function (e) {
        if (departX === null) return;
        var ecart = e.changedTouches[0].clientX - departX;
        departX = null;
        if (Math.abs(ecart) > 50) afficher(index + (ecart < 0 ? 1 : -1));
    });
})();
