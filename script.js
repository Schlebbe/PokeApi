function searchPokemon(toSearch) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${toSearch}`)
        .then(response => {
            console.log(response.status)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let pokemon = {
                }

            response.json().then(data => {
                 pokemon = {
                    name: data.name,
                    id: data.id,
                    sprites: data.sprites.front_default,
                    weight: data.weight,
                    height: data.height
                }
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
}