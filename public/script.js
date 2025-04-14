const form = document.getElementById('form-produto');
const tabela = document.getElementById('tabela-produtos');

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filtro-busca').addEventListener('input', carregarProdutos);
    document.getElementById('filtro-data-inicio').addEventListener('change', carregarProdutos);
    document.getElementById('filtro-data-fim').addEventListener('change', carregarProdutos);
});

async function carregarProdutos() {
    const res = await fetch('/produtos');
    let produtos = await res.json();

    const busca = document.getElementById('filtro-busca').value.toLowerCase();
    const dataInicio = document.getElementById('filtro-data-inicio').value;
    const dataFim = document.getElementById('filtro-data-fim').value;

    if (busca) {
        produtos = produtos.filter(p =>
            p.descricao.toLowerCase().includes(busca) ||
            p.modelo.toLowerCase().includes(busca) ||
            p.marca.toLowerCase().includes(busca)
        );
    }

    if (dataInicio) {
        produtos = produtos.filter(p => p.data_venda >= dataInicio);
    }

    if (dataFim) {
        produtos = produtos.filter(p => p.data_venda <= dataFim);
    }

    tabela.innerHTML = '';
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + produto.descricao + '</td>' +
            '<td>' + produto.modelo + '</td>' +
            '<td>' + produto.marca + '</td>' +
            '<td style="text-align: right;">R$ ' + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(produto.valor_custo) + '</td>' +
            '<td style="text-align: right;">R$ ' + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(produto.valor_venda) + '</td>' +
            '<td>' + new Date(produto.data_venda).toLocaleDateString('pt-BR') + '</td>' +
            '<td>' + produto.tipo_loja + '</td>' +
            '<td>' + produto.quantidade + '</td>' +
            '<td>' +
            '<button onclick="excluir(' + produto.id + ')">Excluir</button>' +
            '<button onclick="editarProduto(' + produto.id + ')">Editar</button>' +
            '</td>';
        tabela.appendChild(tr);
    });
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    await fetch('/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    form.reset();
    carregarProdutos();
}

async function excluir(id) {
    await fetch('/produtos/' + id, { method: 'DELETE' });
    carregarProdutos();
}

async function editarProduto(id) {
    const res = await fetch('/produtos/' + id);
    const produto = await res.json();

    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('modelo').value = produto.modelo;
    document.getElementById('marca').value = produto.marca;
    document.getElementById('valor_custo').value = produto.valor_custo;
    document.getElementById('valor_venda').value = produto.valor_venda;
    document.getElementById('data_venda').value = produto.data_venda;
    document.getElementById('tipo_loja').value = produto.tipo_loja;
    document.getElementById('quantidade').value = produto.quantidade;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(form));
        await fetch('/produtos/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        form.reset();
        form.onsubmit = async (e) => {
            e.preventDefault();
            const dados = Object.fromEntries(new FormData(form));
            await fetch('/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            form.reset();
            carregarProdutos();
        };
        carregarProdutos();
    };
}
window.onload = carregarProdutos;
