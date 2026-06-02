const container = document.getElementById('grade-pokemons');

// Função assíncrona para buscar dados de um Pokémon pelo ID
async function buscarPokemon(id) {
    try {
        // Busca os dados básicos (sprites, nome, tipos)
        const respostaId = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dadosBase = await respostaId.json();
        
        // Busca os dados de espécie (texto descritivo da Pokédex)
        const respostaEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const dadosEspecie = await respostaEspecie.json();

        // Captura a descrição original padrão em Inglês
        let pokedexDescricao = "Description not found.";
        const textosPokedex = dadosEspecie.flavor_text_entries;
        
        for (let entry of textosPokedex) {
            if (entry.language.name === "en") {
                pokedexDescricao = entry.flavor_text;
                break;
            }
        }
        
        // Limpa caracteres especiais de quebra de linha que quebram o layout
        pokedexDescricao = pokedexDescricao.replace(/[\n\f\r]/g, ' ');

        // Renderiza o card na tela com a tipagem e a descrição
        criarCardPokemon(dadosBase, id, pokedexDescricao);

    } catch (erro) {
        console.error("Erro ao processar requisições do Pokémon " + id, erro);
    }
}

// Função responsável por construir o escopo estrutural do card HTML
function criarCardPokemon(pokemon, id, descricao) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    // Formata o ID para três algarismos (Ex: #152)
    const numeroFormatado = String(id).padStart(3, '0');
    const imagemUrl = pokemon.sprites.front_default; 

    // Mapeia os tipos do Pokémon, gerando as bolinhas e cortando para as 3 primeiras letras
    const tiposHTML = pokemon.types.map(info => {
        const nomeTipo = info.type.name;
        const siglaTipo = nomeTipo.substring(0, 3);
        return `<span class="tipo-icone ${nomeTipo}">${siglaTipo}</span>`;
    }).join('');

    // Montagem final do escopo interno do elemento HTML
    card.innerHTML = `
        <div class="pokemon-id">#${numeroFormatado}</div>
        <img class="pokemon-img" src="${imagemUrl}" alt="${pokemon.name}">
        
        <div class="pokemon-tipos">
            ${tiposHTML}
        </div>

        <h2 class="pokemon-nome">${pokemon.name}</h2>
        <div class="pokemon-descricao">${descricao}</div>
    `;

    // Anexa o card gerado ao container principal da grid
    container.appendChild(card);
}

// LÓGICA DO LOOP: Segunda Geração compreende os IDs de 152 a 251
async function carregarSegundaGeracao() {
    for (let i = 152; i <= 251; i++) {
        await buscarPokemon(i);
    }
}

// Inicializa o fluxo de execução do sistema
carregarSegundaGeracao();