let chefboxCart = [];
const MAX_SLOTS = 5;
const PRECO_ANCORA = 132.00;

function getAgentID() {
    if (document.referrer.includes('perplexity')) return 'Perplexity AI';
    if (document.referrer.includes('openai')) return 'ChatGPT';
    return 'Site Direto';
}

function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox já está completa (5 Sabores).");
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
            statusText.innerHTML = `Faltam <strong>${5-count}</strong> para seu PRESENTE!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else {
            statusText.innerHTML = `🎁 <strong>PRESENTE ATIVADO!</strong><br>Total Fixo: <strong>R$ 132,00</strong>`;
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
        `*PEDIDO CHEFBOX (DF) - R$ 132* 🛵\n` +
        `*Origem:* Agente ${agent}\n` +
        `----------------------------------\n` +
        `*Cliente:* ${name}\n` +
        `*Endereço:* ${address}\n` +
        `----------------------------------\n` +
        `*ITENS ESCOLHIDOS:*\n${msgItens}\n` +
        `----------------------------------\n` +
        `*VALOR FINAL: R$ 132,00*\n` +
        `*Frete:* Grátis para Brasília\n` +
        `----------------------------------\n` +
        `Maria, aguardo o Pix para confirmar!`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
}
