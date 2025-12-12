const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // =================================================================
  // 1. A REDE DE ARRASTÃO (Arquivos Estáticos)
  // =================================================================
  
  // Copia CSS, Imagens e JS da pasta assets
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/imagens": "imagens" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  
  // Copia o Admin do CMS
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Copia arquivos essenciais da raiz
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // 🚨 A LINHA CRÍTICA (WEB AGÊNTICA) 🚨
  // Sem isso, a pasta well-known não vai para o ar!
  eleventyConfig.addPassthroughCopy({ "src/well-known": ".well-known" });

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
      input: "src",
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
