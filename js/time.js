// Configurações Globais de Paginação da API (Todas as gerações até a Gen 9)
let offset = 0;
const limit = 50;
let carregando = false;
let buscandoAtivo = false;

// Inicialização dos Slots vazios do time (6 slots)
let time = [null, null, null, null, null, null];
let slotAtivo = null;

// Referências dos Elementos do HTML
const campoBatalha = document.getElementById('campoBatalha');
const modalOverlay = document.getElementById('modalOverlay');
const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnSalvarTime = document.getElementById('btnSalvarTime');

// Executa assim que a página terminar de carregar os elementos básicos
document.addEventListener('DOMContentLoaded', () => {
    // Tenta ler o time salvo anteriormente no localStorage
    const timeSalvo = localStorage.getItem('meuTime');
    if (timeSalvo) {
        try {
            time = JSON.parse(timeSalvo);
        } catch (e) {
            console.error("Erro ao ler dados do time salvo", e);
        }
    }
    
    // Inicializa a interface gráfica
    renderizarSlots();
    carregarPokemonsAPI();

    // Evento de digitação na barra de busca (com delay de 500ms para poupar internet)
    searchInput.addEventListener('input', debounce(() => {
        filtrarPokemonsGlobal();
    }, 500));

    // Evento para o botão de carregar mais
    loadMoreBtn.addEventListener('click', () => {
        if (!buscandoAtivo) carregarPokemonsAPI();
    });

    // Evento para fechar o modal
    btnFecharModal.addEventListener('click', fecharModal);

    // Evento para salvar o time
    btnSalvarTime.addEventListener('click', salvarTime);
});

// Gera visualmente os 6 slots no seu campo de batalha
function renderizarSlots() {
    campoBatalha.innerHTML = '';
    
    time.forEach((pk, index) => {
        const slot = document.createElement('div');
        slot.className = 'slot-pokemon';
        
        if (pk) {
            slot.innerHTML = `
                <img src="${pk.sprite}" alt="${pk.nome}">
                <div class="slot-info">
                    <span class="slot-numero">#${String(pk.id).padStart(3, '0')}</span>
                    <span class="slot-nome">${pk.nome}</span>
                </div>
            `;
        } else {
            slot.innerHTML = `
                <div class="slot-vazio" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 120px; cursor: pointer; color: #ffcc00;">
                    <span style="font-size: 32px; font-weight: bold;">+</span>
                    <p style="font-family: 'Orbitron', sans-serif; font-size: 14px; text-transform: uppercase;">Adicionar</p>
                </div>
            `;
        }
        
        // Atribui o evento de clique direto no slot gerado
        slot.addEventListener('click', () => abrirModal(index));
        campoBatalha.appendChild(slot);
    });
}

// Consome a PokeAPI em lotes de 50 registros por vez
async function carregarPokemonsAPI() {
    if (carregando || offset >= 1025) return;
    carregando = true;
    loadMoreBtn.textContent = "Buscando dados na rede...";

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const dados = await resposta.json();

        for (let item of dados.results) {
            const id = item.url.split('/')[6];
            if (parseInt(id) > 1025) continue; // Trava de segurança no final da geração 9

            const nomeFormatado = item.name.toUpperCase();
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            criarCardNoModal(id, nomeFormatado, spriteUrl);
        }

        offset += limit;
        loadMoreBtn.textContent = "Carregar Mais Pokémon";
    } catch (erro) {
        console.error("Erro ao processar requisição da API:", erro);
        loadMoreBtn.textContent = "Erro ao carregar. Tente novamente.";
    } finally {
        carregando = false;
    }
}

// Faz a busca instantânea pelo nome exato ou ID direto na API global
async function filtrarPokemonsGlobal() {
    const termo = searchInput.value.toLowerCase().trim();

    if (termo === "") {
        buscandoAtivo = false;
        pokemonGrid.innerHTML = '';
        offset = 0;
        loadMoreBtn.style.display = 'block';
        await carregarPokemonsAPI();
        return;
    }

    buscandoAtivo = true;
    loadMoreBtn.style.display = 'none';
    pokemonGrid.innerHTML = '<div style="color:#fff; font-family:\'Orbitron\'; padding: 20px; text-align: center; width: 100%;">Buscando na Pokédex global...</div>';

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);
        if (resposta.ok) {
            const pk = await resposta.json();
            pokemonGrid.innerHTML = ''; 
            criarCardNoModal(pk.id, pk.name.toUpperCase(), pk.sprites.front_default);
        } else {
            pokemonGrid.innerHTML = '<div style="color:#ff4444; font-family:\'Orbitron\'; padding: 20px; text-align: center; width: 100%;">Nenhum Pokémon encontrado.</div>';
        }
    } catch (erro) {
        pokemonGrid.innerHTML = '<div style="color:#ff4444; font-family:\'Orbitron\'; padding: 20px; text-align: center; width: 100%;">Erro na busca.</div>';
    }
}

// Cria os elementos clicáveis de cada Pokémon dentro do modal
function criarCardNoModal(id, nome, sprite) {
    const card = document.createElement('div');
    card.className = 'carta-pokemon';
    card.innerHTML = `
        <img src="${sprite || 'https://play.pokemonshowdown.com/sprites/trainers/red.png'}" alt="${nome}" loading="lazy">
        <span style="font-family: 'Orbitron', sans-serif; font-size: 11px; margin-top: 5px;">#${String(id).padStart(3, '0')} ${nome}</span>
    `;
    
    const dadosPokemon = { id: id, nome: nome, sprite: sprite };
    card.addEventListener('click', () => selecionarPokemon(dadosPokemon));
    
    pokemonGrid.appendChild(card);
}

// Funções de Gerenciamento do Modal
function abrirModal(slot) {
    slotAtivo = slot;
    modalOverlay.style.display = 'flex'; // Força a exibição do overlay do modal
}

function fecharModal() {
    modalOverlay.style.display = 'none';
    searchInput.value = '';
}

function selecionarPokemon(pk) {
    time[slotAtivo] = pk;
    renderizarSlots();
    fecharModal();
}

// Salva o array de objetos estruturados no banco local
function salvarTime() {
    localStorage.setItem('meuTime', JSON.stringify(time));
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

// Função auxiliar técnica (Debounce) para evitar travar o navegador enquanto digita
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}