const produtos = [
  {
    id: 1,
    nome: "Camiseta Básica Preta",
    preco: 59.90,
    imagem: "img/produto-1.svg",
    descricao: "Camiseta básica de algodão 100% na cor preta. Confortável e versátil para o dia a dia. Tecido macio com acabamento premium."
  },
  {
    id: 2,
    nome: "Tênis Esportivo Runner",
    preco: 249.90,
    imagem: "img/produto-2.svg",
    descricao: "Tênis esportivo leve e confortável, ideal para corrida e caminhada. Solado em borracha com amortecimento avançado."
  },
  {
    id: 3,
    nome: "Mochila Urban Pro",
    preco: 189.90,
    imagem: "img/produto-3.svg",
    descricao: "Mochila urbana com compartimento para notebook até 15.6\". Resistente à água, com bolsos organizadores e alças acolchoadas."
  },
  {
    id: 4,
    nome: "Relógio Digital Sport",
    preco: 129.90,
    imagem: "img/produto-4.svg",
    descricao: "Relógio digital esportivo com cronômetro, alarme e luz de fundo. Resistente à água até 50m. Pulseira em silicone."
  },
  {
    id: 5,
    nome: "Fone Bluetooth ANC",
    preco: 349.90,
    imagem: "img/produto-5.svg",
    descricao: "Fone de ouvido Bluetooth com cancelamento ativo de ruído. Bateria de 30 horas, microfone integrado e som Hi-Fi."
  },
  {
    id: 6,
    nome: "Jaqueta Corta-Vento",
    preco: 199.90,
    imagem: "img/produto-6.svg",
    descricao: "Jaqueta corta-vento leve e impermeável. Ideal para atividades ao ar livre. Capuz ajustável e bolsos com zíper."
  },
  {
    id: 7,
    nome: "Óculos de Sol Polarizado",
    preco: 149.90,
    imagem: "img/produto-7.svg",
    descricao: "Óculos de sol com lentes polarizadas e proteção UV400. Armação leve em acetato com design moderno e elegante."
  },
  {
    id: 8,
    nome: "Garrafa Térmica 750ml",
    preco: 79.90,
    imagem: "img/produto-8.svg",
    descricao: "Garrafa térmica em aço inoxidável com capacidade de 750ml. Mantém bebidas quentes por 12h e geladas por 24h."
  }
];

function buscarProdutoPorId(id) {
  return produtos.find(produto => produto.id === parseInt(id));
}

function obterCarrinho() {
  const carrinho = localStorage.getItem("cart");
  return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("cart", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(idProduto) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find(item => item.id === parseInt(idProduto));
  if (existente) {
    existente.qty += 1;
  } else {
    carrinho.push({ id: parseInt(idProduto), qty: 1 });
  }
  salvarCarrinho(carrinho);
  atualizarContadorCarrinho();
  mostrarNotificacao("Produto adicionado ao carrinho!");
}

function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const total = carrinho.reduce((soma, item) => soma + item.qty, 0);
  const contador = document.getElementById("contador-carrinho");
  if (contador) {
    contador.textContent = total;
    contador.style.display = total > 0 ? "flex" : "none";
  }
}

function formatarPreco(valor) {
  return "R$\u00A0" + valor.toFixed(2).replace(".", ",");
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement("div");
  notificacao.className = "notificacao";
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);
  setTimeout(() => notificacao.classList.add("visivel"), 10);
  setTimeout(() => {
    notificacao.classList.remove("visivel");
    setTimeout(() => notificacao.remove(), 300);
  }, 2000);
}
