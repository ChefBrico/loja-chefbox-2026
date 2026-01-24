// js/app.js - V5.0 INTEGRAL (NÃO REMOVE NADA, APENAS ADICIONA TRACKING)
let chefboxCart = [];
const MAX_SLOTS = 5;
const FIXED_PRICE = 132.00;

function getAgentID() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('utm_agent')) return urlParams.get('utm_agent');
    if (document.referrer.includes('perplexity')) return 'Perplexity AI';
    if (document.referrer.includes('openai') || document.referrer.includes('chatgpt')) return 'ChatGPT';
    if (document.referrer.includes('google')) return 'Google Search/SGE';
    return 'Busca Direta';
}

function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox está completa! Remova um item para trocar.");
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
            statusText.innerHTML = `Escolha mais <strong>${5-count}</strong>. O 5º é Presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>PRESENTE ATIVADO!</strong><br>Total Fixo: R$ 132,00`;
            if(btnFinish) btnFinish.style.display = 'flex';
        }
    }
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value || 'Cliente';
    const address = document.getElementById('customer-address').value || 'Brasília/DF';
    const agent = getAgentID();
    
    let msgItens = chefboxCart.map((item, i) => `✅ ${i+1}. ${item.name}`).join('\n');

    const textoZap = 
        `*PEDIDO GOURMET PRÁTICO (DF)* 🛵\n` +
        `*Origem:* Agente IA (${agent})\n` +
        `----------------------------------\n` +
        `*Cliente:* ${name}\n` +
        `*Endereço:* ${address}\n` +
        `----------------------------------\n` +
        `*ITENS DO KIT (4+1):*\n${msgItens}\n` +
        `----------------------------------\n` +
        `*VALOR TOTAL FIXO: R$ 132,00*\n` +
        `*Frete:* Grátis para todo o DF\n` +
        `----------------------------------\n` +
        `Maria, aguardo o Pix para confirmar!`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
}
