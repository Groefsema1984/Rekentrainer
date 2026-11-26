/**
 * Rekentrainer Vellesan College – server (Google Apps Script)
 * Zelfde opzet als de economie-apps: leerling maakt een account met naam + klas,
 * krijgt een leerling-ID + herstelcode (6 cijfers), de docent kijkt mee met een docentcode.
 *
 * Tabbladen die dit script maakt en vult:
 *   Leerlingen  – één rij per leerling (ID, naam, klas, herstelcode, huidig niveau, samenvatting)
 *   Voortgang   – één rij per leerling × niveau × domein, wordt bijgewerkt (beheersing, status)
 *   Foutenlog   – één rij per fout antwoord (wordt toegevoegd, nooit overschreven)
 *   Toetsen     – één rij per gemaakte formatieve rekentoets
 *   Data        – volledige app-staat per leerling (JSON, in 4 delen) voor herstel op een andere iPad
 *   Logboek     – nieuw account, herstel, docentacties
 *
 * Installatie (5 minuten):
 *   1. Maak een nieuwe Google Sheet, bijv. "Rekentrainer – resultaten".
 *   2. Extensies > Apps Script. Plak dit hele bestand in Code.gs en sla op.
 *   3. Pas hieronder DOCENT_CODE en KLASSEN aan.
 *   4. Kies bovenaan de functie "setup" en klik Uitvoeren (geef toestemming).
 *   5. Implementeren > Nieuwe implementatie > Type: Web-app.
 *      Uitvoeren als: Ikzelf. Toegang: Iedereen. Kopieer de URL (eindigt op /exec).
 *   6. Zet die URL in de app (src/core.js: DATA_ENDPOINT_URL) of bouw met ENDPOINT=<url> python3 src/build.py
 *   Na een wijziging in dit script: Implementeren > Implementaties beheren > bewerken > Nieuwe versie.
 */
const CFG = {
  DOCENT_CODE: 'VERANDER-MIJ',          // code voor het docentenscherm in de app (zelf wijzigen!)
  KLASSEN: ['1A', '1B', '2A', '2B', 'Thuis'], // toegestane klassen (gelijk aan KLASSEN in de app)
  START_NIVEAU: 3,                      // standaard startniveau voor een klas zonder eigen instelling
  MAX_MISLUKT: 10                       // na zoveel foute herstelpogingen wordt herstellen geblokkeerd
};

const DOMEINEN = { G: 'Getallen', V: 'Verhoudingen', M: 'Meten en meetkunde', B: 'Verbanden' };
const DOMEIN_IDS = ['G', 'V', 'M', 'B'];
const NIVEAUS = [1, 2, 3, 4, 5, 6, 7, 8];

const KOP = {
  Leerlingen: ['Leerling-ID', 'Naam', 'Klas', 'Herstelcode', 'Aangemaakt', 'Laatst gezien', 'Huidig niveau',
    'Hoogst ontgrendeld', 'Oefentijd totaal (min)', 'Oefentijd deze week (min)', 'Opgaven gemaakt',
    'Getallen %', 'Verhoudingen %', 'Meten en meetkunde %', 'Verbanden %', 'Open fouten', 'Zeker én fout (open)',
    'Toetsen geslaagd', 'Mislukte herstelpogingen'],
  Voortgang: ['Sleutel', 'Bijgewerkt', 'Leerling-ID', 'Naam', 'Klas', 'Niveau', 'Domein', 'Beheersing %', 'Status',
    'Opgaven gemaakt', 'Laatst geoefend'],
  Foutenlog: ['Event-ID', 'Datum/tijd', 'Leerling-ID', 'Naam', 'Klas', 'Niveau', 'Domein', 'Leerdoel', 'Opgave-ID',
    'Vraagtype', 'Trede', 'Gegeven antwoord', 'Juiste antwoord', 'Zeker/gok', 'Fouttype', 'Rekenmachine gebruikt',
    'Spiegelvraag goed'],
  Toetsen: ['Event-ID', 'Datum/tijd', 'Leerling-ID', 'Naam', 'Klas', 'Niveau', 'Poging', 'Totaal %',
    'Getallen %', 'Verhoudingen %', 'Meten en meetkunde %', 'Verbanden %', 'Geslaagd', 'Duur (min)', 'Terug naar domeinen'],
  Data: ['Leerling-ID', 'Bijgewerkt', 'Staat (deel 1)', 'Staat (deel 2)', 'Staat (deel 3)', 'Staat (deel 4)'],
  Logboek: ['Tijd', 'Leerling-ID', 'Naam', 'Klas', 'Actie', 'Details']
};
const KOL_MISLUKT = KOP.Leerlingen.length;  // laatste kolom van Leerlingen
const STATUS = { oefenen: 'Oefenen', check: 'Klaar voor de check', beheerst: 'Beheerst', herkansing: 'Terug naar oefenen' };

