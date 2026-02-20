// =================================================================
// ARQUIVO: js/app.js (VERSÃO V10.1 - BOTÃO VERDE REDUZIDO 30%)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const CNPJ_PIX = "36.014.833/0001-59";

// 1. INJETOR DE ESTILO (Reduz o botão verde em 30% no Mobile automaticamente)
const style = document.createElement('style');
style.innerHTML = `
    @media (max-width: 768px) {
        #btn-finish-game {
            padding: 8px 15px !important; 
            font-size: 0.75rem !important; 
            border-radius: 40px !important;
            height: auto !important;
            min-height: 35px !important;
            width: auto !important;
            white-space: nowrap !important;
        }
    }
`;
document.head.appendChild(style);

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { chefboxCart = JSON.parse(saved); }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox está completa!");
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
    const btnFinish = document.getElementById('btn-finish-game');
    const statusText = document.getElementById('game-status-text');
    const slots = document.querySelectorAll('.slot-circle');

    if (!slots.length) return;

    // 1. Reseta os Slots
    slots.forEach((slot, i) => {
        slot.classList.remove('filled');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.onclick = null;
    });

    // 2. Preenche com as Fotos
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
            slots[index].onclick = () => removeFromGame(index);
        }
    });

    // 3. LÓGICA DO BOTÃO COM ECONOMIA INTEGRADA
    let count = chefboxCart.length;
    
    if (btnFinish) {
        if (count >= 5) {
            btnFinish.style.display = 'flex';
            btnFinish.innerHTML = "FINALIZAR (GANHOU R$ 34,80) ➜";
            btnFinish.style.background = "#25D366";
            if(statusText) statusText.innerHTML = "<b>🎁 COMBO VIP ATIVADO!</b>";
        } else if (count > 0) {
            btnFinish.style.display = 'flex';
            let economia = (count * 6.96).toFixed(2).replace('.', ',');
            btnFinish.innerHTML = `ECONOMIZOU R$ ${economia} ➜`;
            btnFinish.style.background = "#014039";
            if(statusText) statusText.innerHTML = `Faltam ${5-count} para o Presente!`;
        } else {
            btnFinish.style.display = 'none';
            if(statusText) statusText.innerHTML = "<b>🎁 COMBO VIP:</b><br><span>Total R$ 132,00</span>";
        }
    }
}

async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;
    if(!name || !address || !cep) { alert("Preencha os dados de entrega."); return; }
    
    let msgItens = chefboxCart.map((item, i) => `${i+1}️⃣ [${item.sku}] ${item.name}`).join('\n');
    const textoZap = `🧾 *PEDIDO CHEFBRICO*\n*ITENS:*\n${msgItens}\n*TOTAL:* R$ 132,00`;
    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    showPixScreen();
}

function showPixScreen() {
    const modalBox = document.querySelector('.modal-box');
    if (modalBox) {
        modalBox.innerHTML = `<h3 style="color: #014039;">Pedido Enviado! ✅</h3><p>Realize o PIX de R$ 132,00.</p><button onclick="location.reload()" style="background:#25D366; color:white; border:none; padding:15px; border-radius:50px; width:100%;">CONCLUIR</button>`;
    }
}

function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
});
