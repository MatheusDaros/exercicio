const gradeProdutos = document.getElementById("grade-produtos");
const campoBusca = document.getElementById("campo-busca");

function renderizarProdutos(listaProdutos) {
  gradeProdutos.innerHTML = "";

  if (listaProdutos.length === 0) {
    gradeProdutos.innerHTML = '<p class="sem-resultados">Nenhum produto encontrado.</p>';
    return;
  }

  listaProdutos.forEach(produto => {
    const card = document.createElement("article");
    card.className = "card-produto";
    card.innerHTML = `
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        class="card-img"
        onclick="irParaDetalhe(${produto.id})"
      >
      <div class="card-corpo">
        <h3><a href="product.html?id=${produto.id}">${produto.nome}</a></h3>
        <p class="card-preco">${formatarPreco(produto.preco)}</p>
        <button class="btn btn-primario" onclick="adicionarAoCarrinho(${produto.id})">
          Adicionar ao Carrinho
        </button>
      </div>
    `;
    gradeProdutos.appendChild(card);
  });
}

function irParaDetalhe(id) {
  window.location.href = "product.html?id=" + id;
}

function filtrarProdutos() {
  const termo = campoBusca.value.toLowerCase().trim();
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(termo)
  );
  renderizarProdutos(produtosFiltrados);
}

campoBusca.addEventListener("input", filtrarProdutos);

renderizarProdutos(produtos);
atualizarContadorCarrinho();
