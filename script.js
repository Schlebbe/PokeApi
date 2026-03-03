const spinner = document.getElementById("loadingSpinner");
const pokemonCard = document.getElementById("pokemonCard");
const pokemonName = document.getElementById("pokemonName");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonDescription = document.getElementById("pokemonDescription");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const githubApiKey = window.APP_CONFIG?.GITHUB_API_KEY;

// Your Pokémon type colors enum
const PokemonTypeColors = Object.freeze({
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
    teacher: '#FFFF00', // Custom type for the easter egg
    student: '#FF0000', // Custom type for the easter egg
    demigod: '#0000FF', // Custom type for the easter egg
});

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
        errorMessage.classList.add("hidden");
        if (toSearch === "pokeMo") { //TODO: Add easter egg
            typeInfo = [
                {
                    type: {
                        name: "teacher"
                    }
                },
                {
                    type: {
                        name: "student"
                    }
                },
                {
                    type: {
                        name: "demigod"
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

                    generatePokemonDescription(data.name, data)
                        .then(description => {
                            document.getElementById("pokemonSummary").textContent = description;
                        })
                        .catch(error => {
                            console.error("Error generating AI summary:", error);
                            document.getElementById("pokemonSummary").textContent = "Failed to generate AI summary.";
                        });
                });

                return pokemon;

            })
            .catch(error => {
                document.getElementById("errorMessage").classList.remove("hidden");
                errorText.textContent = `There is no Pokémon with name ${toSearch}.`;
            });
    }, 2500);
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
    applyTypeShadow(pokemonImage, data.types.map(t => t.type.name));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function applyTypeShadow(imgEl, types) {
    if (!types || types.length === 0) return;
    imgEl.style.filter = '';

    types.forEach(type => {
        imgEl.style.filter += `drop-shadow(0 4px 25px ${PokemonTypeColors[type]})`;
    });
}

async function generatePokemonDescription(pokemonName, pokemonData) {
    if (!githubApiKey) {
        return "No AI summary available. Add your key in config.local.js.";
    }

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${githubApiKey}`
        },
        body: JSON.stringify({
            messages : [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates a description for a Pokémon based on its name, weight, height, and types.'
                },
                {
                    role: 'user',
                    content: `Generate a short, fun description for a Pokémon with these attributes: Name: ${pokemonData.name}, Weight: ${pokemonData.weight / 10} kg, Height: ${pokemonData.height * 10} cm, Types: ${pokemonData.types.map(t => t.type.name).join(', ')}.`
                }
            ],
            model: 'gpt-5',
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg = data?.error?.message || JSON.stringify(data);
        console.error("AI summary request failed. Status:", response.status);
        console.error("Error details:", errorMsg);
        return `AI summary unavailable: ${errorMsg}`;
    }

    const summary = data?.choices?.[0]?.message?.content;

    if (!summary) {
        console.error("Unexpected AI response format:", data);
        return "AI summary unavailable right now.";
    }

    console.log("AI summary:", summary);
    return summary;
}