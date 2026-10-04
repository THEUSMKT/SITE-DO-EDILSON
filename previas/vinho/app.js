/* =========================================================================
   Prévia · Landing page do vinho importado
   Lê o config.js, monta os links de compra e cuida das animações.
   ========================================================================= */
import { CONFIG } from "./config.js";

const raiz = document.documentElement;
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Utilidades ---------- */
function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function nomeVinho() {
  return texto(CONFIG.nomeVinho);
}

function preencherNome(modelo) {
  return texto(modelo).split("{nome}").join(nomeVinho());
}

function linkWhatsApp(mensagem) {
  const numero = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  const textoPronto = preencherNome(mensagem);
  return "https://wa.me/" + numero + (textoPronto ? "?text=" + encodeURIComponent(textoPronto) : "");
}

function aoMudar(lista, funcao) {
  if (lista.addEventListener) lista.addEventListener("change", funcao);
  else if (lista.addListener) lista.addListener(funcao);
}

/* ---------- Textos vindos do config.js ---------- */
function aplicarTextos() {
  const valores = {
    nomeVinho: nomeVinho(),
    slogan: texto(CONFIG.slogan),
    nomeLoja: texto(CONFIG.nomeLoja)
  };

  document.querySelectorAll("[data-config]").forEach(function (el) {
    const valor = valores[el.dataset.config];
    if (valor) el.textContent = valor;
  });

  if (valores.nomeVinho) document.title = valores.nomeVinho + " | Vinho importado de marca exclusiva";

  document.querySelectorAll("[data-ano]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
}

/* ---------- Links: compra, dúvida e redes sociais ---------- */
function configurarLinks() {
  const compra = linkWhatsApp(CONFIG.mensagemWhats);
  const duvida = linkWhatsApp(CONFIG.mensagemDuvida || CONFIG.mensagemWhats);

  function apontar(seletor, url) {
    document.querySelectorAll(seletor).forEach(function (link) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  apontar("[data-comprar]", compra);
  apontar("[data-duvida]", duvida);

  document.querySelectorAll("[data-social]").forEach(function (link) {
    const url = texto(CONFIG[link.dataset.social]);
    if (url) link.href = url;
    else link.hidden = true;
  });
}

/* ---------- Garrafa: rótulo com o nome e troca automática pela foto ---------- */
const PALAVRAS_DE_LIGACAO = ["de", "da", "do", "das", "dos", "e", "del", "di", "la", "le"];

const SVG_NS = "http://www.w3.org/2000/svg";
const LARGURA_DO_ROTULO = 118;

// Posição das linhas do nome no rótulo e o menor tamanho aceitável antes de quebrar em mais linhas.
const LINHAS_DO_ROTULO = {
  1: { base: 20, minimo: 15, y: [547] },
  2: { base: 17, minimo: 12, y: [533, 557] },
  3: { base: 14, minimo: 0, y: [523, 541, 559] }
};

// Divide as palavras em N linhas deixando a linha mais comprida o menor possível.
function dividirEmLinhas(palavras, quantidade) {
  if (quantidade === 1) return [palavras.join(" ")];
  let melhor = null;
  for (let i = 1; i <= palavras.length - quantidade + 1; i++) {
    const linhas = [palavras.slice(0, i).join(" ")].concat(dividirEmLinhas(palavras.slice(i), quantidade - 1));
    const maior = Math.max.apply(null, linhas.map(function (linha) { return linha.length; }));
    if (!melhor || maior < melhor.maior) melhor = { linhas: linhas, maior: maior };
  }
  return melhor.linhas;
}

function iniciais(nome) {
  return nome
    .split(/\s+/)
    .filter(function (palavra) {
      return palavra && PALAVRAS_DE_LIGACAO.indexOf(palavra.toLowerCase()) === -1;
    })
    .slice(0, 2)
    .map(function (palavra) { return palavra.charAt(0); })
    .join("")
    .toLocaleUpperCase("pt-BR");
}

// Escreve o nome no rótulo em 1 a 3 linhas, reduzindo a fonte se o nome for comprido.
function escreverRotulo(svg) {
  const nome = nomeVinho();
  const alvo = svg.querySelector('[data-rotulo="nome"]');
  if (!nome || !alvo) return;

  const monograma = svg.querySelector('[data-rotulo="monograma"]');
  if (monograma) monograma.textContent = iniciais(nome);

  const palavras = nome.toLocaleUpperCase("pt-BR").split(/\s+/).filter(Boolean);
  const maximoDeLinhas = Math.min(3, palavras.length);

  for (let quantidade = 1; quantidade <= maximoDeLinhas; quantidade++) {
    const regra = LINHAS_DO_ROTULO[quantidade];
    alvo.textContent = "";
    const partes = dividirEmLinhas(palavras, quantidade).map(function (linha, i) {
      const parte = document.createElementNS(SVG_NS, "tspan");
      parte.setAttribute("x", "120");
      parte.setAttribute("y", String(regra.y[i]));
      parte.textContent = linha;
      alvo.append(parte);
      return parte;
    });

    let tamanho = regra.base;
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      alvo.style.fontSize = tamanho.toFixed(2) + "px";
      const largura = Math.max.apply(null, partes.map(function (parte) { return parte.getComputedTextLength(); }));
      if (!largura || largura <= LARGURA_DO_ROTULO) break;
      tamanho = tamanho * (LARGURA_DO_ROTULO / largura);
    }

    if (tamanho >= regra.minimo) break;
  }
}

function montarRotulos() {
  document.querySelectorAll(".garrafa__svg").forEach(escreverRotulo);
}

function usarFoto(caixa, caminho) {
  const decorativa = caixa.dataset.garrafa === "decorativa";
  const svg = caixa.querySelector(".garrafa__svg");
  if (!svg || caixa.classList.contains("tem-foto")) return;

  const foto = new Image();
  foto.className = "garrafa__midia garrafa__foto";
  foto.decoding = "async";
  foto.src = caminho;
  foto.alt = decorativa ? "" : "Garrafa do vinho " + nomeVinho();
  if (decorativa) foto.setAttribute("aria-hidden", "true");

  svg.insertAdjacentElement("afterend", foto);
  caixa.style.setProperty("--garrafa-foto", 'url("' + caminho.replace(/["\\]/g, "\\$&") + '")');
  caixa.classList.add("tem-foto");
}

// Se a foto existir, ela substitui a garrafa em SVG (sem mexer no CSS).
function trocarPorFoto() {
  const caminho = texto(CONFIG.fotoGarrafa);
  if (!caminho) return;

  const teste = new Image();
  teste.onload = function () {
    document.querySelectorAll("[data-garrafa]").forEach(function (caixa) {
      usarFoto(caixa, caminho);
    });
  };
  teste.src = caminho;
}

function montarGarrafa() {
  const nome = nomeVinho();
  document.querySelectorAll('[data-garrafa="principal"] .garrafa__svg').forEach(function (svg) {
    if (nome) svg.setAttribute("aria-label", "Garrafa do vinho " + nome);
  });

  montarRotulos();
  // As medidas do rótulo dependem das fontes: refaz quando elas terminam de carregar.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(montarRotulos);

  trocarPorFoto();
}

/* ---------- Ficha técnica (condicional) ---------- */
const CAMPOS_DA_FICHA = [
  ["origem", "Origem"],
  ["uva", "Uva"],
  ["safra", "Safra"],
  ["teor", "Teor alcoólico"],
  ["harmonizacao", "Harmonização"]
];

function montarFicha() {
  const secao = document.querySelector("[data-ficha]");
  const lista = secao && secao.querySelector("[data-ficha-lista]");
  if (!lista || CONFIG.mostrarFichaTecnica !== true) return;

  const ficha = CONFIG.ficha || {};
  const preenchidos = CAMPOS_DA_FICHA.filter(function (campo) {
    return texto(ficha[campo[0]]);
  });
  if (!preenchidos.length) return;

  preenchidos.forEach(function (campo) {
    const item = document.createElement("div");
    item.className = "ficha__item";
    const termo = document.createElement("dt");
    termo.textContent = campo[1];
    const valor = document.createElement("dd");
    valor.textContent = texto(ficha[campo[0]]);
    item.append(termo, valor);
    lista.append(item);
  });

  lista.setAttribute("data-revelar", "");
  secao.hidden = false;
}

/* ---------- Depoimentos (condicional, somente reais) ---------- */
function montarDepoimentos() {
  const secao = document.querySelector("[data-depoimentos]");
  const destino = secao && secao.querySelector("[data-depoimentos-lista]");
  if (!destino || CONFIG.mostrarDepoimentos !== true) return;

  const lista = (Array.isArray(CONFIG.depoimentos) ? CONFIG.depoimentos : []).filter(function (item) {
    return item && texto(item.texto);
  });
  if (!lista.length) return;

  lista.forEach(function (item) {
    const figura = document.createElement("figure");
    figura.className = "depoimento";
    figura.setAttribute("data-revelar", "");

    const citacao = document.createElement("blockquote");
    const paragrafo = document.createElement("p");
    paragrafo.textContent = texto(item.texto);
    citacao.append(paragrafo);
    figura.append(citacao);

    const autoria = [texto(item.nome), texto(item.cidade)].filter(Boolean).join(" · ");
    if (autoria) {
      const legenda = document.createElement("figcaption");
      legenda.textContent = autoria;
      figura.append(legenda);
    }

    destino.append(figura);
  });

  secao.hidden = false;
}

/* ---------- Perguntas frequentes (acordeão acessível) ---------- */
function configurarAcordeao() {
  const faq = document.querySelector(".faq");
  if (!faq) return;
  const botoes = Array.prototype.slice.call(faq.querySelectorAll(".faq__botao"));

  botoes.forEach(function (botao, indice) {
    const item = botao.closest(".faq__item");
    botao.setAttribute("aria-expanded", "false");

    botao.addEventListener("click", function () {
      const abrir = botao.getAttribute("aria-expanded") !== "true";
      botao.setAttribute("aria-expanded", String(abrir));
      item.classList.toggle("is-aberto", abrir);
    });

    // Setas, Home e End navegam entre as perguntas
    botao.addEventListener("keydown", function (evento) {
      const destinos = { ArrowDown: indice + 1, ArrowUp: indice - 1, Home: 0, End: botoes.length - 1 };
      if (!(evento.key in destinos)) return;
      evento.preventDefault();
      botoes[(destinos[evento.key] + botoes.length) % botoes.length].focus();
    });
  });

  faq.classList.add("faq--pronto");
}

/* ---------- Revelação ao rolar ---------- */
function configurarRevelacao() {
  document.querySelectorAll("[data-revelar-grupo]").forEach(function (grupo) {
    Array.prototype.forEach.call(grupo.children, function (filho, indice) {
      filho.style.setProperty("--atraso", indice * 120 + "ms");
    });
  });

  const alvos = document.querySelectorAll("[data-revelar]");
  if (!("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("is-visivel"); });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("is-visivel");
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  alvos.forEach(function (el) { observador.observe(el); });
}

/* ---------- Botão flutuante de WhatsApp (celular) ---------- */
function configurarFlutuante() {
  const botao = document.querySelector("[data-flutuante]");
  const acoesDaHero = document.querySelector(".hero__acoes");
  if (!botao || !acoesDaHero || !("IntersectionObserver" in window)) return;

  // Some quando outro botão de compra ou o rodapé estão na tela, para não cobrir nada importante.
  const bloqueios = new Set();
  let passouDaHero = false;

  function atualizar() {
    botao.classList.toggle("is-visivel", passouDaHero && bloqueios.size === 0);
  }

  new IntersectionObserver(function (entradas) {
    const entrada = entradas[entradas.length - 1];
    passouDaHero = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;
    atualizar();
  }).observe(acoesDaHero);

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) bloqueios.add(entrada.target);
      else bloqueios.delete(entrada.target);
    });
    atualizar();
  });
  document.querySelectorAll("[data-sem-flutuante]").forEach(function (el) { observador.observe(el); });
}

/* ---------- Parallax leve da garrafa ---------- */
function configurarParallax() {
  const hero = document.querySelector(".hero");
  const garrafa = hero && hero.querySelector(".garrafa__parallax");
  const halo = hero && hero.querySelector(".garrafa__halo");
  if (!garrafa) return;

  let agendado = false;
  let ligado = false;

  function aplicar() {
    agendado = false;
    const rolagem = Math.min(window.scrollY || window.pageYOffset, hero.offsetHeight);
    garrafa.style.transform = "translate3d(0, " + (rolagem * -0.08).toFixed(1) + "px, 0)";
    if (halo) halo.style.setProperty("--parallax-halo", (rolagem * 0.14).toFixed(1) + "px");
  }

  function aoRolar() {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(aplicar);
  }

  function decidir() {
    if (movimentoReduzido.matches && ligado) {
      window.removeEventListener("scroll", aoRolar);
      garrafa.style.transform = "";
      if (halo) halo.style.removeProperty("--parallax-halo");
      ligado = false;
    } else if (!movimentoReduzido.matches && !ligado) {
      window.addEventListener("scroll", aoRolar, { passive: true });
      ligado = true;
      aplicar();
    }
  }

  decidir();
  aoMudar(movimentoReduzido, decidir);
}

/* ---------- Partículas douradas da hero ---------- */
function configurarParticulas() {
  const hero = document.querySelector(".hero");
  const canvas = hero && hero.querySelector(".hero__particulas");
  const contexto = canvas && canvas.getContext && canvas.getContext("2d");
  if (!contexto) return;

  const brilho = criarBrilho();
  let largura = 0;
  let altura = 0;
  let particulas = [];
  let quadro = 0;
  let anterior = 0;
  let heroNaTela = true;

  function criarBrilho() {
    const tela = document.createElement("canvas");
    tela.width = tela.height = 64;
    const c = tela.getContext("2d");
    const gradiente = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradiente.addColorStop(0, "rgba(255, 238, 200, 1)");
    gradiente.addColorStop(0.16, "rgba(227, 200, 143, 0.9)");
    gradiente.addColorStop(0.45, "rgba(200, 164, 92, 0.22)");
    gradiente.addColorStop(1, "rgba(200, 164, 92, 0)");
    c.fillStyle = gradiente;
    c.fillRect(0, 0, 64, 64);
    return tela;
  }

  function nova(p, emQualquerAltura) {
    p.x = Math.random() * largura;
    p.y = emQualquerAltura ? Math.random() * altura : altura + 12;
    p.raio = 0.6 + Math.random() * 1.5;
    p.subida = 6 + Math.random() * 16;
    p.balanco = 6 + Math.random() * 16;
    p.ritmo = 0.15 + Math.random() * 0.45;
    p.fase = Math.random() * Math.PI * 2;
    p.alfa = 0.25 + Math.random() * 0.55;
    p.pisca = 0.5 + Math.random() * 1.3;
    return p;
  }

  function redimensionar() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    largura = hero.clientWidth;
    altura = hero.clientHeight;
    canvas.width = Math.round(largura * escala);
    canvas.height = Math.round(altura * escala);
    contexto.setTransform(escala, 0, 0, escala, 0, 0);

    const total = largura < 640 ? 24 : largura < 1100 ? 36 : 48;
    particulas = [];
    for (let i = 0; i < total; i++) particulas.push(nova({}, true));
  }

  function desenhar(tempo) {
    quadro = window.requestAnimationFrame(desenhar);
    const passo = Math.min((tempo - (anterior || tempo)) / 1000, 0.05);
    anterior = tempo;
    const segundos = tempo / 1000;

    contexto.clearRect(0, 0, largura, altura);
    contexto.globalCompositeOperation = "lighter";

    for (let i = 0; i < particulas.length; i++) {
      const p = particulas[i];
      p.y -= p.subida * passo;
      if (p.y < -12) nova(p, false);

      const x = p.x + Math.sin(segundos * p.ritmo + p.fase) * p.balanco;
      const cintilar = 0.55 + 0.45 * Math.sin(segundos * p.pisca + p.fase);
      const borda = Math.max(0, Math.min(1, p.y / (altura * 0.18), (altura - p.y) / (altura * 0.12)));
      contexto.globalAlpha = p.alfa * cintilar * borda;

      const tamanho = p.raio * 7;
      contexto.drawImage(brilho, x - tamanho / 2, p.y - tamanho / 2, tamanho, tamanho);
    }

    contexto.globalAlpha = 1;
    contexto.globalCompositeOperation = "source-over";
  }

  function podeAnimar() {
    return !movimentoReduzido.matches && heroNaTela && document.visibilityState !== "hidden";
  }

  // Liga ou pausa: aba escondida, hero fora da tela ou movimento reduzido param a animação.
  function atualizar() {
    if (podeAnimar()) {
      if (!quadro) {
        anterior = 0;
        quadro = window.requestAnimationFrame(desenhar);
      }
    } else {
      if (quadro) window.cancelAnimationFrame(quadro);
      quadro = 0;
      if (movimentoReduzido.matches) contexto.clearRect(0, 0, largura, altura);
    }
  }

  redimensionar();

  if ("ResizeObserver" in window) {
    let ultimaLargura = largura;
    let ultimaAltura = altura;
    new ResizeObserver(function () {
      if (hero.clientWidth === ultimaLargura && hero.clientHeight === ultimaAltura) return;
      ultimaLargura = hero.clientWidth;
      ultimaAltura = hero.clientHeight;
      redimensionar();
    }).observe(hero);
  } else {
    window.addEventListener("resize", redimensionar);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      heroNaTela = entradas[entradas.length - 1].isIntersecting;
      atualizar();
    }).observe(hero);
  }

  document.addEventListener("visibilitychange", atualizar);
  aoMudar(movimentoReduzido, atualizar);
  atualizar();
}

/* ---------- Início ---------- */
function iniciar() {
  aplicarTextos();
  configurarLinks();
  montarGarrafa();
  montarFicha();
  montarDepoimentos();
  configurarAcordeao();
  configurarRevelacao();
  configurarFlutuante();
  configurarParallax();
  configurarParticulas();
  window.__vinhoPronto = true;
}

try {
  iniciar();
} catch (erro) {
  // Em caso de erro, mostra a página inteira sem animações em vez de deixar partes escondidas.
  raiz.classList.remove("js");
  window.__vinhoPronto = true;
  console.error(erro);
}