// =====================================================================
// Installatie
// =====================================================================
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(KOP).forEach(function (n) {
    const b = blad_(n, KOP[n]);
    const p = b.protect().setDescription('Alleen docent en script');
    p.removeEditors(p.getEditors()); if (p.canDomainEdit()) p.setDomainEdit(false);
  });
  ['Data'].forEach(function (n) { ss.getSheetByName(n).hideSheet(); });
  ss.getSheetByName('Foutenlog').getRange('A:A').setFontColor('#999999');
  ss.getSheetByName('Toetsen').getRange('A:A').setFontColor('#999999');
  ss.getSheetByName('Voortgang').getRange('A:A').setFontColor('#999999');
  const s1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Blad1');
  if (s1 && ss.getSheets().length > 1) ss.deleteSheet(s1);
  // voorwaardelijke opmaak beheersing
  const vg = ss.getSheetByName('Voortgang');
  const r = vg.getRange('H2:H');
  vg.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(80).setBackground('#d7f0e4').setRanges([r]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(50).setBackground('#f8dcda').setRanges([r]).build()
  ]);
}
function blad_(naam, kop) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let b = ss.getSheetByName(naam);
  if (!b) b = ss.insertSheet(naam);
  b.getRange(1, 1, 1, kop.length).setValues([kop]).setFontWeight('bold').setBackground('#171c24').setFontColor('#ffffff');
  b.setFrozenRows(1);
  return b;
}

// =====================================================================
// Web-app
// =====================================================================
function doGet() { return uit_({ ok: true, app: 'rekentrainer', versie: 1 }); }
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    switch (d.actie) {
      case 'nieuw': return uit_(nieuw_(d));
      case 'herstel': return uit_(herstel_(d));
      case 'sync': return uit_(sync_(d));
      case 'overzicht': return uit_(overzicht_(d));
      case 'leerling': return uit_(leerling_(d));
      case 'klasinstelling': return uit_(klasinstelling_(d));
      case 'vrijgeven': return uit_(vrijgeven_(d));
      default: return uit_({ ok: false, fout: 'Onbekende actie' });
    }
  } catch (err) {
    return uit_({ ok: false, fout: String(err.message || err) });
  } finally { try { lock.releaseLock(); } catch (x) {} }
}
function uit_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// =====================================================================
// Leerling-acties
// =====================================================================
function nieuw_(d) {
  const naam = String(d.naam || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const klas = String(d.klas || '');
  if (naam.length < 3) throw new Error('Vul je voor- en achternaam in');
  if (CFG.KLASSEN.indexOf(klas) < 0) throw new Error('Onbekende klas');
  const sp = sheet_('Leerlingen'); const ids = kolom_(sp, 1); const codes = kolom_(sp, 4).map(String);
  const pre = klas.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5) || 'R';
  let id; do { id = pre + '-' + rndTekst_(4); } while (ids.indexOf(id) >= 0);
  let code; do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (codes.indexOf("'" + code) >= 0 || codes.indexOf(code) >= 0);
  const nu = new Date(); const ki = klasInst_(klas);
  const rij = [id, naam, klas, "'" + code, nu, nu, ki.start, ki.start, 0, 0, 0, '', '', '', '', 0, 0, 0, 0];
  sp.appendRow(rij);
  log_(id, naam, klas, 'nieuw', 'startniveau ' + ki.start);
  return { ok: true, id: id, code: code, klasinst: ki };
}

