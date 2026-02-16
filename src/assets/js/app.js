// =================================================================
// ARQUIVO: js/app.js (VERSÃO V9.3 - AGENTIC ENHANCED)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_FIXO_KIT = 132.00;
const CNPJ_PIX = "36.014.833/0001-59";

// 1. GERADORES DE IDENTIDADE (Preservados)
function generateOrderID() {
    return 'GP' + Math.floor(100000 + Math.random() * 900000);
}

function generateFanCode(name, cep) {
    const cleanName = name.split(' ')[0].toUpperCase();
    const cepPrefix = cep.replace(/\D/g, '').substring(0, 3);
    return `${cleanName}-${cepPrefix}`;
}

function getAgentID() {
    if (document.referrer.includes('perplexity')) return 'Perplexity AI';
    if (document.referrer.includes('openai')) return 'ChatGPT';
    if (document.referrer.includes('google')) return 'Google Agent';
    return 'Busca Direta';
}

// 2. FUNÇÕES DO CARRINHO (Integridade Total)
function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { chefboxCart = JSON.parse(saved); }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
    // NOVIDADE: Sincroniza estado para leitura de Agentes de IA (Meta-Data Dinâmico)
    document.documentElement.setAttribute('data-cart-count', chefboxCart.length);
}

function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox está completa! Clique em 'Finalizar Pedido'.");
        return;
    }
    chefboxCart.push({ name, price, image: imageSrc, sku });
    saveCart();
    renderRuler();
}

function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart();
    renderRuler();
}

function renderRuler() {
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    const slots = document.querySelectorAll('.slot-circle');

    slots.forEach((slot, i) => {
        slot.classList.remove('filled', 'gift-active');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
    });

    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
            slots[index].onclick = () => removeFromGame(index);
            if (index === 4) slots[index].classList.add('gift-active');
        }
    });

    let count = chefboxCart.length;
    if (statusText) {
        if (count < 5) {
            statusText.innerHTML = `Escolha mais <strong>${5-count}</strong> sabores para ganhar o PRESENTE!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>COMBO VIP ATIVADO!</strong><br>Total Fixo: R$ 132,00`;
            if(btnFinish) btnFinish.style.display = 'block';
        }
    }
}

// 3. O NOVO TICKET DE VENDA (A2P PROTOCOL - Otimizado)
async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    if(!name || !address || !cep) {
        alert("Por favor, preencha os dados de entrega para garantir seu frete grátis no DF!");
        return;
    }

    const orderID = generateOrderID();
    const fanCode = generateFanCode(name, cep);
    const agent = getAgentID();

    let msgItens = chefboxCart.map((item, i) => {
        return `✅ ${i+1}. [${item.sku}] ${item.name}${i === 4 ? ' (🎁 PRESENTE)' : ''}`;
    }).join('\n');

    const textoZap = 
`🧾 *COMPROVANTE DE PEDIDO ${orderID}*
--------------------------------
🌟 *STATUS:* CLUB GOURMET VIP
👤 *CLIENTE:* ${name}
🆔 *FÃ-CODE:* ${fanCode}
📧 *E-MAIL:* ${email}
📍 *ENDEREÇO:* ${address}
🚚 *CEP:* ${cep} (DF)
--------------------------------
*ITENS DA SUA CHEFBOX (4+1):*
${msgItens}
--------------------------------
🛵 *FRETE:* GRÁTIS (Brasília D+1)
💰 *TOTAL A PAGAR: R$ 132,00*
--------------------------------
💳 *PARA PAGAR (PIX):*
1. Copie a chave CNPJ abaixo:
*${CNPJ_PIX}*

2. Realize o pagamento de *R$ 132,00*
3. Envie o comprovante nesta conversa.
--------------------------------
_Origem: ${agent}_
_Maria, já estou fazendo o Pix para garantir meu mimo!_`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    localStorage.setItem('gp_member', 'true');
    localStorage.setItem('gp_name', name);
    localStorage.setItem('gp_fancode', fanCode);

    if (typeof closeCheckoutModal === "function") closeCheckoutModal();
}

function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
});
