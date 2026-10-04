// =====================================================================
//  CONFIGURAÇÃO DA PRÉVIA: tudo o que muda fica neste arquivo.
//  Os itens marcados como PLACEHOLDER precisam ser trocados antes da
//  versão final. Veja o passo a passo no LEIAME.md.
// =====================================================================

export const CONFIG = {
  nomeVinho: "Reserva Exclusiva",         // NOME DE TRABALHO: trocar pelo nome real
  slogan: "Um brinde que ninguém esquece.",
  whatsapp: "5551981947979",              // PLACEHOLDER: trocar pelo número da loja
  mensagemWhats: "Olá! Quero comprar o vinho {nome}. Pode me ajudar?",
  instagram: "https://instagram.com/",    // PLACEHOLDER
  facebook: "https://facebook.com/",      // PLACEHOLDER
  fotoGarrafa: "assets/garrafa.png",      // se o arquivo não existir, usar a garrafa em SVG
  mostrarFichaTecnica: false,             // ligar quando houver dados reais
  mostrarDepoimentos: false,              // ligar só com depoimentos REAIS
  ficha: { origem: "", uva: "", safra: "", teor: "", harmonizacao: "" },
  nomeLoja: "Nome da loja",

  // Mensagem do link "Tirar dúvida pelo WhatsApp" (perguntas frequentes).
  mensagemDuvida: "Olá! Tenho uma dúvida sobre o vinho {nome}.",

  // Depoimentos: só aparecem com mostrarDepoimentos: true e pelo menos um item.
  // Use SOMENTE depoimentos reais, com autorização de quem escreveu. Formato:
  // { texto: "O que o cliente escreveu", nome: "Nome do cliente", cidade: "Cidade" },
  depoimentos: []
};
