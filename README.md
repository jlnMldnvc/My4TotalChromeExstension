# Work Hours Calculator (Chrome extension)

A small Chrome extension that adds up the time I spend at work, based on the
arrival and departure times shown on a company attendance page. It shows
the total, the number of work days and the balance against an 8-hour day.

## What it does

- Reads arrival/departure pairs from the attendance table on the current page
- Sums the time per day and in total
- Compares the total with 8 hours × number of work days (positive or negative balance)
- Shows a per-day breakdown on "Show details"
- Works entirely in the browser. No data is sent anywhere.

## How it works

1. Clicking the toolbar icon opens a popup (`popup.html`).
2. `popup.js` finds the active tab and injects `moment.js` and
   `getPagesSource.js` with `chrome.scripting.executeScript`.
3. The injected script reads the table, pairs arrivals and departures,
   and returns `{ details, total, days, balance }`.
4. The popup renders the result; `client.js` toggles the details panel.

## Install (developer mode)

1. Clone or download this repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the project folder.
4. Open the attendance page and click the extension icon.

## Adapting it to another page

The extension is written for one specific attendance page. To use it elsewhere:

- change `host_permissions` in `manifest.json` to your page's URL pattern;
- update the selectors in `getPagesSource.js` (`.dolazak`, `.odlazak`, ...)
  and the date format (`DD-MM-YYYY HH:mm:ss`);
- change `REQUIRED_HOURS_PER_DAY` if your day is not 8 hours.

## Tech

- JavaScript (ES6), HTML, CSS
- Chrome Extensions API, Manifest V3 (`scripting`, `activeTab`)
- [moment.js](https://momentjs.com/) for date arithmetic (MIT license, bundled)

## Permissions

| Permission | Why |
|---|---|
| `activeTab`, `scripting` | inject the reader script into the page I am viewing |
| `host_permissions` (one URL pattern) | limit the extension to the attendance page |

## Notes

My own idea, built for personal use to avoid adding up the hours by hand.
The code was refactored from a first working version (cleaner popup,
styles in a separate file, collapsible details).

## License

MIT for my code. `moment.js` is © its authors, MIT licensed.