function herstel_(d) {
  const r = zoek_(d.id); if (!r) throw new Error('Dit leerling-ID bestaat niet. Controleer je invoer.');
  controleerCode_(r, d.code);
  const staat = leesStaat_(r.id) || {};
  staat.id = r.id; staat.naam = r.naam; staat.klas = r.klas; staat.code = String(d.code);
  log_(r.id, r.naam, r.klas, 'herstel', '');
  return { ok: true, staat: staat, klasinst: klasInst_(r.klas) };
}

/**
 * sync: { actie:'sync', id, code, staat:{...}, events:[ {t:'fout', eid, ...}, {t:'toets', eid, ...} ] }
 * - staat wordt samengevoegd met de serverversie (per onderdeel wint de nieuwste tijdstempel 'u')
 * - events worden precies één keer toegevoegd aan Foutenlog/Toetsen (ontdubbeld op eid)
 * - antwoord bevat de samengevoegde staat + de klasinstelling + de eid's die verwerkt zijn
 */
function sync_(d) {
  const r = zoek_(d.id); if (!r) throw new Error('Onbekend leerling-ID');
  controleerCode_(r, d.code);
  const binnen = d.staat || {};
  const oud = leesStaat_(r.id);
  const nieuw = oud ? mergeStaat_(oud, binnen) : binnen;
  nieuw.id = r.id; nieuw.naam = r.naam; nieuw.klas = r.klas;   // naam en klas bepaalt de server
  delete nieuw.code;                                             // code niet in de data opslaan
  schrijfStaat_(r.id, nieuw);

  const verwerkt = verwerkEvents_(r, d.events || []);
  schrijfVoortgang_(r, nieuw);
  schrijfSamenvatting_(r, nieuw);

  const terug = JSON.parse(JSON.stringify(nieuw)); terug.code = String(d.code);
  return { ok: true, staat: terug, klasinst: klasInst_(r.klas), verwerkt: verwerkt };
}

// =====================================================================
// Docent-acties
// =====================================================================
function checkDocent_(d) {
  if (String(d.docentcode) !== String(CFG.DOCENT_CODE)) { Utilities.sleep(1500); throw new Error('Onjuiste docentcode'); }
}

