// =================================================================
// ARQUIVO: js/app.js (VERSÃO MESTRA V4.0 - DF ONLY & R$ 132)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;

// --- 1. FUNÇÕES UTILITÁRIAS ---
function limparPreco(valor) {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    // Converte "R$ 30,00" para 30.00 (Padrão Matemático)
    let apenasNumeros = valor.toString().replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(apenasNumeros) || 0;
}

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- 2. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderRuler();
});

// --- 3. MOTOR DO JOGO (ADICIONAR ITEM) ---
function addToGame(name, price, imageSrc, sku, url) {
    if (chefboxCart.length >= MAX_SLOTS) {
        // Feedback visual de erro (Piscar vermelho suave)
        const bar = document.getElementById('chefbox-bar');
        if(bar) {
            bar.style.backgroundColor = '#ffebee';
            setTimeout(() => { bar.style.backgroundColor = 'white'; }, 500);
        }
        alert("Sua ChefBox já está completa (5 Sabores). Remova um item para trocar.");
        return;
    }

    // REGRA DE OURO: ORDEM CRONOLÓGICA
    // O item entra na fila. Se for o 5º a entrar => PRESENTE.
    chefboxCart.push({ name, price, image: imageSrc, sku, url });
    saveCart();
    renderRuler();
    
    // Feedback tátil (Vibração para Mobile)
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeFromGame(index) {
    // Ao remover, a fila anda. O item que era 5º vira 4º (e passa a ser pago).
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

// --- 4. RENDERIZAÇÃO E CÁLCULO (A LÓGICA DO PRESENTE) ---
function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');

    if (!slots.length) return;

    // A. Limpa Slots Visualmente
    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1); // O ícone do 5º slot é fixo
        slot.classList.remove('filled', 'active', 'gift-active');
        slot.style.backgroundImage = 'none';
        slot.onclick = null;
    });

    // B. Preenche com Itens do Carrinho
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; 
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.style.backgroundPosition = 'center';
            slot.onclick = () => removeFromGame(index); // Clique remove o item
        }
    });

    // C. CÁLCULO FINANCEIRO
    let totalPagar = 0;
    
    chefboxCart.forEach((item, i) => {
        // Regra Absoluta:
        // Índices 0, 1, 2, 3 (os 4 primeiros) = PAGOS.
        // Índice 4 (o 5º item) = GRATIS/PRESENTE (Valor ignorado na soma).
        if (i < 4) { 
            totalPagar += limparPreco(item.price);
        }
    });

    // D. Comunicação com o Humano (Texto da Régua)
    let count = chefboxCart.length;
    
    if (statusText) {
        if (count === 0) {
            statusText.innerHTML = `Monte sua ChefBox:`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (count < 5) {
            let faltam = 5 - count;
            statusText.innerHTML = `Escolha mais <strong>${faltam}</strong>. O 5º é Presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (count === 5) {
            // AQUI ESTÁ O "WOW FACTOR"
            statusText.innerHTML = `🎁 <strong>PRESENTE ATIVADO!</strong><br>Total Final: <strong>${formatarDinheiro(totalPagar)}</strong>`;
            if(btnFinish) btnFinish.style.display = 'flex';
            slots[4].classList.add('gift-active'); // Faz o slot do presente brilhar/destacar
        }
    }
}

// --- 5. CHECKOUT WHATSAPP (A "NOTA FISCAL" SEMÂNTICA) ---
function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    // VALIDAÇÃO GEOGRÁFICA (HUMANA)
    if (!name || !address) {
        alert("Atenção: Para entrega no DF, precisamos do seu Nome e Endereço completo.");
        return;
    }

    // Prepara a lista EXATAMENTE como o cliente montou (Cronológica)
    let itensParaZap = [...chefboxCart];
    
    let msgItens = "";
    let totalFinal = 0;

    itensParaZap.forEach((item, index) => {
        let valor = limparPreco(item.price);
        if (index < 4) {
            // Itens 1 a 4: Cobrados
            totalFinal += valor;
            msgItens += `✅ ${index+1}. ${item.name} (${formatarDinheiro(valor)})\n`;
        } else {
            // Item 5: PRESENTE
            msgItens += `🎁 5. ${item.name} (PRESENTE! R$ 0,00)\n`;
        }
    });

    // MENSAGEM BLINDADA PARA O WHATSAPP
    const textoZap = 
        `*PEDIDO CHEFBOX (DF)* 🛵\n` +
        `----------------------------------\n` +
        `*Cliente:* ${name}\n` +
        `*Endereço:* ${address}\n` +
        `*CEP:* ${cep}\n` +
        `----------------------------------\n` +
        `*SEUS 5 ESCOLHIDOS:*\n${msgItens}` +
        `----------------------------------\n` +
        `*TOTAL A PAGAR: ${formatarDinheiro(totalFinal)}*\n` +
        `*Frete:* Grátis (Entrega D+1)\n` +
        `----------------------------------\n` +
        `Aguardo chave PIX!`;

    const phone = "5561996659880";
    
    // Dispara para o WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    closeCheckoutModal();
}

// --- 6. UI AUXILIAR (MENUS) ---
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.mobile-menu-drawer');
    if(btn && nav) {
        btn.addEventListener('click', () => {
            if (nav.style.display === 'flex') {
                nav.style.display = 'none';
                btn.innerHTML = '☰';
            } else {
                nav.style.display = 'flex';
                btn.innerHTML = '✕';
            }
        });
    }
}
