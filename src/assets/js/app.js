// =================================================================
// ARQUIVO: js/app.js (VERSÃO V9.0 - WHATSAPP CRM & CLUB)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_FIXO = 132.00;

// GERA ID ÚNICO PARA CONCILIAÇÃO BANCÁRIA
function generateOrderID() {
    return 'GP' + Math.floor(100000 + Math.random() * 900000);
}

// GERA CÓDIGO DE FÃ PARA O CRM (Ex: EDISON-720)
function generateFanCode(name, cep) {
    const cleanName = name.split(' ')[0].toUpperCase();
    const cepPrefix = cep.substring(0, 3);
    return `${cleanName}-${cepPrefix}`;
}

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { chefboxCart = JSON.parse(saved); }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("ChefBox completa! Clique no botão verde para finalizar.");
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
            statusText.innerHTML = `Faltam <strong>${5-count}</strong> para seu PRESENTE!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>COMBO VIP ATIVADO!</strong><br>Total Fixo: R$ 132,00`;
            if(btnFinish) btnFinish.style.display = 'block';
        }
    }
}

// --- FUNÇÃO MESTRE: O NOVO TICKET WHATSAPP V9.0 ---
async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    const orderID = generateOrderID();
    const fanCode = generateFanCode(name, cep);

    let msgItens = chefboxCart.map((item, i) => {
        return `🍲 [${item.sku}] ${item.name}${i === 4 ? ' (🎁 PRESENTE)' : ''}`;
    }).join('\n');

    const textoZap = 
`🚀 *PEDIDO ${orderID} - CLUB GOURMET* 
--------------------------------
🌟 *STATUS:* MEMBRO VIP ATIVO
👤 *CLIENTE:* ${name}
🆔 *FÃ-CODE:* ${fanCode}
📧 *E-MAIL:* ${email}
📍 *ENTREGA:* ${address}
🚚 *CEP:* ${cep} (DF)
--------------------------------
*ITENS ESCOLHIDOS (4+1):*
${msgItens}
--------------------------------
🛵 *FRETE:* GRÁTIS (Brasília D+1)
💰 *TOTAL A PAGAR: R$ 132,00*
--------------------------------
*PARA PAGAR (PIX):*
1. Copie o CNPJ abaixo:
*36.014.833/0001-59*
2. Envie o comprovante aqui.

_Maria, estou aguardando meu mimo surpresa!_`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    // SINAL PARA O N8N (No futuro, descomentar a linha abaixo)
    // fetch('SUA_URL_N8N', { method: 'POST', body: JSON.stringify({orderID, fanCode, email, name, items: chefboxCart}) });
}

function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => { loadCart(); renderRuler(); });