/** Klassenoverzicht: samenvatting per leerling (geen volledige staat, dat houdt het antwoord klein). */
function overzicht_(d) {
  checkDocent_(d);
  const sp = sheet_('Leerlingen');
  const n = sp.getLastRow() - 1;
  const rijen = n > 0 ? sp.getRange(2, 1, n, KOP.Leerlingen.length).getValues() : [];
  const leerlingen = rijen.filter(function (x) { return x[0]; })
    .filter(function (x) { return !d.klas || x[2] === d.klas; })
    .map(function (x) {
      const o = {}; KOP.Leerlingen.forEach(function (k, i) { o[k] = x[i] instanceof Date ? x[i].getTime() : x[i]; });
      o['Herstelcode'] = String(o['Herstelcode']).replace(/^'/, '');
      return o;
    });
  // hardnekkigste fouten per klas: opgaven die het vaakst "zeker én fout" zijn
  const top = topFouten_(d.klas);
  const inst = {}; CFG.KLASSEN.forEach(function (k) { inst[k] = klasInst_(k); });
  return { ok: true, klassen: CFG.KLASSEN, leerlingen: leerlingen, topfouten: top, klasinst: inst };
}

/** Detail van één leerling: volledige staat + zijn/haar fouten en toetsen uit de logs. */
function leerling_(d) {
  checkDocent_(d);
  const r = zoek_(d.id); if (!r) throw new Error('Onbekend leerling-ID');
  const staat = leesStaat_(r.id) || {};
  const fouten = rijenVan_('Foutenlog', 3, r.id, 400);
  const toetsen = rijenVan_('Toetsen', 3, r.id, 100);
  return { ok: true, leerling: { id: r.id, naam: r.naam, klas: r.klas, code: r.code }, staat: staat,
    fouten: fouten, toetsen: toetsen };
}

/**
 * Instelling per klas: startniveau, hoogst toegestane niveau, rekenmachine-modus en of de toets vrij is.
 * { actie:'klasinstelling', docentcode, klas, start:3, max:8, toetsVrij:true }
 */
function klasinstelling_(d) {
  checkDocent_(d);
  if (CFG.KLASSEN.indexOf(d.klas) < 0) throw new Error('Onbekende klas');
  const alle = leesKlasInst_();
  const oud = klasInst_(d.klas);
  const start = NIVEAUS.indexOf(Number(d.start)) >= 0 ? Number(d.start) : oud.start;
  const max = NIVEAUS.indexOf(Number(d.max)) >= 0 ? Math.max(Number(d.max), start) : Math.max(oud.max, start);
  alle[d.klas] = { start: start, max: max, toetsVrij: d.toetsVrij !== false };
  PropertiesService.getScriptProperties().setProperty('KLASINST', JSON.stringify(alle));
  log_('', '', d.klas, 'klasinstelling', JSON.stringify(alle[d.klas]));
  return { ok: true, klasinst: alle[d.klas] };
}

/** Herstelblokkade opheffen na te veel foute pogingen. */
function vrijgeven_(d) {
  checkDocent_(d);
  const r = zoek_(d.id); if (!r) throw new Error('Onbekend leerling-ID');
  sheet_('Leerlingen').getRange(r.rij, KOL_MISLUKT).setValue(0);
  log_(r.id, r.naam, r.klas, 'vrijgegeven', '');
  return { ok: true };
}

function leesKlasInst_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('KLASINST') || '{}'); } catch (e) { return {}; }
}
function klasInst_(klas) {
  const k = leesKlasInst_()[klas] || {};
  return { start: k.start || CFG.START_NIVEAU, max: k.max || 8, toetsVrij: k.toetsVrij !== false };
}

