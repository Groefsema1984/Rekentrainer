# Rekentrainer: handleiding voor de docent

## Voor leerlingen
1. Open de app op de iPad. Tip: Deel › Zet op beginscherm.
2. Kies "Nieuw account": vul je naam en klas in. Je krijgt een **leerling-ID** en een **6-cijferige herstelcode**. Schrijf die op.
3. Daarna maak je de **instaptoets**. Die bepaalt je startniveau (Niveau 1 = 1F t/m Niveau 8 = 3F eindniveau vwo).
4. Oefen met "Verder oefenen". Bij elk antwoord kies je **Zeker!** of **Gok?**. Een fout antwoord geeft uitleg, een uitwerking en daarna een spiegelvraag.
5. Staan alle vier domeinen op 80%, dan gaat de **rekentoets** open. Haal je die (elk domein en het totaal ≥ 80%), dan ga je naar het volgende niveau.
6. Op een ander apparaat: kies "Ik heb al een account" en vul je ID en herstelcode in.

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
- export naar CSV.

## Google Sheet
- **Leerlingen**: één rij per leerling, met de herstelcode (handig als iemand die kwijt is).
- **Voortgang**: beheersing per niveau en domein.
- **Foutenlog**: elke fout, met zeker/gok en fouttype.
- **Toetsen**: instaptoetsen en rekentoetsen.
- **Logboek**: nieuwe accounts, herstelpogingen en niveauwissels.

Na een wijziging in Code.gs: Implementeren › Implementaties beheren › bewerken › Nieuwe versie (de URL blijft dan hetzelfde).
