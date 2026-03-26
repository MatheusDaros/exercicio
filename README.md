# ShopBR — E-commerce Vanilla

E-commerce completo desenvolvido com **HTML, CSS e JavaScript puro**, sem frameworks ou bibliotecas externas.

## Funcionalidades

- **Vitrine de Produtos** — Grid de cards com imagem, nome, preço e botão de adicionar ao carrinho
- **Busca em Tempo Real** — Filtragem de produtos pelo nome conforme o usuário digita
- **Página de Detalhe** — Visualização ampliada do produto com descrição completa (`?id=`)
- **Carrinho de Compras** — Adicionar, alterar quantidade e remover itens, com persistência via `localStorage`
- **Checkout** — Resumo do pedido, formulário com validação de dados pessoais e pagamento simulado

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura e semântica das páginas |
| **CSS3** | Estilização, Flexbox/Grid, responsividade |
| **JavaScript (ES6+)** | DOM, eventos, localStorage, validação |
| **Jest** | Testes unitários com cobertura |

## Estrutura do Projeto

```
exercicio/
├── index.html          # Vitrine de produtos
├── product.html        # Detalhe do produto
├── cart.html           # Carrinho de compras
├── checkout.html       # Finalização da compra
├── css/
│   └── style.css       # Estilos globais
├── js/
│   ├── products.js     # Dados dos produtos e funções compartilhadas
│   ├── app.js          # Lógica da vitrine e busca
│   ├── product.js      # Lógica da página de detalhe
│   ├── cart.js         # Lógica do carrinho
│   └── checkout.js     # Lógica do checkout e validação
├── img/                # Imagens dos produtos (SVG)
└── tests/              # Testes unitários (Jest)
```

## Como Executar

Basta abrir o arquivo `index.html` no navegador. Não é necessário servidor ou build.

## Testes

```bash
npm install
npm test
```

Os testes utilizam **Jest** com ambiente `jsdom` e geram relatório de cobertura na pasta `coverage/`.

## Licença

Este projeto é um exercício educacional.
