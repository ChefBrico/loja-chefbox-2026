// ================================================================= //
// ===== ARQUIVO SCRIPT.JS MESTRE - CHEFBRICO A-COMMERCE V7.0 ==== //
// ================================================================= //

document.addEventListener('DOMContentLoaded', function() {

    // --- MOTOR 1: MENU MOBILE & DROPDOWNS (CORRIGIDO) ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileBtn && navList) {
        // 1. Abrir/Fechar Menu Principal
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita fechar logo em seguida
            navList.classList.toggle('active');
            mobileBtn.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });

        // 2. Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !mobileBtn.contains(e.target)) {
                navList.classList.remove('active');
                mobileBtn.textContent = '☰';
            }
        });

        // 3. Lógica para Dropdown no Mobile (Toque)
        const dropdowns = document.querySelectorAll('.has-dropdown > a');
        dropdowns.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se estiver no mobile (tela pequena)
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Não vai para o link, abre o menu
                    const parent = link.parentElement;
                    parent.classList.toggle('open');
                }
            });
        });
    }

    // --- MOTOR 2: ACORDEÃO (FAQ e Detalhes) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const wasActive = this.classList.contains('active');

                // Fecha outros (Comportamento exclusivo)
                accordionHeaders.forEach(other => {
                    if (other !== this) {
                        other.classList.remove('active');
                        if(other.nextElementSibling) other.nextElementSibling.style.display = 'none';
                    }
                });

                // Abre/Fecha o atual
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content) {
                    content.style.display = this.classList.contains('active') ? 'block' : 'none';
                }
            });
        });
    }

    // --- MOTOR 3: CARROSSEL (Arrastar com Mouse) ---
    const carousels = document.querySelectorAll('.carousel-container, .post-carousel');
    carousels.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active'); // Opcional: mudar cursor no CSS
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Velocidade do scroll
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // --- MOTOR 4: FILTROS INTELIGENTES (A-Commerce Context) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.card'); // Ajustado para sua classe .card

    if (filterButtons.length > 0 && productCards.length > 0) {
        
        function filterProducts(category) {
            // 1. Atualiza botões
            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === category);
            });

            // 2. Filtra cards
            productCards.forEach(card => {
                // Verifica se o card tem a categoria (classe ou data-attr)
                // Assumindo que você usará classes como "cat-risotos" nos cards
                const cardCats = card.className; 
                
                if (category === 'all' || cardCats.includes(category)) {
                    card.style.display = 'block'; // Ou 'flex'
                    // Animação suave (opcional)
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        }

        // Event Listeners
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => filterProducts(btn.dataset.filter));
        });

        // Verifica URL (Ex: ?filtro=risotos)
        const params = new URLSearchParams(window.location.search);
        const filterParam = params.get('filtro');
        if (filterParam) filterProducts(filterParam);
    }
});

// ================================================================= //
// ===== ARQUIVO SCRIPT.JS MESTRE - CHEFBRICO A-COMMERCE VFINAL ==== //
// ================================================================= //

// Variáveis Globais do Jogo
let chefboxCart = [];
const MAX_SLOTS = 5; // 4 Pagos + 1 Presente

// --- 1. INICIALIZAÇÃO (Quando o site carrega) ---
document.addEventListener('DOMContentLoaded', function() {
    
    // A. Carrega o carrinho salvo na memória (Persistência)
    loadCart();
    
    // B. Desenha a régua com o que tiver na memória
    renderRuler();

    // C. Configura o Menu Mobile (Hambúrguer)
    setupMobileMenu();
});

// --- 2. LÓGICA DO MENU MOBILE ---
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileBtn && navList) {
        // Abrir/Fechar ao clicar no ícone
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
            // Muda ícone (☰ para X)
            mobileBtn.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });

        // Fechar ao clicar fora do menu
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !mobileBtn.contains(e.target)) {
                navList.classList.remove('active');
                mobileBtn.textContent = '☰';
            }
        });

        // Lógica para Submenus (Dropdown) no Celular
        const dropdowns = document.querySelectorAll('.has-dropdown > a');
        dropdowns.forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Não navega, apenas abre
                    const parent = link.parentElement;
                    // Fecha outros abertos
                    document.querySelectorAll('.has-dropdown').forEach(item => {
                        if (item !== parent) item.classList.remove('open');
                    });
                    parent.classList.toggle('open');
                }
            });
        });
    }
}

// --- 3. LÓGICA DO JOGO (ADICIONAR/REMOVER) ---

// Função chamada pelos botões "Adicionar" nos Cards e na Página de Receita
function addToGame(name, price, imageSrc) {
    // Verifica se já está cheio
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua caixa já está completa! Clique em uma bolinha na régua para remover um item se quiser trocar.");
        return;
    }

    // Adiciona produto à lista
    chefboxCart.push({ name: name, price: price, image: imageSrc });
    
    // Salva na memória do navegador
    saveCart();
    
    // Atualiza a Régua Visual
    renderRuler();

    // Feedback visual simples (opcional)
    // alert(`+1 ${name} adicionado!`); 
}

