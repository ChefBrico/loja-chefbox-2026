/**
 * CHEFBOX A-COMMERCE ENGINE v2026 (FINAL)
 * Integração: Lógica Client-Side + Netlify Forms + WhatsApp Pix
 */

class ChefBoxStore {
    constructor() {
        // 1. O ESTADO (Dados do Carrinho e Configurações)
        this.state = {
            cart: [],
            config: {
                minItems: 5, // Regra 4+1
                discountItemIndex: 4, // O 5º item é grátis
                freight: {
                    df_cep_start: 70000000,
                    df_cep_end: 73999999,
                    free_shipping_threshold: 132.00
                }
            },
            customer: { name: "", cep: "", address: "" }
        };
        this.init();
    }

    init() {
        this.loadCart();
        this.render();
        this.exposeAgentInterface(); // Permite que Robôs comprem
    }

    // --- GERENCIAMENTO DO CARRINHO ---

    addToCart(product) {
        if (this.state.cart.length >= this.state.config.minItems) {
            alert("Sua ChefBox já está cheia! Remova um item para trocar.");
            return;
        }
        this.state.cart.push({
            sku: product.sku,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            url: product.url
        });
        this.saveCart();
        this.render();
    }

    removeFromCart(index) {
        this.state.cart.splice(index, 1);
        this.saveCart();
        this.render();
    }

