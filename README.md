# Rekentrainer Vellesan

Adaptieve rekentrainer voor Niveau 1–8 (1F tot en met 3F), voor de iPad.

- **App:** `index.html` (één bestand, gebouwd uit `src/` met `python3 src/build.py`)
- **Server:** `server/Code.gs` (Google Apps Script + Google Sheet)
- **Controle van alle opgaven:** `node tools/controleer.js`
- `wip/`: vragenbanken voor Niveau 7 en 8, nog in controle (zitten nog niet in de app)

Leerlingen maken een account met naam en klas, doen een instaptoets en oefenen daarna adaptief.
Docenten openen het docentenscherm via "Docent" met de docentcode uit `Code.gs`.
