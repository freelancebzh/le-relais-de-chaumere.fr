// Affiche 3 guides au hasard (« Vous aimerez aussi ») en bas des pages de guides locaux.
// Chaque page concernée contient un conteneur <div id="vous-aimerez-aussi"> et charge ce fichier.
(function () {
    var pages = [
        { href: 'patrimoine.html', emoji: '🏰', titre: 'Histoire & Patrimoine', desc: 'Châteaux et cités de caractère près de Domagné.' },
        { href: 'culture.html', emoji: '🎭', titre: 'Culture & Divertissement', desc: 'Cinémas, médiathèque et centres culturels.' },
        { href: 'insolite.html', emoji: '✨', titre: 'Insolite & Expériences', desc: 'Sculptures géantes, légendes et géocaching.' },
        { href: 'escapades.html', emoji: '🚶', titre: 'Escapades & Randonnées', desc: 'Balades et sentiers autour de Domagné.' },
        { href: 'gastronomie.html', emoji: '🍽️', titre: 'Gastronomie locale', desc: 'Nos bonnes adresses pour se régaler.' },
        { href: 'detente.html', emoji: '🧖', titre: 'Détente & Bien-être', desc: 'Baignade, spa et parenthèse douceur.' }
    ];
    var conteneur = document.getElementById('vous-aimerez-aussi');
    if (!conteneur) return;

    var pageActuelle = window.location.pathname.split('/').pop();
    var autres = pages.filter(function (p) { return p.href !== pageActuelle; });
    // mélange (Fisher-Yates)
    for (var i = autres.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = autres[i];
        autres[i] = autres[j];
        autres[j] = tmp;
    }
    conteneur.innerHTML = autres.slice(0, 3).map(function (p) {
        return '<a class="carte-guide" href="' + p.href + '">' +
            '<strong class="carte-guide-titre">' + p.emoji + ' ' + p.titre + '</strong>' +
            '<p class="carte-guide-desc">' + p.desc + '</p>' +
            '</a>';
    }).join('');
})();
