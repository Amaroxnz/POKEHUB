const container = document.getElementById('grade-pokemons');

// Função para buscar os dados de um Pokémon específico pelo ID
async function buscarPokemon(id) {
    try {
        // Busca os dados básicos (imagem, nome e tipos)
        const respostaId = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dadosBase = await respostaId.json();
        
        // Busca os dados da espécie (onde ficam os textos da Pokédex)
        const respostaEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const dadosEspecie = await respostaEspecie.json();

        // Procura a descrição original padrão em Inglês
        let pokedexDescricao = "Description not found.";
        const textosPokedex = dadosEspecie.flavor_text_entries;
        
        for (let entry of textosPokedex) {
            if (entry.language.name === "en") { // Garante o texto em inglês
                pokedexDescricao = entry.flavor_text;
                break;
            }
        }
        
        // Limpa quebras de linha estranhas que a API costuma enviar
        pokedexDescricao = pokedexDescricao.replace(/[\n\f\r]/g, ' ');

        // Cria o card na tela com a tipagem e a descrição original
        criarCardPokemon(dadosBase, id, pokedexDescricao);

    } catch (erro) {
        console.error("Erro ao buscar o Pokémon " + id, erro);
    }
}

// Função que monta o HTML do card
function criarCardPokemon(pokemon, id, descricao) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    // Formata o número para exibir sempre 3 dígitos (ex: 001, 025)
    const numeroFormatado = String(id).padStart(3, '0');
    
    // Pega o sprite oficial
    const imagemUrl = pokemon.sprites.front_default; 

    // Mapeia os tipos do Pokémon, gerando as bolinhas e cortando para as 3 primeiras letras
    const tiposHTML = pokemon.types.map(info => {
        const nomeTipo = info.type.name;
        const siglaTipo = nomeTipo.substring(0, 3); // Ex: "grass" vira "gra"
        return `<span class="tipo-icone ${nomeTipo}">${siglaTipo}</span>`;
    }).join('');

    // Insere a estrutura interna com os dados reais
    card.innerHTML = `
        <div class="pokemon-id">#${numeroFormatado}</div>
        <img class="pokemon-img" src="${imagemUrl}" alt="${pokemon.name}">
        
        <div class="pokemon-tipos">
            ${tiposHTML}
        </div>

        <h2 class="pokemon-nome">${pokemon.name}</h2>
        <div class="pokemon-descricao">${descricao}</div>
    `;

    // Adiciona o card gerado dentro do container principal
    container.appendChild(card);
}

// Função principal que roda a 1ª Geração (Do Pokémon 1 ao 151)
async function carregarPrimeiraGeracao() {
    for (let i = 1; i <= 151; i++) {
        await buscarPokemon(i);
    }
}

// Inicializa a página carregando os Pokémons
carregarPrimeiraGeracao();