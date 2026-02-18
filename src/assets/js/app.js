// =================================================================
// ARQUIVO: js/app.js (VERSÃO V9.5 - PERFORMANCE & TICKET VIP)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_FIXO_KIT = 132.00;
const CNPJ_PIX = "36.014.833/0001-59";

// --- NOVO: FUNÇÃO DE PRELOAD (CARREGAMENTO INSTANTÂNEO) ---
function preloadRecipeImages() {
    const allRecipeImages = document.querySelectorAll('.recipe-card img');
    allRecipeImages.forEach((img) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
}

// 1. GERADORES DE IDENTIDADE
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

// 2. FUNÇÕES DO CARRINHO
function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { chefboxCart = JSON.parse(saved); }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
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

    if (!slots.length) return;

    slots.forEach((slot, i) => {
        slot.classList.remove('filled');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.onclick = null;
    });

    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
            slots[index].onclick = () => removeFromGame(index);
        }
    });

    let count = chefboxCart.length;
    if (statusText) {
        if (count < 5) {
            statusText.innerHTML = `Escolha mais <strong>${5-count}</strong> sabores!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <b>COMBO VIP ATIVADO!</b>`;
            if(btnFinish) btnFinish.style.display = 'flex'; // Flex para manter a seta alinhada
        }
    }
}

// 3. O TICKET DE VENDA PROFISSIONAL
async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    if(!name || !address || !cep) {
        alert("Por favor, preencha os dados de entrega.");
        return;
    }

    const orderID = generateOrderID();
    const fanCode = generateFanCode(name, cep);
    const agent = getAgentID();

    let msgItens = chefboxCart.map((item, i) => {
        return `${i+1}️⃣ [${item.sku}] ${item.name}${i === 4 ? ' *🎁 PRESENTE*' : ''}`;
    }).join('\n');

    const textoZap = 
`🧾 *COMPROVANTE DE PEDIDO ${orderID}*
--------------------------------
🌟 *STATUS:* CLUB GOURMET VIP
👤 *CLIENTE:* ${name}
🆔 *FÃ-CODE:* ${fanCode}
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
1. Copie a chave CNPJ: *${CNPJ_PIX}*
2. Realize o pagamento de *R$ 132,00*
3. Envie o comprovante aqui.
--------------------------------
_Origem: ${agent}_`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    localStorage.setItem('gp_member', 'true');
    localStorage.setItem('gp_name', name);
    localStorage.setItem('gp_fancode', fanCode);

    showPixScreen();
}

function showPixScreen() {
    const modalBox = document.querySelector('.modal-box');
    if (modalBox) {
        modalBox.innerHTML = `
            <div style="text-align: center; padding: 10px;">
                <h3 style="color: #014039; margin-bottom: 10px;">Pedido Enviado! ✅</h3>
                <p style="font-size: 0.9rem; color: #555;">Pague agora para agilizar sua entrega:</p>
                <div style="background: #fdfbf7; padding: 20px; border-radius: 16px; margin: 20px 0; border: 2px solid #F2811D; display: inline-block;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126360014br.gov.bcb.pix0114360148330001595204000053039865406132.005802BR5910ChefBrico6008Brasilia62070503***6304E64A" 
                         style="width: 180px; height: 180px;">
                    <p style="font-weight: 800; color: #F2811D; margin-top: 10px; font-size: 1.2rem;">R$ 132,00</p>
                </div>
                <button onclick="copyPixKey()" id="btn-copy-pix" style="background: #014039; color: white; border: none; padding: 12px 25px; border-radius: 50px; cursor: pointer; font-weight: bold;">
                    📋 COPIAR CHAVE CNPJ
                </button>
                <p onclick="location.reload()" style="margin-top:20px; color: #999; cursor: pointer; font-size: 0.8rem; text-decoration: underline;">Concluir e voltar ao site</p>
            </div>
        `;
    }
}

function copyPixKey() {
    navigator.clipboard.writeText(CNPJ_PIX).then(() => {
        const btn = document.getElementById('btn-copy-pix');
        btn.innerText = "✅ COPIADO!";
        btn.style.background = "#25D366";
        setTimeout(() => {
            btn.innerText = "📋 COPIAR CHAVE CNPJ";
            btn.style.background = "#014039";
        }, 2000);
    });
}

function openCheckoutModal() { 
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.style.display = 'flex'; 
}

function closeCheckoutModal() { 
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.style.display = 'none'; 
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
    preloadRecipeImages(); // Inicia o carregamento instantâneo
});
