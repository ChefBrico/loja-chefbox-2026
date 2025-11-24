const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // 1. CÓPIAS DE SEGURANÇA (Pass-through)
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

  // 3. CONFIGURAÇÃO RÍGIDA DE DIRETÓRIOS
  return {
    dir: {
      input: ".",         // Entrada: Raiz
      includes: "_includes", // Layouts: Pasta _includes
      data: "_data",      // Dados: Pasta _data
      output: "_site"     // Saída: Pasta _site (Igual ao netlify.toml)
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
