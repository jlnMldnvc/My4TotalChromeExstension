// Funkcija koja se izvršava kada se popup prozor učita
async function onWindowLoad() {
  const messageDiv = document.querySelector('#message');

  if (!chrome.tabs) {
    throw new Error("chrome.tabs API nije dostupan");
  }

  // Dohvati trenutno aktivni tab
  //let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs || tabs.length === 0) {
    throw new Error("Nema aktivnog taba");
  }

  // Dohvati trenutno aktivni tab
  let [tab] = tabs;

  // Proveri da li imamo pristup stranici pre nego što ubacimo skripte
  // Ovo sprečava greške na stranicama poput "chrome://"
  if (tab.url.startsWith('http')) {
    try {
      // Ubaci skripte koristeći novi `scripting` API
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["moment.js", "getPagesSource.js"]
      });

      // Rezultat je niz. Uzimamo prvi rezultat (od prvog frejma)
      if (injectionResults && injectionResults[0] && injectionResults[0].result) {
        const source = injectionResults[0].result;

        // Popuni popup sa dobijenim podacima
        displayData(source)

      } else {
        messageDiv.innerText = 'Could not retrieve data from the page.';
      }

    } catch (error) {
      console.error('Failed to inject script:', error);
      messageDiv.innerText = 'Error: Failed to inject script.\n' + error.message;
    }
  } else {
    messageDiv.innerText = "This extension cannot run on this page.";
  }
}

function displayData(data) {
  const total = document.getElementById('total');
  const days = document.getElementById('days');
  const bilans = document.getElementById('bilans');
  const detailsContainer = document.getElementById('details_container');

  if (total && days && bilans && detailsContainer) {
    total.innerText = data.total;
    days.innerText = data.days;
    bilans.innerText = data.bilans;
    detailsContainer.innerText = data.details;
  }
}

// Postavi listener da se funkcija izvrši kada se sadržaj popup-a učita
document.addEventListener('DOMContentLoaded', onWindowLoad);