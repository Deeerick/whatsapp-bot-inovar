const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const delay = ms => new Promise(res => setTimeout(res, ms));

const users = {}; // Armazena os nomes dos usuários

// Inicializa o cliente com autenticação local
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    }),
});

// Serviço de leitura do QR Code
client.on('qr', (qr) => {
    console.log('QR Code recebido, por favor escaneie.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
    clientReady = true;
});

client.on('authenticated', () => {
    console.log('Autenticado com sucesso!');
});

client.on('auth_failure', (msg) => {
    console.error('Falha na autenticação', msg);
});

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado', reason);
});

client.initialize();

client.on('message', async msg => {
    if (msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const userId = msg.from;

        if (!users[userId]) {
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(userId, 'Bem vindo(a) ao atendimento Inovar!\n Por gentileza, me informe o seu nome?');
            users[userId] = { step: 'waiting_name' };
            return;
        }

        if (users[userId].step === 'waiting_name') {
            users[userId].name = msg.body;
            users[userId].step = 'menu';
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(userId, `Obrigado, ${users[userId].name.split(" ")[0]}! Como posso ajudá-lo hoje? Digite uma das opções abaixo:\n\n1 - Boletos\n2 - Liberar visitante\n3 - Formulário de autorização\n4 - Marcar minha mudança\n5 - Acesso ao app do condomínio`);
            return;
        }

        if (users[userId].step === 'menu') {
            if (msg.body === '1') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Os boletos são encaminhados para o e-mail cadastrado no condomínio e dentro do app do condomínio.\n\n Caso nao esteja conseguindo recebendo por e-mail ou acessar o app, entre em contato com a administradora do seu condomínio.');
            } else if (msg.body === '2') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Para liberar um visitante, é necessário se encaminhar até a portaria e solicitar o formulário de liberação.');
            } else if (msg.body === '3') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'O formulário de autorização pode ser encontrado no app do condomínio na seção de documentos.');
            } else if (msg.body === '4') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Para marcar sua mudança, entre em contato com a administração do condomínio por telefone (19) 9 9923-7273 ou por e-mail contato@destaqueservicos.com.br');
            } else if (msg.body === '5') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'O acesso ao app do condomínio pode ser feito através do site oficial do condomínio. Caso tenha problemas, entre em contato com o suporte.');
            }
            await delay(2000);
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(msg.from, 'Ajudo em algo mais?\n\n 1 - SIM\n 2 - NAO');
            users[userId].step = 'more_help';
            return;
        }

        if (users[userId].step === 'more_help') {
            if (msg.body === '1') {
                users[userId].step = 'additional_options';
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(userId, `Selecione uma das opções adicionais abaixo:\n\n1 - Boletos\n2 - Liberar visitante\n3 - Formulário de autorização\n4 - Marcar minha mudança\n5 - Acesso ao app do condomínio\n6 - Falar com o síndico`);
            } else if (msg.body === '2') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Obrigado por utilizar o atendimento Inovar.\n Até breve!');
                delete users[userId];
            }
            return;
        }

        if (users[userId].step === 'additional_options') {
            if (msg.body === '1') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Os boletos são encaminhados para o e-mail cadastrado no condomínio e dentro do app do condomínio.\n\n Caso nao esteja conseguindo recebendo por e-mail ou acessar o app, entre em contato com a administradora do seu condomínio.');
            } else if (msg.body === '2') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Para liberar um visitante, acesse o app do condomínio e siga as instruções na seção de visitantes.');
            } else if (msg.body === '3') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'O formulário de autorização pode ser encontrado no app do condomínio na seção de documentos.');
            } else if (msg.body === '4') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Para marcar sua mudança, entre em contato com a administração do condomínio pelo telefone ou e-mail.');
            } else if (msg.body === '5') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'O acesso ao app do condomínio pode ser feito através do site oficial do condomínio. Caso tenha problemas, entre em contato com o suporte.');
            } else if (msg.body === '6') {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Para falar com o síndico, utilize o e-mail contato@inovar.com.br.\n\n Se preferir, pode enviar a sua dúvida aqui mesmo.\n O prazo de resposta é de 24h.');
                return;
            }
            await delay(2000);
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(msg.from, 'Ajudo em algo mais?\n\n 1 - SIM\n 2 - NAO');
            users[userId].step = 'more_help';
            return;
        }
    }
});
