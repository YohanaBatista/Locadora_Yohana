let editoras = [];

// 1. Funções de Inicialização ou Carregamento de Dados

// Função para carregar as editoras do localStorage ao iniciar
function carregaEditorasArmazenadas() {
    const editorasArmazenadas = localStorage.getItem('editoras');
    if (editorasArmazenadas) {
        editoras = JSON.parse(editorasArmazenadas);
        mostrarEditoras();
    }
}

// Função de Pesquisa de Editoras
function searchEditoras() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredEditoras = editoras.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    mostrarEditoras(filteredEditoras);
}

// Carregar as editoras do localStorage quando a página for carregada
window.onload = carregaEditorasArmazenadas;

// 2. Funções de Manipulação de Dados

// Função para salvar as editoras no localStorage
function salvarEditoras() {
    localStorage.setItem('editoras', JSON.stringify(editoras));
}

// Função para mostrar as editoras na tabela
function mostrarEditoras(filteredUsers = editoras) {
    const listagem = document.getElementById('listagem');
    listagem.innerHTML = '';
    if (filteredUsers.length === 0) {
        listagem.innerHTML = `<p>Nenhuma editora encontrada.</p>`;
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

// Função para editar uma editora
function editUser(index) {
    const user = editoras[index];
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('tel').value = user.tel;

    openModal();

    document.getElementById('userForm').onsubmit = function (e) {
        e.preventDefault();
        editoras[index].name = document.getElementById('name').value;
        editoras[index].email = document.getElementById('email').value;
        editoras[index].tel = document.getElementById('tel').value;

        salvarEditoras();  // Salvar no localStorage
        showNotificationModal("Editora editada com sucesso!", "success");
        mostrarEditoras();
        closeModal();
    };
}

// Função para confirmar a exclusão de uma editora
function confirmDeleteUser(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta editora?");
    if (confirmDelete) {
        deleteUser(index);
    }
}

// Função para excluir uma editora
function deleteUser(index) {
    editoras.splice(index, 1);
    salvarEditoras();  // Salvar no localStorage
    showNotificationModal("Editora excluída com sucesso!", "delete");
    mostrarEditoras();
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

    // Adicione uma classe de estilo de sucesso ou erro
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

// Evento de submissão do formulário de cadastro/edição de editoras
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value;

    const existingUser = editoras.find(user => user.email === email);

    if (existingUser) {
        showNotificationModal("Editora já cadastrada!", "error");
    } else {
        editoras.push({ name, email, tel });
        salvarEditoras();  // Salvar no localStorage
        showNotificationModal("Editora cadastrada com sucesso!", "success");
        mostrarEditoras();
        closeModal();
    }
});
