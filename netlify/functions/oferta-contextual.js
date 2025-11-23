exports.handler = async function(event, context) {
  // LÓGICA DO ROBÔ DE VENDAS
  // Ele decide qual oferta mostrar baseado no contexto (aqui simulado)
  
  const ofertas = [
    {
      texto: "⚡ Oferta Relâmpago: Use o cupom MARIA10 para 10% OFF agora.",
      cor: "#e74c3c" // Vermelho Urgência
    },
    {
      texto: "🎁 Hoje o Frete é Grátis para Brasília na compra da ChefBox!",
      cor: "#27ae60" // Verde Sucesso
    },
    {
      texto: "💎 Dica da IA: O Risoto Pomodori é o favorito da Chef Maria.",
      cor: "#8e44ad" // Roxo VIP
    }
  ];

  // Escolhe uma oferta aleatória (simulando inteligência dinâmica)
  const ofertaDoDia = ofertas[Math.floor(Math.random() * ofertas.length)];

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Permite que seu site acesse
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ofertaDoDia)
  };
};
