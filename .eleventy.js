const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // =================================================================
  // 1. O RESGATE DOS ARQUIVOS (Mapeamento de Segurança)
  // =================================================================
  
  // --- CSS (A CORREÇÃO DO SITE QUEBRADO) ---
  // Tenta pegar da pasta nova (src/assets/css)
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "css" });
  // Tenta pegar da pasta antiga na raiz (css), caso você tenha esquecido de mover
  eleventyConfig.addPassthroughCopy({ "css": "css" });
  
  // --- IMAGENS ---
  eleventyConfig.addPassthroughCopy({ "src/assets/imagens": "imagens" });
  eleventyConfig.addPassthroughCopy({ "imagens": "imagens" }); // Segurança raiz
  
  // --- JAVASCRIPT ---
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "js": "js" }); // Segurança raiz
  
  // --- OUTROS ---
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  
  // Arquivos soltos
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // =================================================================
  // 2. FILTROS
  // =================================================================
  eleventyConfig.addFilter("dinheiro", (valor) => {
    if (!valor) return "0,00";
    return parseFloat(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

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
