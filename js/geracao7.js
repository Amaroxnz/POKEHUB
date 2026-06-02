const container = document.getElementById('grade-pokemons');

// Função para buscar Pokémon
async function buscarPokemon(id) {

    try {

        // Dados principais
        const respostaId = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dadosBase = await respostaId.json();

        // Dados da espécie
        const respostaEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const dadosEspecie = await respostaEspecie.json();

        // Descrição padrão
        let pokedexDescricao = "Description not found.";

        const textosPokedex = dadosEspecie.flavor_text_entries;

        for (let entry of textosPokedex) {

            if (entry.language.name === "en") {

                pokedexDescricao = entry.flavor_text;
                break;
            }
        }

        // Limpa caracteres estranhos
        pokedexDescricao = pokedexDescricao.replace(/[\n\f\r]/g, ' ');

        // Cria card
        criarCardPokemon(dadosBase, id, pokedexDescricao);

    } catch (erro) {

        console.error("Erro ao buscar Pokémon " + id, erro);
    }
}

// Função do card
function criarCardPokemon(pokemon, id, descricao) {

    const card = document.createElement('div');

    card.classList.add('pokemon-card');

    // Número formatado
    const numeroFormatado = String(id).padStart(3, '0');

    // Imagem
    const imagemUrl = pokemon.sprites.front_default;

    // Tipos
    const tiposHTML = pokemon.types.map(info => {

        const nomeTipo = info.type.name;

        const siglaTipo = nomeTipo.substring(0, 3);

        return `
            <span class="tipo-icone ${nomeTipo}">
                ${siglaTipo}
            </span>
        `;

    }).join('');

    // HTML do card
    card.innerHTML = `

        <div class="pokemon-id">
            #${numeroFormatado}
        </div>

        <img
            class="pokemon-img"
            src="${imagemUrl}"
            alt="${pokemon.name}"
        >

        <div class="pokemon-tipos">
            ${tiposHTML}
        </div>

        <h2 class="pokemon-nome">
            ${pokemon.name}
        </h2>

        <div class="pokemon-descricao">
            ${descricao}
        </div>
    `;

    container.appendChild(card);
}

// 7ª geração: IDs 722 até 809
async function carregarSetimaGeracao() {

    for (let i = 722; i <= 809; i++) {

        await buscarPokemon(i);
    }
}

// Inicializa
carregarSetimaGeracao();