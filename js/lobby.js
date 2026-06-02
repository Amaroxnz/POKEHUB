
document.addEventListener('DOMContentLoaded', () => {
    const avatarLobby = document.getElementById('avatar-lobby');
    const nickLobby = document.getElementById('nick-lobby');
    
    // Busca os dados salvos na memória
    const avatarSalvo = localStorage.getItem('avatarSelecionado');
    const nickSalvo = localStorage.getItem('nickSelecionado');
    
    // Se houver avatar salvo, atualiza
    if (avatarSalvo) {
        avatarLobby.setAttribute('src', avatarSalvo);
    }
    
    // Se houver nick salvo, atualiza o texto
    if (nickSalvo && nickSalvo.trim() !== "") {
        nickLobby.textContent = nickSalvo;
    }
});