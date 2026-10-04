# Prévia: landing page do vinho importado

> [!WARNING]
> **ESTA É UMA PRÉVIA COM DADOS PROVISÓRIOS.** Antes da versão final, troque tudo o que está nesta lista:
>
> | O quê | Valor atual (PLACEHOLDER) | Onde trocar |
> |---|---|---|
> | Nome do vinho | `Reserva Exclusiva` (nome de trabalho) | `config.js` → `nomeVinho` e o `<head>` dos dois `index.html` (o da prévia e o da raiz) |
> | WhatsApp da loja | `5551981947979` | `config.js` → `whatsapp` |
> | Instagram | `https://instagram.com/` | `config.js` → `instagram` |
> | Facebook | `https://facebook.com/` | `config.js` → `facebook` |
> | Nome da loja | `Nome da loja` | `config.js` → `nomeLoja` e `og:site_name` nos dois `index.html` |
> | Foto da garrafa | ainda não existe: a página usa a garrafa desenhada em SVG | colocar `assets/garrafa.png` |
> | Imagem de compartilhamento | `assets/og-imagem.jpg` mostra o nome de trabalho e a garrafa em SVG | trocar o arquivo |
> | Ficha técnica | desligada (não há dados reais) | `config.js` → `mostrarFichaTecnica` e `ficha` |
> | Depoimentos | desligados (não há depoimentos reais) | `config.js` → `mostrarDepoimentos` e `depoimentos` |
> | Endereço nas tags de compartilhamento | `https://theusmkt.github.io/SITE-DO-EDILSON/previas/vinho/` | `og:url` e `og:image` nos dois `index.html` |

Landing page de página única para vender um único vinho importado de marca exclusiva. Todo botão **Comprar** abre uma conversa no WhatsApp da loja com a mensagem pronta. Não há carrinho nem checkout: pagamento e entrega são combinados na conversa.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `config.js` | **Tudo o que muda fica aqui**: nome, WhatsApp, redes, foto, ficha técnica e depoimentos |
| `index.html` | Estrutura e textos da página |
| `style.css` | Visual: cores, fontes, layout e animações |
| `app.js` | Lê o `config.js`, monta os links e cuida das animações |
| `assets/favicon.svg` | Ícone da aba do navegador |
| `assets/og-imagem.jpg` | Imagem que aparece quando o link é compartilhado (1200 × 630) |

Na raiz do repositório, um `index.html` só redireciona o endereço curto do site para a prévia.

## Como ver a prévia

