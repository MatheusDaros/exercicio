/**
 * @jest-environment jsdom
 */
const { loadScript } = require('./helpers/loadScript');

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = `
    <span id="contador-carrinho">0</span>
    <div id="conteudo-carrinho"></div>
  `;
  loadScript('js/products.js', 'js/cart.js');
});

describe('renderizarCarrinho', () => {
  test('exibe mensagem quando carrinho está vazio', () => {
    renderizarCarrinho();
    expect(document.querySelector('.carrinho-vazio')).not.toBeNull();
    expect(document.querySelector('.carrinho-vazio').textContent).toContain('Seu carrinho está vazio');
  });

  test('exibe link para continuar comprando quando vazio', () => {
    renderizarCarrinho();
    const link = document.querySelector('.carrinho-vazio a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('index.html');
  });

  test('exibe itens quando carrinho tem produtos', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }]));
    renderizarCarrinho();
    expect(document.querySelector('.lista-carrinho')).not.toBeNull();
    expect(document.querySelector('.item-carrinho')).not.toBeNull();
  });

  test('exibe nome e preço do produto', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
    renderizarCarrinho();
    const item = document.querySelector('.item-carrinho');
    expect(item.innerHTML).toContain('Camiseta Básica Preta');
    expect(item.querySelector('.preco-item').textContent).toBe(formatarPreco(59.90));
  });

  test('exibe quantidade correta', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 3 }]));
    renderizarCarrinho();
    const qtd = document.querySelector('.quantidade-valor');
    expect(qtd.textContent).toBe('3');
  });

  test('exibe subtotal correto', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }]));
    renderizarCarrinho();
    const subtotal = document.querySelector('.subtotal-item');
    expect(subtotal.textContent).toBe(formatarPreco(119.80));
  });

  test('exibe total geral correto', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }, { id: 2, qty: 1 }]));
    renderizarCarrinho();
    const total = document.querySelector('.total-carrinho span');
    expect(total).not.toBeNull();
    expect(total.textContent).toBe(formatarPreco(59.90 * 2 + 249.90));
  });

  test('ignora itens com produto inválido', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 999, qty: 1 }, { id: 1, qty: 1 }]));
    renderizarCarrinho();
    const itens = document.querySelectorAll('.item-carrinho');
    expect(itens.length).toBe(1);
  });

  test('exibe rodapé com links', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
    renderizarCarrinho();
    const rodape = document.querySelector('.rodape-carrinho');
    expect(rodape).not.toBeNull();
    expect(rodape.innerHTML).toContain('checkout.html');
    expect(rodape.innerHTML).toContain('index.html');
  });
});

describe('alterarQuantidade', () => {
  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }, { id: 2, qty: 1 }]));
  });

  test('incrementa quantidade', () => {
    alterarQuantidade(1, 1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho.find(i => i.id === 1).qty).toBe(3);
  });

  test('decrementa quantidade', () => {
    alterarQuantidade(1, -1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho.find(i => i.id === 1).qty).toBe(1);
  });

  test('remove item quando quantidade chega a 0', () => {
    alterarQuantidade(2, -1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho.find(i => i.id === 2)).toBeUndefined();
  });

  test('não faz nada para produto inexistente no carrinho', () => {
    alterarQuantidade(999, 1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho).toHaveLength(2);
  });

  test('funciona com id string', () => {
    alterarQuantidade('1', 1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho.find(i => i.id === 1).qty).toBe(3);
  });
});

describe('removerDoCarrinho', () => {
  test('remove item do carrinho', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }, { id: 2, qty: 1 }]));
    removerDoCarrinho(1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho).toHaveLength(1);
    expect(carrinho[0].id).toBe(2);
  });

  test('carrinho fica vazio ao remover último item', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
    removerDoCarrinho(1);
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho).toHaveLength(0);
  });

  test('funciona com id string', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
    removerDoCarrinho('1');
    const carrinho = JSON.parse(localStorage.getItem('cart'));
    expect(carrinho).toHaveLength(0);
  });

  test('atualiza renderização após remoção', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
    removerDoCarrinho(1);
    expect(document.querySelector('.carrinho-vazio')).not.toBeNull();
  });
});
