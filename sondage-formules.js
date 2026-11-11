/* Carrousel du sondage « prix juste » par formule (pages tarifs).
   Sans JavaScript, les formules restent empilées : le formulaire marche pareil. */
(function () {
    var carrousel = document.querySelector('.sondage-carrousel');
    if (!carrousel) { return; }
    var piste = carrousel.querySelector('.sondage-piste');
    var diapos = carrousel.querySelectorAll('.sondage-diapo');
    var precedent = carrousel.querySelector('.sondage-prec');
    var suivant = carrousel.querySelector('.sondage-suiv');
    var compteur = carrousel.querySelector('.sondage-compteur');
    if (!piste || !diapos.length || !precedent || !suivant || !compteur) { return; }

    var modele = compteur.getAttribute('data-modele') || '{n} / {total}';
    carrousel.classList.add('sondage-actif');

    function indexCourant() {
        return Math.round(piste.scrollLeft / piste.clientWidth);
    }

    function miseAJour() {
        var i = Math.min(Math.max(indexCourant(), 0), diapos.length - 1);
        compteur.textContent = modele.replace('{n}', i + 1).replace('{total}', diapos.length);
        precedent.disabled = i === 0;
        suivant.disabled = i === diapos.length - 1;
    }

    function aller(sens) {
        var i = Math.min(Math.max(indexCourant() + sens, 0), diapos.length - 1);
        piste.scrollTo({ left: i * piste.clientWidth, behavior: 'smooth' });
    }

    precedent.addEventListener('click', function () { aller(-1); });
    suivant.addEventListener('click', function () { aller(1); });
    piste.addEventListener('scroll', miseAJour);
    window.addEventListener('resize', miseAJour);
    miseAJour();
})();
