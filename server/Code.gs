// Rekenen op Niveau © 2026 S. Groefsema. Alle rechten voorbehouden. Zie LICENSE.
/**
 * Rekenen op Niveau – server (Google Apps Script)
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
 *   3. Pas hieronder DOCENT_CODE aan (de code waarmee jij in het docentenscherm komt).
 *   4. Kies bovenaan de functie "setup" en klik Uitvoeren (geef toestemming).
 *   5. Implementeren > Nieuwe implementatie > Type: Web-app.
 *      Uitvoeren als: Ikzelf. Toegang: Iedereen. Kopieer de URL (eindigt op /exec).
 *   6. Zet die URL in de app (src/core.js: DATA_ENDPOINT_URL) of bouw met ENDPOINT=<url> python3 src/build.py
 *   Na een wijziging in dit script: Implementeren > Implementaties beheren > bewerken > Nieuwe versie.
 */
const CFG = {
  DOCENT_CODE: 'VERANDER-MIJ',          // code voor het docentenscherm in de app (zelf wijzigen!)
  // gelijk aan KLASSEN in de app: groep 3 t/m 8, daarna klas 1 t/m 4 vmbo, 1 t/m 5 havo, 1 t/m 6 vwo
  KLASSEN: ['groep 3', 'groep 4', 'groep 5', 'groep 6', 'groep 7', 'groep 8',
    'klas 1 vmbo', 'klas 2 vmbo', 'klas 3 vmbo', 'klas 4 vmbo', 'klas 1 havo', 'klas 2 havo', 'klas 3 havo', 'klas 4 havo', 'klas 5 havo',
    'klas 1 vwo', 'klas 2 vwo', 'klas 3 vwo', 'klas 4 vwo', 'klas 5 vwo', 'klas 6 vwo'],
  // Het echte startniveau bepaalt de instaptoets in de app. Dit is alleen het startpunt van die toets.
  MAX_MISLUKT: 10,                      // na zoveel foute herstelpogingen wordt herstellen geblokkeerd
  // Automatische kwaliteitscontrole van opgavesjablonen (leerdoel + vraagvorm)
  ITEM_MIN: 30,                         // pas vanaf zoveel pogingen oordeelt het systeem
  ITEM_P_MIN: 0.15,                     // minder dan 15% goed: bijna iedereen fout → blokkeren
  ITEM_SKIP_MAX: 0.25,                  // meer dan 25% overgeslagen/vastgelopen → blokkeren
  ITEM_TIJD_MAX: 300,                   // gemiddeld langer dan 5 minuten → blokkeren
  ITEM_STERK_MIN: 0.30                  // sterke leerlingen minder dan 30% goed → blokkeren
};

