const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // 1. CÓPIAS DE ARQUIVOS (O que vai direto para o site)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("imagens");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin"); 
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");

  // 2. FILTROS
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });

  // 3. CONFIGURAÇÃO DO MOTOR (AQUI ESTÁ A CURA)
  return {
    dir: {
      input: ".",         // Entrada na raiz
      includes: "_includes", // Layouts
      data: "_data",      // Dados
      output: "_site"     // Saída
    },
    // ESTAS 3 LINHAS OBRIGAM O HTML A FUNCIONAR
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
