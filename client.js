// Čekamo da se DOM (struktura stranice) učita pre nego što dodamo listener
document.addEventListener('DOMContentLoaded', () => {

	// Pronalazimo dugme po ID-u
	const detailsButton = document.getElementById('details-btn');

	// Proveravamo da li dugme postoji da bismo izbegli greške
	if (detailsButton) {
		// Dodajemo 'click' event listener na dugme
		detailsButton.addEventListener('click', () => {
			// Pronalazimo kontejner sa detaljima
			const detailsContainer = document.getElementById('details_container');
			if (detailsContainer) {
				// Uključujemo ili isključujemo 'show' klasu
				detailsContainer.classList.toggle('show');
				//
				// Opciono: promena teksta dugmeta
				detailsButton.textContent = detailsContainer.classList.contains('show')
					? 'Hide details'
					: 'Show details';
			} else {
				console.error("Element details_container nije pronađen!");
			}
		});
	} else {
		console.error("Element details-btn nije pronađen!");
	}
});
