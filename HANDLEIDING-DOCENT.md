# Rekenen op Niveau: handleiding voor de docent

Eén adaptieve leerlijn zonder klasgrenzen, van de basisschool tot vwo-eindniveau. Twaalf niveaus.
Niveau 1–4 = groep 3–6, niveau 5 = groep 7 (1F), niveau 6 = groep 8 (1S), niveau 7–12 = klas 1–6 vwo. Niveau 8 is 2F, niveau 12 is 3F.
Het doel hangt af van het schooltype: vmbo tot niveau 8, havo tot niveau 11, vwo tot niveau 12.

De vormgeving past zich aan het niveau aan: op niveau 1–4 grotere tekst en knoppen, korte zinnen en plaatjes (rekenrek, klok, munten, blokjes, beeldgrafieken). De rekenmachine is uit op niveau 1–6 en wordt vanaf niveau 7 per opgave bepaald.

## Voor leerlingen
1. Open de app op de iPad. Tip: Deel › Zet op beginscherm.
2. Kies "Nieuw account": vul je naam in en kies je groep of klas (vanaf klas 1 met vmbo, havo of vwo). Je krijgt een **leerling-ID** en een **6-cijferige herstelcode**. Schrijf die op.
3. Daarna maak je de **instaptoets** (16 opgaven). Die begint op het niveau van je groep of klas (groep 3 op niveau 1, groep 8 op niveau 6, klas 2 havo op niveau 7, …) en past zich per vraag aan: na een fout een niveau lager, na twee goed achter elkaar een niveau hoger.
4. Oefen met "Verder oefenen". Bij elk antwoord kies je **Zeker!** of **Gok?**. Een fout antwoord geeft uitleg, een uitwerking en daarna een spiegelvraag.
5. Staan alle vier domeinen op 80%, dan gaat de **rekentoets** open. Haal je die (elk domein en het totaal ≥ 80%), dan ga je naar het volgende niveau.
6. Van groep of klas gewisseld? Via het account-scherm › *groep of klas wijzigen*.
7. Op een ander apparaat: kies "Ik heb al een account" en vul je ID en herstelcode in.

## Extra's voor leerlingen
- **Rekenfit (2 minuten):** kale sommen op niveau (tafels, ×10, breuk–komma–procent, …). Goed als warming-up aan het begin van de les.
- **Eerst schatten:** bij opgaven met rekenmachine kiest de leerling eerst de ordegrootte. Zit een antwoord er een factor 5 of meer naast, dan krijgt hij een controletip.
- **Toetsopgaven in rekentoetsstijl:** contextopgaven met een bron (webshop, dienstregeling, tarieven) en overbodige informatie. Elke rekentoets bevat er minstens 3.
- **Lees voor** en **woordenlijst:** tik op een onderstreept rekenwoord voor uitleg.
- **Modellen:** bij uitgewerkte voorbeelden een dubbele getallenlijn of strook.
- **Model-knop (✏️):** bij elke oefenopgave kan de leerling zelf een strook verdelen en inkleuren, of een wijzer over een dubbele getallenlijn schuiven (bv. bedrag boven, 0–100% onder).
- **Schema bij verhaalsommen:** bij verhoudingsopgaven zet de leerling eerst de getallen uit de tekst in een verhoudingstabel (het ? is wat je zoekt). Daarna gaat het antwoordvak open.
- **Herhaalplanning (menu Planning):** beheerste onderdelen komen terug na 2 dagen, 1 week, 2 weken, 1 maand en 2 maanden. De leerling ziet per dag wat er terugkomt en kan met *Herhaal nu* direct de herhaalmomenten van vandaag doen.

## Hoe het adaptief werkt
- Elk leerdoel begint met een gewone opgave. Gaat die fout, dan krijgt de leerling een uitgewerkt voorbeeld (trede 1) en daarna een voorbeeld met één open stap (trede 2).
- Fouten komen in de **foutenbank** en keren terug (na een paar opgaven, na 1 dag en na 3 dagen). *Zeker én fout* komt het vaakst terug.
- Is een leerling na 24 opgaven op een niveau onder de 40% goed, dan gaat het niveau één omlaag.
- De rekenmachine verschijnt alleen bij opgaven waarbij hij in de rekentoets ook mag.

