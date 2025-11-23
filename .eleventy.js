const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // --- 1. CÓPIAS DE ARQUIVOS (SEM O "src/" NA FRENTE) ---
  // Isso pega a pasta 'css' da raiz e joga para o site final
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("imagens");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin"); 
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_redirects");

  // --- 2. FILTROS DE DATA (Para o Google e Sitemap) ---
  
  // Data legível para humanos (Ex: 23/11/2025)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });
  
  // Data ISO para Robôs (Ex: 2025-11-23T14:00:00-03:00)
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toISO();
  });

  // --- 3. CONFIGURAÇÃO DE DIRETÓRIOS (CRÍTICO) ---
  return {
    dir: {
      // input: "." significa "A raiz do meu projeto é a entrada"
      input: ".",     
      
      // Onde estão os moldes HTML?
      includes: "_includes", 
      
      // Onde estão os JSONs (meta, menu)?
      data: "_data",         
      
      // Para onde vai o site pronto?
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
