#!/usr/bin/env python3
"""Écrit data/topo-du-jour.json : météo du jour à Domagné (Open-Meteo) + petit texte rédigé par l'API Gemini
avec des idées de sorties tirées de tourisme.html.

Lancé chaque matin par .github/workflows/topo-du-jour.yml. La clé est lue dans la variable
d'environnement GEMINI_API_KEY (secret GitHub) : elle n'est jamais écrite dans le dépôt.
En cas d'échec, le script s'arrête sans toucher au fichier : le site garde le topo de la veille.
Le français est écrit en premier ; il est ensuite traduit en anglais, allemand et néerlandais pour les accueils
traduits. Si une traduction échoue, cette langue est seulement sautée : le topo français est publié quand même.
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, 'data', 'topo-du-jour.json')
LATITUDE, LONGITUDE = 48.146, -1.372  # Domagné
MODELE = os.environ.get('GEMINI_MODEL', 'gemini-3.5-flash-lite')
LANGUES = {'en': 'anglais', 'de': 'allemand', 'nl': 'néerlandais'}

# Codes météo WMO (Open-Meteo) regroupés
CIEL = [(0, 'ciel dégagé'), (3, 'ciel peu nuageux à nuageux'), (48, 'brouillard'), (57, 'bruine'),
        (67, 'pluie'), (77, 'neige'), (82, 'averses'), (86, 'averses de neige'), (99, 'orage')]


def lire_json(url, entetes=None, corps=None):
    requete = urllib.request.Request(url, data=corps, headers=entetes or {})
    for essai in range(3):
        try:
            with urllib.request.urlopen(requete, timeout=60) as reponse:
                return json.load(reponse)
        except (TimeoutError, urllib.error.HTTPError) as erreur:
            if isinstance(erreur, urllib.error.HTTPError):
                print('Réponse du serveur (%d) : %s' % (erreur.code, erreur.read().decode('utf-8', 'replace')[:500]))
            erreur_serveur = isinstance(erreur, TimeoutError) or erreur.code >= 500
            if essai == 2 or not erreur_serveur:
                raise
            time.sleep(10)


def meteo():
    params = urllib.parse.urlencode({
        'latitude': LATITUDE, 'longitude': LONGITUDE, 'timezone': 'Europe/Paris', 'forecast_days': 1,
        'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max'})
    d = lire_json('https://api.open-meteo.com/v1/forecast?' + params)['daily']
    code = d['weather_code'][0]
    return {'ciel': next(libelle for seuil, libelle in CIEL if code <= seuil),
            'mini': round(d['temperature_2m_min'][0]), 'maxi': round(d['temperature_2m_max'][0]),
            'pluie': d['precipitation_probability_max'][0], 'vent': round(d['wind_speed_10m_max'][0])}


def lieux():
    """Noms des lieux de la page tourisme (une seule source : pas de liste à tenir à jour ici)."""
    html = open(os.path.join(RACINE, 'tourisme.html'), encoding='utf-8').read()
    return [re.sub(r'<[^>]+>', '', n).strip() for n in re.findall(r'<h3>(.*?)</h3>', html, re.S)]


def gemini(consigne):
    return gemini(consigne)


def traduire(texte, langue):
    consigne = (
        "Traduis ce texte en %s, avec le même ton chaleureux. Garde les deux paragraphes séparés par une ligne vide "
        "et recopie tels quels les noms de lieux. Réponds uniquement par la traduction : pas de titre, pas de markdown, "
        "pas d'emoji.\n\n%s" % (LANGUES[langue], texte))
    return gemini(consigne)


def rediger(m, sorties):
    consigne = (
        "Tu rédiges le « topo du jour » du blog d'un gîte à Domagné, près de Vitré et Châteaugiron (Ille-et-Vilaine). "
        "En français, ton chaleureux, 90 à 130 mots, deux courts paragraphes séparés par une ligne vide : "
        "1) la météo du jour en une ou deux phrases ; 2) deux ou trois idées de sorties adaptées à ce temps, "
        "choisies UNIQUEMENT dans cette liste de lieux : %s. "
        "N'invente aucun lieu, horaire ni tarif. Pas de titre, pas de liste à puces, pas de markdown, pas d'emoji.\n\n"
        "Météo du jour : %s, de %d à %d °C, risque de pluie %d %%, vent jusqu'à %d km/h."
        % (', '.join(sorties), m['ciel'], m['mini'], m['maxi'], m['pluie'], m['vent']))
    corps = json.dumps({'contents': [{'parts': [{'text': consigne}]}]}).encode()
    url = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % MODELE
    reponse = lire_json(url, {'Content-Type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']}, corps)
    texte = reponse['candidates'][0]['content']['parts'][0]['text'].strip()
    if len(texte) < 80:
        raise ValueError('texte trop court')
    return texte


def main():
    if not os.environ.get('GEMINI_API_KEY'):
        sys.exit('GEMINI_API_KEY absente : topo non généré.')
    m = meteo()
    texte = rediger(m, lieux())
    traductions = {}
    for code in LANGUES:
        try:
            traductions[code] = traduire(texte, code)
        except Exception as erreur:  # le français passe avant : on saute simplement cette langue
            print('Traduction %s ignorée : %s' % (code, erreur))
    jour = datetime.now(ZoneInfo('Europe/Paris')).date()
    os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
    with open(SORTIE, 'w', encoding='utf-8', newline='\n') as f:
        json.dump({'date': jour.isoformat(), 'meteo': m, 'texte': texte, 'traductions': traductions}, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('Topo du %s écrit.' % jour)


if __name__ == '__main__':
    main()