// =====================================================================
// Events -> Foutenlog en Toetsen
// =====================================================================
function verwerkEvents_(r, events) {
  if (!events.length) return [];
  const fl = sheet_('Foutenlog'), tt = sheet_('Toetsen');
  const gezien = {};
  laatsteIds_(fl, 3000).forEach(function (x) { gezien[x] = 1; });
  laatsteIds_(tt, 1000).forEach(function (x) { gezien[x] = 1; });
  const fRij = [], tRij = [], ok = [];
  events.slice(0, 500).forEach(function (ev) {
    const eid = String(ev.eid || '').slice(0, 40);
    if (!eid) return;
    if (gezien[eid]) { ok.push(eid); return; }   // al binnen: alleen bevestigen
    gezien[eid] = 1;
    const tijd = ev.tijd ? new Date(ev.tijd) : new Date();
    if (ev.t === 'fout') {
      fRij.push([eid, tijd, r.id, r.naam, r.klas, num_(ev.niveau), DOMEINEN[ev.domein] || ev.domein || '', tekst_(ev.leerdoel),
        tekst_(ev.opgave), tekst_(ev.type), num_(ev.trede), tekst_(ev.gegeven), tekst_(ev.juist),
        ev.zeker === true ? 'Zeker (!)' : ev.zeker === false ? 'Gok (?)' : '', tekst_(ev.fouttype),
        ev.rekenmachine ? 'ja' : 'nee', ev.spiegelGoed === true ? 'ja' : ev.spiegelGoed === false ? 'nee' : '']);
      ok.push(eid);
    } else if (ev.t === 'toets') {
      const p = ev.perDomein || {};
      tRij.push([eid, tijd, r.id, r.naam, r.klas, num_(ev.niveau), num_(ev.poging), num_(ev.totaal),
        num_(p.G), num_(p.V), num_(p.M), num_(p.B), ev.geslaagd ? 'ja' : 'nee', num_(ev.duurMin),
        (ev.terug || []).map(function (k) { return DOMEINEN[k] || k; }).join(', ')]);
      ok.push(eid);
    }
  });
  if (fRij.length) fl.getRange(fl.getLastRow() + 1, 1, fRij.length, fRij[0].length).setValues(fRij);
  if (tRij.length) tt.getRange(tt.getLastRow() + 1, 1, tRij.length, tRij[0].length).setValues(tRij);
  return ok;
}
function laatsteIds_(b, max) {
  const n = b.getLastRow() - 1; if (n <= 0) return [];
  const van = Math.max(2, b.getLastRow() - max + 1);
  return b.getRange(van, 1, b.getLastRow() - van + 1, 1).getValues().map(function (x) { return String(x[0]); });
}
function num_(x) { const n = Number(x); return isFinite(n) && x !== '' && x !== null && x !== undefined ? n : ''; }
function tekst_(x) {
  if (x === null || x === undefined) return '';
  const s = typeof x === 'object' ? JSON.stringify(x) : String(x);
  return /^[=+\-@]/.test(s) ? "'" + s.slice(0, 300) : s.slice(0, 300);   // geen formule-injectie in de Sheet
}

// =====================================================================
// Voortgang (één rij per leerling × niveau × domein, wordt bijgewerkt)
// staat.dom = { "3.G": { b: 72, st: 'oefenen', n: 41, l: 1732612345678, u: ... }, ... }
// =====================================================================
function schrijfVoortgang_(r, staat) {
  const dom = staat.dom || {};
  const keys = Object.keys(dom); if (!keys.length) return;
  const vg = sheet_('Voortgang');
  const sleutels = kolom_(vg, 1).map(String);
  const nu = new Date(); const nieuw = [];
  keys.forEach(function (k) {
    const p = k.split('.'); const niv = Number(p[0]); const dm = p[1];
    if (NIVEAUS.indexOf(niv) < 0 || DOMEIN_IDS.indexOf(dm) < 0) return;
    const x = dom[k] || {};
    const sl = r.id + '|' + niv + '|' + dm;
    const rij = [sl, nu, r.id, r.naam, r.klas, niv, DOMEINEN[dm], Math.round(x.b || 0), STATUS[x.st] || 'Oefenen',
      x.n || 0, x.l ? new Date(x.l) : ''];
    const i = sleutels.indexOf(sl);
    if (i < 0) nieuw.push(rij); else vg.getRange(i + 2, 1, 1, rij.length).setValues([rij]);
  });
  if (nieuw.length) vg.getRange(vg.getLastRow() + 1, 1, nieuw.length, nieuw[0].length).setValues(nieuw);
}

function schrijfSamenvatting_(r, s) {
  const niv = s.niv || CFG.START_NIVEAU;
  const dom = s.dom || {};
  const pct = DOMEIN_IDS.map(function (d) { const x = dom[niv + '.' + d]; return x ? Math.round(x.b || 0) : ''; });
  const fb = s.fb || {}; let open = 0, zf = 0;
  Object.keys(fb).forEach(function (k) { const f = fb[k]; if (!f.opgelost) { open++; if (f.zf) zf++; } });
  const toetsen = (s.toetsen || []).filter(function (t) { return t.geslaagd; }).length;
  const rij = [new Date(), niv, s.max || niv, Math.round((s.tijd || 0) / 60), Math.round(((s.week || {})[weekId_()] || 0) / 60),
    s.aantal || 0].concat(pct, [open, zf, toetsen]);
  sheet_('Leerlingen').getRange(r.rij, 6, 1, rij.length).setValues([rij]);
}

