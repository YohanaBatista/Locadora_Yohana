let users = [];

// 1. Funções de Inicialização ou Carregamento de Dados

// Função para carregar os usuários do localStorage ao iniciar
function carregaUsuariosArmazenados() {
    const usuariosArmazenados = localStorage.getItem('users');
    if (usuariosArmazenados) {
        users = JSON.parse(usuariosArmazenados);
        mostrarUsuarios();
    }
}

// Função de Pesquisa de Usuários
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    mostrarUsuarios(filteredUsers);
}

// Carregar os usuários do localStorage quando a página for carregada
window.onload = carregaUsuariosArmazenados;

// 2. Funções de Manipulação de Dados

// Função para salvar os usuários no localStorage
function salvarUsuarios() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Função para mostrar os usuários na tabela
function mostrarUsuarios(filteredUsers = users) {
    const listagem = document.getElementById('listagem');
    listagem.innerHTML = '';
    if (filteredUsers.length === 0) {
        listagem.innerHTML = `<p>Nenhum usuário encontrado.</p>`;
    } else {
        filteredUsers.forEach((user, index) => {
            listagem.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
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

// Função para editar um usuário
function editUser(index) {
    const user = users[index];
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.querySelector(`input[name="role"][value="${user.role}"]`).checked = true;

    openModal();

    document.getElementById('userForm').onsubmit = function (e) {
        e.preventDefault();
        users[index].name = document.getElementById('name').value;
        users[index].email = document.getElementById('email').value;
        users[index].password = document.getElementById('password').value;
        users[index].role = document.querySelector('input[name="role"]:checked').value;

        salvarUsuarios();  // Salvar no localStorage
        showNotificationModal("Usuário editado com sucesso!", "success");
        mostrarUsuarios();
        closeModal();
    };
}

// Função para confirmar a exclusão de um usuário
function confirmDeleteUser(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
        deleteUser(index);
    }
}

// Função para excluir um usuário
function deleteUser(index) {
    users.splice(index, 1);
    salvarUsuarios();  // Salvar no localStorage
    showNotificationModal("Usuário excluído com sucesso!", "delete");
    mostrarUsuarios();
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

// Evento de submissão do formulário de cadastro/edição de usuários
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showNotificationModal("Usuário já cadastrado!", "error");
    } else {
        users.push({ name, email, password, role });
        salvarUsuarios();  // Salvar no localStorage
        showNotificationModal("Usuário cadastrado com sucesso!", "success");
        mostrarUsuarios();
        closeModal();
    }
});
