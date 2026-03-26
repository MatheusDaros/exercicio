/**
 * @jest-environment jsdom
 */
const { loadScript } = require('./helpers/loadScript');

function setupCheckoutComItens() {
  localStorage.clear();
  localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 1 }]));
  document.body.innerHTML = `
    <span id="contador-carrinho">0</span>
    <div id="conteudo-checkout"></div>
  `;
  loadScript('js/products.js', 'js/checkout.js');
}

function setupCheckoutVazio() {
  localStorage.clear();
  document.body.innerHTML = `
    <span id="contador-carrinho">0</span>
    <div id="conteudo-checkout"></div>
  `;
  loadScript('js/products.js', 'js/checkout.js');
}

describe('carregarCheckout', () => {
  test('exibe mensagem quando carrinho está vazio', () => {
    setupCheckoutVazio();
    expect(document.querySelector('.carrinho-vazio')).not.toBeNull();
    expect(document.querySelector('.carrinho-vazio').textContent).toContain('Seu carrinho está vazio');
  });

  test('exibe formulário quando carrinho tem itens', () => {
    setupCheckoutComItens();
    expect(document.getElementById('formulario-checkout')).not.toBeNull();
  });

  test('exibe resumo do pedido com itens', () => {
    setupCheckoutComItens();
    expect(document.querySelector('.resumo-pedido')).not.toBeNull();
    expect(document.querySelector('.lista-resumo')).not.toBeNull();
  });

  test('exibe total correto no resumo', () => {
    setupCheckoutComItens();
    const total = document.querySelector('.total-resumo');
    expect(total).not.toBeNull();
    expect(total.textContent).toContain('59,90');
  });

  test('cria campos do formulário', () => {
    setupCheckoutComItens();
    expect(document.getElementById('nome-completo')).not.toBeNull();
    expect(document.getElementById('email')).not.toBeNull();
    expect(document.getElementById('rua')).not.toBeNull();
    expect(document.getElementById('numero')).not.toBeNull();
    expect(document.getElementById('cidade')).not.toBeNull();
    expect(document.getElementById('cep')).not.toBeNull();
    expect(document.getElementById('numero-cartao')).not.toBeNull();
    expect(document.getElementById('validade')).not.toBeNull();
    expect(document.getElementById('cvv')).not.toBeNull();
  });
});

describe('aplicarMascaraCep', () => {
  test('formata CEP com hífen', () => {
    const evento = { target: { value: '12345678' } };
    setupCheckoutComItens();
    aplicarMascaraCep(evento);
    expect(evento.target.value).toBe('12345-678');
  });

  test('remove caracteres não numéricos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '123abc45678' } };
    aplicarMascaraCep(evento);
    expect(evento.target.value).toBe('12345-678');
  });

  test('não adiciona hífen para menos de 6 dígitos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '12345' } };
    aplicarMascaraCep(evento);
    expect(evento.target.value).toBe('12345');
  });
});

describe('aplicarMascaraCartao', () => {
  test('formata número do cartão com espaços', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '1234567890123456' } };
    aplicarMascaraCartao(evento);
    expect(evento.target.value).toBe('1234 5678 9012 3456');
  });

  test('limita a 16 dígitos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '12345678901234567890' } };
    aplicarMascaraCartao(evento);
    expect(evento.target.value).toBe('1234 5678 9012 3456');
  });

  test('remove caracteres não numéricos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '1234abcd5678efgh' } };
    aplicarMascaraCartao(evento);
    expect(evento.target.value).toBe('1234 5678');
  });
});

describe('aplicarMascaraValidade', () => {
  test('formata validade com barra', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '1225' } };
    aplicarMascaraValidade(evento);
    expect(evento.target.value).toBe('12/25');
  });

  test('não adiciona barra para menos de 3 dígitos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '12' } };
    aplicarMascaraValidade(evento);
    expect(evento.target.value).toBe('12');
  });

  test('remove caracteres não numéricos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '1a2b2c5' } };
    aplicarMascaraValidade(evento);
    expect(evento.target.value).toBe('12/25');
  });
});