const DOMEINEN = { G: 'Getallen', V: 'Verhoudingen', M: 'Meten en meetkunde', B: 'Verbanden' };
const DOMEIN_IDS = ['G', 'V', 'M', 'B'];
const NIVEAUS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];   // Niveau 1 (groep 3) t/m 12 (vwo-eindniveau)
const VER = 2;
// startniveau van de instaptoets per groep/klas (zelfde regel als in de app)
function startNiveau_(klas) {
  const g = String(klas).match(/^groep (\d)/); if (g) return Number(g[1]) - 2;
  const m = String(klas).match(/^klas (\d) (\w+)/); if (!m) return 5;
  const t = { vmbo: [4, 8], havo: [5, 11], vwo: [6, 12] }[m[2]] || [6, 12];
  return Math.min(t[1], t[0] + Number(m[1]));
}
// oude namen (8 niveaus) → nieuwe namen
const KLAS_OUD = { '1e klas': 'klas 1 vwo', '2e klas': 'klas 2 vwo', '3e klas': 'klas 3 vwo', '4e klas': 'klas 4 vwo', '5e klas': 'klas 5 vwo', '6e klas': 'klas 6 vwo', 'Thuis': 'groep 6' };
// staat van 8 naar 12 niveaus: Niveau n wordt n + 4 (zelfde regel als migreer() in de app)
function migreer_(st) {
  if (!st || (st.ver || 1) >= VER) return st;
  const p = function (x) { return typeof x === 'number' && x > 0 ? x + 4 : x; };
  st.niv = p(st.niv); st.max = p(st.max); st.recNiv = p(st.recNiv);
  if (st.plaatsing && st.plaatsing.niv) st.plaatsing.niv = p(st.plaatsing.niv);
  const dom = {}; Object.keys(st.dom || {}).forEach(function (k) { const a = k.split('.'); dom[(Number(a[0]) + 4) + '.' + a[1]] = st.dom[k]; }); st.dom = dom;
  const dip = {}; Object.keys(st.diplomas || {}).forEach(function (k) { dip[String(Number(k) + 4)] = st.diplomas[k]; }); st.diplomas = dip;
  Object.keys(st.fb || {}).forEach(function (k) { const f = st.fb[k]; if (f && f.niv) f.niv = p(f.niv); });
  (st.toetsen || []).forEach(function (t) { if (t && t.niveau) t.niveau = p(t.niveau); if (t && t.niv) t.niv = p(t.niv); });
  if (KLAS_OUD[st.klas]) st.klas = KLAS_OUD[st.klas];
  st.ver = VER; return st;
}
// leerling uit de oude opzet: klas omzetten en de oude voortgangsregels (oude niveaunummers) weghalen
function migreerLeerling_(r) {
  if (KLAS_OUD[r.klas]) { r.klas = KLAS_OUD[r.klas]; sheet_('Leerlingen').getRange(r.rij, 3).setValue(r.klas); }
  const vg = sheet_('Voortgang'); const ids = kolom_(vg, 3).map(String);
  for (let i = ids.length - 1; i >= 0; i--) if (ids[i].toUpperCase() === r.id.toUpperCase()) vg.deleteRow(i + 2);
}

