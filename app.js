document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const place = document.getElementById('place').value;
    searchPlace(place);
});

async function searchPlace(place) {
    const URL = "https://api.inaturalist.org/v1";
    try {
        // Fetch places
        const placesResponse = await fetch(`${URL}/places/autocomplete?q=${place}`);
        const placesData = await placesResponse.json();
        const places = placesData.results;

        if (places.length === 0) {
            document.getElementById('results').innerHTML = '<p>No places found.</p>';
            return;
        }

        const placeId = places[0].id;

        // Fetch identifications for the selected place
        const identificationsResponse = await fetch(`${URL}/observations?place_id=${placeId}&per_page=10`);
        const identificationsData = await identificationsResponse.json();
        displayResults(identificationsData.results);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

function displayResults(identifications) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (identifications.length === 0) {
        resultsDiv.innerHTML = '<p>No identifications found.</p>';
        return;
    }

    identifications.forEach(identification => {
        const taxon = identification.taxon;
        if (!taxon || !taxon.name) return; 

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';

        const name = document.createElement('h2');
        name.textContent = taxon.name;
        resultDiv.appendChild(name);

        if (taxon.default_photo) {
            const img = document.createElement('img');
            img.src = taxon.default_photo.medium_url;
            img.alt = taxon.name;
            resultDiv.appendChild(img);
        }

        resultsDiv.appendChild(resultDiv);
    });
}
