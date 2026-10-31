// Affiche le « topo du jour » (data/topo-du-jour.json, écrit chaque matin par outils/generer_topo.py).
// Si le fichier manque ou n'est pas daté d'aujourd'hui (heure de Paris), la section (cachée par défaut) reste cachée.
(function () {
    // Mots du texte → page du site vers laquelle les relier (premier mot trouvé seulement, une fois chacun).
    var LIENS = [
        ['Châteaugiron', 'patrimoine.html'], ['Vitré', 'patrimoine.html'],
        ['Ar Milin', 'escapades.html'], ['Roche-aux-Fées', 'insolite.html'], ['Roche aux Fées', 'insolite.html'],
        ['Brocéliande', 'tourisme.html'], ['Rennes', 'tourisme.html'], ['Fougères', 'tourisme.html'],
        ['Saint-Malo', 'tourisme.html'], ['St Malo', 'tourisme.html'], ['Mont St Michel', 'tourisme.html'],
        ['Mont-Saint-Michel', 'tourisme.html'], ['Cantache', 'tourisme.html'], ['Vern', 'tourisme.html'],
        ['balade', 'escapades.html'], ['randonnée', 'escapades.html'],
        ['château', 'patrimoine.html'], ['crêperie', 'gastronomie.html'], ['restaurant', 'gastronomie.html'],
        ['cinéma', 'culture.html'], ['piscine', 'detente.html']
    ];

    // Écrit le texte dans l'élément en transformant chaque mot connu en lien (sans toucher au reste).
    function ajouterLiens(el, texte) {
        var morceaux = [texte];
        LIENS.forEach(function (paire) {
            var fait = false;
            var re = new RegExp('(^|[^A-Za-zÀ-ÿ])(' + paire[0] + ')', 'i');
            morceaux = morceaux.reduce(function (acc, m) {
                if (fait || typeof m !== 'string') { acc.push(m); return acc; }
                var trouve = re.exec(m);
                if (!trouve) { acc.push(m); return acc; }
                var i = trouve.index + trouve[1].length;
                fait = true;
                var a = document.createElement('a');
                a.href = paire[1];
                a.textContent = m.substr(i, paire[0].length);
                acc.push(m.slice(0, i), a, m.slice(i + paire[0].length));
                return acc;
            }, []);
        });
        morceaux.forEach(function (m) {
            el.appendChild(typeof m === 'string' ? document.createTextNode(m) : m);
        });
    }

    var zone = document.getElementById('topo-du-jour');
    if (!zone) return;

    fetch('data/topo-du-jour.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (t) {
            if (!t || !t.texte || !t.date) return;
            var aujourdhui = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
            if (t.date !== aujourdhui) return;
            var date = new Date(t.date + 'T12:00:00');

            var m = t.meteo;
            var meta = document.createElement('p');
            meta.className = 'topo-meteo';
            meta.textContent = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                + ' : ' + m.ciel + ', ' + m.mini + ' à ' + m.maxi + ' °C, pluie ' + m.pluie + ' %, vent ' + m.vent + ' km/h';

            zone.textContent = '';
            zone.appendChild(meta);
            t.texte.split(/\n\s*\n/).forEach(function (para) {
                var p = document.createElement('p');
                ajouterLiens(p, para.trim());
                zone.appendChild(p);
            });
            var suite = document.createElement('p');
            suite.className = 'topo-suite';
            suite.innerHTML = 'Plus d\'idées : <a href="escapades.html">balades</a>, <a href="patrimoine.html">patrimoine</a>, '
                + '<a href="gastronomie.html">tables</a>, <a href="detente.html">détente</a>, '
                + '<a href="culture.html">culture</a>, <a href="insolite.html">insolite</a>, '
                + '<a href="tourisme.html">toutes les sorties</a>.';
            zone.appendChild(suite);
            var note = document.createElement('p');
            note.className = 'topo-note';
            note.textContent = 'Texte rédigé chaque matin par une intelligence artificielle (Gemini), d’après la météo du jour. Météo : Open-Meteo.';
            zone.appendChild(note);
            zone.closest('section').hidden = false;
        })
        .catch(function () {});
})();
