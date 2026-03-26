const conteudoCarrinho = document.getElementById("conteudo-carrinho");

function renderizarCarrinho() {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    conteudoCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <p>Seu carrinho está vazio.</p>
        <a href="index.html" class="btn btn-primario">Continuar comprando</a>
      </div>
    `;
    return;
  }

  let totalGeral = 0;
  let htmlItens = '<ul class="lista-carrinho">';

  carrinho.forEach(item => {
    const produto = buscarProdutoPorId(item.id);
    if (!produto) return;

    const subtotal = produto.preco * item.qty;
    totalGeral += subtotal;

    htmlItens += `
      <li class="item-carrinho">
        <img src="${produto.imagem}" alt="${produto.nome}" class="img-item">
        <div class="info-item">
          <h3>${produto.nome}</h3>
          <p class="preco-item">${formatarPreco(produto.preco)}</p>
        </div>
        <div class="controles-quantidade">
          <button onclick="alterarQuantidade(${produto.id}, -1)" aria-label="Diminuir quantidade">−</button>
          <span class="quantidade-valor">${item.qty}</span>
          <button onclick="alterarQuantidade(${produto.id}, 1)" aria-label="Aumentar quantidade">+</button>
        </div>
        <span class="subtotal-item">${formatarPreco(subtotal)}</span>
        <button class="btn btn-perigo" onclick="removerDoCarrinho(${produto.id})" aria-label="Remover item">
          Remover
        </button>
      </li>
    `;
  });

  htmlItens += "</ul>";

  htmlItens += `
    <div class="rodape-carrinho">
      <p class="total-carrinho">Total: <span>${formatarPreco(totalGeral)}</span></p>
      <div>
        <a href="index.html" class="btn btn-contorno">Continuar comprando</a>
        <a href="checkout.html" class="btn btn-primario">Finalizar compra</a>
      </div>
    </div>
  `;

  conteudoCarrinho.innerHTML = htmlItens;
}

function alterarQuantidade(idProduto, delta) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(i => i.id === parseInt(idProduto));
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removerDoCarrinho(idProduto);
    return;
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
  atualizarContadorCarrinho();
}

function removerDoCarrinho(idProduto) {
  let carrinho = obterCarrinho();
  carrinho = carrinho.filter(item => item.id !== parseInt(idProduto));
  salvarCarrinho(carrinho);
  renderizarCarrinho();
  atualizarContadorCarrinho();
}

renderizarCarrinho();
atualizarContadorCarrinho();