function topFouten_(klas) {
  const fl = sheet_('Foutenlog'); const n = fl.getLastRow() - 1; if (n <= 0) return [];
  const van = Math.max(2, fl.getLastRow() - 5000 + 1);
  const v = fl.getRange(van, 1, fl.getLastRow() - van + 1, KOP.Foutenlog.length).getValues();
  const tel = {};
  v.forEach(function (x) {
    if (klas && x[4] !== klas) return;
    const k = x[8]; if (!k) return;
    const t = tel[k] || (tel[k] = { opgave: k, niveau: x[5], domein: x[6], leerdoel: x[7], keer: 0, zeker: 0, leerlingen: {} });
    t.keer++; if (x[13] === 'Zeker (!)') t.zeker++; t.leerlingen[x[2]] = 1;
  });
  return Object.keys(tel).map(function (k) { const t = tel[k]; t.leerlingen = Object.keys(t.leerlingen).length; return t; })
    .sort(function (a, b) { return (b.zeker * 2 + b.leerlingen) - (a.zeker * 2 + a.leerlingen); }).slice(0, 25);
}

function rijenVan_(naam, kol, id, max) {
  const b = sheet_(naam); const n = b.getLastRow() - 1; if (n <= 0) return [];
  const kop = KOP[naam];
  const v = b.getRange(2, 1, n, kop.length).getValues().filter(function (x) { return String(x[kol - 1]) === id; });
  return v.slice(-max).map(function (x) {
    const o = {}; kop.forEach(function (k, i) { o[k] = x[i] instanceof Date ? x[i].getTime() : x[i]; }); return o;
  });
}

