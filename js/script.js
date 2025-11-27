// ================================================================= //
// ===== ARQUIVO SCRIPT.JS GLOBAL - CHEFBRICO (REVISTA + LOJA) ===== //
// ================================================================= //

// --- VARIÁVEIS GLOBAIS DO JOGO CHEFBOX ---
let chefboxCart = [];
const MAX_SLOTS = 5; // 4 Pagos + 1 Presente

// =================================================================
// [1] INICIALIZAÇÃO (O Maestro que liga tudo)
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1.1. Inicia Menu Mobile
    initMobileMenu();

    // 1.2. Inicia Acordeões (FAQ e Detalhes)
    initAccordions();

    // 1.3. Inicia Carrosséis (Arrastar com mouse/dedo na Home)
    initCarousels();

    // 1.4. Inicia Filtros (Página de Receitas)
    initFilters();

    // 1.5. Inicia o Jogo ChefBox (Recupera memória e desenha régua)
    loadCart();
    renderRuler();
});


// =================================================================
// [2] MOTOR DE NAVEGAÇÃO & UI (Menu, Acordeão, Carrossel)
// =================================================================

function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileBtn && navList) {
        // Abrir/Fechar
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
            mobileBtn.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !mobileBtn.contains(e.target)) {
                navList.classList.remove('active');
                mobileBtn.textContent = '☰';
            }
        });

        // Dropdowns no Mobile (Toque para abrir)
        const dropdowns = document.querySelectorAll('.has-dropdown > a');
        dropdowns.forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = link.parentElement;
                    parent.classList.toggle('open');
                }
            });
        });
    }
}

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header, .faq-summary'); // Suporta ambos os estilos
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            // Se for o estilo <details>, o navegador resolve sozinho.
            // Se for div customizada (FAQ antigo):
            if (!this.parentElement.tagName.match(/DETAILS/i)) {
                const content = this.nextElementSibling;
                this.classList.toggle('active');
                if (content) {
                    content.style.display = this.classList.contains('active') ? 'block' : 'none';
                }
            }
        });
    });
}

function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container, .post-carousel');
    
    carousels.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.recipe-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active de todos
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.innerText.trim(); // Pega o texto do botão (ex: "Risoto")

                productCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category') || "";
                    
                    if (category === 'Todos' || category === 'all' || cardCat.includes(category)) {
                        card.style.display = 'block'; // ou flex
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}


// =================================================================
// [3] MOTOR A-COMMERCE (Jogo ChefBox 4+1)
// =================================================================

// Adicionar Item (Chamado pelo botão HTML)
function addToGame(name, price, imageSrc) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua caixa já está completa! Clique em uma bolinha na régua para remover um item se quiser trocar.");
        return;
    }

    chefboxCart.push({ name: name, price: price, image: imageSrc });
    saveCart();
    renderRuler();
    
    // Feedback visual rápido (opcional)
    // alert(`${name} adicionado à caixa!`);
}

// Remover Item (Chamado ao clicar na bolinha)
function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart();
    renderRuler();
}

// Salvar no Navegador
function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

// Carregar do Navegador
function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) {
        try { chefboxCart = JSON.parse(saved); } 
        catch (e) { chefboxCart = []; }
    }
}

// --- 5. RENDERIZAÇÃO (DESENHAR A RÉGUA) ---
function renderRuler() {
    // Elementos da DOM
    const statusText = document.getElementById('game-status'); 
    const statusTextGlobal = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish');
    const btnFinishGlobal = document.getElementById('btn-finish-game');
    const priceDisplay = document.getElementById('game-total-price'); // Novo elemento de preço
    
    if (!document.querySelector('.slot-circle')) return;

    // Limpa slots
    const allSlots = document.querySelectorAll('.slot-circle');
    allSlots.forEach(s => { 
        const num = s.id.split('-')[1];
        s.innerHTML = num; 
        s.className = 'slot-circle'; 
        s.onclick = null;
    });

    // Marca o Presente
    const giftSlots = document.querySelectorAll('#slot-5');
    giftSlots.forEach(s => { s.classList.add('gift'); s.innerHTML = '🎁'; });

    let totalPrice = 0;

    // Preenche slots e calcula preço
    chefboxCart.forEach((item, index) => {
        const slotsAtIndex = document.querySelectorAll(`#slot-${index + 1}`);
        
        slotsAtIndex.forEach(slot => {
            slot.classList.add('filled');
            slot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
            slot.onclick = () => removeFromGame(index);
        });

        // Soma preço (apenas dos 4 primeiros)
        if (index < 4) {
            // CORREÇÃO CRÍTICA DE PREÇO:
            // Remove "R$", espaços e troca vírgula por ponto para o JS somar
            let priceString = item.price.toString().replace('R$', '').replace(/\s/g, '').replace(',', '.');
            let priceNum = parseFloat(priceString);
            
            if (!isNaN(priceNum)) {
                totalPrice += priceNum;
            }
        }
    });

    // Formata o preço final para o Brasil (R$ 00,00)
    const formattedTotal = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Lógica de Mensagens
    const count = chefboxCart.length;
    let message = "";
    let showButton = false;

    if (count < 4) {
        message = `Faltam ${4 - count} para o presente!`;
        if(priceDisplay) priceDisplay.style.display = 'none';
        giftSlots.forEach(s => s.classList.remove('active'));
    } else if (count === 4) {
        message = "PARABÉNS! ESCOLHA SEU PRESENTE! 🎁";
        if(priceDisplay) {
            priceDisplay.style.display = 'inline-block';
            priceDisplay.innerText = formattedTotal;
        }
        giftSlots.forEach(s => s.classList.add('active'));
    } else if (count === 5) {
        message = `CAIXA COMPLETA!`;
        if(priceDisplay) {
            priceDisplay.style.display = 'inline-block';
            priceDisplay.innerText = formattedTotal;
        }
        showButton = true;
        giftSlots.forEach(s => s.classList.remove('active'));
    }

    // Atualiza textos
    if (statusText) statusText.innerText = message;
    if (statusTextGlobal) {
        // Se tivermos o elemento de preço separado, usamos ele. Se não, colocamos no texto.
        if (!priceDisplay) {
             statusTextGlobal.innerText = count >= 4 ? `${message} (${formattedTotal})` : message;
        } else {
             statusTextGlobal.innerText = message;
        }
    }

    // Botões
    if (btnFinish) btnFinish.style.display = showButton ? 'block' : 'none';
    if (btnFinishGlobal) btnFinishGlobal.style.display = showButton ? 'block' : 'none';
}


// =================================================================
// [4] MOTOR DE CHECKOUT (Modal & WhatsApp)
// =================================================================

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
        alert("Por favor, preencha Nome e Endereço.");
        return;
    }

    let itemsList = "";
    let total = 0;

    chefboxCart.forEach((item, index) => {
        if (index < 4) {
            let p = parseFloat(item.price.toString().replace(',', '.'));
            total += p;
            itemsList += `✅ ${item.name} (R$ ${item.price})\n`;
        } else {
            itemsList += `🎁 PRESENTE: ${item.name} (GRÁTIS)\n`;
        }
    });

    const message = `*NOVO PEDIDO CHEFBOX (4+1)* 🥗\n\n` +
                    `*Cliente:* ${name}\n` +
                    `*Endereço:* ${address}\n` +
                    `*CEP:* ${cep}\n\n` +
                    `*Itens:*\n${itemsList}\n` +
                    `*💰 TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n` +
                    `Aguardo link de pagamento!`;

    const phone = "5561996659880"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    
    closeCheckoutModal();
}