// Função chamada ao clicar na bolinha da régua
function removeFromGame(index) {
    chefboxCart.splice(index, 1); // Remove o item do array
    saveCart(); // Salva a alteração
    renderRuler(); // Redesenha
}

// --- 4. PERSISTÊNCIA (MEMÓRIA) ---
function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) {
        try {
            chefboxCart = JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao ler carrinho", e);
            chefboxCart = [];
        }
    }
}

// --- 5. RENDERIZAÇÃO (DESENHAR A RÉGUA) ---
function renderRuler() {
    // Elementos da DOM
    const statusText = document.getElementById('game-status'); // Na régua mobile
    const statusTextGlobal = document.getElementById('game-status-text'); // Na régua global
    const btnFinish = document.getElementById('btn-finish'); // Botão mobile
    const btnFinishGlobal = document.getElementById('btn-finish-game'); // Botão global
    
    // Se a régua não existir na página (ex: página de erro), para aqui
    if (!document.querySelector('.slot-circle')) return;

    // Limpa todos os slots visuais
    const allSlots = document.querySelectorAll('.slot-circle');
    allSlots.forEach(s => { 
        s.innerHTML = s.id.split('-')[1]; // Volta o número (1, 2, 3...)
        s.className = 'slot-circle'; // Remove classes 'filled', 'gift'
        s.onclick = null; // Remove clique antigo
    });

    // Re-aplica estilo do Presente (Slot 5)
    const giftSlots = document.querySelectorAll('#slot-5');
    giftSlots.forEach(s => {
        s.classList.add('gift');
        s.innerHTML = '🎁';
    });

    let totalPrice = 0;

    // Preenche os slots com os itens do carrinho
    chefboxCart.forEach((item, index) => {
        // Seleciona os slots correspondentes (pode ter mais de um se tiver régua mobile e desktop)
        const slotsAtIndex = document.querySelectorAll(`#slot-${index + 1}`);
        
        slotsAtIndex.forEach(slot => {
            slot.classList.add('filled');
            slot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
            slot.onclick = () => removeFromGame(index); // Permite remover clicando
        });

        // Soma preço (apenas dos 4 primeiros, o 5º é grátis)
        if (index < 4) {
            // Converte "34,80" ou "34.80" para número
            let priceNum = parseFloat(item.price.toString().replace(',', '.'));
            if (!isNaN(priceNum)) {
                totalPrice += priceNum;
            }
        }
    });

    // Lógica de Mensagens e Botão Finalizar
    const count = chefboxCart.length;
    let message = "";
    let showButton = false;

    if (count < 4) {
        message = `Faltam ${4 - count} para liberar o presente!`;
        // Remove animação do presente
        giftSlots.forEach(s => s.classList.remove('active'));
    } else if (count === 4) {
        message = "PARABÉNS! ESCOLHA SEU PRESENTE AGORA! 🎁";
        // Faz o presente piscar
        giftSlots.forEach(s => s.classList.add('active'));
    } else if (count === 5) {
        message = `CAIXA COMPLETA! Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        showButton = true;
        // Para de piscar
        giftSlots.forEach(s => s.classList.remove('active'));
    }

    // Atualiza textos na tela
    if (statusText) statusText.innerText = message;
    if (statusTextGlobal) statusTextGlobal.innerText = message;

    // Mostra ou esconde botões de finalizar
    if (btnFinish) btnFinish.style.display = showButton ? 'block' : 'none';
    if (btnFinishGlobal) btnFinishGlobal.style.display = showButton ? 'block' : 'none';
}

// --- 6. MODAL DE CHECKOUT (NAP) ---

function openCheckoutModal() {
    // Tenta abrir o modal global ou o local
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert("Erro: Modal de checkout não encontrado.");
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// --- 7. ENVIO PARA WHATSAPP (O FECHAMENTO) ---

function sendOrderToWhatsApp() {
    // Captura dados dos inputs
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const cepInput = document.getElementById('customer-cep');

    const name = nameInput ? nameInput.value : "";
    const address = addressInput ? addressInput.value : "";
    const cep = cepInput ? cepInput.value : "";

    // Validação simples
    if (!name || !address) {
        alert("Por favor, preencha seu Nome e Endereço para que possamos entregar.");
        return;
    }

    // Monta a lista de produtos
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

    // Monta a mensagem final
    const message = `*NOVO PEDIDO CHEFBOX (4+1)* 🥗\n\n` +
                    `*Cliente:* ${name}\n` +
                    `*Endereço:* ${address}\n` +
                    `*CEP:* ${cep}\n\n` +
                    `*Itens Escolhidos:*\n${itemsList}\n` +
                    `*💰 TOTAL A PAGAR: R$ ${total.toFixed(2).replace('.', ',')}*\n\n` +
                    `Aguardo o link de pagamento!`;

    // Número da Maria (Formato Internacional sem +)
    const phone = "5561996659880"; 
    
    // Abre o WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Fecha o modal e limpa (opcional)
    closeCheckoutModal();
    // localStorage.removeItem('chefbox_cart'); // Descomente se quiser limpar após enviar
    // chefboxCart = [];
    // renderRuler();
}
