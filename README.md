# RekenKracht · De RekenLijn

RekenKracht werkt volgens De RekenLijn: één adaptieve leerlijn zonder klasgrenzen, van de basisschool tot vwo-eindniveau.
Twaalf niveaus, voor de iPad:

| Niveau | Doelgroep | Referentie |
|---|---|---|
| 1–4 | groep 3 t/m 6 | op weg naar 1F |
| 5 | groep 7 | 1F |
| 6 | groep 8 | 1S |
| 7–12 | klas 1 t/m 6 (vmbo tot niveau 8, havo tot 11, vwo tot 12) | 2F (niveau 8) tot 3F (niveau 12) |

- **App:** `index.html` (één bestand, gebouwd uit `src/` met `python3 src/build.py`)
- **Server:** `server/Code.gs` (Google Apps Script + Google Sheet)
- **Controle van alle opgaven:** `node tools/controleer.js` (vorm) en `node tools/orakel.js` (inhoud, realisme en taal)
- **Dekking referentiekader:** [DEKKING.md](DEKKING.md) (`node tools/dekking.js`)

Leerlingen maken een account met naam en groep of klas (met schooltype vanaf klas 1), doen een instaptoets en oefenen daarna adaptief.
Docenten openen het docentenscherm via "Docent" met de docentcode uit `Code.gs`.

## Eigendom
© 2026 S. Groefsema. Alle rechten voorbehouden. Dit is géén open-source software: zie [LICENSE](LICENSE).
De broncode is openbaar zichtbaar omdat GitHub Pages dat (gratis) vereist; dat geeft niemand het recht om hem te hergebruiken.
