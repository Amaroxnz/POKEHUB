// Mapear os elementos do HTML
const avatarAtual = document.getElementById('avatar-atual');
const opcoesAvatar = document.querySelectorAll('.opcao-avatar');
const inputNick = document.getElementById('input-nick');
const btnSalvar = document.getElementById('btn-salvar');

// VARIÁVEL LOCAL PARA ARMAZENAR O AVATAR SELECIONADO
let avatarSelecionadoTemporario = "";

// Executa assim que a página abre
document.addEventListener('DOMContentLoaded', () => {
    // 1. Recupera o Nick salvo e joga no campo de input
    const nickSalvo = localStorage.getItem('nickSelecionado');
    if (nickSalvo) {
        inputNick.value = nickSalvo;
    } else {
        inputNick.value = "Treinador"; // Valor padrão caso esteja vazio
    }

    // 2. Recupera o Avatar salvo
    const avatarSalvo = localStorage.getItem('avatarSelecionado');
    if (avatarSalvo) {
        avatarAtual.src = avatarSalvo;
        avatarSelecionadoTemporario = avatarSalvo;
    } else {
        avatarSelecionadoTemporario = avatarAtual.src;
    }
});

// Captura cliques nos avatares da grade
opcoesAvatar.forEach(avatar => {
    avatar.addEventListener('click', () => {
        const novoLinkImagem = avatar.src; // Pega a URL completa resolvida pelo navegador
        avatarAtual.src = novoLinkImagem;
        
        // Atualiza nossa variável temporária
        avatarSelecionadoTemporario = novoLinkImagem;
        
        // Pequena animação de feedback visual do clique
        avatarAtual.style.transform = 'scale(1.1)';
        setTimeout(() => {
            avatarAtual.style.transform = 'scale(1.0)';
        }, 150);
    });
});

// LOGICA DO BOTÃO SALVAR: Garante a gravação dos dados e muda de página de forma limpa
btnSalvar.addEventListener('click', () => {
    // Salva o texto atualizado do Nick
    localStorage.setItem('nickSelecionado', inputNick.value);
    
    // Salva o link do avatar que está ativo
    localStorage.setItem('avatarSelecionado', avatarSelecionadoTemporario);
    
    // Redireciona para o lobby com os dados já salvos no banco local
    window.location.href = "lobby.html";
});