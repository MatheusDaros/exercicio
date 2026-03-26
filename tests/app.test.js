/**
 * @jest-environment jsdom
 */
const { loadScript } = require('./helpers/loadScript');

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = `
    <span id="contador-carrinho">0</span>
    <div id="grade-produtos"></div>
    <input type="text" id="campo-busca" value="" />
  `;
  loadScript('js/products.js', 'js/app.js');
});

describe('renderizarProdutos', () => {
  test('renderiza todos os 8 produtos', () => {
    renderizarProdutos(produtos);
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(8);
  });

  test('exibe mensagem quando lista está vazia', () => {
    renderizarProdutos([]);
    expect(document.querySelector('.sem-resultados')).not.toBeNull();
    expect(document.querySelector('.sem-resultados').textContent).toBe('Nenhum produto encontrado.');
  });

  test('card contém nome do produto', () => {
    renderizarProdutos([produtos[0]]);
    const card = document.querySelector('.card-produto');
    expect(card.innerHTML).toContain('Camiseta Básica Preta');
  });

  test('card contém preço formatado', () => {
    renderizarProdutos([produtos[0]]);
    const preco = document.querySelector('.card-preco');
    expect(preco.textContent).toBe(formatarPreco(59.90));
  });

  test('card contém botão de adicionar ao carrinho', () => {
    renderizarProdutos([produtos[0]]);
    const btn = document.querySelector('.btn-primario');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toContain('Adicionar ao Carrinho');
  });

  test('card contém link para página de detalhe', () => {
    renderizarProdutos([produtos[0]]);
    const link = document.querySelector('.card-corpo a');
    expect(link.getAttribute('href')).toBe('product.html?id=1');
  });

  test('card contém imagem do produto', () => {
    renderizarProdutos([produtos[0]]);
    const img = document.querySelector('.card-img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('img/produto-1.svg');
    expect(img.getAttribute('alt')).toBe('Camiseta Básica Preta');
  });

  test('renderiza subconjunto de produtos', () => {
    renderizarProdutos(produtos.slice(0, 3));
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(3);
  });
});

describe('filtrarProdutos', () => {
  test('filtra produtos pelo nome', () => {
    document.getElementById('campo-busca').value = 'camiseta';
    filtrarProdutos();
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(1);
  });

  test('busca é case-insensitive', () => {
    document.getElementById('campo-busca').value = 'MOCHILA';
    filtrarProdutos();
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(1);
  });

  test('exibe todos quando busca está vazia', () => {
    document.getElementById('campo-busca').value = '';
    filtrarProdutos();
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(8);
  });

  test('exibe mensagem quando nenhum produto encontrado', () => {
    document.getElementById('campo-busca').value = 'produtoinexistente123';
    filtrarProdutos();
    expect(document.querySelector('.sem-resultados')).not.toBeNull();
  });

  test('filtra com termo parcial', () => {
    document.getElementById('campo-busca').value = 'rel';
    filtrarProdutos();
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(1);
    expect(cards[0].innerHTML).toContain('Relógio Digital Sport');
  });

  test('busca com espaços nas extremidades', () => {
    document.getElementById('campo-busca').value = '  camiseta  ';
    filtrarProdutos();
    const cards = document.querySelectorAll('.card-produto');
    expect(cards.length).toBe(1);
  });
});

describe('irParaDetalhe', () => {
  test('é uma função definida', () => {
    expect(typeof irParaDetalhe).toBe('function');
  });
});
