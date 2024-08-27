let NomeDoArrayAqui = [];

// Função para carregar os usuários do localStorage ao iniciar
function carregaArrayArmazenados() {
    const arrayArmazenados = localStorage.getItem('NomeDoArrayAqui');
    if (arrayArmazenados) {
        NomeDoArrayAqui = JSON.parse(arrayArmazenados);
        mostrarArray();
    }
}

// Função para salvar os usuários no localStorage
function salvarNovoUsuario() {
    localStorage.setItem('NomeDoArrayAqui', JSON.stringify(NomeDoArrayAqui));
}

function openModal() {
    document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
}

function mostrarArray(filteredUsers = NomeDoArrayAqui) {
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

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    const existingUser = NomeDoArrayAqui.find(user => user.email === email);

    if (existingUser) {
        showNotificationModal("Usuário já cadastrado!", "error");
    } else {
        NomeDoArrayAqui.push({ name, email, password, role });
        salvarNovoUsuario();  // Salvar no localStorage
        showNotificationModal("Usuário cadastrado com sucesso!", "success");
        mostrarArray();
        closeModal();
    }
});

function editUser(index) {
    const user = NomeDoArrayAqui[index];
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('tel').value = user.password;

    openModal();

    document.getElementById('userForm').onsubmit = function(e) {
        e.preventDefault();
        NomeDoArrayAqui[index].name = document.getElementById('name').value;
        NomeDoArrayAqui[index].email = document.getElementById('email').value;
        NomeDoArrayAqui[index].password = document.getElementById('tel').value;

        salvarNovoUsuario();  // Salvar no localStorage
        showNotificationModal("Locatário editado com sucesso!", "success");
        mostrarArray();
        closeModal();
    };
}

function confirmDeleteUser(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este locatário?");
    if (confirmDelete) {
        deleteUser(index);
    }
}

function deleteUser(index) {
    NomeDoArrayAqui.splice(index, 1);
    salvarNovoUsuario();  // Salvar no localStorage
    showNotificationModal("Locatário excluído com sucesso!", "delete");
    mostrarArray();
}

function showNotificationModal(message, type) {
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');

    notificationMessage.innerHTML = ''

    // Adicione uma classe de estilo de sucesso ou erro
    if (type === "success") {
        notificationMessage.innerHTML = `
        <div class="success">
          <img src="../assets/img/success.png" alt="">
          <p>${message}</p>
        </div>
        `
    } else if (type === "error") {
        notificationMessage.innerHTML = `
        <div class="unsuccess">
          <img src="../assets/img/unsuccess.png" alt="">
          <p>${message}</p>
        </div>
        `
    } else if (type === "delete") {
        notificationMessage.innerHTML = `
        <div class="unsuccess">
          <img src="../assets/img/delete_user.png" alt="">
          <p>${message}</p>
        </div>
        `
    }

    notificationModal.style.display = 'block';

    setTimeout(() => {
        closeNotificationModal();
    }, 3000);  // Fecha o modal automaticamente após 3 segundos
}

function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

// Função de Pesquisa de Usuários
function searchArray() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredUsers = NomeDoArrayAqui.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );
  mostrarArray(filteredUsers);
}

// Carregar os usuários do localStorage quando a página for carregada
window.onload = carregaArrayArmazenados;