## Docentenscherm
Klik rechtsboven op **Docent** en vul de docentcode uit `Code.gs` in. Je ziet dan:
- per klas alle leerlingen met niveau, domeinscores, oefentijd en open fouten;
- de hardnekkigste fouten van de klas (zeker én fout weegt zwaarder);
- per leerling alle fouten en toetsen;
- een schakelaar om de rekentoets per klas vrij te geven of dicht te zetten;
- **Denkfouten**: fouten gegroepeerd per misconceptie (bijvoorbeeld "delen door het verkeerde geheel"), met een tip voor een mini-instructie;
- **Analyse van de vragen**: per leerdoel het percentage goed bij de eerste poging en het percentage zeker-fout, met een signaal (te makkelijk / te moeilijk);
- export naar CSV.

## Google Sheet
- **Leerlingen**: één rij per leerling, met de herstelcode (handig als iemand die kwijt is).
- **Voortgang**: beheersing per niveau en domein.
- **Foutenlog**: elke fout, met zeker/gok en fouttype.
- **Toetsen**: instaptoetsen en rekentoetsen.
- **Logboek**: nieuwe accounts, herstelpogingen en niveauwissels.

Na een wijziging in Code.gs: Implementeren › Implementaties beheren › bewerken › Nieuwe versie (de URL blijft dan hetzelfde).

## Automatische kwaliteitscontrole van de opgaven
Na elke gemaakte opgave stuurt de app een klein gegeven naar de Sheet: welk opgavesjabloon (leerdoel + vraagvorm), goed of fout, Zeker of Gok, hoe lang het duurde, of de leerling afhaakte, en of de leerling op dat onderdeel sterk is. In het tabblad **Sjablonen** telt Code.gs dit op.

Vanaf 30 pogingen beoordeelt het systeem elk sjabloon:
- **Geblokkeerd** als bijna iedereen hem fout maakt (minder dan 15% goed), als meer dan 25% afhaakt, als het gemiddeld langer dan 5 minuten duurt, als ook sterke leerlingen hem vaak fout maken, of als sterke leerlingen het slechter doen dan zwakke. De app biedt een geblokkeerd sjabloon dan niet meer aan (een leerdoel blijft altijd bereikbaar via de andere vormen).
- **Werkt goed** als hij duidelijk onderscheid maakt tussen sterke en zwakke leerlingen. Die vorm komt vaker aan bod.

In het docentscherm › *Analyse van de vragen* zie je de lijst met reden. Met **Herstel** geef je een sjabloon weer vrij, met **Blokkeer** zet je hem zelf uit. De grenzen staan bovenaan in Code.gs (CFG.ITEM_…) en kun je daar aanpassen.

Ook nieuw: Enter in het antwoordvak telt niet meer als "Zeker". De leerling kiest altijd zelf Zeker of Gok, zodat "Zeker én fout" betrouwbaar is.

## Ontwikkelaarsmodus
Voor de maker en docent: alle 12 niveaus open en elke opgave direct bekijken.
1. Klik op **Docent** en log in met de docentcode.
2. Klik op **🛠 Ontwikkelaarsmodus**. De app herlaadt met een paars label *Ontwikkelaar*.
3. Via het menu **🛠 Ontwikkelaar** kies je een niveau. Je kunt dan de rekentoets of instaptoets van dat niveau starten, of per leerdoel elk vraagtype openen (Zelf doen, Meerkeuze, Voorbeeld, Invulsom, Saboteur, Koppel, …).

Het ontwikkelaarsprofiel staat apart opgeslagen. Een leerlingaccount op hetzelfde apparaat blijft gewoon staan en komt terug zodra je *Ontwikkelaarsmodus verlaten* kiest. In de ontwikkelaarsmodus gaat er niets naar de Google Sheet: geen voortgang, geen foutenlog en niets in de vraagcontrole.

## Groep 3 tot en met 6 (niveau 1–4)
- Per onderwerp bouwt de invoer op: de eerste 3 opgaven zijn grote antwoordtegels om op te tikken, daarna een open vraag met grote cijfertoetsen in beeld (typen mag ook), en als het onderwerp goed gaat (75% of 12 opgaven) gewoon typen. De cijfertoetsen zijn met één tik terug te halen.
- Op niveau 1–2 wordt elke vraag vanzelf voorgelezen (knop *Voorlezen: aan/uit*).

