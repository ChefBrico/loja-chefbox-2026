const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // --- FORÇAR O MOTOR A LIGAR ---
  // Isso obriga o Eleventy a ler o frontmatter dentro de arquivos HTML
  eleventyConfig.setTemplateFormats(["njk", "md", "html"]);
  
  // --- CÓPIAS DE ARQUIVOS ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("imagens");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin"); 
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");

  // --- FILTROS ---
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });

  // --- CONFIGURAÇÃO DE DIRETÓRIOS (A VERDADE) ---
  return {
    dir: {
      input: ".",         // A raiz do GitHub é a entrada
      includes: "_includes", // A pasta de layouts
      data: "_data",      // A pasta de dados
      output: "_site"     // Onde o site é gerado
    },
    // Estas 3 linhas garantem que o layout funcione
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