describe('aplicarMascaraCvv', () => {
  test('limita a 4 dígitos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '12345' } };
    aplicarMascaraCvv(evento);
    expect(evento.target.value).toBe('1234');
  });

  test('remove caracteres não numéricos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '12a3b' } };
    aplicarMascaraCvv(evento);
    expect(evento.target.value).toBe('123');
  });

  test('aceita 3 dígitos', () => {
    setupCheckoutComItens();
    const evento = { target: { value: '123' } };
    aplicarMascaraCvv(evento);
    expect(evento.target.value).toBe('123');
  });
});

describe('validarCampo', () => {
  beforeEach(() => {
    setupCheckoutComItens();
  });

  test('adiciona classe invalido quando condição é falsa', () => {
    const result = validarCampo('nome-completo', false);
    expect(result).toBe(false);
    expect(document.getElementById('nome-completo').classList.contains('invalido')).toBe(true);
  });

  test('remove classe invalido quando condição é verdadeira', () => {
    document.getElementById('nome-completo').classList.add('invalido');
    const result = validarCampo('nome-completo', true);
    expect(result).toBe(true);
    expect(document.getElementById('nome-completo').classList.contains('invalido')).toBe(false);
  });

  test('valida campo email', () => {
    expect(validarCampo('email', true)).toBe(true);
    expect(validarCampo('email', false)).toBe(false);
  });
});

describe('finalizarPedido', () => {
  beforeEach(() => {
    setupCheckoutComItens();
  });

  test('previne envio padrão do formulário', () => {
    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);
    expect(evento.preventDefault).toHaveBeenCalled();
  });

  test('marca campos inválidos quando vazios', () => {
    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);
    expect(document.getElementById('nome-completo').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('email').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('rua').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('numero').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('cidade').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('cep').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('numero-cartao').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('validade').classList.contains('invalido')).toBe(true);
    expect(document.getElementById('cvv').classList.contains('invalido')).toBe(true);
  });

  test('não limpa carrinho quando formulário é inválido', () => {
    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);
    expect(localStorage.getItem('cart')).not.toBeNull();
  });

  test('finaliza pedido com dados válidos', () => {
    document.getElementById('nome-completo').value = 'João Silva';
    document.getElementById('email').value = 'joao@email.com';
    document.getElementById('rua').value = 'Rua Teste';
    document.getElementById('numero').value = '123';
    document.getElementById('cidade').value = 'São Paulo';
    document.getElementById('cep').value = '12345-678';
    document.getElementById('numero-cartao').value = '1234 5678 9012 3456';
    document.getElementById('validade').value = '12/25';
    document.getElementById('cvv').value = '123';

    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);

    expect(localStorage.getItem('cart')).toBeNull();
    expect(document.querySelector('.mensagem-sucesso')).not.toBeNull();
    expect(document.querySelector('.mensagem-sucesso').textContent).toContain('João Silva');
    expect(document.querySelector('.mensagem-sucesso').textContent).toContain('joao@email.com');
  });

  test('rejeita email inválido', () => {
    document.getElementById('nome-completo').value = 'João Silva';
    document.getElementById('email').value = 'email-invalido';
    document.getElementById('rua').value = 'Rua Teste';
    document.getElementById('numero').value = '123';
    document.getElementById('cidade').value = 'São Paulo';
    document.getElementById('cep').value = '12345-678';
    document.getElementById('numero-cartao').value = '1234 5678 9012 3456';
    document.getElementById('validade').value = '12/25';
    document.getElementById('cvv').value = '123';

    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);

    expect(document.getElementById('email').classList.contains('invalido')).toBe(true);
    expect(localStorage.getItem('cart')).not.toBeNull();
  });

  test('rejeita CEP inválido', () => {
    document.getElementById('nome-completo').value = 'João Silva';
    document.getElementById('email').value = 'joao@email.com';
    document.getElementById('rua').value = 'Rua Teste';
    document.getElementById('numero').value = '123';
    document.getElementById('cidade').value = 'São Paulo';
    document.getElementById('cep').value = '123';
    document.getElementById('numero-cartao').value = '1234 5678 9012 3456';
    document.getElementById('validade').value = '12/25';
    document.getElementById('cvv').value = '123';

    const evento = { preventDefault: jest.fn() };
    finalizarPedido(evento);

    expect(document.getElementById('cep').classList.contains('invalido')).toBe(true);
    expect(localStorage.getItem('cart')).not.toBeNull();
  });
});
