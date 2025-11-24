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

// ==================================================
// MOTOR CHEFBOX PERSISTENTE (LOCALSTORAGE)
// ==================================================

let chefboxCart = [];
const MAX_SLOTS = 5;

// 1. INICIALIZAÇÃO (Roda quando a página carrega)
document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Recupera dados salvos
    renderRuler(); // Desenha a régua
});

// 2. ADICIONAR (Funciona na Home e na Página de Receita)
function addToGame(name, price, imageSrc) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua caixa está completa! Remova um item da régua para trocar.");
        return;
    }

    // Adiciona
    chefboxCart.push({ name, price, image: imageSrc });
    
    // SALVA NA MEMÓRIA DO NAVEGADOR
    saveCart();
    
    // Atualiza Visual
    renderRuler();
    
    // Feedback visual (opcional)
    alert(`Adicionado: ${name}`);
}

// 3. REMOVER
function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart(); // Salva a remoção
    renderRuler();
}

// 4. SALVAR E CARREGAR (A Mágica da Persistência)
function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) {
        chefboxCart = JSON.parse(saved);
    }
}

// 5. RENDERIZAR A RÉGUA (Atualizado para mostrar preço)
function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const btn = document.getElementById('btn-finish-game');
    const statusText = document.getElementById('game-status-text');
    
    // Limpa slots
    slots.forEach(s => { s.innerHTML = ''; s.className = 'slot-circle'; });
    slots[4].classList.add('gift');
    slots[4].innerHTML = '🎁';

    let total = 0;

    // Preenche slots
    chefboxCart.forEach((item, index) => {
        const slot = slots[index];
        slot.classList.add('filled');
        slot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        slot.onclick = () => removeFromGame(index);

        // Soma preço (apenas dos 4 primeiros, o 5º é grátis)
        if (index < 4) {
            total += parseFloat(item.price.replace(',', '.')); // Garante número
        }
    });

    // Atualiza Texto e Botão
    if (chefboxCart.length < 4) {
        statusText.innerText = `Faltam ${4 - chefboxCart.length} para o presente!`;
        btn.style.display = 'none';
    } else if (chefboxCart.length === 4) {
        statusText.innerText = "ESCOLHA SEU PRESENTE! 🎁";
        slots[4].classList.add('active'); // Pisca
        btn.style.display = 'none';
    } else {
        statusText.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        slots[4].classList.remove('active');
        btn.style.display = 'block';
    }
}

// ... (Mantenha as funções de Modal e WhatsApp do passo anterior) ...
