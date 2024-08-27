let alugados = [];

// Função para carregar os usuários do localStorage ao iniciar
function carregaAlugados() {
    const alugadosArmazenados = localStorage.getItem('alugados');
    if (alugadosArmazenados) {
        alugados = JSON.parse(alugadosArmazenados);
        mostrarAlugados();
    }
}

// Função para salvar os usuários no localStorage
function salvarAlugados() {
    localStorage.setItem('alugados', JSON.stringify(alugados));
}

// Funções de Modal
function openModal() {
    document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
}

// Função para mostrar a lista de alugados
function mostrarAlugados(filteredUsers = alugados) {
    const listagem = document.getElementById('listagem');
    listagem.innerHTML = '';

    if (filteredUsers.length === 0) {
        listagem.innerHTML = `<p>Nenhum usuário encontrado.</p>`;
    } else {
        filteredUsers.forEach((user, index) => {
            listagem.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.dataDevolucao}</td>
                    <td>
                        <button onclick="editarAlugado(${index})">✏️</button>
                        <button onclick="confirmarExcluirAlugado(${index})">🗑️</button>
                        <button>🔍</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Função para adicionar um novo alugado
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('name').value;
    const dataDevolucao = document.getElementById('dataDevolucao').value;

    const alugadoExistente = alugados.find(user => user.dataDevolucao === dataDevolucao);

    if (alugadoExistente) {
        mostrarNotificacao("Usuário já cadastrado!", "error");
    } else {
        alugados.push({ name: nome, dataDevolucao });
        salvarAlugados();
        mostrarNotificacao("Usuário cadastrado com sucesso!", "success");
        mostrarAlugados();
        closeModal();
    }
});

// Função para editar um alugado
function editarAlugado(index) {
    const user = alugados[index];
    document.getElementById('name').value = user.name;
    document.getElementById('dataDevolucao').value = user.dataDevolucao;

    openModal();

    document.getElementById('userForm').onsubmit = function(e) {
        e.preventDefault();
        alugados[index].name = document.getElementById('name').value;
        alugados[index].dataDevolucao = document.getElementById('dataDevolucao').value;

        salvarAlugados();
        mostrarNotificacao("Usuário editado com sucesso!", "success");
        mostrarAlugados();
        closeModal();
    };
}

// Função para confirmar a exclusão de um alugado
function confirmarExcluirAlugado(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
        excluirAlugado(index);
    }
}

// Função para excluir um alugado
function excluirAlugado(index) {
    alugados.splice(index, 1);
    salvarAlugados();
    mostrarNotificacao("Usuário excluído com sucesso!", "delete");
    mostrarAlugados();
}

// Função para mostrar notificações
function mostrarNotificacao(message, type) {
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');

    notificationMessage.innerHTML = '';

    if (type === "success") {
        notificationMessage.innerHTML = `
        <div class="success">
            <img src="../assets/img/success.png" alt="">
            <p>${message}</p>
        </div>
        `;
    } else if (type === "error") {
        notificationMessage.innerHTML = `
        <div class="unsuccess">
            <img src="../assets/img/unsuccess.png" alt="">
            <p>${message}</p>
        </div>
        `;
    } else if (type === "delete") {
        notificationMessage.innerHTML = `
        <div class="unsuccess">
            <img src="../assets/img/delete_user.png" alt="">
            <p>${message}</p>
        </div>
        `;
    }

    notificationModal.style.display = 'block';

    setTimeout(() => {
        fecharNotificacao();
    }, 3000);
}

function fecharNotificacao() {
    document.getElementById('notificationModal').style.display = 'none';
}

// Função de Pesquisa de Alugados
function pesquisarAlugados() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = alugados.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.dataDevolucao.toLowerCase().includes(searchTerm)
    );
    mostrarAlugados(filteredUsers);
}

// Carregar os usuários do localStorage quando a página for carregada
window.onload = carregaAlugados;
