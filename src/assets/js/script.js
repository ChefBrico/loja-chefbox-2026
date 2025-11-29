// =================================================================
// ARQUIVO: js/script.js (VERSÃO FINAL - CORREÇÃO MATEMÁTICA)
// =================================================================

// --- 1. VARIÁVEIS GLOBAIS ---
let chefboxCart = [];
const MAX_SLOTS = 5; // 4 Pagos + 1 Presente

// --- 2. FUNÇÕES AUXILIARES (A MÁGICA DA MATEMÁTICA) ---

// Transforma qualquer coisa (Texto "R$ 30,00" ou Número 30) em Número Puro (30.00)
function limparPreco(valor) {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    
    // Remove tudo que não for número ou vírgula
    let apenasNumeros = valor.toString().replace(/[^\d,]/g, '');
    // Troca vírgula por ponto (padrão americano que o sistema entende)
    apenasNumeros = apenasNumeros.replace(',', '.');
    
    return parseFloat(apenasNumeros) || 0;
}

// Transforma Número Puro (30.00) em Texto Brasileiro ("R$ 30,00")
function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- 3. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAccordions();
    
    // Recupera o carrinho salvo se o cliente voltar
    loadCart();
    renderRuler();
});

// --- 4. MOTOR DO JOGO CHEFBOX (4+1) ---

function addToGame(name, price, imageSrc) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox já está completa! Remova um item clicando na bolinha se quiser trocar.");
        return;
    }

    // Adiciona ao carrinho
    chefboxCart.push({ 
        name: name, 
        price: price, 
        image: imageSrc 
    });
    
    saveCart();
    renderRuler();
    
    // Feedback tátil (vibra o celular)
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

// --- 5. RENDERIZAÇÃO DA RÉGUA (VISUAL + CÁLCULO) ---

function renderRuler() {
    // Pega os elementos da tela
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    const barContainer = document.getElementById('chefbox-bar');
    
    // Se não tiver régua na página, para aqui (evita erro)
    if (!slots.length) return;

    let totalPagavel = 0;
    let itensCount = chefboxCart.length;

    // A. Limpa visualmente todos os slots (reseta)
    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1); // O 5º é presente
        slot.classList.remove('filled', 'active');
        slot.style.backgroundImage = 'none';
        slot.onclick = null;
    });

    // B. Preenche com os itens do carrinho
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; // Remove o número para mostrar a foto
            
            // Ajuste da imagem de fundo
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.style.backgroundPosition = 'center';
            
            // Clique para remover
            slot.onclick = () => removeFromGame(index);

            // C. CÁLCULO DO PREÇO (AQUI ESTAVA O ERRO NaN)
            // Só soma se for um dos 4 primeiros (índice 0, 1, 2, 3). O índice 4 é grátis.
            if (index < 4) {
                totalPagavel += limparPreco(item.price);
            }
        }
    });

    // D. Atualiza Textos e Botões na Régua
    if (statusText) {
        if (itensCount === 0) {
            statusText.innerHTML = `Monte sua ChefBox:`;
            if(btnFinish) btnFinish.style.display = 'none';
        
        } else if (itensCount < 4) {
            let faltam = 4 - itensCount;
            statusText.innerHTML = `Faltam <strong>${faltam}</strong> para ganhar o presente!`;
            if(btnFinish) btnFinish.style.display = 'none';
        
        } else if (itensCount === 4) {
            statusText.innerHTML = `🎉 Parabéns! Escolha seu <strong>PRESENTE</strong> agora!`;
            if(btnFinish) btnFinish.style.display = 'none';
            slots[4].classList.add('active'); // Anima o slot do presente
        
        } else if (itensCount === 5) {
            // Mostra o total formatado corretamente (Ex: R$ 139,20)
            statusText.innerHTML = `✅ Completa! Total: <strong>${formatarDinheiro(totalPagavel)}</strong>`;
            if(btnFinish) btnFinish.style.display = 'flex'; // Mostra botão verde
        }
    }
}

// --- 6. CHECKOUT WHATSAPP (ENVIO DO PEDIDO) ---

function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

function sendOrderToWhatsApp() {
    // Pega dados do formulário
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;

    if (!name || !address) {
        alert("Por favor, preencha seu Nome e Endereço para a entrega.");
        return;
    }

    let msgItens = "";
    let totalFinal = 0;

    // Monta a lista de itens para o Zap
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

    // Abre o WhatsApp
    const phone = "5561996659880";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    closeCheckoutModal();
}

// --- 7. FUNÇÕES DE UI (MENU E ACORDEÃO) ---
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
