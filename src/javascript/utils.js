export function appendMessage(role, message, index) {
    const chatMessages = document.getElementById('chat-messages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(role === 'user' ? 'user-message' : 'response-message');

    const textContainer = document.createElement('div');
    textContainer.innerHTML = message;
    const deleteButton = createDeleteButton(index);

    messageContainer.appendChild(textContainer);
    messageContainer.appendChild(deleteButton);
    chatMessages.appendChild(messageContainer);

    scrollToBottom();
}

export function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

export function showLoadingMessage() {
    const chatMessages = document.getElementById('chat-messages');
    const loadingMessage = createMessageElement('Escrevendo. Aguarde.', 'loading-message');
    chatMessages.appendChild(loadingMessage);
}

export function hideLoadingMessage() {
    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

export function createMessageElement(text, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.classList.add(className);
    return messageElement;
}

export function createDeleteButton(index) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        const messageContainer = deleteButton.parentElement;
        messageContainer.remove();
        
        // Remover a mensagem correspondente do localStorage
        removeMessageFromLocalStorage(index);
    });
    return deleteButton;
}

function removeMessageFromLocalStorage(index) {
    // Carregar mensagens do localStorage
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    // Remover a mensagem com base no índice
    savedMessages.splice(index, 1);
    
    // Atualizar o localStorage com as mensagens atualizadas
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}
