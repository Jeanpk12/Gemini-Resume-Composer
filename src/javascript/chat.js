import { initializeGenerativeAI } from './generativeAI.js';
import { appendMessage, showLoadingMessage, hideLoadingMessage, createDeleteButton } from './utils.js';

document.addEventListener('DOMContentLoaded', initializeChat);

async function initializeChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const printPdfBtn = document.getElementById('print-pdf-btn');

    let chat;

    // Carregar mensagens do localStorage, se houver
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.forEach((message, index) => {
        appendMessage(message.role, message.content, index);
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    printPdfBtn.addEventListener('click', function() {
        window.print();
    });

    async function sendMessage() {
        const topic = userInput.value.trim();
        if (!topic) return;

        userInput.value = '';

        showLoadingMessage();

        try {
            if (!chat) {
                chat = await initializeGenerativeAI();
            }

            const formattedTopic = `Escreva um resumo sobre: ${topic}. Leve em consideração a nossa última interação e evite ser repetitivo sobre temas já abordados. Seja criativo e escreva textos longos e didáticos. O título deve vir em h3`;

            const response = await chat.sendMessage(formattedTopic);
            const textResponse = await response.response.text();
            
            const htmlResponse = marked.parse(textResponse);

            appendMessage('model', htmlResponse);

            // Salvar a nova mensagem no localStorage
            const newMessage = { role: 'model', content: htmlResponse };
            savedMessages.push(newMessage);
            localStorage.setItem('chatMessages', JSON.stringify(savedMessages));

            hideLoadingMessage();
        } catch (error) {
            if (error.status === 503) {
                console.log('Erro 503: O servidor está sobrecarregado. Tentando novamente em 5 segundos...');
                setTimeout(sendMessage, 5000);
            } else {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    }
}
