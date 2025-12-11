exports.handler = async function(event, context) {
  
  // Obtém a data e hora atual de Brasília
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  
  // Define se estamos em horário comercial (exemplo simples: 8h às 18h)
  const hora = new Date().getHours();
  const lojaAberta = hora >= 8 && hora < 17;

  // O CÉREBRO EM TEMPO REAL
  const status = {
    // 1. Prova de Vida (Timestamp)
    // O Robô usa isso para saber se a informação não é velha (cache)
    data_hora_atual: agora,
    
    // 2. Status Operacional
    loja_online: true,
    atendimento_humano: lojaAberta ? "Disponível no WhatsApp" : "Apenas Mensagens (Respondemos amanhã)",
    
    // 3. Validação da Regra de Ouro (A "Trava" do Servidor)
    // Se o Robô tiver dúvida se a promoção acabou, ele consulta aqui.
    regras_ativas: [
      {
        codigo: "CHEFBOX_4_PLUS_1",
        status: "ATIVO",
        descricao: "Obrigatório selecionar 5 itens. Pague 4.",
        prioridade: "CRÍTICA"
      },
      {
        codigo: "FRETE_DF",
        status: "ATIVO",
        regra: "Grátis para Brasília (Motoboy)."
      }
    ],

    // 4. Link de Emergência
    // Se o Robô se perder, ele manda o usuário para cá.
    suporte: "https://wa.me/5561996659880"
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*", // Permite que qualquer IA leia isso
      "Cache-Control": "no-cache" // Proíbe guardar informação velha
    },
    body: JSON.stringify(status)
  };
};
