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

        // Captura a descrição original padrão em Inglês ('en') direto da PokeAPI
        let pokedexDescricao = "Description not found.";
        const textosPokedex = dadosEspecie.flavor_text_entries;
        
        for (let entry of textosPokedex) {
            if (entry.language.name === "en") {
                pokedexDescricao = entry.flavor_text;
                break;
            }
        }
        
        // Sanatização: Limpa caracteres especiais de quebra de linha do terminal clássico
        pokedexDescricao = pokedexDescricao.replace(/[\n\f\r]/g, ' ');

        // Renderiza o card estruturado na tela
        criarCardPokemon(dadosBase, id, pokedexDescricao);

    } catch (erro) {
        console.error("Erro ao processar requisições do Pokémon " + id, erro);
    }
}

// Função responsável por construir o escopo estrutural do card HTML
function criarCardPokemon(pokemon, id, descricao) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    // Formata o ID para exibir 3 dígitos sempre (Ex: #252)
    const numeroFormatado = String(id).padStart(3, '0');
    const imagemUrl = pokemon.sprites.front_default; 

    // Cria as bolinhas dos tipos reduzindo o texto para 3 letras (Ex: "water" vira "wat")
    const tiposHTML = pokemon.types.map(info => {
        const nomeTipo = info.type.name;
        const siglaTipo = nomeTipo.substring(0, 3);
        return `<span class="tipo-icone ${nomeTipo}">${siglaTipo}</span>`;
    }).join('');

    // Montagem do template string do Card
    card.innerHTML = `
        <div class="pokemon-id">#${numeroFormatado}</div>
        <img class="pokemon-img" src="${imagemUrl}" alt="${pokemon.name}">
        
        <div class="pokemon-tipos">
            ${tiposHTML}
        </div>

        <h2 class="pokemon-nome">${pokemon.name}</h2>
        <div class="pokemon-descricao">${descricao}</div>
    `;

    // Adiciona o elemento criado na página
    container.appendChild(card);
}

// LOOP CONTROLADO: Terceira Geração compreende estritamente os IDs de 252 a 386
async function carregarTerceiraGeracao() {
    for (let i = 252; i <= 386; i++) {
        await buscarPokemon(i);
    }
}

// Inicializa a execução da página
carregarTerceiraGeracao();