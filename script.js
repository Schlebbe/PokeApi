const spinner = document.getElementById("loadingSpinner");
const pokemonCard = document.getElementById("pokemonCard");
const pokemonName = document.getElementById("pokemonName");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonDescription = document.getElementById("pokemonDescription");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

// Bootstrap 5 toast requires initialization
document.addEventListener('DOMContentLoaded', () => {
    const toastEl = document.getElementById('pokemonToast');
    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    toast.show();
});

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
                sprites: {
                    front_default: 'https://ca.slack-edge.com/T4WV23X5X-U07KP4RK281-9711ee434489-512'
                },
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
                document.getElementById("errorMessage").classList.remove("hidden");
                errorText.textContent = `There is no Pokémon with name ${toSearch}.`;
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