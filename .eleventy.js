const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // --- 1. O QUE O ROBÔ DEVE COPIAR (Do SRC para o Site Final) ---
  // Note que agora apontamos para dentro de "src/"
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/imagens");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin"); 
  
  // Arquivos soltos importantes que movemos para src
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" }); // Garante que vá para a raiz do site final

  // --- 2. FILTROS (Mantidos e Protegidos) ---
  
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

  // --- 3. A NOVA CONFIGURAÇÃO DE DIRETÓRIOS (O PULO DO GATO) ---
  return {
    dir: {
      input: "src",          // <--- AQUI MUDOU! Agora olhamos para SRC
      includes: "_includes", // O Eleventy busca em src/_includes
      data: "_data",         // O Eleventy busca em src/_data
      output: "_site"        // Onde o site pronto é gerado
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
