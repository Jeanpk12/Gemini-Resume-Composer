// utils.js

export function appendMessage(role, message, index) {
    const chatMessages = document.getElementById('chat-messages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(role === 'user' ? 'user-message' : 'response-message');

    const textContainer = document.createElement('div');
    textContainer.innerHTML = message;
    
    // Criar botões "up" e "down"
    const upButton = createUpDownButton(index, 'up');
    const downButton = createUpDownButton(index, 'down');

    messageContainer.appendChild(textContainer);
    messageContainer.appendChild(upButton);
    messageContainer.appendChild(downButton);
    
    // Adicionar botão de exclusão
    const deleteButton = createDeleteButton(index);
    messageContainer.appendChild(deleteButton);

    chatMessages.appendChild(messageContainer);

    scrollToBottom();
}

export function createUpDownButton(index, direction) {
    const button = document.createElement('button');
    button.innerHTML = `<i class="ri-arrow-${direction}-line"></i>`;
    button.classList.add(direction);
    button.addEventListener('click', function() {
        moveMessage(index, direction);
    });
    return button;
}

function moveMessage(index, direction) {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === savedMessages.length - 1)) {
        return;
    }

    const temp = savedMessages[index];
    if (direction === 'up') {
        savedMessages[index] = savedMessages[index - 1];
        savedMessages[index - 1] = temp;
    } else {
        savedMessages[index] = savedMessages[index + 1];
        savedMessages[index + 1] = temp;
    }

    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));

    const chatMessages = document.getElementById('chat-messages');
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
    savedMessages.forEach((message, idx) => {
        appendMessage(message.role, message.content, idx);
    });
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
    deleteButton.innerHTML = '<i class="ri-delete-bin-7-line"></i>';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        const messageContainer = deleteButton.parentElement;
        messageContainer.remove();
        
        removeMessageFromLocalStorage(index);
    });
    return deleteButton;
}

function removeMessageFromLocalStorage(index) {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    savedMessages.splice(index, 1);
    
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}