const KOP = {
  Leerlingen: ['Leerling-ID', 'Naam', 'Klas', 'Herstelcode', 'Aangemaakt', 'Laatst gezien', 'Huidig niveau',
    'Hoogst ontgrendeld', 'Oefentijd totaal (min)', 'Oefentijd deze week (min)', 'Opgaven gemaakt',
    'Getallen %', 'Verhoudingen %', 'Meten en meetkunde %', 'Verbanden %', 'Open fouten', 'Zeker én fout (open)',
    'Toetsen geslaagd', 'Mislukte herstelpogingen'],
  Voortgang: ['Sleutel', 'Bijgewerkt', 'Leerling-ID', 'Naam', 'Klas', 'Niveau', 'Domein', 'Beheersing %', 'Status',
    'Opgaven gemaakt', 'Laatst geoefend'],
  Foutenlog: ['Event-ID', 'Datum/tijd', 'Leerling-ID', 'Naam', 'Klas', 'Niveau', 'Domein', 'Leerdoel', 'Opgave-ID',
    'Vraagtype', 'Trede', 'Gegeven antwoord', 'Juiste antwoord', 'Zeker/gok', 'Fouttype', 'Rekenmachine gebruikt',
    'Spiegelvraag goed', 'Misconceptie'],
  Toetsen: ['Event-ID', 'Datum/tijd', 'Leerling-ID', 'Naam', 'Klas', 'Soort', 'Niveau', 'Poging', 'Totaal %',
    'Getallen %', 'Verhoudingen %', 'Meten en meetkunde %', 'Verbanden %', 'Geslaagd', 'Duur (min)', 'Terug naar domeinen'],
  Data: ['Leerling-ID', 'Bijgewerkt', 'Staat (deel 1)', 'Staat (deel 2)', 'Staat (deel 3)', 'Staat (deel 4)'],
  Logboek: ['Tijd', 'Leerling-ID', 'Naam', 'Klas', 'Actie', 'Details'],
  Sjablonen: ['Sjabloon', 'Leerdoel', 'Vorm', 'Niveau', 'Pogingen', 'Goed', 'Zeker en fout', 'Overgeslagen', 'Tijd totaal (s)',
    'Sterk pogingen', 'Sterk goed', 'Zwak pogingen', 'Zwak goed', 'p-waarde', 'Discriminatie', 'Gem. tijd (s)',
    'Status', 'Reden', 'Docent', 'Bijgewerkt']
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
      case 'nieuw2': return uit_(nieuw_(d));
      case 'herstel2': return uit_(herstel_(d));
      case 'sync2': return uit_(sync_(d));
      case 'nieuw': case 'herstel': case 'sync':   // oude app-versie (8 niveaus): niet meer mengen met de nieuwe niveaunummers
        return uit_({ ok: false, fout: 'Er is een nieuwe versie van Rekenen op Niveau. Herlaad de pagina.' });
      case 'overzicht': return uit_(overzicht_(d));
      case 'leerling': return uit_(leerling_(d));
      case 'klasinstelling': return uit_(klasinstelling_(d));
      case 'vrijgeven': return uit_(vrijgeven_(d));
      case 'analyse': return uit_(analyse_(d));
      case 'sjablonen': return uit_(sjablonen_());
      case 'itemanalyse': return uit_(itemanalyse_(d));
      case 'sjabloonstatus': return uit_(sjabloonStatus_(d));
      case 'effect': return uit_(effect_(d));
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
  const pre = /^groep/.test(klas) ? 'G' + klas.match(/\d/)[0] : ({ vmbo: 'VM', havo: 'HA', vwo: 'VW' }[klas.split(' ')[2]] || 'K') + klas.match(/\d/)[0];   // G3 … G8, VM1, HA2, VW6
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
  let staat = leesStaat_(r.id) || {};
  if (staat.niv && (staat.ver || 1) < VER) { staat = migreer_(staat); schrijfStaat_(r.id, staat); migreerLeerling_(r); }
  staat.ver = VER; staat.id = r.id; staat.naam = r.naam; staat.klas = r.klas; staat.code = String(d.code);
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
  const binnen = migreer_(d.staat || {});
  let oud = leesStaat_(r.id);
  if (oud && (oud.ver || 1) < VER) { oud = migreer_(oud); migreerLeerling_(r); }
  if (KLAS_OUD[r.klas]) migreerLeerling_(r);
  // de leerling mag zelf zijn groep/klas aanpassen (nieuw schooljaar); de server controleert de naam
  if (binnen.klas && binnen.klas !== r.klas && CFG.KLASSEN.indexOf(binnen.klas) >= 0) { sheet_('Leerlingen').getRange(r.rij, 3).setValue(binnen.klas); log_(r.id, r.naam, binnen.klas, 'klas', r.klas + ' → ' + binnen.klas); r.klas = binnen.klas; }
  const nieuw = oud ? mergeStaat_(oud, binnen) : binnen;
  nieuw.id = r.id; nieuw.naam = r.naam; nieuw.klas = r.klas; nieuw.ver = VER;   // naam bepaalt de server
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
  const topmisc = topMisc_(d.klas);
  const inst = {}; CFG.KLASSEN.forEach(function (k) { inst[k] = klasInst_(k); });
  return { ok: true, klassen: CFG.KLASSEN, leerlingen: leerlingen, topfouten: top, topmisc: topmisc, klasinst: inst };
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
  return { start: k.start || startNiveau_(klas), max: k.max || 12, toetsVrij: k.toetsVrij !== false };
}

