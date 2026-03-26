const containerDetalhe = document.getElementById("detalhe-produto");

function carregarDetalhe() {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");
  const produto = buscarProdutoPorId(id);

  if (!produto) {
    containerDetalhe.innerHTML = `
      <div class="carrinho-vazio" style="grid-column: 1 / -1;">
        <p>Produto não encontrado.</p>
        <a href="index.html" class="btn btn-primario">Voltar à vitrine</a>
      </div>
    `;
    return;
  }

  document.title = produto.nome + " — ShopBR";

  containerDetalhe.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" class="imagem-detalhe">
    <div class="info-detalhe">
      <h1>${produto.nome}</h1>
      <p class="preco-detalhe">${formatarPreco(produto.preco)}</p>
      <p class="descricao-detalhe">${produto.descricao}</p>
      <button class="btn btn-primario" onclick="adicionarAoCarrinho(${produto.id})">
        Adicionar ao Carrinho
      </button>
    </div>
  `;
}

carregarDetalhe();
atualizarContadorCarrinho();
