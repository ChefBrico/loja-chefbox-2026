/**
 * CHEFBOX A-COMMERCE ENGINE v2026
 * Focado em: Lógica Client-Side, Regra 4+1, Logística Híbrida e Interface para Agentes.
 */

class ChefBoxStore {
    constructor() {
        // 1. O ESTADO (Single Source of Truth)
        this.state = {
            cart: [],
            config: {
                minItems: 5, // Regra 4+1
                discountItemIndex: 4, // O 5º item (índice 4) é grátis
                freight: {
                    df_cep_start: 70000000,
                    df_cep_end: 73999999,
                    free_shipping_threshold: 132.00
                }
            },
            customer: {
                name: "",
                cep: "",
                address: ""
            }
        };

        this.init();
    }

    init() {
        this.loadCart();
        this.render();
        this.exposeAgentInterface(); // O Pulo do Gato para 2026
    }

    // --- GERENCIAMENTO DE DADOS ---

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
        // Dispara evento para Agentes ouvirem a mudança
        document.dispatchEvent(new CustomEvent('ChefBox:CartUpdated', { detail: this.state.cart }));
    }

    loadCart() {
        const saved = localStorage.getItem('chefbox_state');
        if (saved) {
            try { this.state.cart = JSON.parse(saved); } catch (e) { console.error("Erro ao carregar carrinho", e); }
        }
    }

    // --- LÓGICA DE NEGÓCIOS (A "Borda") ---

    calculateTotals() {
        let subtotal = 0;
        let discount = 0;
        
        // Ordena por preço para garantir que o desconto seja no menor valor (ou lógica específica)
        // Aqui assumimos ordem de adição, mas a regra do 5º item grátis se aplica
        
        this.state.cart.forEach((item, index) => {
            subtotal += item.price;
            // Regra 4+1: O 5º item (index 4) é grátis
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
        // Sanitiza CEP
        const cleanCep = parseInt(cep.replace(/\D/g, ''));
        
        // Lógica de Zona (DF vs Brasil)
        if (cleanCep >= this.state.config.freight.df_cep_start && cleanCep <= this.state.config.freight.df_cep_end) {
            return { zone: "DF", cost: 0, method: "Motoboy (Grátis)" };
        } else {
            return { zone: "BR", cost: null, method: "Correios (A Calcular)" };
        }
    }

    // --- INTERFACE AGÊNTICA (O Futuro) ---
    
    exposeAgentInterface() {
        window.ChefBoxAgent = {
            // O Robô pergunta: "Como está o carrinho?"
            getState: () => this.calculateTotals(),
            
            // O Robô comanda: "Adicione o Risoto"
            addItem: (sku, name, price, image, url) => {
                this.addToCart({ sku, name, price, image, url });
                return "Item adicionado. Faltam " + (5 - this.state.cart.length) + " para fechar a caixa.";
            },
            
            // O Robô finaliza: "Me dê o link de pagamento"
            getCheckoutLink: (customerData) => {
                this.state.customer = customerData;
                return this.generateWhatsAppLink();
            }
        };
        console.log("🤖 ChefBox Agent Interface Ready");
    }

    // --- RENDERIZAÇÃO VISUAL (Para Humanos) ---

    render() {
        const totals = this.calculateTotals();
        const slots = document.querySelectorAll('.slot-circle');
        const btnFinish = document.getElementById('btn-finish-game');
        const statusText = document.getElementById('game-status-text');

        // Atualiza Régua Visual
        slots.forEach((slot, i) => {
            slot.innerHTML = i === 4 ? '🎁' : (i + 1);
            slot.style.backgroundImage = 'none';
            slot.classList.remove('filled');
            slot.onclick = null;
        });

        this.state.cart.forEach((item, index) => {
            if (slots[index]) {
                const slot = slots[index];
                slot.classList.add('filled');
                slot.style.backgroundImage = `url('${item.image}')`;
                slot.style.backgroundSize = 'cover';
                slot.onclick = () => this.removeFromCart(index);
            }
        });

        // Atualiza Textos
        if (statusText) {
            if (totals.isComplete) {
                statusText.innerText = "Caixa Completa! 🎉";
                statusText.style.color = "#27ae60";
            } else {
                statusText.innerText = `Faltam ${5 - totals.count} itens`;
                statusText.style.color = "#666";
            }
        }

        // Botão Finalizar
        if (btnFinish) {
            btnFinish.style.display = totals.isComplete ? 'block' : 'none';
        }
    }

    // --- PROTOCOLO WHATSAPP (Deep Link) ---

    generateWhatsAppLink() {
        const totals = this.calculateTotals();
        const logistics = this.checkLogistics(this.state.customer.cep);
        
        let msg = `*PEDIDO CHEFBOX #${Math.floor(Math.random() * 10000)}* 🥗\n`;
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
        msg += `*PAGAMENTO EXCLUSIVO VIA PIX*\n`;
        msg += `Chave CNPJ: 36.014.833/0001-59\n`;
        msg += `\nAguardo confirmação para envio!`;

        return `https://wa.me/5561996659880?text=${encodeURIComponent(msg)}`;
    }
}

// Inicializa a Loja
let store;
document.addEventListener('DOMContentLoaded', () => {
    store = new ChefBoxStore();
});

// Funções Globais para o HTML chamar (Legacy Support)
window.addToGame = (name, price, image, sku, url) => {
    store.addToCart({ sku, name, price, image, url });
};

window.openCheckoutModal = () => {
    document.getElementById('checkout-modal').style.display = 'flex';
};

window.closeCheckoutModal = () => {
    document.getElementById('checkout-modal').style.display = 'none';
};

window.sendOrderToWhatsApp = () => {
    const name = document.getElementById('customer-name').value;
    const cep = document.getElementById('customer-cep').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !cep || !address) {
        alert("Por favor, preencha todos os dados.");
        return;
    }

    store.state.customer = { name, cep, address };
    const link = store.generateWhatsAppLink();
    window.open(link, '_blank');
};
