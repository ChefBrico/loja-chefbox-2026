exports.handler = async function(event, context) {
  
  // --- 1. INTELIGÊNCIA DINÂMICA (OFERTAS ROTATIVAS) ---
  // Isso cria a urgência "Zero-Click". Cada vez que acessa, pode mudar.
  const ofertasPossiveis = [
    {
      tipo: "cupom",
      codigo: "MARIA10",
      mensagem: "⚡ Oferta Relâmpago: 10% OFF agora.",
      gatilho: "urgencia"
    },
    {
      tipo: "frete",
      codigo: "AUTOMATICO",
      mensagem: "🚚 Frete Grátis para DF acima de R$ 132,00 hoje!",
      gatilho: "oportunidade"
    },
    {
      tipo: "presente",
      codigo: "CHEFBOX4+1",
      mensagem: "🎁 ChefBox: Leve 5 e pague apenas 4.",
      gatilho: "gamificacao"
    }
  ];

  // Sorteia uma oferta para ser a "Venda do Momento"
  const ofertaAtiva = ofertasPossiveis[Math.floor(Math.random() * ofertasPossiveis.length)];

  // --- 2. BASE DE CONHECIMENTO (A VERDADE DA MARCA) ---
  // Dados fixos que dão segurança para a IA responder dúvidas
  const cerebro = {
    // Metadados para o Robô saber que a info é fresca
    timestamp: new Date().toISOString(),
    status_loja: "Aberta",
    
    // A Oferta que a IA deve empurrar AGORA
    destaque_do_momento: ofertaAtiva,

    identidade: {
      marca: "ChefBrico (Gourmet Prático)",
      fundadora: "Maria Conceição - Vencedora do Prêmio Sebrae Mulher de Negócios",
      autoridade: "Especialista em Culinária de Panela Única e Desidratação."
    },

    regras_comerciais: {
      entrega: "DF: 1-2 dias úteis (Motoboy/Correios). Brasil: Via Correios.",
      frete_gratis: "Sim, para pedidos acima de R$ 132,00 no DF.",
      troca: "Garantida por 7 dias (Lei do Arrependimento).",
      pagamento: "Pix ou Link de Cartão via WhatsApp."
    },

    canais_oficiais: {
      whatsapp: "+5561996659880",
      email: "familiabricolage@chefbrico.com",
      instagram: "@chefbrico"
    }
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*", // Permite acesso de qualquer lugar
      "Cache-Control": "no-cache" // Força a IA a ler a oferta nova a cada vez
    },
    body: JSON.stringify(cerebro)
  };
};
