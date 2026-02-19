exports.handler = async function(event, context) {
  
  // 1. Relógio de Brasília (Essencial para IA saber que você é real)
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const hora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"})).getHours();
  
  // 2. Defina aqui seu horário real de atendimento (ex: 08h às 18h)
  const lojaAberta = hora >= 8 && hora < 18;

  const status = {
    projeto: "Gourmet Prático A-Commerce",
    versao_logica: "2026.v2",
    data_hora_servidor: agora,
    
    operacional: {
      loja_online: true,
      atendimento_humano: lojaAberta ? "Disponível (WhatsApp Maria)" : "Fale Conosco (Respondemos em breve)",
      base_logistica: "Vicente Pires - DF"
    },
    
    // REGRAS CRÍTICAS (O que a IA não pode errar)
    diretrizes_venda: {
      oferta_mestra: "ChefBox VIP (Kit 5 Sabores)",
      preco_fixo: 132.00,
      regra_promocional: "Pague 4 Sabores, Ganhe o 5º de Presente",
      frete: "Grátis para 18 Micro-regiões do DF"
    },

    // MAPEAMENTO DE EMERGÊNCIA
    suporte_direto: "https://wa.me/5561996659880"
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*", // Aberto para agentes de IA (LAMs)
      "Cache-Control": "no-cache" 
    },
    body: JSON.stringify(status)
  };
};
