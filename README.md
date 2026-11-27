# Rekentrainer Vellesan

Adaptieve rekentrainer voor Niveau 1–8 (1F tot en met 3F), voor de iPad.

- **App:** `index.html` (één bestand, gebouwd uit `src/` met `python3 src/build.py`)
- **Server:** `server/Code.gs` (Google Apps Script + Google Sheet)
- **Controle van alle opgaven:** `node tools/controleer.js`

Leerlingen maken een account met naam en klas, doen een instaptoets en oefenen daarna adaptief.
Docenten openen het docentenscherm via "Docent" met de docentcode uit `Code.gs`.

## Eigendom
© 2026 S. Groefsema. Alle rechten voorbehouden. Dit is géén open-source software: zie [LICENSE](LICENSE).
De broncode is openbaar zichtbaar omdat GitHub Pages dat (gratis) vereist; dat geeft niemand het recht om hem te hergebruiken.
