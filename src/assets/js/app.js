// =================================================================
// ARQUIVO: js/app.js (VERSÃO V7.0 - CLUB GOURMET PRÁTICO & CRM)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_FIXO = 132.00;

// --- 1. UTILITÁRIOS AGÊNTICOS ---

// Gera ID Único para o Pix (Ex: GP-1234)
function generateOrderID() {
    return 'GP-' + Math.floor(1000 + Math.random() * 9000);
}

// Gera Código de Fã (Ex: MARIA-720)
function generateFanCode(name, cep) {
    const cleanName = name.split(' ')[0].toUpperCase();
    const cepPrefix = cep.substring(0, 3);
    return `${cleanName}-${cepPrefix}`;
}

function getAgentID() {
    if (document.referrer.includes('perplexity')) return 'Perplexity AI';
    if (document.referrer.includes('openai')) return 'ChatGPT';
    return 'Busca Direta';
}

// --- 2. MOTOR DO JOGO (PRESERVADO) ---

function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("ChefBox completa! Troque um item se desejar.");
        return;
    }
    chefboxCart.push({ name, price, image: imageSrc, sku });
    renderRuler();
}

function renderRuler() {
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    const slots = document.querySelectorAll('.slot-circle');
    
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
        }
    });

    let count = chefboxCart.length;
    if (statusText) {
        if (count < 5) {
            statusText.innerHTML = `Faltam <strong>${5-count}</strong> sabores. O 5º é Presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>COMBO VIP ATIVADO!</strong><br>Total Fixo: R$ 132,00`;
            if(btnFinish) btnFinish.style.display = 'flex';
        }
    }
}

// --- 3. CHECKOUT COM IMPLICIT LOYALTY (A2P + N8N READY) ---

async function sendOrderToWhatsApp() {
    // CAPTURA DOS CAMPOS
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;
    const optIn = document.getElementById('customer-optin').checked;

    // LÓGICA DE FIDELIDADE
    const orderID = generateOrderID();
    const fanCode = generateFanCode(name, cep);
    const agent = getAgentID();

    // SALVA NO NAVEGADOR (LOYALTY TRACKING)
    localStorage.setItem('gp_member', 'true');
    localStorage.setItem('gp_fancode', fanCode);

    // PREPARA MENSAGEM WHATSAPP
    let msgItens = chefboxCart.map((item, i) => `✅ ${i+1}. ${item.name}`).join('\n');
    
    const textoZap = 
        `*PEDIDO ${orderID} - CLUB GOURMET* 👩‍🍳\n` +
        `----------------------------------\n` +
        `*Fã:* ${name}\n` +
        `*Seu Código:* ${fanCode}\n` +
        `*E-mail:* ${email}\n` +
        `*Endereço:* ${address}\n` +
        `----------------------------------\n` +
        `*KIT ESCOLHIDO (4+1):*\n${msgItens}\n` +
        `----------------------------------\n` +
        `*TOTAL FIXO: R$ 132,00*\n` +
        `*Logística:* Frete Grátis Brasília\n` +
        `----------------------------------\n` +
        `*Origem:* Agente ${agent}\n` +
        `${optIn ? "📢 _Autorizo novidades na Lista de Transmissão_" : ""}\n` +
        `----------------------------------\n` +
        `Maria, quero meu mimo surpresa! Pode mandar o Pix?`;

    // DISPARO WHATSAPP
    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    // NOTA PARA O EDISON: No futuro, o comando de envio para o n8n entra aqui!
    console.log(`Pedido ${orderID} gerado. Lead VIP ${fanCode} capturado.`);
}