## Uitgewerkte voorbeelden
Bij elk uitgewerkt voorbeeld staat naast de goede aanpak ook de meest gemaakte denkfout ("Zo gaat het vaak mis"). Goed en fout vergelijken helpt leerlingen de kern te zien.

## Voor ouders (menu Ouders)
Een weekoverzicht: oefentijd, wat goed gaat, wat nog moeite kost en een concrete tip voor thuis. Te printen, als pdf te bewaren of als tekst te kopiëren. Er worden geen extra persoonsgegevens gevraagd.

## Instructiegroepjes (docentendashboard)
Onder *Denkfouten* staat een voorstel voor instructiegroepjes: leerlingen met dezelfde denkfout bij elkaar, met een tip voor de mini-instructie. Daaronder per leerling de eigen denkfouten.

## Oefentoetsen (menu Oefentoets)
Doorstroomtoets groep 8 (1F/1S, 24 opgaven, 45 min, zonder rekenmachine), rekentoets 2F (30 opgaven, 60 min) en 3F (30 opgaven, 75 min). Met klok en zonder uitleg tussendoor; daarna score per domein en de fouten nabespreken. Een oefentoets verandert het niveau niet.

## Offline en rustige modus
- Zet de app op het beginscherm: hij werkt dan ook zonder internet. Antwoorden worden bewaard en later verstuurd. Een nieuwe versie komt vanzelf door zodra er weer internet is.
- *Account › Rustige modus*: meer ruimte tussen regels en woorden, geen bewegingen of foto's, en 50% extra tijd bij oefentoetsen en metingen. Bedoeld voor leerlingen met dyscalculie, dyslexie of die snel overprikkeld raken.

## Effectmeting (voor de pilot)
- Leerling: *Oefentoets › Voor- en nameting*. De voormeting meet op het huidige niveau (20 opgaven, 30 min). De nameting gebruikt precies dezelfde soorten opgaven met andere getallen, liefst na minstens 4 weken.
- Docent: knop **Effectmeting** in het dashboard. Per leerling voor, na en verschil; voor de groep de gemiddelde winst en de effectgrootte (d). Export naar CSV.
- Tip: laat een vergelijkingsklas dezelfde metingen maken zonder de app; dan zie je het effect van de app los van de gewone groei.

## Voorleesstem Roos (ElevenLabs)
De app kan voorlezen met de stem Roos van ElevenLabs in plaats van de stem van het apparaat. Alleen de opgavetekst gaat naar ElevenLabs, nooit gegevens van leerlingen. De sleutel staat alleen in Apps Script (Scripteigenschappen), nooit in de app of op GitHub.
- Instellen: Scripteigenschappen `ELEVENLABS_KEY` en `ELEVENLABS_VOICE` (optioneel `STEM_MAX_TEKENS`, standaard 9500 per maand), daarna een nieuwe versie implementeren.
- Docentendashboard › **Voorleesstem**: aan/uit, verbruik deze maand en de laatste foutmelding van ElevenLabs.
- Is de stem uit, het maximum bereikt of ElevenLabs onbereikbaar, dan leest de app voor met de stem van het apparaat.
- Een zin die al eens is voorgelezen, wordt op het apparaat bewaard en kost geen tekens meer.
- Gratis versie van ElevenLabs: niet voor commercieel gebruik en met bronvermelding. Die staat onderaan de app zolang de stem actief is.

## Vragenbank en kwaliteit (uitbreiding 29-11-2026)
De vragenbank telt nu 247 leerdoelen (was 196). Niveau 1–5 hebben elk minstens 18 leerdoelen en dekken nu ook vormen en hoeken, symmetrie, inhoud, kalender, kommagetallen, negatieve getallen (thermometer), schaal en het gemiddelde. Niveau 6–12 zijn aangevuld waar onderdelen ontbraken. Bij meerkeuzevragen is elk fout antwoord nu een herkenbare denkfout met uitleg. Op niveau 2–5 staan "vind de fout"-opgaven (saboteurs), en op niveau 5–7 toetsopgaven met een bron, zoals in de doorstroomtoets.

Voor leerlingen die al bezig waren, tellen de nieuwe leerdoelen pas mee in hun percentage zodra ze die geoefend hebben. Hun voortgang zakt dus niet door de uitbreiding.
