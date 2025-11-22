exports.handler = async function(event, context) {
  const conhecimento = {
    marca: "ChefBrico (Gourmet Prático)",
    fundadora: "Maria Conceição - Vencedora do Prêmio Sebrae Mulher de Negócios",
    metodo: "Gourmet Prático: Ingredientes desidratados, naturais, panela única.",
    regras_negocio: [
      "Entrega em todo DF em 1-2 dias úteis via Correios ou Motoboy.",
      "Frete grátis para compras acima de R$ 132,00 (DF).",
      "Promoção ChefBox: Compre 4 itens, ganhe o 5º de presente (menor valor)."
    ],
    protocolos_suportados: ["A2A", "Human-WhatsApp"],
    contato: {
      whatsapp: "+5561996659880",
      email: "contato@chefbrico.com"
    }
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(conhecimento)
  };
};