// =====================================================================
// Events -> Foutenlog en Toetsen
// =====================================================================
function verwerkEvents_(r, events) {
  if (!events.length) return [];
  const fl = sheet_('Foutenlog'), tt = sheet_('Toetsen');
  const nk = KOP.Foutenlog.length; if (fl.getRange(1, nk).getValue() !== KOP.Foutenlog[nk - 1]) fl.getRange(1, nk).setValue(KOP.Foutenlog[nk - 1]).setFontWeight('bold').setBackground('#171c24').setFontColor('#ffffff');
  const gezien = {};
  laatsteIds_(fl, 3000).forEach(function (x) { gezien[x] = 1; });
  laatsteIds_(tt, 1000).forEach(function (x) { gezien[x] = 1; });
  const fRij = [], tRij = [], ok = [], items = [];
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
        ev.rekenmachine ? 'ja' : 'nee', ev.spiegelGoed === true ? 'ja' : ev.spiegelGoed === false ? 'nee' : '', tekst_(ev.misc)]);
      ok.push(eid);
    } else if (ev.t === 'toets') {
      const p = ev.perDomein || {};
      tRij.push([eid, tijd, r.id, r.naam, r.klas, ['Instaptoets', 'Oefentoets', 'Voormeting', 'Nameting'].indexOf(ev.soort) >= 0 ? (ev.soort + (ev.examen ? ' ' + ev.examen : '')) : 'Rekentoets', num_(ev.niveau), num_(ev.poging), num_(ev.totaal),
        num_(p.G), num_(p.V), num_(p.M), num_(p.B), ev.geslaagd ? 'ja' : 'nee', num_(ev.duurMin),
        (ev.terug || []).map(function (k) { return DOMEINEN[k] || k; }).join(', ')]);
      ok.push(eid);
    } else if (ev.t === 'item') {
      items.push(ev); ok.push(eid);
    } else if (ev.t === 'niveau') {
      log_(r.id, r.naam, r.klas, 'niveau', 'van ' + num_(ev.van) + ' naar ' + num_(ev.naar) + (ev.reden ? ' (' + tekst_(ev.reden) + ')' : ''));
      ok.push(eid);
    } else {
      ok.push(eid);   // onbekend soort event: bevestigen zodat het niet blijft hangen
    }
  });
  if (fRij.length) fl.getRange(fl.getLastRow() + 1, 1, fRij.length, fRij[0].length).setValues(fRij);
  if (tRij.length) tt.getRange(tt.getLastRow() + 1, 1, tRij.length, tRij[0].length).setValues(tRij);
  if (items.length) werkSjablonenBij_(items);
  return ok;
}

