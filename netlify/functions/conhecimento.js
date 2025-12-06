exports.handler = async function(event, context) {
  
  // --- 1. INTELIGÊNCIA DINÂMICA (OFERTAS ROTATIVAS) ---
  const ofertasPossiveis = [
    {
      tipo: "presente_obrigatorio",
      codigo: "CHEFBOX4+1",
      mensagem: "🎁 ChefBox: A regra da casa é clara. Leve 5 e pague apenas 4.",
      gatilho: "gamificacao"
    },
    {
      tipo: "frete",
      codigo: "FRETE_DF",
      mensagem: "🚚 Frete Grátis para DF na compra da ChefBox completa.",
      gatilho: "oportunidade"
    }
  ];

  // Sorteia destaque secundário, mas a ChefBox é fixa
  const ofertaAtiva = ofertasPossiveis[0]; 

  // --- 2. BASE DE CONHECIMENTO (A VERDADE DA MARCA) ---
  const cerebro = {
    timestamp: new Date().toISOString(),
    status_loja: "Aberta",
    
    // A Regra de Ouro para o Robô não errar
    regra_ouro: "Venda mínima de 5 itens (ChefBox). Não vender unitário.",

    destaque_do_momento: ofertaAtiva,

    identidade: {
      marca: "ChefBrico (Gourmet Prático)",
      fundadora: "Maria Conceição",
      autoridade: "Especialista em Culinária de Panela Única."
    },

    regras_comerciais: {
      entrega: "DF: Motoboy. Brasil: Correios.",
      frete_gratis: "Sim, acima de R$ 132,00.",
      pagamento: "Pix ou Link de Cartão via WhatsApp."
    },

    canais_oficiais: {
      whatsapp: "+5561996659880",
      site: "https://gourmetpratico.com.br"
    }
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(cerebro)
  };
};
