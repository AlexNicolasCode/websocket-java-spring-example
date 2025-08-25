document.addEventListener('DOMContentLoaded', async () => {
    generateQRCode();
    connect();
});

const generateQRCode = () => {
    const key = getKey();
    const url = `http://${window.location.host}/?key=${key}`;
    new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
} 

const getKey = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const keyByQueryParams = urlParams.get('key');
    if (keyByQueryParams) {
        localStorage.setItem('key', keyByQueryParams);
        history.pushState({}, "", '/');
    }
    const key = localStorage.getItem('key');
    if (!key) {
        const newKey = crypto.randomUUID();
        localStorage.setItem('key', newKey);
        return newKey;
    }
    return key;
}

function encryptText(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function decryptText(encryptedText, key) {
    return encryptText(encryptedText, key);
}

const stompClient = new StompJs.Client({
    brokerURL: `ws://${window.location.host}/socket`
});

stompClient.onConnect = (frame) => {
    const chatId = getChatId();
    setConnected(true);
    stompClient.subscribe(`/chats/${chatId}`, (message) => {
        updateLiveChat(JSON.parse(message.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    const message = $("#message").val();
    if (!message) {
        return;
    }
    const key = getKey();
    const chatId = getChatId();
    stompClient.publish({
        destination: `/chats/${chatId}/messages`,
        body: encryptText(JSON.stringify({ user: $('#user').val(), message }), key),
    });
    $("#message").val("");
}

function updateLiveChat(body) {
    try {
        const key = localStorage.getItem('key');
        const decryptBody = decryptText(body, key);
        const { user, message } = JSON.parse(decryptBody);
        $("#livechat").append(`<tr><td>${user}: ${message}</td></tr>`);
    } catch (error) {
        console.log('mensagem não decodificada');
    }
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendMessage());
});

const getChatId = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chatByQueryParams = urlParams.get('chatId');
    if (chatByQueryParams) {
        localStorage.setItem('chatId', chatByQueryParams);
        history.pushState({}, "", '/');
    }
    const chatId = localStorage.getItem('chatId');
    if (!chatId) {
        const newChatId = crypto.randomUUID();
        localStorage.setItem('chatId', newChatId);
        return newChatId;
    }
    return chatId;
}