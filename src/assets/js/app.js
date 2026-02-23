// =================================================================
// ARQUIVO: js/app.js (VERSÃO V11.0 - BLINDAGEM MESTRE 3 COLUNAS)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const CNPJ_PIX = "36.014.833/0001-59";

/**
 * 1. CARREGAMENTO E PERSISTÊNCIA (DTC DATA PROTECTION)
 */
function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { 
        chefboxCart = JSON.parse(saved); 
    }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

/**
 * 2. MOTOR DA GAMERFICAÇÃO (A REGRA DOS 5 SLOTS)
 */
function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox está completa! Finalize seu pedido para ganhar o presente.");
        return;
    }
    
    // Adiciona o prato ao array de dados
    chefboxCart.push({ name, price, image: imageSrc, sku });
    saveCart();
    renderRuler();
    
    // Feedback visual suave de adição
    const bar = document.getElementById('chefbox-bar');
    if(bar) {
        bar.style.transform = 'translateX(-50%) scale(1.05)';
        setTimeout(() => bar.style.transform = 'translateX(-50%) scale(1)', 200);
    }
}

function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart();
    renderRuler();
}

/**
 * 3. RENDERIZADOR DA RÉGUA 4+1 (ILHA DINÂMICA)
 * Atualizado para alinhar com o visual de 3 colunas do catálogo
 */
function renderRuler() {
    const btnFinish = document.getElementById('btn-finish-game');
    const statusText = document.getElementById('game-status-text');
    const slots = document.querySelectorAll('.slot-circle');
    const visorLucro = document.getElementById('visor-dinamico-lucro');

    if (!slots.length) return;

    // Reset de Interface
    slots.forEach((slot, i) => {
        slot.classList.remove('filled');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.onclick = null;
    });

    // Injeção de Fotos nos Slots
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = ''; // Limpa o número para mostrar a comida
            slots[index].onclick = () => removeFromGame(index); // Clique remove o item
        }
    });

    // LÓGICA DE ECONOMIA E CTAs (PERSUASÃO GOURMET)
    let count = chefboxCart.length;
    
    if (btnFinish) {
        if (count >= 5) {
            btnFinish.style.display = 'flex';
            btnFinish.innerHTML = "FINALIZAR R$ 132 ➜";
            btnFinish.classList.add('pulsing');
            if(visorLucro) visorLucro.innerHTML = "GANHOU O 5º SABOR!";
            if(statusText) statusText.style.color = "#25D366";
        } else if (count > 0) {
            btnFinish.style.display = 'flex';
            let economiaReal = (count * 6.96).toFixed(2).replace('.', ',');
            btnFinish.innerHTML = `FINALIZAR (FALTAM ${5-count})`;
            btnFinish.classList.remove('pulsing');
            if(visorLucro) visorLucro.innerHTML = `ECONOMIA R$ ${economiaReal}`;
        } else {
            btnFinish.style.display = 'none';
            if(visorLucro) visorLucro.innerHTML = "ECONOMIA R$ 0,00";
        }
    }
}

/**
 * 4. CHECKOUT E CONVERSÃO (O MÉTODO WHATSAPP)
 */
async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const phone = document.getElementById('customer-phone').value;
    const cep = document.getElementById('customer-cep').value;

    if(!name || !address || !cep) { 
        alert("Por favor, preencha os dados para entrega em Brasília."); 
        return; 
    }
    
    // Mapeia os itens escolhidos para a mensagem
    let msgItens = chefboxCart.map((item, i) => {
        return `${i + 1}️⃣ [${item.sku}] ${item.name}`;
    }).join('\n');

    const textoZap = `🛵 *NOVO PEDIDO CHEFBRICO*\n\n` +
                   `*CLIENTE:* ${name}\n` +
                   `*CONTATO:* ${phone}\n` +
                   `*ENDEREÇO:* ${address}\n` +
                   `*CEP:* ${cep}\n\n` +
                   `*ITENS DA CHEFBOX:* (4 Sabores + 1 Presente)\n${msgItens}\n\n` +
                   `*TOTAL DO COMBO:* R$ 132,00 (Frete Grátis)\n` +
                   `*PAGAMENTO:* PIX (CNPJ: ${CNPJ_PIX})`;

    // Abre o WhatsApp com a mensagem pronta
    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    // Transição para tela de confirmação/PIX
    showPixScreen();
}

function showPixScreen() {
    const modalBox = document.querySelector('.modal-box');
    if (modalBox) {
        modalBox.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #014039; font-size: 1.8rem;">Quase lá! ✅</h3>
                <p style="margin: 20px 0;">Seu pedido foi enviado ao WhatsApp da Maria. Para agendar a produção e entrega (D+1), realize o PIX.</p>
                <div style="background: #F5F5F7; padding: 20px; border-radius: 20px; border: 1px dashed #25D366; margin-bottom: 25px;">
                    <span style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 5px;">CNPJ PIX (Copia e Cola):</span>
                    <strong style="font-size: 1.1rem; color: #014039;">${CNPJ_PIX}</strong>
                </div>
                <button onclick="location.reload()" style="background: var(--chef-green, #014039); color: white; border: none; padding: 18px; border-radius: 50px; width: 100%; font-weight: 800; cursor: pointer;">CONCLUIR PEDIDO</button>
            </div>
        `;
    }
}

/**
 * 5. INICIALIZAÇÃO OMNICHANNEL
 */
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
});
