// =================================================================
// CHEFBRICO 2026 - LÓGICA DE VENDAS RESTAURADA (V11.0)
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;
const CNPJ_PIX = "36.014.833/0001-59";

function loadCart() {
    const saved = localStorage.getItem('chefbox_cart');
    if (saved) { chefboxCart = JSON.parse(saved); }
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(chefboxCart));
}

function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("Sua ChefBox está completa! Finalize seu pedido para ganhar o presente.");
        return;
    }
    chefboxCart.push({ name, price, image: imageSrc, sku });
    saveCart();
    renderRuler();
}

function removeFromGame(index) {
    chefboxCart.splice(index, 1);
    saveCart();
    renderRuler();
}

function renderRuler() {
    const btnFinish = document.getElementById('btn-finish-game');
    const slots = document.querySelectorAll('.slot-circle');
    const visorLucro = document.getElementById('visor-dinamico-lucro');

    if (!slots.length) return;

    slots.forEach((slot, i) => {
        slot.classList.remove('filled');
        slot.style.backgroundImage = 'none';
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.onclick = null;
    });

    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
            slots[index].onclick = () => removeFromGame(index);
        }
    });

    let count = chefboxCart.length;
    if (btnFinish) {
        if (count >= 5) {
            btnFinish.style.display = 'flex';
            btnFinish.innerHTML = "FINALIZAR R$ 132 ➜";
            btnFinish.classList.add('pulsing');
            if(visorLucro) visorLucro.innerHTML = "GANHOU O 5º SABOR!";
        } else if (count > 0) {
            btnFinish.style.display = 'flex';
            btnFinish.innerHTML = `FALTAM ${5-count} PARA O PRESENTE`;
            if(visorLucro) visorLucro.innerHTML = `ECONOMIA R$ ${(count * 6.96).toFixed(2).replace('.', ',')}`;
        } else {
            btnFinish.style.display = 'none';
        }
    }
}

// FUNÇÃO DE ENVIO E GERAÇÃO DE COMPROVANTE VIP
async function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const phone = document.getElementById('customer-phone').value;
    const cep = document.getElementById('customer-cep').value;

    if(!name || !address || !cep) { 
        alert("Por favor, preencha os dados de entrega."); 
        return; 
    }

    // GERAÇÃO DO ID ÚNICO E FÃ-CODE
    const pedidoID = "GP" + Math.floor(100000 + Math.random() * 900000);
    const faCode = name.split(' ')[0].toUpperCase() + "-" + Math.floor(100 + Math.random() * 899);

    let msgItens = chefboxCart.map((item, i) => {
        const sufixo = (i === 4) ? " 🎁 PRESENTE" : ""; 
        return `🔹 [${item.sku}] ${item.name}${sufixo}`;
    }).join('\n');

    // MODELO DE COMPROVANTE RESTAURADO
    const textoZap = `🎫 *COMPROVANTE DE PEDIDO ${pedidoID}*
--------------------------------
💎 STATUS: CLUB GOURMET VIP
👤 CLIENTE: ${name}
🆔 FÃ-CODE: ${faCode}
📍 ENDEREÇO: ${address}
📮 CEP: ${cep} (DF)
--------------------------------
*ITENS DA SUA CHEFBOX (4+1):*
${msgItens}
--------------------------------
🚚 FRETE: GRÁTIS (Brasília D+1)
💰 *TOTAL A PAGAR: R$ 132,00*
--------------------------------
💳 *PARA PAGAR (PIX):*
1. Copie a chave CNPJ: ${CNPJ_PIX}
2. Realize o pagamento de R$ 132,00
3. Envienos o comprovante.
--------------------------------
Origem: Busca Direta`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(textoZap)}`, '_blank');
    showPixScreen(pedidoID);
}

function showPixScreen(id) {
    const modalBox = document.querySelector('.modal-box');
    if (modalBox) {
        modalBox.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #014039; font-size: 1.6rem;">Pedido ${id} Enviado! ✅</h3>
                <p style="margin: 20px 0; color: #666;">Copie a chave PIX abaixo para finalizar:</p>
                <div style="background: #FDFBF7; padding: 20px; border-radius: 20px; border: 2px dashed #25D366; margin-bottom: 25px;">
                    <span style="font-size: 0.7rem; color: #888; display: block;">CHAVE CNPJ (PIX):</span>
                    <strong style="font-size: 1.1rem; color: #014039;">${CNPJ_PIX}</strong>
                </div>
                <button onclick="location.reload()" style="background: #014039; color: white; border: none; padding: 18px; border-radius: 50px; width: 100%; font-weight: 900; cursor: pointer;">CONCLUIR PEDIDO</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderRuler();
});
