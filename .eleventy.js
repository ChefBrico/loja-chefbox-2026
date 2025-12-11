const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // =================================================================
  // 1. A REDE DE ARRASTÃO (Arquivos Estáticos)
  // =================================================================
  
  // Copia CSS, Imagens e JS da pasta assets para a raiz do site
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/imagens": "imagens" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  
  // Copia o Admin do CMS
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Copia arquivos essenciais da raiz
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // 🚨 A LINHA CRÍTICA (WEB AGÊNTICA) 🚨
  // Isso pega a pasta "src/well-known" e publica como ".well-known" (com ponto).
  // Sem isso, o ChatGPT e o Google não conseguem validar seu agente.
  eleventyConfig.addPassthroughCopy({ "src/well-known": ".well-known" });

  // =================================================================
  // 2. FILTROS (Formatadores de Dados)
  // =================================================================
  
  // Filtro para formatar dinheiro (R$ 1.200,00)
  eleventyConfig.addFilter("dinheiro", (valor) => {
    if (!valor) return "0,00";
    return parseFloat(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

  // Filtro para formatar datas (DD/MM/AAAA)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("America/Sao_Paulo").toFormat("dd/MM/yyyy");
  });

  // =================================================================
  // 3. CONFIGURAÇÃO DO MOTOR
  // =================================================================
  return {
    dir: {
      input: "src",          // Onde estão os arquivos fonte
      includes: "_includes", // Onde estão os layouts
      data: "_data",         // Onde estão os dados globais
      output: "_site"        // Onde o site pronto será salvo
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
