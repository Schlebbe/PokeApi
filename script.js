let spinner = document.getElementById("loadingSpinner");
let pokemonCard = document.getElementById("pokemonCard");
let pokemonName = document.getElementById("pokemonName");
let pokemonImage = document.getElementById("pokemonImage");
let pokemonDescription = document.getElementById("pokemonDescription");

function searchPokemon(toSearch) {
    pokemonCard.classList.add("hidden");
    spinner.classList.remove("hidden");
    setTimeout(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${toSearch}`)
            .then(response => {
                spinner.classList.add("hidden");
                if (!response.ok) {
                    document.getElementById("pokemonCard").classList.add("hidden");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let pokemon = {};

                response.json().then(data => {
                    pokemon = {
                        name: data.name,
                        id: data.id,
                        sprites: data.sprites.front_default,
                        weight: data.weight,
                        height: data.height
                    };

                    pokemonName.textContent = pokemon.name;
                    pokemonImage.src = pokemon.sprites;
                    pokemonDescription.textContent = `ID: ${pokemon.id}, Weight: ${pokemon.weight}, Height: ${pokemon.height}`;
                    pokemonCard.classList.remove("hidden");
                    // spinner.classList.add("hidden");

                    console.log({
                        name: data.name,
                        id: data.id,
                        sprites: data.sprites.front_default,
                        weight: data.weight,
                        height: data.height
                    });
                });

                return pokemon;

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, 1000);
}