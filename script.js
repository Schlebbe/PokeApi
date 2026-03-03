let spinner = document.getElementById("loadingSpinner");
let pokemonCard = document.getElementById("pokemonCard");
let pokemonName = document.getElementById("pokemonName");
let pokemonImage = document.getElementById("pokemonImage");
let pokemonDescription = document.getElementById("pokemonDescription");
let errorMessage = document.getElementById("errorMessage");

function searchPokemon(toSearch) {
    pokemonCard.classList.add("hidden");
    spinner.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    setTimeout(() => {
        if (toSearch === "pokeMo") { //TODO: Add easter egg
            typeInfo = [
                {
                    type: {
                        name: "Teacher"
                    }
                },
                {
                    type: {
                        name: "Student"
                    }

                },
                {
                    type: {
                        name: "Demigod"
                    }
                }
            ]
            let pokemon = {
                name: "Mo",
                id: "???",
                sprites: 'https://ca.slack-edge.com/T4WV23X5X-U07KP4RK281-9711ee434489-512',
                weight: "???",
                height: "???",
                types: typeInfo
            }
            spinner.classList.add("hidden");
            renderPokemon(pokemon);
            return;
        }


        fetch(`https://pokeapi.co/api/v2/pokemon/${toSearch}`)
            .then(response => {
                spinner.classList.add("hidden");
                if (!response.ok) {
                    document.getElementById("pokemonCard").classList.add("hidden");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let pokemon = {};

                response.json().then(data => {
                    renderPokemon(data);
                });

                return pokemon;

            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById("errorMessage").classList.remove("hidden");
                errorMessage.textContent = `There is no Pokémon with name ${toSearch}. Check Spelling and try again.`;
            });
    }, 1000);
}

function renderPokemon(data) {
    let pokemon = {
        name: data.name,
        id: data.id,
        sprites: data.sprites.front_default,
        weight: data.weight !== "???" ? data.weight / 10 : "???",
        height: data.height !== "???" ? data.height * 10 : "???",
        types: data.types.map(typeInfo => {
            return capitalizeFirstLetter(typeInfo.type.name);
        }).join(", ")
        
    }

    pokemonName.textContent = pokemon.name;
    pokemonImage.src = pokemon.sprites;
    pokemonDescription.textContent = `ID: ${pokemon.id}, Weight: ${pokemon.weight} kg, Height: ${pokemon.height} cm, Types: ${pokemon.types}`;
    pokemonCard.classList.remove("hidden");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}