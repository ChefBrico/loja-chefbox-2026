// =================================================================
// ARQUIVO: js/script.js (CORRIGIDO E BLINDADO)
// =================================================================

// --- VARIÁVEIS GLOBAIS ---
let chefboxCart = [];
const MAX_SLOTS = 5; // 4 Pagos + 1 Presente

// --- FUNÇÃO AUXILIAR: LIMPEZA MATEMÁTICA (FIM DO NaN) ---
function limparPreco(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    // Remove "R$", espaços e caracteres invisíveis
    let limpo = valor.toString().replace('R$', '').replace(/\s/g, '').trim();
    // Troca vírgula por ponto para o padrão internacional (JS)
    limpo = limpo.replace(',', '.');
    return parseFloat(limpo) || 0;
}

// --- FUNÇÃO AUXILIAR: FORMATAR DINHEIRO (VISUAL BRASIL) ---
function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAccordions();
    
    // Recupera o carrinho salvo e desenha a régua
    loadCart();
    renderRuler();
});

// --- 1. MOTOR DO JOGO CHEFBOX (4+1) ---

function addToGame(name, price, imageSrc) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox já está cheia! Remova um item clicando na bolinha se quiser trocar.");
        return;
    }

    // Salva o preço bruto para evitar erros futuros
    chefboxCart.push({ 
        name: name, 
        price: price, // Mantém como string ou number, a função limparPreco resolve depois
        image: imageSrc 
    });
    
    saveCart();
    renderRuler();
    
    // Feedback visual (Vibração no celular se suportado)
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

// --- 2. RENDERIZAÇÃO DA RÉGUA (VISUAL TREVIJANO) ---

function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    
    if (!slots.length) return; // Se não estiver na página de receitas, sai.

    let totalPagavel = 0;
    let itensCount = chefboxCart.length;

    // 1. Limpa visualmente todos os slots
    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1); // O 5º é presente
        slot.classList.remove('filled', 'active');
        slot.style.backgroundImage = 'none';
        slot.onclick = null;
    });

    // 2. Preenche com os itens do carrinho
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; // Remove o número
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.onclick = () => removeFromGame(index);

            // Soma apenas os 4 primeiros (O 5º é grátis)
            if (index < 4) {
                totalPagavel += limparPreco(item.price);
            }
        }
    });

    // 3. Atualiza Textos e Botões
    if (statusText) {
        if (itensCount < 4) {
            statusText.innerHTML = `Faltam <strong>${4 - itensCount}</strong> para ganhar o presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        } else if (itensCount === 4) {
            statusText.innerHTML = `🎉 Parabéns! Escolha seu <strong>PRESENTE</strong> agora!`;
            if(btnFinish) btnFinish.style.display = 'none';
            // Anima o slot do presente
            slots[4].classList.add('active'); 
        } else if (itensCount === 5) {
            statusText.innerHTML = `✅ Caixa Completa! Total: <strong>${formatarDinheiro(totalPagavel)}</strong>`;
            if(btnFinish) btnFinish.style.display = 'flex'; // Mostra botão verde
        }
    }
}

// --- 3. CHECKOUT WHATSAPP (SEM NaN) ---

function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    if (!name || !address) {
        alert("Por favor, preencha seu Nome e Endereço para a entrega.");
        return;
    }

    let msgItens = "";
    let totalFinal = 0;

    chefboxCart.forEach((item, index) => {
        if (index < 4) {
            let valorItem = limparPreco(item.price);
            totalFinal += valorItem;
            msgItens += `✅ ${item.name} (${formatarDinheiro(valorItem)})\n`;
        } else {
            msgItens += `🎁 PRESENTE: ${item.name} (GRÁTIS)\n`;
        }
    });

    // Monta a mensagem final
    const textoZap = `*NOVO PEDIDO CHEFBOX (4+1)* 🥗\n\n` +
        `*Cliente:* ${name}\n` +
        `*Endereço:* ${address}\n` +
        `*CEP:* ${cep}\n\n` +
        `*Itens Escolhidos:*\n${msgItens}\n` +
        `*💰 TOTAL A PAGAR: ${formatarDinheiro(totalFinal)}*\n\n` +
        `Aguardo o link do Pix/Cartão!`;

    const phone = "5561996659880";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    closeCheckoutModal();
    // Opcional: Limpar carrinho após envio
    // chefboxCart = []; saveCart(); renderRuler();
}

// --- 4. FUNÇÕES DE UI (MENU E ACORDEÃO) ---
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-list');
    if(btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            btn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
}

function initAccordions() {
    const acc = document.querySelectorAll('.accordion-header');
    acc.forEach(el => {
        el.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}