// =====================================================================
// Kwaliteitscontrole: itemanalyse per opgavesjabloon
// =====================================================================
function sjBlad_() { return sheet_('Sjablonen') || blad_('Sjablonen', KOP.Sjablonen); }
function leesSjablonen_() {
  const b = sjBlad_(); const n = b.getLastRow() - 1; const K = KOP.Sjablonen.length;
  return { b: b, rijen: n > 0 ? b.getRange(2, 1, n, K).getValues() : [] };
}
// tellers bijwerken met nieuwe item-events en de status opnieuw bepalen
function werkSjablonenBij_(items) {
  const L = leesSjablonen_(); const pos = {};
  L.rijen.forEach(function (x, i) { pos[x[0]] = i; });
  items.forEach(function (ev) {
    const sj = String(ev.sj || '').slice(0, 60); if (!sj) return;
    let i = pos[sj];
    if (i === undefined) { i = L.rijen.length; pos[sj] = i; L.rijen.push([sj, tekst_(ev.ld), tekst_(ev.vorm), num_(ev.niv), 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '']); }
    const x = L.rijen[i];
    if (ev.skip) { x[7] = (+x[7] || 0) + 1; }
    else {
      x[4] = (+x[4] || 0) + 1; if (ev.goed) x[5] = (+x[5] || 0) + 1; else if (ev.zeker === true) x[6] = (+x[6] || 0) + 1;
      x[8] = (+x[8] || 0) + Math.min(1800, +ev.sec || 0);
      if (ev.sterk) { x[9] = (+x[9] || 0) + 1; if (ev.goed) x[10] = (+x[10] || 0) + 1; }
      else { x[11] = (+x[11] || 0) + 1; if (ev.goed) x[12] = (+x[12] || 0) + 1; }
    }
    x[19] = new Date();
  });
  L.rijen.forEach(beoordeel_);
  if (L.rijen.length) L.b.getRange(2, 1, L.rijen.length, KOP.Sjablonen.length).setValues(L.rijen);
}
// regels: genoeg pogingen → slecht werkende sjablonen blokkeren, goed onderscheidende sjablonen "Werkt goed"
function beoordeel_(x) {
  const n = +x[4] || 0, g = +x[5] || 0, skip = +x[7] || 0, sN = +x[9] || 0, sG = +x[10] || 0, zN = +x[11] || 0, zG = +x[12] || 0;
  const p = n ? g / n : 0, pS = sN ? sG / sN : null, pZ = zN ? zG / zN : null, D = pS !== null && pZ !== null ? pS - pZ : null, tijd = n ? (+x[8] || 0) / n : 0;
  x[13] = n ? Math.round(p * 100) / 100 : ''; x[14] = D !== null && sN >= 5 && zN >= 5 ? Math.round(D * 100) / 100 : ''; x[15] = n ? Math.round(tijd) : '';
  const docent = String(x[18] || '');
  if (docent === 'vrijgegeven') { x[16] = 'Actief'; x[17] = 'Door docent vrijgegeven'; return; }
  if (docent === 'geblokkeerd') { x[16] = 'Geblokkeerd'; x[17] = 'Door docent geblokkeerd'; return; }
  if (n + skip < CFG.ITEM_MIN) { x[16] = 'Te weinig gegevens'; x[17] = (n + skip) + ' van ' + CFG.ITEM_MIN + ' pogingen'; return; }
  const reden = [];
  if (p < CFG.ITEM_P_MIN) reden.push('bijna iedereen fout (' + Math.round(p * 100) + '% goed)');
  if (skip / (n + skip) > CFG.ITEM_SKIP_MAX) reden.push('vaak overgeslagen of vastgelopen (' + Math.round(100 * skip / (n + skip)) + '%)');
  if (tijd > CFG.ITEM_TIJD_MAX) reden.push('duurt gemiddeld ' + Math.round(tijd / 60) + ' minuten');
  if (sN >= 10 && pS < CFG.ITEM_STERK_MIN) reden.push('ook sterke leerlingen fout (' + Math.round(pS * 100) + '% goed)');
  if (sN >= 10 && zN >= 10 && D < -0.1) reden.push('sterke leerlingen doen het slechter dan zwakke');
  if (reden.length) { x[16] = 'Geblokkeerd'; x[17] = reden.join('; '); return; }
  if (D !== null && sN >= 10 && zN >= 10 && D >= 0.2 && p >= 0.3 && p <= 0.9) { x[16] = 'Werkt goed'; x[17] = 'onderscheidt goed tussen sterk en zwak'; return; }
  x[16] = 'Actief'; x[17] = p > 0.97 ? 'erg makkelijk' : '';
}
// openbaar: alleen de lijst sjabloon-sleutels (geen leerlinggegevens)
function sjablonen_() {
  const L = leesSjablonen_(); const blok = [], sterk = [];
  L.rijen.forEach(function (x) { if (x[16] === 'Geblokkeerd') blok.push(x[0]); else if (x[16] === 'Werkt goed') sterk.push(x[0]); });
  return { ok: true, blok: blok, sterk: sterk };
}
function itemanalyse_(d) {
  checkDocent_(d);
  const L = leesSjablonen_(); const k = KOP.Sjablonen;
  return { ok: true, min: CFG.ITEM_MIN, sjablonen: L.rijen.map(function (x) { const o = {}; k.forEach(function (h, i) { o[h] = x[i] instanceof Date ? x[i].toISOString() : x[i]; }); return o; }) };
}
// docent: sjabloon handmatig vrijgeven, blokkeren, of terug naar automatisch ('')
function sjabloonStatus_(d) {
  checkDocent_(d);
  const L = leesSjablonen_(); const sj = String(d.sj || ''); const st = ['vrijgegeven', 'geblokkeerd', ''].indexOf(d.status) >= 0 ? d.status : '';
  let i = -1; L.rijen.forEach(function (x, j) { if (x[0] === sj) i = j; });
  if (i < 0) { L.rijen.push([sj, sj.split('|')[0], sj.split('|')[1] || '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '']); i = L.rijen.length - 1; }
  L.rijen[i][18] = st; L.rijen[i][19] = new Date(); beoordeel_(L.rijen[i]);
  L.b.getRange(2, 1, L.rijen.length, KOP.Sjablonen.length).setValues(L.rijen);
  log_('', 'docent', '', 'sjabloon', sj + ' → ' + (st || 'automatisch'));
  return { ok: true, status: L.rijen[i][16] };
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
  const niv = s.niv || 1;
  const dom = s.dom || {};
  const pct = DOMEIN_IDS.map(function (d) { const x = dom[niv + '.' + d]; return x ? Math.round(x.b || 0) : ''; });
  const fb = s.fb || {}; let open = 0, zf = 0;
  Object.keys(fb).forEach(function (k) { const f = fb[k]; if (!f.opgelost) { open++; if (f.zf) zf++; } });
  const toetsen = (s.toetsen || []).filter(function (t) { return t.geslaagd; }).length;
  const rij = [new Date(), niv, s.max || niv, Math.round((s.tijd || 0) / 60), Math.round(((s.week || {})[weekId_()] || 0) / 60),
    s.aantal || 0].concat(pct, [open, zf, toetsen]);
  sheet_('Leerlingen').getRange(r.rij, 6, 1, rij.length).setValues([rij]);
}

/** Denkfouten (misconcepties) per klas: hoe vaak, bij hoeveel leerlingen en in welke leerdoelen. */
function topMisc_(klas) {
  const fl = sheet_('Foutenlog'); if (fl.getLastRow() < 2) return [];
  const nk = KOP.Foutenlog.length; const van = Math.max(2, fl.getLastRow() - 5000 + 1);
  const v = fl.getRange(van, 1, fl.getLastRow() - van + 1, nk).getValues(); const tel = {};
  v.forEach(function (x) {
    if (klas && x[4] !== klas) return; const m = x[nk - 1]; if (!m) return;
    const t = tel[m] || (tel[m] = { naam: m, keer: 0, zeker: 0, leerlingen: {}, leerdoelen: {} });
    t.keer++; if (String(x[13]).indexOf('Zeker') === 0) t.zeker++; const w = t.leerlingen[x[2]] || (t.leerlingen[x[2]] = { id: x[2], naam: x[3], keer: 0 }); w.keer++; t.leerdoelen[x[7]] = (t.leerdoelen[x[7]] || 0) + 1;
  });
  return Object.keys(tel).map(function (k) { const t = tel[k]; const wie = Object.keys(t.leerlingen).map(function (k) { return t.leerlingen[k]; }).sort(function (a, b) { return b.keer - a.keer; });
    return { naam: t.naam, keer: t.keer, zeker: t.zeker, leerlingen: wie.length, wie: wie,
    leerdoelen: Object.keys(t.leerdoelen).sort(function (a, b) { return t.leerdoelen[b] - t.leerdoelen[a]; }).slice(0, 4) }; })
    .sort(function (a, b) { return b.leerlingen * 3 + b.keer - (a.leerlingen * 3 + a.keer); }).slice(0, 12);
}

/** Effectmeting: per leerling de eerste voormeting en de laatste nameting, met groepsstatistiek (gemiddelde winst en effectgrootte). */
function effect_(d) {
  checkDocent_(d);
  const b = sheet_('Toetsen'); const n = b.getLastRow() - 1; if (n <= 0) return { ok: true, leerlingen: [], stat: null };
  const v = b.getRange(2, 1, n, KOP.Toetsen.length).getValues(); const per = {};
  v.forEach(function (x) {
    const soort = String(x[5]); const vor = soort.indexOf('Voormeting') === 0, na = soort.indexOf('Nameting') === 0; if (!vor && !na) return;
    if (d.klas && x[4] !== d.klas) return;
    const id = String(x[2]); const o = per[id] || (per[id] = { id: id, naam: x[3], klas: x[4], voor: null, na: null });
    const t = x[1] instanceof Date ? x[1].getTime() : x[1];
    const m = { tijd: t, niveau: x[6], totaal: Number(x[8]), G: x[9], V: x[10], M: x[11], B: x[12] };
    if (vor && !o.voor) o.voor = m; if (na) o.na = m;
  });
  const ll = Object.keys(per).map(function (k) { return per[k]; });
  const paren = ll.filter(function (o) { return o.voor && o.na; }).map(function (o) { return o.na.totaal - o.voor.totaal; });
  let stat = null;
  if (paren.length) {
    const gem = paren.reduce(function (a, b) { return a + b; }, 0) / paren.length;
    const sd = Math.sqrt(paren.reduce(function (a, b) { return a + (b - gem) * (b - gem); }, 0) / Math.max(1, paren.length - 1));
    const voor = ll.filter(function (o) { return o.voor && o.na; }).map(function (o) { return o.voor.totaal; });
    stat = { n: paren.length, voor: voor.reduce(function (a, b) { return a + b; }, 0) / voor.length, winst: gem, sd: sd, d: sd > 0 ? gem / sd : null,
      beter: paren.filter(function (x) { return x > 0; }).length };
  }
  return { ok: true, leerlingen: ll, stat: stat };
}

/** Itemanalyse: per leerdoel hoeveel zelfstandige pogingen, % goed en % zeker-fout (uit de opgeslagen staat). */
function analyse_(d) {
  checkDocent_(d);
  const sp = sheet_('Leerlingen'); const n = sp.getLastRow() - 1; const klasVan = {};
  if (n > 0) sp.getRange(2, 1, n, 3).getValues().forEach(function (x) { klasVan[String(x[0]).toUpperCase()] = x[2]; });
  const db = sheet_('Data'); const m = db.getLastRow() - 1; const tel = {};
  if (m > 0) db.getRange(2, 1, m, 6).getValues().forEach(function (x) {
    const id = String(x[0]).toUpperCase(); if (d.klas && klasVan[id] !== d.klas) return;
    let st; try { st = JSON.parse([x[2], x[3], x[4], x[5]].join('')); } catch (e) { return; }
    const ld = (st && st.ld) || {};
    Object.keys(ld).forEach(function (k) { const o = ld[k]; if (!o || !o.p3) return;
      const t = tel[k] || (tel[k] = { ld: k, pogingen: 0, goed: 0, zekerFout: 0, leerlingen: 0 });
      t.pogingen += o.p3; t.goed += o.g3 || 0; t.zekerFout += o.zf3 || 0; t.leerlingen++; });
  });
  return { ok: true, items: Object.keys(tel).map(function (k) { return tel[k]; }) };
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
// Testfunctie: draai in de editor om te controleren of alles werkt (maakt een testleerling in de laatste klas)
// =====================================================================
function test() {
  const n = nieuw_({ naam: 'Test Leerling', klas: CFG.KLASSEN[CFG.KLASSEN.length - 1] });
  const staat = { ver: 2, upd: Date.now(), niv: 3, max: 3, tijd: 120, aantal: 5,
    dom: { '3.G': { b: 64, st: 'oefenen', n: 5, l: Date.now(), u: Date.now() } }, fb: {}, toetsen: [] };
  const s = sync_({ id: n.id, code: n.code, staat: staat, events: [
    { t: 'fout', eid: 'test-' + Date.now(), niveau: 3, domein: 'G', leerdoel: 'G3.breuk-deel', opgave: 'N3-G-012',
      type: 'open', trede: 3, gegeven: '15', juist: '12', zeker: true, fouttype: 'Begripsfout' }] });
  Logger.log(JSON.stringify(s).slice(0, 500));
}