// =====================================================================
// Opslag
// =====================================================================
function sheet_(n) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); }
function kolom_(b, k) { return b.getLastRow() > 1 ? b.getRange(2, k, b.getLastRow() - 1, 1).getValues().map(function (r) { return r[0]; }) : []; }
function zoek_(id) {
  id = String(id || '').trim().toUpperCase(); if (!id) return null;
  const sp = sheet_('Leerlingen'); const ids = kolom_(sp, 1).map(function (x) { return String(x).toUpperCase(); });
  const i = ids.indexOf(id); if (i < 0) return null;
  const rij = i + 2; const v = sp.getRange(rij, 1, 1, KOL_MISLUKT).getValues()[0];
  return { rij: rij, id: String(v[0]), naam: v[1], klas: v[2], code: String(v[3]).replace(/^'/, ''), mislukt: Number(v[KOL_MISLUKT - 1]) || 0 };
}
function controleerCode_(r, code) {
  const sp = sheet_('Leerlingen');
  if (r.mislukt >= CFG.MAX_MISLUKT) throw new Error('Te veel foute pogingen. Vraag je docent om je account vrij te geven.');
  if (String(code) !== r.code) {
    sp.getRange(r.rij, KOL_MISLUKT).setValue(r.mislukt + 1); Utilities.sleep(1000);
    throw new Error('De herstelcode klopt niet.');
  }
  if (r.mislukt) sp.getRange(r.rij, KOL_MISLUKT).setValue(0);
}
function leesStaat_(id) {
  const db = sheet_('Data'); const ids = kolom_(db, 1).map(function (x) { return String(x).toUpperCase(); });
  const i = ids.indexOf(String(id).toUpperCase()); if (i < 0) return null;
  const v = db.getRange(i + 2, 3, 1, 4).getValues()[0];
  try { return JSON.parse(v.join('')); } catch (e) { return null; }
}
function schrijfStaat_(id, staat) {
  const db = sheet_('Data'); const ids = kolom_(db, 1); const i = ids.indexOf(id);
  const json = JSON.stringify(staat); const N = 45000;
  if (json.length > 4 * N) throw new Error('Voortgang te groot om op te slaan');
  const delen = []; for (let k = 0; k < 4; k++) delen.push(json.slice(k * N, (k + 1) * N));
  const rij = [id, new Date()].concat(delen);
  if (i < 0) db.appendRow(rij); else db.getRange(i + 2, 1, 1, 6).setValues([rij]);
}
function log_(id, naam, klas, actie, details) { sheet_('Logboek').appendRow([new Date(), id, naam, klas, actie, details]); }
function rndTekst_(n) { const t = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < n; i++) s += t[Math.floor(Math.random() * t.length)]; return s; }
function weekId_(d) {
  d = d || new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return t.getUTCFullYear() + '-W' + ('0' + Math.ceil(((t - y) / 864e5 + 1) / 7)).slice(-2);
}

// =====================================================================
// Samenvoegen van twee staten (zelfde regels als in de app, zie src/core.js mergeStaat)
//  - objecten met een tijdstempel 'u' (leerdoelen, domeinen, foutenbank-items): de nieuwste wint als geheel
//    → beheersing mag dus ook dalen, en een opgeloste fout blijft opgelost
//  - tellers (tijd, aantal, max = hoogst ontgrendeld niveau): grootste wint
//  - lijsten met 'eid' (toetsen, badges): vereniging, ontdubbeld
//  - overige waarden: de staat met de nieuwste 'upd' wint
// =====================================================================
const MAX_VELDEN = { tijd: 1, aantal: 1, max: 1 };
function mergeStaat_(p, q) {
  const xy = (p.upd || 0) <= (q.upd || 0) ? [p, q] : [q, p];   // [oud, nieuw]
  const m = merge_(xy[0], xy[1], '');
  m.upd = Math.max(xy[0].upd || 0, xy[1].upd || 0);
  return m;
}
function merge_(a, b, pad) {
  if (a === undefined || a === null) return b;
  if (b === undefined || b === null) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.concat(b).every(function (x) { return x && typeof x === 'object' && x.eid; })) {
      const seen = {}; const u = [];
      a.concat(b).forEach(function (x) { if (!seen[x.eid]) { seen[x.eid] = 1; u.push(x); } });
      return u.sort(function (x, y) { return (x.tijd || 0) - (y.tijd || 0); });
    }
    if (a.concat(b).every(function (x) { return typeof x === 'string'; })) {
      const u = a.slice(); b.forEach(function (x) { if (u.indexOf(x) < 0) u.push(x); }); return u;
    }
    return b;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    if ('u' in a || 'u' in b) return (a.u || 0) > (b.u || 0) ? a : b;
    const o = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) { if (!(k in o)) o[k] = merge_(a[k], b[k], pad + '.' + k); });
    return o;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    const veld = pad.split('.').pop();
    if (MAX_VELDEN[veld] || pad.indexOf('.week.') === 0) return Math.max(a, b);
  }
  return b;
}

// =====================================================================
// Testfunctie: draai in de editor om te controleren of alles werkt (maakt een testleerling 'Thuis')
// =====================================================================
function test() {
  const n = nieuw_({ naam: 'Test Leerling', klas: CFG.KLASSEN[CFG.KLASSEN.length - 1] });
  const staat = { upd: Date.now(), niv: 3, max: 3, tijd: 120, aantal: 5,
    dom: { '3.G': { b: 64, st: 'oefenen', n: 5, l: Date.now(), u: Date.now() } }, fb: {}, toetsen: [] };
  const s = sync_({ id: n.id, code: n.code, staat: staat, events: [
    { t: 'fout', eid: 'test-' + Date.now(), niveau: 3, domein: 'G', leerdoel: 'G3.breuk-deel', opgave: 'N3-G-012',
      type: 'open', trede: 3, gegeven: '15', juist: '12', zeker: true, fouttype: 'Begripsfout' }] });
  Logger.log(JSON.stringify(s).slice(0, 500));
}
