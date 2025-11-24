const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // 1. COPIAS DE ARQUIVOS ESTÁTICOS
  // Garante que o CSS e as Imagens vão para o site final
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("imagens");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");

  // 2. FILTROS DE DATA
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toISO();
  });

  // 3. CONFIGURAÇÃO CRÍTICA (AQUI ESTAVA O ERRO)
  return {
    dir: {
      input: ".",         // A raiz é a entrada
      includes: "_includes", // Onde estão header e footer
      data: "_data",      // Onde estão os jsons
      output: "_site"     // Para onde vai o site
    },
    // ESTAS LINHAS ABAIXO CONSERTAM O TEXTO ESTRANHO NO TOPO
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",     // <--- OBRIGA O HTML A LER O LAYOUT
    markdownTemplateEngine: "njk", // <--- OBRIGA O MARKDOWN A LER O LAYOUT
    dataTemplateEngine: "njk"
  };
};
