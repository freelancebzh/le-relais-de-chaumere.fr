// Affiche le « topo du jour » (data/topo-du-jour.json, écrit chaque matin par outils/generer_topo.py).
// Si le fichier manque ou n'est pas daté d'aujourd'hui (heure de Paris), la section (cachée par défaut) reste cachée.
// Sur les accueils en/de/nl, affiche la traduction (champ « traductions ») ; sans traduction du jour, la section reste cachée.
(function () {
    var langue = document.documentElement.lang || 'fr';

    // Textes propres aux accueils traduits (le français est écrit directement dans le code plus bas).
    var TRAD = {
        en: { locale: 'en-GB', tourisme: 'tourism.html',
              ciel: ['clear sky', 'partly cloudy to cloudy', 'fog', 'drizzle', 'rain', 'snow', 'showers', 'snow showers', 'thunderstorm'],
              meteo: function (j, m, c) { return j + ': ' + c + ', ' + m.mini + ' to ' + m.maxi + ' °C, rain ' + m.pluie + '%, wind ' + m.vent + ' km/h'; },
              suite: 'More ideas: <a href="tourism.html">all our outings</a> (the local guides are in French).',
              note: 'Text written every morning by an artificial intelligence (Gemini), based on the day’s weather. Weather: Open-Meteo.' },
        de: { locale: 'de-DE', tourisme: 'tourismus.html',
              ciel: ['klarer Himmel', 'leicht bis stark bewölkt', 'Nebel', 'Nieselregen', 'Regen', 'Schnee', 'Schauer', 'Schneeschauer', 'Gewitter'],
              meteo: function (j, m, c) { return j + ': ' + c + ', ' + m.mini + ' bis ' + m.maxi + ' °C, Regen ' + m.pluie + ' %, Wind ' + m.vent + ' km/h'; },
              suite: 'Weitere Ideen: <a href="tourismus.html">alle unsere Ausflugsziele</a> (die lokalen Führer sind auf Französisch).',
              note: 'Text, jeden Morgen von einer künstlichen Intelligenz (Gemini) nach dem Wetter des Tages verfasst. Wetter: Open-Meteo.' },
        nl: { locale: 'nl-NL', tourisme: 'toerisme.html',
              ciel: ['heldere lucht', 'licht tot zwaar bewolkt', 'mist', 'motregen', 'regen', 'sneeuw', 'buien', 'sneeuwbuien', 'onweer'],
              meteo: function (j, m, c) { return j + ': ' + c + ', ' + m.mini + ' tot ' + m.maxi + ' °C, regen ' + m.pluie + ' %, wind ' + m.vent + ' km/u'; },
              suite: 'Meer ideeën: <a href="toerisme.html">al onze uitstapjes</a> (de lokale gidsen zijn in het Frans).',
              note: 'Tekst die elke ochtend door een kunstmatige intelligentie (Gemini) wordt geschreven, op basis van het weer van de dag. Weer: Open-Meteo.' }
    };
    // Libellés du ciel écrits par le script du matin, dans le même ordre que TRAD[xx].ciel.
    var CIEL_FR = ['ciel dégagé', 'ciel peu nuageux à nuageux', 'brouillard', 'bruine', 'pluie', 'neige', 'averses', 'averses de neige', 'orage'];
    // Lieux (noms propres) reliés à la page tourisme de la langue.
    var LIEUX = ['Châteaugiron', 'Vitré', 'Rennes', 'Fougères', 'Saint-Malo', 'St Malo', 'Mont-Saint-Michel', 'Mont St Michel',
                 'Brocéliande', 'Ar Milin', 'Roche-aux-Fées', 'Cantache', 'Vern'];

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
    function ajouterLiens(el, texte, LIENS) {
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

    // Le post-it se détache au bout de 20 s ; un lien permet de le remettre (pour 20 s de plus).
    function gererPostIt() {
        var postIt = document.getElementById('post-it-topo');
        var remettre = document.querySelector('.post-it-remettre');
        var minuteur;

        function retirer() {
            postIt.classList.add('post-it-detache');
            var fini = false;
            function masquer() {
                if (fini) return;
                fini = true;
                postIt.hidden = true;
                remettre.hidden = false;
            }
            postIt.addEventListener('animationend', masquer, { once: true });
            setTimeout(masquer, 1500); // si l'animation est désactivée
        }

        function afficher() {
            remettre.hidden = true;
            postIt.classList.remove('post-it-detache');
            postIt.hidden = false;
            clearTimeout(minuteur);
            minuteur = setTimeout(retirer, 20000);
        }

        remettre.querySelector('button').addEventListener('click', afficher);
        afficher();
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

            var trad = TRAD[langue];
            var texte = t.texte;
            var liens = LIENS;
            if (trad) {
                texte = t.traductions && t.traductions[langue];
                if (!texte) return;
                liens = LIEUX.map(function (nom) { return [nom, trad.tourisme]; });
            }

            var m = t.meteo;
            var meta = document.createElement('p');
            meta.className = 'topo-meteo';
            if (trad) {
                var i = CIEL_FR.indexOf(m.ciel);
                meta.textContent = trad.meteo(date.toLocaleDateString(trad.locale, { weekday: 'long', day: 'numeric', month: 'long' }),
                    m, i < 0 ? m.ciel : trad.ciel[i]);
            } else {
                meta.textContent = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                    + ' : ' + m.ciel + ', ' + m.mini + ' à ' + m.maxi + ' °C, pluie ' + m.pluie + ' %, vent ' + m.vent + ' km/h';
            }

            zone.textContent = '';
            zone.appendChild(meta);
            texte.split(/\n\s*\n/).forEach(function (para) {
                var p = document.createElement('p');
                ajouterLiens(p, para.trim(), liens);
                zone.appendChild(p);
            });
            var suite = document.createElement('p');
            suite.className = 'topo-suite';
            if (trad) {
                suite.innerHTML = trad.suite;
            } else {
                suite.innerHTML = 'Plus d\'idées : <a href="escapades.html">balades</a>, <a href="patrimoine.html">patrimoine</a>, '
                    + '<a href="gastronomie.html">tables</a>, <a href="detente.html">détente</a>, '
                    + '<a href="culture.html">culture</a>, <a href="insolite.html">insolite</a>, '
                    + '<a href="tourisme.html">toutes les sorties</a>.';
            }
            zone.appendChild(suite);
            var note = document.createElement('p');
            note.className = 'topo-note';
            note.textContent = trad ? trad.note
                : 'Texte rédigé chaque matin par une intelligence artificielle (Gemini), d’après la météo du jour. Météo : Open-Meteo.';
            zone.appendChild(note);
            zone.closest('section').hidden = false;
            gererPostIt();
        })
        .catch(function () {});
})();
