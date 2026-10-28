// Affiche le « topo du jour » (data/topo-du-jour.json, écrit chaque matin par outils/generer_topo.py).
// Si le fichier manque ou n'est pas daté d'aujourd'hui (heure de Paris), la section (cachée par défaut) reste cachée.
(function () {
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
                p.textContent = para.trim();
                zone.appendChild(p);
            });
            var note = document.createElement('p');
            note.className = 'topo-note';
            note.textContent = 'Texte rédigé chaque matin par une intelligence artificielle (Gemini), d’après la météo du jour. Météo : Open-Meteo.';
            zone.appendChild(note);
            zone.closest('section').hidden = false;
        })
        .catch(function () {});
})();
