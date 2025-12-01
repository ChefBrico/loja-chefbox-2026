// =================================================================
// ARQUIVO: src/assets/js/app.js
// OBJETIVO: Gerenciar Jogo 4+1, Sacolinha e Recibo WhatsApp Profissional
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderRuler();
    // Ajuste Mobile
    document.body.style.paddingBottom = "120px";
});

// --- FUNÇÕES AUXILIARES ---
function limparPreco(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    let apenasNumeros = valor.toString().replace(/[^\d,.]/g, '').replace(',', '.');
    return parseFloat(apenasNumeros) || 0;
}

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para encurtar o nome (Remove "ChefBrico", "18 minutos", etc)
function limparNomeProduto(nomeCompleto) {
    let nomeCurto = nomeCompleto.split('|')[0]; // Pega tudo antes da barra |
    nomeCurto = nomeCurto.replace(' em 18 Minutos', ''); // Remove tempo
    nomeCurto = nomeCurto.replace('ChefBrico', ''); // Remove marca se sobrar
    return nomeCurto.trim();
}

// --- MOTOR DO JOGO ---
// Agora aceita SKU também
window.addToGame = function(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        alert("Sua ChefBox já está completa! Remova um item para trocar.");
        return;
    }

    // Se o SKU não vier (páginas antigas), usa um genérico
    let codigoSku = sku || "PROD";

    chefboxCart.push({ 
        name: name, 
        price: price, 
        image: imageSrc,
        sku: codigoSku
    });
    
    saveCart();
    renderRuler();
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
    if (saved) { try { chefboxCart = JSON.parse(saved); } catch (e) { chefboxCart = []; } }
}

// --- RENDERIZAÇÃO DA RÉGUA ---
function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const statusText = document.getElementById('slots-count');
    const btnFinish = document.getElementById('btn-finish-game');
    
    if (!slots.length) return;

    let totalPagavel = 0;
    let itensCount = chefboxCart.length;

    // Limpa slots
    slots.forEach((slot, i) => {
        slot.innerHTML = i === 4 ? '🎁' : (i + 1);
        slot.style.backgroundImage = 'none';
        slot.classList.remove('filled', 'active');
        slot.onclick = null;
    });

    // Preenche slots
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            const slot = slots[index];
            slot.classList.add('filled');
            slot.innerHTML = ''; 
            slot.style.backgroundImage = `url('${item.image}')`;
            slot.style.backgroundSize = 'cover';
            slot.onclick = () => removeFromGame(index);

            if (index < 4) totalPagavel += limparPreco(item.price);
        }
    });

    // Atualiza Texto
    if (statusText) statusText.innerText = (4 - itensCount) > 0 ? (4 - itensCount) : 0;

    // Mostra Botão Finalizar se tiver 5 itens
    if (btnFinish) {
        btnFinish.style.display = itensCount === 5 ? 'block' : 'none';
    }
}

// --- CHECKOUT E WHATSAPP (AQUI ESTÁ A MUDANÇA) ---

window.openCheckoutModal = function() {
    document.getElementById('checkout-modal').style.display = 'flex';
    renderCartSummary(); // Mostra a sacolinha dentro do modal
}

window.closeCheckoutModal = function() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Função para desenhar a sacolinha dentro do modal
function renderCartSummary() {
    const container = document.getElementById('cart-summary');
    if (!container) return;

    let html = '<ul style="list-style:none; padding:0; margin:0;">';
    let total = 0;

    chefboxCart.forEach((item, index) => {
        let nomeCurto = limparNomeProduto(item.name);
        let preco = limparPreco(item.price);
        let displayPreco = formatarDinheiro(preco);
        
        if (index === 4) {
            displayPreco = "GRÁTIS (🎁)";
            preco = 0;
        }
        
        total += preco;

        html += `
            <li style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:5px 0; font-size:0.9rem;">
                <span>${index + 1}. ${nomeCurto}</span>
                <strong>${displayPreco}</strong>
            </li>
        `;
    });

    html += `</ul>
             <div style="text-align:right; margin-top:10px; font-size:1.1rem; color:#014039;">
                Total: <strong>${formatarDinheiro(total)}</strong>
             </div>`;
    
    container.innerHTML = html;
}

window.sendOrderToWhatsApp = function() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const cep = document.getElementById('customer-cep').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert("Por favor, preencha Nome, WhatsApp e Endereço.");
        return;
    }

    let msgItens = "";
    let totalFinal = 0;

    // Monta a lista de itens formatada
    chefboxCart.forEach((item, index) => {
        let nomeCurto = limparNomeProduto(item.name);
        let sku = item.sku || "N/A";
        
        if (index < 4) {
            let valor = limparPreco(item.price);
            totalFinal += valor;
            msgItens += `📦 [${sku}] ${nomeCurto}\n   └ R$ ${formatarDinheiro(valor)}\n`;
        } else {
            msgItens += `🎁 [${sku}] ${nomeCurto}\n   └ PRESENTE (GRÁTIS)\n`;
        }
    });

    // O RECIBO PROFISSIONAL
    const textoZap = 
        `*PEDIDO CHEFBOX #${Math.floor(Math.random() * 10000)}* 🥗\n` +
        `--------------------------------\n` +
        `👤 *Cliente:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `📍 *Endereço:* ${address}\n` +
        `📮 *CEP:* ${cep}\n` +
        `--------------------------------\n` +
        `*ITENS ESCOLHIDOS:*\n` +
        `${msgItens}\n` +
        `--------------------------------\n` +
        `🚚 *Frete:* Grátis para Brasília\n` +
        `💰 *TOTAL A PAGAR: ${formatarDinheiro(totalFinal)}*\n` +
        `--------------------------------\n` +
        `*PARA PAGAR:* Faça um PIX Copia e Cola:\n` +
        `🔑 CNPJ: 36.014.833/0001-59\n` +
        `\nAguardo o comprovante para enviar!`;

    const phoneDestino = "5561996659880"; 
    window.open(`https://wa.me/${phoneDestino}?text=${encodeURIComponent(textoZap)}`, '_blank');
    
    // Opcional: Limpar carrinho após envio
    // chefboxCart = []; saveCart(); renderRuler(); closeCheckoutModal();
}
