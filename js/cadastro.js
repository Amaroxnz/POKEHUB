// javascript da pagina de cadastro

// pego todos os avatares da grade
var avatares = document.querySelectorAll('.opcao-avatar');

// pego a imagem grande que fica no topo
var avatarAtual = document.getElementById('avatar-atual');

// pego o texto que mostra o nome do avatar
var nomeAvatar = document.getElementById('nome-avatar-selecionado');

// pego o formulário de cadastro para controlar o envio
var formCadastro = document.getElementById('form-cadastro') || document.querySelector('form');

// deixo o primeiro avatar ja marcado como selecionado quando a pagina abre
avatares[0].classList.add('selecionado');

// percorro todos os avatares e coloco um evento de clique em cada um
avatares.forEach(function(avatar) {

    avatar.addEventListener('click', function() {

        // tiro a classe selecionado de todos primeiro
        avatares.forEach(function(a) {
            a.classList.remove('selecionado');
        });

        // coloco a classe selecionado so no que foi clicado
        avatar.classList.add('selecionado');

        // mudo a imagem grande pra ser igual a que clicou
        avatarAtual.src = avatar.src;

        // mudo o texto embaixo pra mostrar o nome do avatar
        nomeAvatar.textContent = avatar.alt;

    });

});

// ====================================================================
// NOVA LÓGICA: SALVAR OS DADOS NO LOCALSTORAGE AO CLICAR EM CADASTRAR
// ====================================================================
formCadastro.addEventListener('submit', function(evento) {
    // Pegamos o input do nome do treinador pelo ID que adicionamos
    var inputUsuario = document.getElementById('usuario');
    
    if (inputUsuario && avatarAtual) {
        var nickname = inputUsuario.value;
        var urlAvatar = avatarAtual.src;

        // Salvamos no banco de dados local do navegador com as chaves que o lobby espera
        localStorage.setItem('nickSelecionado', nickname);
        localStorage.setItem('avatarSelecionado', urlAvatar);
    }
    
    // O formulário seguirá o caminho do 'action' para o lobby.html levando os dados gravados!
});