**Online:** depois que o GitHub Pages estiver ligado (veja [Publicar](#publicar-no-github-pages)), o endereço é
`https://theusmkt.github.io/SITE-DO-EDILSON/previas/vinho/`

O endereço curto `https://theusmkt.github.io/SITE-DO-EDILSON/` também abre a prévia: o `index.html` da raiz redireciona na hora, mantendo parâmetros como `?utm_source=`.

**No computador:** a página usa módulos JavaScript, que o navegador só carrega a partir de um servidor. Aberta com dois cliques no `index.html`, ela aparece inteira, mas sem animações e com os botões de compra sem o link do WhatsApp. Para ver tudo funcionando:

```bash
# na pasta raiz do repositório
python3 -m http.server 8000
# e abra http://localhost:8000/previas/vinho/
```

(No VS Code, a extensão *Live Server* faz o mesmo.)

## Como trocar o `config.js`

Abra o `config.js`, troque o valor entre aspas e salve. A página se atualiza sozinha em todos os lugares.

| Campo | O que é | Exemplo de formato |
|---|---|---|
| `nomeVinho` | Nome do vinho. Aparece no título, no rótulo da garrafa em SVG, nos textos e na mensagem do WhatsApp. Nomes compridos são ajustados no rótulo automaticamente. | `"Nome Real do Vinho"` |
| `slogan` | Frase logo abaixo do nome, na abertura da página | `"Um brinde que ninguém esquece."` |
| `whatsapp` | Número da loja com código do país e DDD, só números (espaços, traços e parênteses são ignorados) | `"55" + DDD + número` → `"5551999999999"` |
| `mensagemWhats` | Mensagem pronta dos botões **Comprar**. `{nome}` vira o nome do vinho. | `"Olá! Quero comprar o vinho {nome}. Pode me ajudar?"` |
| `mensagemDuvida` | Mensagem pronta do link "Tirar dúvida pelo WhatsApp" das perguntas frequentes | `"Olá! Tenho uma dúvida sobre o vinho {nome}."` |
| `instagram` / `facebook` | Endereço completo do perfil. Deixe `""` para esconder o botão. | `"https://instagram.com/perfil.da.loja"` |
| `fotoGarrafa` | Caminho da foto da garrafa (veja abaixo) | `"assets/garrafa.png"` |
| `nomeLoja` | Nome da loja no topo e no rodapé | `"Nome da Loja"` |
| `mostrarFichaTecnica` / `ficha` | Liga a ficha técnica (veja abaixo) | `true` ou `false` |
| `mostrarDepoimentos` / `depoimentos` | Liga os depoimentos (veja abaixo) | `true` ou `false` |

Mantenha as aspas, as vírgulas no fim de cada linha e o `true`/`false` sem aspas.

### Quando o nome real chegar, troque também nos dois `index.html`

WhatsApp, Facebook e Google leem o começo do `index.html` antes de qualquer JavaScript rodar. Por isso, além do `config.js`, atualize estas linhas no `<head>` do `index.html` da prévia **e** do `index.html` da raiz do repositório (o do redirecionamento):

- `<title>` e `og:title`: troque `Reserva Exclusiva` pelo nome real;
- `og:site_name`: troque `Nome da loja`;
- `assets/og-imagem.jpg`: substitua por uma imagem nova de 1200 × 630 px (por exemplo, a foto da garrafa sobre fundo escuro).

## Como colocar a foto da garrafa

1. Use um **PNG com fundo transparente** (sem fundo), com a garrafa em pé e recortada bem rente às bordas.
2. Tamanho sugerido: cerca de **600 × 1900 px** (proporção aproximada de 1 para 3), com **até 300 KB**. Dá para comprimir no [TinyPNG](https://tinypng.com) ou no [Squoosh](https://squoosh.app).
3. Salve como **`garrafa.png`** dentro de **`previas/vinho/assets/`**.

Pronto: a página percebe a foto sozinha e troca as duas garrafas (abertura e fechamento), mantendo o brilho, a sombra, a flutuação e o reflexo. **Não é preciso mexer no CSS.** Para usar outro nome ou formato (por exemplo, `.webp`), altere `fotoGarrafa` no `config.js`.

> Enquanto a foto não existir, o console do navegador mostra um aviso 404 para `assets/garrafa.png`. É esperado: é assim que a página verifica se a foto já foi colocada.

## Como ligar a ficha técnica

Use **apenas dados reais**, tirados do rótulo ou do produtor. Preencha os campos e mude a flag para `true`:

```js
mostrarFichaTecnica: true,
ficha: {
  origem: "…",        // país e região
  uva: "…",           // uva ou corte
  safra: "…",         // ano
  teor: "…",          // teor alcoólico, ex.: "13,5%"
  harmonizacao: "…"   // sugestões de harmonização
},
```

Só os campos preenchidos aparecem. Se todos estiverem vazios, a seção continua escondida mesmo com `true`.

## Como ligar os depoimentos

**Nunca invente depoimentos.** Use somente mensagens reais de clientes, com autorização de quem escreveu.

```js
mostrarDepoimentos: true,
depoimentos: [
  { texto: "Texto exatamente como o cliente escreveu", nome: "Nome do cliente", cidade: "Cidade" },
  { texto: "Outro depoimento real", nome: "Outro cliente" }
]
```

`nome` e `cidade` são opcionais. Itens sem `texto` são ignorados, e a seção só aparece com a flag `true` e pelo menos um depoimento.

## Publicar no GitHub Pages

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, a branch **main** e a pasta **/(root)**. Salve.
3. Depois do merge na `main`, a prévia fica em `https://theusmkt.github.io/SITE-DO-EDILSON/previas/vinho/`, e o endereço curto `https://theusmkt.github.io/SITE-DO-EDILSON/` redireciona para ela (leva um ou dois minutos).

Se a pasta for copiada para outro repositório (por exemplo, `Matheus-Performance`), copie `previas/vinho/` inteira e troque o endereço em `og:url` e `og:image` no `index.html`.

## O que já está pronto

- **Ordem de persuasão:** abertura com a garrafa → por que este vinho → exclusividade → a experiência → ficha técnica (opcional) → momentos para brindar → como comprar em 3 passos → depoimentos (opcional) → perguntas frequentes → fechamento → rodapé.
- **Um objetivo só:** todos os botões de compra abrem o WhatsApp. No celular, um botão flutuante aparece depois da abertura e some quando outro botão de compra ou o rodapé estão na tela.
- **Animações elegantes:** entrada em sequência, garrafa flutuando com parallax leve, partículas douradas (pausam quando a aba fica escondida ou a abertura sai da tela), revelação ao rolar e brilho discreto no botão. Com **"reduzir movimento"** ligado no aparelho, tudo isso desliga e a página continua completa.
- **Acessibilidade:** contraste AA (mínimo de 5,7:1 nas combinações usadas), foco visível, navegação por teclado (no FAQ, setas, Home e End passam de uma pergunta para outra) e rótulos ARIA.
- **Leve:** HTML, CSS e JS puros, sem frameworks; fontes com `display=swap`; garrafa em SVG (nenhuma imagem pesada).
- **Prévia fora dos buscadores:** `noindex, nofollow`.
- **Ética:** sem verificação de idade nem selo "+18" (apenas "Beba com moderação." no rodapé), sem escassez falsa, sem prazos ou valores inventados e sem dados que não possam ser comprovados (origem, safra, prêmios, notas).

## Checklist de verificação

- [x] A página não tem modal de idade nem menção a "+18".
- [x] Todo botão **Comprar** abre o WhatsApp com a mensagem pronta (número do `config.js`).
- [x] Instagram e Facebook levam aos links do `config.js`.
- [x] Nenhum dado inventado: sem origem, safra, prêmios, depoimentos ou escassez falsa.
- [x] Ficha técnica e depoimentos estão ocultos por flag.
- [x] A garrafa funciona em SVG e é trocável por foto.
- [x] Animações desligam com `prefers-reduced-motion: reduce`.
- [x] `noindex` presente (também no redirecionamento da raiz) e nenhum arquivo existente fora de `previas/vinho/` foi alterado. O `index.html` da raiz foi criado depois, a pedido, só para redirecionar para a prévia.
- [x] Testado em 390 × 844 e 1440 × 900 (e também em 320, 360, 430, 768 e 1024 px de largura).
