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
