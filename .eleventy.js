const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // 1. COPIAR ARQUIVOS ESTÁTICOS (Essencial para o CSS e Imagens aparecerem)
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/imagens");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/admin"); // Para o Decap CMS
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/_redirects");

  // 2. FILTRO DE DATA (Para o sitemap e artigos)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });

  // 3. CONFIGURAÇÃO DE DIRETÓRIOS (Para evitar bagunça)
  return {
    dir: {
      input: ".", // Ou "src" se você moveu tudo para dentro de src
      includes: "_includes",
      data: "_data",
      output: "_site" // A pasta que vai para o servidor
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};