    saveCart() {
        localStorage.setItem('chefbox_state', JSON.stringify(this.state.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('chefbox_state');
        if (saved) {
            try { this.state.cart = JSON.parse(saved); } catch (e) { console.error(e); }
        }
    }

    // --- CÁLCULOS E LÓGICA (A Inteligência) ---

    calculateTotals() {
        let subtotal = 0;
        let discount = 0;
        
        this.state.cart.forEach((item, index) => {
            subtotal += item.price;
            // O 5º item é grátis (Regra 4+1)
            if (index === this.state.config.discountItemIndex) {
                discount += item.price;
            }
        });

        return {
            subtotal: subtotal,
            discount: discount,
            total: subtotal - discount,
            count: this.state.cart.length,
            isComplete: this.state.cart.length === this.state.config.minItems
        };
    }

    checkLogistics(cep) {
        const cleanCep = parseInt(cep.replace(/\D/g, ''));
        // Verifica se é Brasília (Faixa de CEP 70xxx a 73xxx)
        if (cleanCep >= this.state.config.freight.df_cep_start && cleanCep <= this.state.config.freight.df_cep_end) {
            return { zone: "DF", method: "Motoboy (Grátis/Rápido)" };
        } else {
            return { zone: "BR", method: "Correios (Valor a Calcular)" };
        }
    }

    // --- INTERFACE PARA ROBÔS (A-Commerce) ---
    exposeAgentInterface() {
        window.ChefBoxAgent = {
            getState: () => this.calculateTotals(),
            addItem: (sku, name, price, image, url) => {
                this.addToCart({ sku, name, price, image, url });
                return "Item adicionado.";
            },
            getCheckoutLink: (customerData) => {
                this.state.customer = customerData;
                return this.generateWhatsAppLink("PEDIDO-ROBO");
            }
        };
    }

    // --- VISUAL (Atualiza as bolinhas e botões) ---
    render() {
        const totals = this.calculateTotals();
        const slots = document.querySelectorAll('.slot-circle');
        const btnFinish = document.getElementById('btn-finish-game');
        const statusText = document.getElementById('game-status-text');

        // Limpa slots
        slots.forEach((slot, i) => {
            slot.innerHTML = i === 4 ? '🎁' : (i + 1);
            slot.style.backgroundImage = 'none';
            slot.classList.remove('filled');
            slot.onclick = null;
        });

        // Preenche slots
        this.state.cart.forEach((item, index) => {
            if (slots[index]) {
                const slot = slots[index];
                slot.classList.add('filled');
                slot.style.backgroundImage = `url('${item.image}')`;
                slot.style.backgroundSize = 'cover';
                slot.onclick = () => this.removeFromCart(index);
            }
        });

        // Atualiza Texto
        if (statusText) {
            statusText.innerText = totals.isComplete ? "Caixa Completa! 🎉" : `Faltam ${5 - totals.count} itens`;
            statusText.style.color = totals.isComplete ? "#27ae60" : "#666";
        }

        // Mostra/Esconde Botão
        if (btnFinish) {
            btnFinish.style.display = totals.isComplete ? 'block' : 'none';
        }
    }

    // --- GERAÇÃO DO LINK WHATSAPP (Com PIX) ---
    generateWhatsAppLink(orderId) {
        const totals = this.calculateTotals();
        const logistics = this.checkLogistics(this.state.customer.cep);
        
        let msg = `*PEDIDO CHEFBOX #${orderId}* 🥗\n`;
        msg += `--------------------------------\n`;
        msg += `👤 *Cliente:* ${this.state.customer.name}\n`;
        msg += `📮 *CEP:* ${this.state.customer.cep} (${logistics.zone})\n`;
        msg += `📍 *Endereço:* ${this.state.customer.address}\n`;
        msg += `--------------------------------\n`;
        msg += `*ITENS ESCOLHIDOS (4+1):*\n`;

        this.state.cart.forEach((item, index) => {
            let priceDisplay = index === 4 ? "🎁 PRESENTE" : `R$ ${item.price.toFixed(2)}`;
            msg += `📦 [${item.sku}] ${item.name}\n   └ ${priceDisplay}\n`;
        });

        msg += `--------------------------------\n`;
        msg += `🚚 *Frete:* ${logistics.method}\n`;
        msg += `💰 *TOTAL A PAGAR: R$ ${totals.total.toFixed(2)}*\n`;
        msg += `--------------------------------\n`;
        msg += `*PARA PAGAR (PIX):*\n`;
        msg += `1. Copie a chave CNPJ abaixo:\n`;
        msg += `36.014.833/0001-59\n`; 
        msg += `2. Envie o comprovante aqui.\n`;
        
        return `https://wa.me/5561996659880?text=${encodeURIComponent(msg)}`;
    }
}

// --- INICIALIZAÇÃO E EVENTOS ---

let store;

document.addEventListener('DOMContentLoaded', () => {
    store = new ChefBoxStore();

    // Lógica do Formulário Híbrido (Netlify + Zap)
    const form = document.getElementById('form-checkout');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Cálculo de Frete ao digitar CEP
    const cepInput = document.getElementById('customer-cep');
    if (cepInput) {
        cepInput.addEventListener('blur', (e) => {
            const logistics = store.checkLogistics(e.target.value);
            const preview = document.getElementById('frete-preview');
            if(preview) {
                preview.value = logistics.method;
                preview.style.color = logistics.zone === 'DF' ? '#27ae60' : '#e67e22';
            }
        });
    }
});

// Função que processa o envio
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const btn = document.querySelector('.btn-finalizar-zap');
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Processando...";
    btn.disabled = true;

    // 1. Captura Dados
    const formData = new FormData(e.target);
    store.state.customer = {
        name: formData.get('nome'),
        cep: formData.get('cep'),
        address: formData.get('endereco')
    };

    // 2. Gera ID e Prepara Backup
    const orderId = `CB-${Date.now().toString().slice(-6)}`;
    const totals = store.calculateTotals();
    
    // Preenche inputs ocultos para o Netlify receber
    let resumo = "";
    store.state.cart.forEach(i => resumo += `${i.name} | `);
    
    if(document.getElementById('hidden-pedido')) document.getElementById('hidden-pedido').value = resumo;
    if(document.getElementById('hidden-total')) document.getElementById('hidden-total').value = totals.total.toFixed(2);
    if(document.getElementById('hidden-id')) document.getElementById('hidden-id').value = orderId;

    // 3. Envia Backup (Silencioso)
    try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(e.target)).toString(),
        });
    } catch (err) { console.log("Backup offline, seguindo para Zap"); }

    // 4. Abre WhatsApp
    const linkZap = store.generateWhatsAppLink(orderId);
    
    btn.innerHTML = "✅ Abrindo WhatsApp...";
    setTimeout(() => {
        window.open(linkZap, '_blank');
        btn.innerHTML = originalText;
        btn.disabled = false;
        closeCheckoutModal();
    }, 1000);
}

// --- FUNÇÕES GLOBAIS (Para os botões do HTML funcionarem) ---
window.addToGame = (name, price, image, sku, url) => {
    store.addToCart({ sku, name, price, image, url });
};
window.openCheckoutModal = () => {
    document.getElementById('checkout-modal').style.display = 'flex';
};
window.closeCheckoutModal = () => {
    document.getElementById('checkout-modal').style.display = 'none';
};
