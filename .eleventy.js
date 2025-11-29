const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // =================================================================
  // 1. O TRANSPORTE DOS ARQUIVOS (Mapeamento Inteligente)
  // =================================================================
  
  // A Regra é: { "ONDE_ESTA_AGORA" : "ONDE_VAI_FICAR_NO_SITE" }
  
  // CSS: Pega de assets/css e joga na pasta css do site (para não quebrar links)
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "css" });
  
  // JS: Pega de assets/js e joga na pasta js
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  
  // Imagens: Pega de assets/imagens e joga na pasta imagens
  eleventyConfig.addPassthroughCopy({ "src/assets/imagens": "imagens" });
  
  // Admin do CMS
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Arquivos Soltos (Robots, Redirects)
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // =================================================================
  // 2. FILTROS (O Cérebro Matemático)
  // =================================================================
  
  // Filtro de Dinheiro (Corrige o R$ 34,80)
  eleventyConfig.addFilter("dinheiro", (valor) => {
    if (!valor) return "0,00";
    return parseFloat(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

  // Filtro de Data
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });

  // =================================================================
  // 3. CONFIGURAÇÃO DO MOTOR
  // =================================================================
  return {
    dir: {
      input: "src",          // O Robô olha para dentro de SRC
      includes: "_includes", // Busca layouts em src/_includes
      data: "_data",         // Busca dados em src/_data
      output: "_site"        // Cospe o site pronto aqui
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
