// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: let serialized_html = DOMtoString(document);

/**
 * Funkcija za ekstrakciju i obradu podataka iz DOM-a.
 * @param {Document|Element} document_root - DOM koren (npr. document ili neki element)
 * @returns {Object} - Objekat sa detaljima, ukupnim vremenom, brojem dana i bilansom
 */
function DOMtoString(document_root) {

    const REQUIRED_HOURS_PER_DAY = 8;
    const TIME_ROW_SELECTOR = ".vremeBelo, .vremeSivo";
    const ARRIVAL_SELECTOR = ".dolazak";
    const DEPARTURE_SELECTOR = ".odlazak";
    const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss'
    const REVERSE_DATE_FORMAT = 'YYYY-MM-DD'

    let details = "";
    let totalSeconds = 0;
    const uniqueDates = [];
    const ukupnoPoDanu = {}; // Ključ: datum, Vrednost: ukupan broj sekundi za taj dan
    let numberOfDays = 0;

    try {
        // Pronalazi sve elemente sa klasama .vremeBelo i .vremeSivo
        const timeElements = document_root.querySelectorAll(TIME_ROW_SELECTOR);

        timeElements.forEach(element => {

            // Pronalazi prvi .dolazak i .odlazak unutar trenutnog elementa
            const dolazakNode = element.querySelector(ARRIVAL_SELECTOR);
            const odlazakNode = element.querySelector(DEPARTURE_SELECTOR);

            const dolazak = dolazakNode ? dolazakNode.innerHTML : null;
            const odlazak = odlazakNode ? odlazakNode.innerHTML : null;

            if (dolazak && odlazak) {

                // provera da li je moment.js dostupan
                if (typeof moment === 'undefined') {
                    return {
                        error: "Biblioteka nije učitana - moment.js nedostaje."
                    }
                }

                // Parsiranje datuma pomoću moment.js
                // Kreiramo 'Date' objekat iz stringa sa specifičnim formatom
                const dateDolazak = moment(dolazak.trim(), DATE_TIME_FORMAT);
                const dateOdlazak = moment(odlazak.trim(), DATE_TIME_FORMAT);


                const dayOfMonth = dateDolazak.format(REVERSE_DATE_FORMAT);
                //const dayOfMonth = dateDolazak.date();
                
                // Izračunaj razliku u sekundama
                const diffSeconds = dateOdlazak.diff(dateDolazak, 'seconds', true);
                ///////////////////////////////

                // Ako već postoji unos za taj dan, dodajemo razliku
                if (ukupnoPoDanu[dayOfMonth]) {
                    ukupnoPoDanu[dayOfMonth] += diffSeconds;

                } else {
                    // Ako ne postoji, kreiramo novi unos
                    ukupnoPoDanu[dayOfMonth] = diffSeconds;

                    // Provera jedinstvenih datuma
                    // if (uniqueDates.indexOf(dayOfMonth) === -1)
                    // Ako datum nije već dodat u uniqueDates, dodaj ga
                    uniqueDates.push(dayOfMonth);
                    numberOfDays++;
                }

                /////////////////////////////

                totalSeconds += diffSeconds;
            }
        });

        ////////////////////////////

        // Generisanje details stringa sa sabranim vremenima po danu
        uniqueDates.forEach(date => {
            const dateObj = moment(date, REVERSE_DATE_FORMAT);

            const formatedDolazak = dateObj.format('LL');
            const daySeconds = ukupnoPoDanu[date];

            // Konvertuj sekunde u sate, minute i sekunde za dnevni prikaz
            const hDay = Math.floor(daySeconds / 3600);
            const mDay = Math.floor((daySeconds % 3600) / 60);
            const sDay = Math.floor(daySeconds % 60);

            // Formatiranje datuma
            const part = `${formatedDolazak} : ${hDay}h, ${mDay}m, ${sDay}s\n`;
            details += part;
        });

        //////////////////////////////

        // Ukupno vreme u satima, minutima i sekundama
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        // Bilans se sada računa u sekundama (8 sati = 8 * 3600 sekundi)
        const bilansInSeconds = totalSeconds - (numberOfDays * REQUIRED_HOURS_PER_DAY * 3600);

        const absBilans = Math.abs(bilansInSeconds);

        const hBilans = Math.floor(absBilans / 3600);
        const mBilans = Math.floor((absBilans % 3600) / 60);
        const sBilans = absBilans % 60;

        const bilansString = `${hBilans}h, ${mBilans}m, ${sBilans}s`;

        /* if (bilansInSeconds < 0) {
            returnObject.bilans = "-" + bilansString;
        } else if (bilansInSeconds > 0) {
            returnObject.bilans = "+" + bilansString;
        } else {
            returnObject.bilans = bilansString;
        } */

        let textBilans = (bilansInSeconds < 0 ? "-" : bilansInSeconds > 0 ? "+" : "") + bilansString

        return {
            details: details.trim(),
            total: `${h}h, ${m}m, ${s}s`,
            days: numberOfDays,
            bilans: textBilans
        };

    } catch (e) {
        console.error("Error in DOMtoString:", e);
        return { error: e.message };
    }
}

DOMtoString(document);