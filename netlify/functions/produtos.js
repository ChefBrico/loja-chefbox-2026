exports.handler = async function(event, context) {
  // Este é o Catálogo que o Robô vai ler
  // No futuro, isso pode vir automático do banco de dados
  const produtos = [
    {
      id: "RIS-FUN-001",
      nome: "Risoto Funghi Secchi",
      categoria: "Risoto",
      preco: 34.80,
      estoque: "Em Estoque",
      descricao: "Risoto clássico com funghi chileno. Vegano.",
      url_visual: "https://gourmetpratico.com.br/receitas/risotos/funghi/"
    },
    {
      id: "RIS-POM-002",
      nome: "Risoto Pomodori & Pesto",
      categoria: "Risoto",
      preco: 34.80,
      estoque: "Em Estoque",
      descricao: "Risoto de tomate seco com pesto de manjericão.",
      url_visual: "https://gourmetpratico.com.br/receitas/risotos/pomodori/"
    },
    {
      id: "SOP-DET-005",
      nome: "Sopa Detox Ora-pro-nóbis",
      categoria: "Sopa Funcional",
      preco: 29.60,
      estoque: "Em Estoque",
      descricao: "Sopa verde detox com gengibre e super alimentos.",
      url_visual: "https://gourmetpratico.com.br/receitas/sopas-funcionais/detox/"
    },
    {
      id: "REF-BAI-002",
      nome: "Baião de Dois Integral",
      categoria: "Refeição",
      preco: 34.80,
      estoque: "Em Estoque",
      descricao: "Prato brasileiro vegano com feijão fradinho e shiitake defumado.",
      url_visual: "https://gourmetpratico.com.br/receitas/refeicoes-integrais/baiao-de-dois/"
    },
    {
      id: "ANT-PES-002",
      nome: "Pesto de Manjericão",
      categoria: "Empório",
      preco: 29.80,
      estoque: "Em Estoque",
      descricao: "Pesto genovês com castanha do pará. Contém queijo.",
      url_visual: "https://gourmetpratico.com.br/receitas/emporio-da-chef/pesto-manjericao/"
    }
    // ... Você pode adicionar os outros 20 aqui seguindo o modelo ...
  ];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json", // Isso diz ao robô: "Sou dados puros"
      "Access-Control-Allow-Origin": "*"  // Permite que qualquer IA leia isso
    },
    body: JSON.stringify(produtos)
  };
};
