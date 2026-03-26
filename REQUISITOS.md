# Requisitos do Projeto — E-commerce Vanilla

## Descrição

Desenvolver um e-commerce completo utilizando **apenas HTML, CSS e JavaScript puro** (sem frameworks ou bibliotecas externas).

---

## Requisitos Funcionais

### RF01 — Vitrine de Produtos

- Exibir uma lista de produtos em formato de grid (cards).
- Cada card deve conter: imagem, nome, preço e botão "Adicionar ao Carrinho".
- Os produtos devem ser renderizados dinamicamente via JavaScript a partir de um array de objetos.

### RF02 — Busca e Filtro

- O usuário deve poder buscar produtos pelo nome através de um campo de texto.
- A lista de produtos deve ser atualizada em tempo real conforme o usuário digita.

### RF03 — Página de Detalhe do Produto

- Ao clicar em um produto, o usuário deve ser direcionado para uma página de detalhe.
- A página deve exibir: imagem ampliada, nome, descrição completa, preço e botão "Adicionar ao Carrinho".
- O produto deve ser identificado via parâmetro na URL (`?id=1`).

### RF04 — Carrinho de Compras

- O usuário deve poder adicionar produtos ao carrinho a partir da vitrine ou da página de detalhe.
- O carrinho deve exibir: lista de itens, quantidade de cada item, subtotal por item e total geral.
- O usuário deve poder alterar a quantidade de cada item ou removê-lo do carrinho.
- O estado do carrinho deve persistir entre páginas utilizando `localStorage`.
- O ícone do carrinho no header deve exibir um contador com a quantidade total de itens.

### RF05 — Checkout (Finalização de Compra)

- Exibir um resumo do pedido (itens, quantidades e total).
- Formulário com os campos: nome completo, e-mail, endereço (rua, número, cidade, CEP) e dados de pagamento simulados (número do cartão, validade, CVV).
- Todos os campos devem ser validados com JavaScript antes do envio.
- Ao finalizar, o carrinho deve ser limpo e uma mensagem de sucesso deve ser exibida.

---

## Requisitos Não Funcionais

### RNF01 — Responsividade

- O layout deve ser responsivo e funcionar corretamente em dispositivos móveis, tablets e desktops.
- Utilizar CSS Flexbox e/ou Grid para organização dos elementos.
- Utilizar `@media` queries para adaptação de breakpoints.

### RNF02 — Sem Dependências Externas

- Não utilizar nenhum framework ou biblioteca (React, Vue, Angular, jQuery, Bootstrap, Tailwind, etc.).
- Apenas HTML, CSS e JavaScript puros.

### RNF03 — Organização do Código

- Separar responsabilidades em arquivos distintos (um JS por funcionalidade, um CSS centralizado).
- Código limpo, legível e comentado quando necessário.

### RNF04 — Persistência de Estado

- Utilizar `localStorage` para manter o carrinho entre navegações de página.
- Os dados devem ser armazenados em formato JSON.

### RNF05 — Acessibilidade Básica

- Utilizar tags semânticas do HTML5 (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`).
- Botões e links devem ser navegáveis por teclado.
- Imagens devem possuir atributo `alt` descritivo.

---

## Estrutura de Arquivos

```
exercicio/
├── index.html          # Vitrine de produtos
├── product.html        # Detalhe do produto
├── cart.html           # Carrinho de compras
├── checkout.html       # Finalização da compra
├── REQUISITOS.md       # Este documento
├── css/
│   └── style.css       # Estilos globais
├── js/
│   ├── products.js     # Dados dos produtos (array de objetos)
│   ├── app.js          # Lógica da vitrine e busca
│   ├── product.js      # Lógica da página de detalhe
│   ├── cart.js         # Lógica do carrinho (localStorage)
│   └── checkout.js     # Lógica do checkout e validação
└── img/                # Imagens dos produtos
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura e semântica das páginas |
| **CSS3** | Estilização, layout (Flexbox/Grid), responsividade |
| **JavaScript (ES6+)** | Manipulação do DOM, eventos, localStorage, validação |

---

## Gestão de Estado

O estado do carrinho é gerenciado via `localStorage` com a chave `cart`, armazenando um array de objetos no formato:

```json
[
  { "id": 1, "qty": 2 },
  { "id": 3, "qty": 1 }
]
```

Todas as páginas leem e escrevem nessa mesma chave, garantindo consistência entre navegações.
