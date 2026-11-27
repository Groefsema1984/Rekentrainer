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
