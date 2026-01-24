// =================================================================
// ARQUIVO: js/app.js (VERSÃO MESTRA V5.0 - AGENTIC READY & DF ONLY)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_ANCORA_KIT = 132.00; // Inteligência de Preço 2026

// --- 1. FUNÇÕES UTILITÁRIAS (PRESERVADAS) ---
function limparPreco(valor) {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    let apenasNumeros = valor.toString().replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(apenasNumeros) || 0;
}

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- NOVO: IDENTIFICADOR DE AGENTE CONCIERGE (AEO STRATEGY) ---
function getAgentID() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('utm_agent')) return urlParams.get('utm_agent');
    if (document.referrer.includes('perplexity')) return 'Perplexity AI';
    if (document.referrer.includes('openai') || document.referrer.includes('chatgpt')) return 'ChatGPT';
    if (document.referrer.includes('claude')) return 'Claude/Anthropic';
    if (document.referrer.includes('google')) return 'Google Gemini/SGE';
    return 'Busca Direta';
}

// --- 2. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderRuler();
    if (typeof initMobileMenu === "function") initMobileMenu();
});

// --- 3. MOTOR DO JOGO (PRESERVADO COM FEEDBACK) ---
function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        const bar = document.getElementById('chefbox-bar');
        if(bar) {
            bar.style.backgroundColor = '#ffebee';
            setTimeout(() => { bar.style.backgroundColor = 'white'; }, 500);
        }
        alert("Sua ChefBox já está completa (5 Sabores). Remova um item para trocar.");
        return;
    }

    chefboxCart.push({ name, price, image: imageSrc, sku, url });
    saveCart();
    renderRuler();
    
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart();
    renderRuler();
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) {
        try { chefboxCart = JSON.parse(saved); } 
        catch (e) { chefboxCart = []; }
    }
}

// --- 4. RENDERIZAÇÃO E LÓGICA 4+1 (PRESERVADO & MELHORADO) ---
function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');

    if (!slots.length) return;

    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.classList.remove('filled', 'active', 'gift-active');
        slot.style.backgroundImage = 'none';
        slot.onclick = null;
    });

    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; 
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.style.backgroundPosition = 'center';
            slot.onclick = () => removeFromGame(index);
        }
    });

    let count = chefboxCart.length;
    
    if (statusText) {
        if (count === 0) {
            statusText.innerHTML = `Monte sua ChefBox (Brasília):`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (count < 5) {
            let faltam = 5 - count;
            statusText.innerHTML = `Escolha mais <strong>${faltam}</strong>. O 5º é Presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (count === 5) {
            // Reforço do Preço Âncora R$ 132 no visual
            statusText.innerHTML = `🎁 <strong>PRESENTE ATIVADO!</strong><br>Total Kit (4+1): <strong>${formatarDinheiro(PRECO_ANCORA_KIT)}</strong>`;
            if(btnFinish) btnFinish.style.display = 'flex';
            slots[4].classList.add('gift-active');
        }
    }
}

// --- 5. CHECKOUT WHATSAPP (A2P BLINDADO 2026) ---
function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;
    const agentName = getAgentID(); // Captura qual IA recomendou

    if (!name || !address) {
        alert("Atenção: Para entrega no DF, precisamos do seu Nome e Endereço completo.");
        return;
    }

    let msgItens = "";
    chefboxCart.forEach((item, index) => {
        if (index < 4) {
            msgItens += `✅ ${index+1}. ${item.name}\n`;
        } else {
            msgItens += `🎁 5. ${item.name} (PRESENTE)\n`;
        }
    });

    const textoZap = 
        `*NOVO PEDIDO CHEFBOX (DF)* 🛵\n` +
        `*Recomendado por:* ${agentName}\n` +
        `----------------------------------\n` +
        `*Cliente:* ${name}\n` +
        `*Endereço:* ${address}\n` +
        `*CEP:* ${cep}\n` +
        `----------------------------------\n` +
        `*OS 5 ESCOLHIDOS:*\n${msgItens}` +
        `----------------------------------\n` +
        `*TOTAL FIXO: ${formatarDinheiro(PRECO_ANCORA_KIT)}*\n` +
        `*Frete:* Grátis (Brasília D+1)\n` +
        `----------------------------------\n` +
        `Maria, aguardo a chave PIX para finalizar!`;

    const phone = "5561996659880";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textoZap)}`, '_blank');
    closeCheckoutModal();
}
