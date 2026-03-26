const conteudoCheckout = document.getElementById("conteudo-checkout");

function carregarCheckout() {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    conteudoCheckout.innerHTML = `
      <div class="carrinho-vazio">
        <p>Seu carrinho está vazio. Adicione produtos antes de finalizar.</p>
        <a href="index.html" class="btn btn-primario">Ir para a vitrine</a>
      </div>
    `;
    return;
  }

  let totalGeral = 0;
  let htmlResumo = '<ul class="lista-resumo">';

  carrinho.forEach(item => {
    const produto = buscarProdutoPorId(item.id);
    if (!produto) return;
    const subtotal = produto.preco * item.qty;
    totalGeral += subtotal;
    htmlResumo += `
      <li>
        <span class="nome-resumo">${produto.nome}</span>
        <span class="qtd-resumo">x${item.qty}</span>
        <span class="preco-resumo">${formatarPreco(subtotal)}</span>
      </li>
    `;
  });

  htmlResumo += "</ul>";
  htmlResumo += `
    <div class="total-resumo">
      <span>Total</span>
      <span>${formatarPreco(totalGeral)}</span>
    </div>
  `;

  conteudoCheckout.innerHTML = `
    <div class="container-checkout">
      <form class="formulario-checkout" id="formulario-checkout" novalidate>
        <div class="secao-form">
          <h2>Dados Pessoais</h2>
          <div class="grupo-campo">
            <label for="nome-completo">Nome Completo</label>
            <input type="text" id="nome-completo" placeholder="Seu nome completo" required>
            <span class="mensagem-erro">Informe seu nome completo.</span>
          </div>
          <div class="grupo-campo">
            <label for="email">E-mail</label>
            <input type="email" id="email" placeholder="seuemail@exemplo.com" required>
            <span class="mensagem-erro">Informe um e-mail válido.</span>
          </div>
        </div>

        <div class="secao-form">
          <h2>Endereço</h2>
          <div class="grupo-campo">
            <label for="rua">Rua</label>
            <input type="text" id="rua" placeholder="Nome da rua" required>
            <span class="mensagem-erro">Informe a rua.</span>
          </div>
          <div class="linha-campos">
            <div class="grupo-campo">
              <label for="numero">Número</label>
              <input type="text" id="numero" placeholder="Nº" required>
              <span class="mensagem-erro">Informe o número.</span>
            </div>
            <div class="grupo-campo">
              <label for="cidade">Cidade</label>
              <input type="text" id="cidade" placeholder="Sua cidade" required>
              <span class="mensagem-erro">Informe a cidade.</span>
            </div>
          </div>
          <div class="grupo-campo">
            <label for="cep">CEP</label>
            <input type="text" id="cep" placeholder="00000-000" maxlength="9" required>
            <span class="mensagem-erro">Informe um CEP válido (00000-000).</span>
          </div>
        </div>

        <div class="secao-form">
          <h2>Pagamento</h2>
          <div class="grupo-campo">
            <label for="numero-cartao">Número do Cartão</label>
            <input type="text" id="numero-cartao" placeholder="0000 0000 0000 0000" maxlength="19" required>
            <span class="mensagem-erro">Informe um número de cartão válido (16 dígitos).</span>
          </div>
          <div class="linha-campos">
            <div class="grupo-campo">
              <label for="validade">Validade</label>
              <input type="text" id="validade" placeholder="MM/AA" maxlength="5" required>
              <span class="mensagem-erro">Informe a validade (MM/AA).</span>
            </div>
            <div class="grupo-campo">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="000" maxlength="4" required>
              <span class="mensagem-erro">Informe o CVV (3 ou 4 dígitos).</span>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primario" style="width:100%; margin-top:1rem;">
          Confirmar Pedido
        </button>
      </form>

      <div class="resumo-pedido">
        <h2 class="titulo-pagina">Resumo do Pedido</h2>
        ${htmlResumo}
      </div>
    </div>
  `;

  const formulario = document.getElementById("formulario-checkout");
  formulario.addEventListener("submit", finalizarPedido);

  // Máscaras de entrada
  document.getElementById("cep").addEventListener("input", aplicarMascaraCep);
  document.getElementById("numero-cartao").addEventListener("input", aplicarMascaraCartao);
  document.getElementById("validade").addEventListener("input", aplicarMascaraValidade);
  document.getElementById("cvv").addEventListener("input", aplicarMascaraCvv);
}

function aplicarMascaraCep(evento) {
  let valor = evento.target.value.replace(/\D/g, "");
  if (valor.length > 5) {
    valor = valor.substring(0, 5) + "-" + valor.substring(5, 8);
  }
  evento.target.value = valor;
}

function aplicarMascaraCartao(evento) {
  let valor = evento.target.value.replace(/\D/g, "");
  valor = valor.substring(0, 16);
  valor = valor.replace(/(\d{4})(?=\d)/g, "$1 ");
  evento.target.value = valor;
}

function aplicarMascaraValidade(evento) {
  let valor = evento.target.value.replace(/\D/g, "");
  if (valor.length > 2) {
    valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
  }
  evento.target.value = valor;
}

function aplicarMascaraCvv(evento) {
  evento.target.value = evento.target.value.replace(/\D/g, "").substring(0, 4);
}

function validarCampo(id, condicao) {
  const campo = document.getElementById(id);
  if (!condicao) {
    campo.classList.add("invalido");
    return false;
  }
  campo.classList.remove("invalido");
  return true;
}

function finalizarPedido(evento) {
  evento.preventDefault();

  const nomeCompleto = document.getElementById("nome-completo").value.trim();
  const email = document.getElementById("email").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const numeroCartao = document.getElementById("numero-cartao").value.trim();
  const validade = document.getElementById("validade").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexCep = /^\d{5}-?\d{3}$/;
  const regexCartao = /^(\d{4}\s?){4}$/;
  const regexValidade = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const regexCvv = /^\d{3,4}$/;

  let formularioValido = true;

  formularioValido = validarCampo("nome-completo", nomeCompleto.length >= 3) && formularioValido;
  formularioValido = validarCampo("email", regexEmail.test(email)) && formularioValido;
  formularioValido = validarCampo("rua", rua.length >= 3) && formularioValido;
  formularioValido = validarCampo("numero", numero.length >= 1) && formularioValido;
  formularioValido = validarCampo("cidade", cidade.length >= 2) && formularioValido;
  formularioValido = validarCampo("cep", regexCep.test(cep)) && formularioValido;
  formularioValido = validarCampo("numero-cartao", regexCartao.test(numeroCartao)) && formularioValido;
  formularioValido = validarCampo("validade", regexValidade.test(validade)) && formularioValido;
  formularioValido = validarCampo("cvv", regexCvv.test(cvv)) && formularioValido;

  if (!formularioValido) return;

  // Limpa o carrinho e mostra mensagem de sucesso
  localStorage.removeItem("cart");
  atualizarContadorCarrinho();

  conteudoCheckout.innerHTML = `
    <div class="mensagem-sucesso">
      <h2>✅ Pedido realizado com sucesso!</h2>
      <p>Obrigado, <strong>${nomeCompleto}</strong>! Seu pedido foi confirmado.<br>
      Um e-mail de confirmação será enviado para <strong>${email}</strong>.</p>
      <a href="index.html" class="btn btn-primario">Voltar à vitrine</a>
    </div>
  `;
}

carregarCheckout();
atualizarContadorCarrinho();
