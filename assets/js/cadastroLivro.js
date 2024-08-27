let livros = [];

// 1. Funções de Inicialização ou Carregamento de Dados

// Função para carregar os livros do localStorage ao iniciar
function carregaLivrosArmazenados() {
    const livrosArmazenados = localStorage.getItem('livros');
    if (livrosArmazenados) {
        livros = JSON.parse(livrosArmazenados);
        mostrarLivros();
    }
}

// Função de Pesquisa de Livros
function searchLivros() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredLivros = livros.filter(livro =>
        livro.name.toLowerCase().includes(searchTerm) ||
        livro.editora.toLowerCase().includes(searchTerm)
    );
    mostrarLivros(filteredLivros);
}

// Carregar os livros do localStorage quando a página for carregada
window.onload = carregaLivrosArmazenados;

// 2. Funções de Manipulação de Dados

// Função para salvar os livros no localStorage
function salvarNovoLivro() {
    localStorage.setItem('livros', JSON.stringify(livros));
}

// Função para mostrar os livros na tabela
function mostrarLivros(filteredLivros = livros) {
    const listagem = document.getElementById('listagem');
    listagem.innerHTML = '';
    if (filteredLivros.length === 0) {
        listagem.innerHTML = `<p>Nenhum livro encontrado.</p>`;
    } else {
        filteredLivros.forEach((livro, index) => {
            listagem.innerHTML += `
                <tr>
                    <td>${livro.name}</td>
                    <td>${livro.editora}</td>
                    <td>${livro.dataLancamento}</td>
                    <td>${livro.disponiveis}</td>
                    <td>${livro.alugados}</td>
                    <td>
                        <button onclick="editLivro(${index})">✏️</button>
                        <button onclick="confirmDeleteLivro(${index})">🗑️</button>
                        <button>🔍</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Função para editar um livro
function editLivro(index) {
    const livro = livros[index];
    document.getElementById('name').value = livro.name;
    document.getElementById('editora').value = livro.editora;
    document.getElementById('dataLancamento').value = livro.dataLancamento;
    document.getElementById('disponiveis').value = livro.disponiveis;
    document.getElementById('alugados').value = livro.alugados;

    openModal();

    document.getElementById('userForm').onsubmit = function (e) {
        e.preventDefault();
        livros[index].name = document.getElementById('name').value;
        livros[index].editora = document.getElementById('editora').value;
        livros[index].dataLancamento = document.getElementById('dataLancamento').value;
        livros[index].disponiveis = document.getElementById('disponiveis').value;
        livros[index].alugados = document.getElementById('alugados').value;

        salvarNovoLivro();  // Salvar no localStorage
        showNotificationModal("Livro editado com sucesso!", "success");
        mostrarLivros();
        closeModal();
    };
}

// Função para confirmar a exclusão de um livro
function confirmDeleteLivro(index) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este livro?");
    if (confirmDelete) {
        deleteLivro(index);
    }
}

// Função para excluir um livro
function deleteLivro(index) {
    livros.splice(index, 1);
    salvarNovoLivro();  // Salvar no localStorage
    showNotificationModal("Livro excluído com sucesso!", "delete");
    mostrarLivros();
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
        <div class="unsuccess">
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

// Evento de submissão do formulário de cadastro/edição de livros
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const editora = document.getElementById('editora').value;
    const dataLancamento = document.getElementById('dataLancamento').value;
    const disponiveis = document.getElementById('disponiveis').value;
    const alugados = document.getElementById('alugados').value;

    const existingLivro = livros.find(livro => livro.name === name);

    if (existingLivro) {
        showNotificationModal("Livro já cadastrado!", "error");
    } else {
        livros.push({ name, editora, dataLancamento, disponiveis, alugados });
        salvarNovoLivro();  // Salvar no localStorage
        showNotificationModal("Livro cadastrado com sucesso!", "success");
        mostrarLivros();
        closeModal();
    }
});
