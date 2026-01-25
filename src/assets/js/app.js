// =================================================================
// ARQUIVO: js/app.js (VERSÃO V8.0 - FIX TOTAL)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_FIXO = 132.00;

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) {
        try { chefboxCart = JSON.parse(saved); } 
        catch (e) { chefboxCart = []; }
    }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("ChefBox completa! Clique em Finalizar ou remova um item para trocar.");
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

    // Limpa visual antes de renderizar
    slots.forEach((slot, i) => {
        slot.classList.remove('filled', 'gift-active');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.onclick = null;
    });

    // Preenche com os itens escolhidos
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].style.backgroundSize = 'cover';
            slots[index].innerHTML = ''; // Remove o número/presente
            slots[index].onclick = () => removeFromGame(index);
        }
    });

    let count = chefboxCart.length;
    if (statusText) {
        if (count < 5) {
            statusText.innerHTML = `Escolha mais <strong>${5 - count}</strong> sabores. O 5º é Presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>COMBO VIP ATIVADO!</strong><br>Total Fixo: R$ 132,00`;
            if(btnFinish) btnFinish.style.display = 'block'; // Garante que o botão apareça
            slots[4].classList.add('gift-active');
        }
    }
}

// --- FUNÇÃO QUE ESTAVA FALTANDO ---
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert("Erro técnico: Modal de cadastro não encontrado. Verifique o arquivo base.njk.");
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;

    let msgItens = chefboxCart.map((item, i) => `✅ ${i+1}. ${item.name}`).join('\n');

    const textoZap = 
        `*PEDIDO CLUB GOURMET* 🛵\n` +
        `----------------------------------\n` +
        `*Fã:* ${name}\n` +
        `*E-mail:* ${email}\n` +
        `*Endereço:* ${address}\n` +
        `----------------------------------\n` +
        `*ITENS DO KIT (4+1):*\n${msgItens}\n` +
        `----------------------------------\n` +
        `*TOTAL FIXO: R$ 132,00*\n` +
        `----------------------------------\n` +
        `Maria, quero meu brinde VIP! Manda o Pix?`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
});
