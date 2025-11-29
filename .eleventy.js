const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // =================================================================
  // 1. A REDE DE ARRASTÃO (Encontra o CSS onde ele estiver)
  // =================================================================
  
  // Opção A: Se você colocou em src/assets/css (O Ideal)
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "css" });
  
  // Opção B: Se você colocou solto em src/css (Comum)
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  
  // Opção C: Se você esqueceu na Raiz/css (Antigo)
  eleventyConfig.addPassthroughCopy({ "css": "css" });

  // --- OUTROS ARQUIVOS ---
  eleventyConfig.addPassthroughCopy({ "src/assets/imagens": "imagens" });
  eleventyConfig.addPassthroughCopy({ "src/imagens": "imagens" }); // Segurança
  
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" }); // Segurança
  
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
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
