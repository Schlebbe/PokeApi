function searchPokemon(toSearch) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${toSearch}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}