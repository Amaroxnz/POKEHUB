const gradePokemons = document.getElementById("grade-pokemons");

const ID_INICIAL = 494;
const ID_FINAL = 649;

async function buscarPokemon(id) {
    try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        ]);

        const pokemon = await pokemonResponse.json();
        const species = await speciesResponse.json();

        const descricao =
            species.flavor_text_entries
                .find(entry => entry.language.name === "en")
                ?.flavor_text
                .replace(/[\n\f\r]/g, " ")
                || "No description available.";

        const tiposHTML = pokemon.types
            .map(tipo => `
                <span class="tipo-icone ${tipo.type.name}">
                    ${tipo.type.name.substring(0, 3)}
                </span>
            `)
            .join("");

        const card = document.createElement("div");
        card.classList.add("pokemon-card");

        card.innerHTML = `
            <div class="pokemon-id">
                #${String(pokemon.id).padStart(3, "0")}
            </div>

            <img
                class="pokemon-img"
                src="${pokemon.sprites.front_default}"
                alt="${pokemon.name}"
            >

            <div class="pokemon-tipos">
                ${tiposHTML}
            </div>

            <div class="pokemon-nome">
                ${pokemon.name}
            </div>

            <div class="pokemon-descricao">
                ${descricao}
            </div>
        `;

        gradePokemons.appendChild(card);

    } catch (erro) {
        console.error(`Erro ao carregar Pokémon ${id}:`, erro);
    }
}

async function carregarGeracao5() {
    for (let id = ID_INICIAL; id <= ID_FINAL; id++) {
        await buscarPokemon(id);
    }
}

carregarGeracao5();