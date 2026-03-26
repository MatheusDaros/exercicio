/**
 * @jest-environment jsdom
 */
const { loadScript } = require('./helpers/loadScript');

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '<span id="contador-carrinho">0</span>';
  loadScript('js/products.js');
});

describe('produtos', () => {
  test('deve ter 9 produtos', () => {
    expect(produtos).toHaveLength(9);
  });

  test('cada produto deve ter id, nome, preco, imagem e descricao', () => {
    produtos.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('nome');
      expect(p).toHaveProperty('preco');
      expect(p).toHaveProperty('imagem');
      expect(p).toHaveProperty('descricao');
    });
  });

  test('ids devem ser únicos', () => {
    const ids = produtos.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('buscarProdutoPorId', () => {
  test('retorna produto com id numérico válido', () => {
    const produto = buscarProdutoPorId(1);
    expect(produto).toBeDefined();
    expect(produto.nome).toBe('Camiseta Básica Preta');
    expect(produto.preco).toBe(59.90);
  });

  test('retorna produto com id string', () => {
    const produto = buscarProdutoPorId('3');
    expect(produto).toBeDefined();
    expect(produto.nome).toBe('Mochila Urban Pro');
  });

  test('retorna undefined para id inexistente', () => {
    expect(buscarProdutoPorId(999)).toBeUndefined();
  });

  test('retorna undefined para id nulo', () => {
    expect(buscarProdutoPorId(null)).toBeUndefined();
  });
});

describe('obterCarrinho', () => {
  test('retorna array vazio quando localStorage está vazio', () => {
    expect(obterCarrinho()).toEqual([]);
  });

  test('retorna itens salvos no localStorage', () => {
    const itens = [{ id: 1, qty: 2 }];
    localStorage.setItem('cart', JSON.stringify(itens));
    expect(obterCarrinho()).toEqual(itens);
  });

  test('retorna múltiplos itens', () => {
    const itens = [{ id: 1, qty: 2 }, { id: 3, qty: 1 }];
    localStorage.setItem('cart', JSON.stringify(itens));
    expect(obterCarrinho()).toEqual(itens);
  });
});

describe('salvarCarrinho', () => {
  test('salva carrinho no localStorage', () => {
    const itens = [{ id: 1, qty: 3 }];
    salvarCarrinho(itens);
    expect(JSON.parse(localStorage.getItem('cart'))).toEqual(itens);
  });

  test('salva carrinho vazio', () => {
    salvarCarrinho([]);
    expect(JSON.parse(localStorage.getItem('cart'))).toEqual([]);
  });
});

describe('adicionarAoCarrinho', () => {
  test('adiciona novo produto ao carrinho', () => {
    adicionarAoCarrinho(1);
    const carrinho = obterCarrinho();
    expect(carrinho).toHaveLength(1);
    expect(carrinho[0]).toEqual({ id: 1, qty: 1 });
  });

  test('incrementa quantidade de produto existente', () => {
    adicionarAoCarrinho(1);
    adicionarAoCarrinho(1);
    const carrinho = obterCarrinho();
    expect(carrinho).toHaveLength(1);
    expect(carrinho[0].qty).toBe(2);
  });

  test('adiciona múltiplos produtos diferentes', () => {
    adicionarAoCarrinho(1);
    adicionarAoCarrinho(2);
    const carrinho = obterCarrinho();
    expect(carrinho).toHaveLength(2);
  });

  test('funciona com id string', () => {
    adicionarAoCarrinho('5');
    const carrinho = obterCarrinho();
    expect(carrinho[0].id).toBe(5);
  });
});

describe('atualizarContadorCarrinho', () => {
  test('exibe total de itens no contador', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 3 }, { id: 2, qty: 2 }]));
    atualizarContadorCarrinho();
    const contador = document.getElementById('contador-carrinho');
    expect(contador.textContent).toBe('5');
    expect(contador.style.display).toBe('flex');
  });

  test('esconde contador quando carrinho está vazio', () => {
    atualizarContadorCarrinho();
    const contador = document.getElementById('contador-carrinho');
    expect(contador.textContent).toBe('0');
    expect(contador.style.display).toBe('none');
  });

  test('não quebra se elemento contador não existe', () => {
    document.body.innerHTML = '';
    expect(() => atualizarContadorCarrinho()).not.toThrow();
  });
});

describe('formatarPreco', () => {
  test('formata preço com duas casas decimais', () => {
    expect(formatarPreco(59.9)).toBe('R$\u00A059,90');
  });

  test('formata preço inteiro', () => {
    expect(formatarPreco(100)).toBe('R$\u00A0100,00');
  });

  test('formata preço com centavos', () => {
    expect(formatarPreco(249.90)).toBe('R$\u00A0249,90');
  });

  test('formata zero', () => {
    expect(formatarPreco(0)).toBe('R$\u00A00,00');
  });
});

describe('mostrarNotificacao', () => {
  jest.useFakeTimers();

  test('cria elemento de notificação no body', () => {
    mostrarNotificacao('Produto adicionado!');
    const notificacao = document.querySelector('.notificacao');
    expect(notificacao).not.toBeNull();
    expect(notificacao.textContent).toBe('Produto adicionado!');
  });

  test('adiciona classe visivel após timeout', () => {
    mostrarNotificacao('Teste');
    jest.advanceTimersByTime(20);
    const notificacao = document.querySelector('.notificacao');
    expect(notificacao.classList.contains('visivel')).toBe(true);
  });

  test('remove notificação após 2 segundos', () => {
    mostrarNotificacao('Teste');
    jest.advanceTimersByTime(2500);
    const notificacao = document.querySelector('.notificacao');
    expect(notificacao).toBeNull();
  });
});
