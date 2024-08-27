let locatarios = [];

// 1. Funções de Inicialização ou Carregamento de Dados

// Função para carregar os locatários do localStorage ao iniciar
function carregaLocatariosArmazenados() {
    const locatariosArmazenados = localStorage.getItem('locatarios');
    if (locatariosArmazenados) {
        locatarios = JSON.parse(locatariosArmazenados);
        mostrarLocatarios();
    }
}

// Função de Pesquisa de Locatários
function searchLocatarios() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredLocatarios = locatarios.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    mostrarLocatarios(filteredLocatarios);
}

// Carregar os locatários do localStorage quando a página for carregada
window.onload = carregaLocatariosArmazenados;

// 2. Funções de Manipulação de Dados

// Função para salvar os locatários no localStorage
function salvarLocatarios() {
    localStorage.setItem('locatarios', JSON.stringify(locatarios));
}

// Função para mostrar os locatários na tabela
function mostrarLocatarios(filteredUsers = locatarios) {
    const listagem = document.getElementById('listagem');
    listagem.innerHTML = '';
    if (filteredUsers.length === 0) {
        listagem.innerHTML = `<p>Nenhum locatário encontrado.</p>`;
    } else {
        filteredUsers.forEach((user, index) => {
            listagem.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.tel}</td>
                    <td>
                        <button onclick="editUser(${index})">✏️</button>
                        <button onclick="confirmDeleteUser(${index})">🗑️</button>
                        <button>🔍</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Função para editar um locatário
function editUser(index) {
    const user = locatarios[index];
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('tel').value = user.tel;

    openModal();

    document.getElementById('userForm').onsubmit = function (e) {
        e.preventDefault();
        locatarios[index].name = document.getElementById('name').value;
        locatarios[index].email = document.getElementById('email').value;
        locatarios[index].tel = document.getElementById('tel').value;

        salvarLocatarios();  // Salvar no localStorage
        showNotificationModal("Locatário editado com sucesso!", "success");
        mostrarLocatarios();
        closeModal();
    };
}

// Função para confirmar a exclusão de um locatário
function confirmDeleteUser(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este locatário?");
    if (confirmDelete) {
        deleteUser(index);
    }
}

// Função para excluir um locatário
function deleteUser(index) {
    locatarios.splice(index, 1);
    salvarLocatarios();  // Salvar no localStorage
    showNotificationModal("Locatário excluído com sucesso!", "delete");
    mostrarLocatarios();
}

// 3. Funções de Manipulação de Interface (UI)

// Função para abrir o modal
function openModal() {
    document.getElementById('userModal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
}

// Função para mostrar o modal de notificação
function showNotificationModal(message, type) {
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');

    notificationMessage.innerHTML = '';

    // Adiciona classe de estilo de sucesso ou erro
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
        <div class="delete">
            <img src="../assets/img/delete_user.png" alt="">
            <p>${message}</p>
        </div>
        `;
    }

    notificationModal.style.display = 'block';

    setTimeout(() => {
        closeNotificationModal();
    }, 3000);  // Fecha o modal automaticamente após 3 segundos
}

// Função para fechar o modal de notificação
function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

// 4. Funções de Interação do Usuário

// Evento de submissão do formulário de cadastro/edição de locatários
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value;

    const existingUser = locatarios.find(user => user.email === email);

    if (existingUser) {
        showNotificationModal("Locatário já cadastrado!", "error");
    } else {
        locatarios.push({ name, email, tel });
        salvarLocatarios();  // Salvar no localStorage
        showNotificationModal("Locatário cadastrado com sucesso!", "success");
        mostrarLocatarios();
        closeModal();
    }
});
