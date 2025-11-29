// =================================================================
// ARQUIVO: src/js/app.js
// OBJETIVO: Gerenciar o Jogo 4+1 e formatar o Pedido WhatsApp
// =================================================================

// 1. VARIÁVEIS GLOBAIS
let chefboxCart = [];
const MAX_SLOTS = 5; // 4 Pagos + 1 Presente

// 2. INICIALIZAÇÃO (Quando a página carrega)
document.addEventListener('DOMContentLoaded', function() {
    loadCart();    // Recupera o carrinho se o cliente voltar
    renderRuler(); // Desenha a régua
    
    // Ajuste Mobile: Garante que a barra não cubra o rodapé
    document.body.style.paddingBottom = "120px";
});

// 3. FUNÇÕES MATEMÁTICAS (CORREÇÃO DO ERRO NaN)
function limparPreco(valor) {
    // Se já for número (ex: 34.8), retorna ele mesmo
    if (typeof valor === 'number') return valor;
    
    // Se for texto (ex: "R$ 34,80"), limpa e converte
    if (!valor) return 0;
    let apenasNumeros = valor.toString().replace(/[^\d,.]/g, ''); // Mantém apenas números, vírgula e ponto
    apenasNumeros = apenasNumeros.replace(',', '.'); // Troca vírgula por ponto
    return parseFloat(apenasNumeros) || 0;
}

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 4. MOTOR DO JOGO
window.addToGame = function(name, price, imageSrc) {
    if (chefboxCart.length >= MAX_SLOTS) {
        // Vibra para avisar que está cheio
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        alert("Sua ChefBox já está completa! Clique em uma bolinha para remover se quiser trocar.");
        return;
    }

    // Adiciona ao carrinho
    chefboxCart.push({ name: name, price: price, image: imageSrc });
    saveCart();
    renderRuler();
    
    // Feedback tátil (Sucesso)
    if (navigator.vibrate) navigator.vibrate(100);
}

window.removeFromGame = function(index) {
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
        try { chefboxCart = JSON.parse(saved); } catch (e) { chefboxCart = []; }
    }
}

// 5. RENDERIZAÇÃO DA RÉGUA (VISUAL)
function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    
    if (!slots.length) return; // Proteção se a barra não existir

    let totalPagavel = 0;
    let itensCount = chefboxCart.length;

    // Reseta visual dos slots
    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.style.backgroundImage = 'none';
        slot.classList.remove('filled', 'active');
        slot.onclick = null;
    });

    // Preenche slots e calcula total
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; 
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.onclick = () => removeFromGame(index);

            // SÓ SOMA OS 4 PRIMEIROS. O 5º É GRÁTIS.
            if (index < 4) {
                totalPagavel += limparPreco(item.price);
            }
        }
    });

    // Atualiza Texto da Barra
    if (statusText) {
        if (itensCount < 4) {
            statusText.innerHTML = `Faltam <strong>${4 - itensCount}</strong> para o presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (itensCount === 4) {
            statusText.innerHTML = `🎉 Escolha seu <strong>PRESENTE</strong>!`;
            slots[4].classList.add('active'); // Anima o presente
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (itensCount === 5) {
            statusText.innerHTML = `✅ Total: <strong>${formatarDinheiro(totalPagavel)}</strong>`;
            if(btnFinish) btnFinish.style.display = 'flex'; // Mostra botão
        }
    }
}

// 6. WHATSAPP BRIDGE (ENVIO)
window.openCheckoutModal = function() {
    document.getElementById('checkout-modal').style.display = 'flex';
}

window.closeCheckoutModal = function() {
    document.getElementById('checkout-modal').style.display = 'none';
}

window.sendOrderToWhatsApp = function() {
    const name = document.getElementById('customer-name').value;
    const cep = document.getElementById('customer-cep').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !cep) {
        alert("Por favor, preencha pelo menos Nome e CEP.");
        return;
    }

    let msgItens = "";
    let totalFinal = 0;

    chefboxCart.forEach((item, index) => {
        if (index < 4) {
            let valor = limparPreco(item.price);
            totalFinal += valor;
            msgItens += `📦 ${item.name} (${formatarDinheiro(valor)})\n`;
        } else {
            msgItens += `🎁 PRESENTE: ${item.name} (GRÁTIS)\n`;
        }
    });

    const textoZap = `*NOVO PEDIDO CHEFBOX (4+1)* 👩‍🍳\n` +
        `--------------------------------\n` +
        `*Cliente:* ${name}\n` +
        `*CEP:* ${cep}\n` +
        `*Endereço:* ${address}\n` +
        `--------------------------------\n` +
        `*ITENS ESCOLHIDOS:*\n${msgItens}\n` +
        `*💰 TOTAL: ${formatarDinheiro(totalFinal)}*\n` +
        `--------------------------------\n` +
        `Aguardo link de pagamento!`;

    const phone = "5561996659880"; // Número da ChefBrico
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textoZap)}`, '_blank');
    closeCheckoutModal();
}
