const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // --- 1. CÓPIAS DE ARQUIVOS (O Robô pega da pasta SRC) ---
  // Agora avisamos que eles estão guardados dentro de src
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/imagens");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin"); 
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // O _redirects geralmente fica na raiz ou src, vamos garantir que ele copie
  // Se ele estiver na raiz, use apenas "_redirects". Se moveu para src, use "src/_redirects"
  // Vou deixar configurado para buscar no SRC, pois é o padrão ouro.
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // --- 2. FILTROS (Mantidos iguais) ---
  
  // Filtro de Dinheiro (R$ 34,80)
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

  // --- 3. CONFIGURAÇÃO DO MOTOR (AQUI MUDOU!) ---
  return {
    dir: {
      // AGORA APONTAMOS PARA A PASTA SRC
      input: "src", 
      
      // O resto é relativo ao input (ou seja, src/_includes)
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
