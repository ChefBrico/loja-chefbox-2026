const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // --- 1. O ROBÔ COPIA ESSAS PASTAS PARA O SITE FINAL ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("imagens");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin"); 
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");

  // --- 2. A CORREÇÃO DO PREÇO (O GARÇOM ESPERTO) ---
  // Aqui ensinamos ele a escrever "34,80" e não "R$ 34.8"
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

  // --- 3. ONDE ESTÃO OS ARQUIVOS? (A DESPENSA) ---
  return {
    dir: {
      // SE O SITE FICAR EM BRANCO, TROQUE "." POR "src" NA LINHA ABAIXO
      input: ".", 
      
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
