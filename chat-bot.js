const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

const delay = ms => new Promise(res => setTimeout(res, ms));

const users = {}; // Armazena os nomes dos usuários

// Serviço de leitura do QR Code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
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
            await client.sendMessage(userId, 'Bem vindo(a) ao atendimento Inovar!\n Para começarmos, me informe o seu nome?');
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

        // if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i)) {
        //     await chat.sendStateTyping();
        //     await delay(2000);
        //     await client.sendMessage(userId, `Olá ${users[userId].name.split(" ")[0]}! Como posso ajudá-lo hoje? Digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`);
        // }

        if (msg.body != null && msg.body === '1' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(msg.from, 'Os boletos são encaminhados para o e-mail cadastrado no condomínio e dentro do app do condomínio.\n\n Caso nao esteja conseguindo recebendo por e-mail ou acessar o app, entre em contato com a administradora do seu condomínio.')
            await delay(2000);
            await chat.sendStateTyping();
            await delay(2000);
            await client.sendMessage(msg.from, 'Ajudo em algo mais?\n\n 1 - SIM\n 2 - NAO')

        }
    }
});


//     if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
//         const chat = await msg.getChat();


//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos');

//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar');

//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');


//     }

//     if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
//         const chat = await msg.getChat();


//         await delay(2000); //Delay de 2000 milisegundos mais conhecido como 3 segundos
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes');

//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
//     }

//     if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
//         const chat = await msg.getChat();


//         await delay(2000); //Delay de 2000 milisegundos mais conhecido como 3 segundos
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Sorteio de em prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos');
        
//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');

//     }

//     if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
//         const chat = await msg.getChat();

//         await delay(2000); //Delay de 2000 milisegundos mais conhecido como 3 segundos
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato');


//         await delay(2000);
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');


//     }

//     if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
//         const chat = await msg.getChat();

//         await delay(2000); //Delay de 2000 milisegundos mais conhecido como 3 segundos
//         await chat.sendStateTyping();
//         await delay(2000);
//         await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: https://site.com ');


//     }








// });