import { useEffect, useState } from "react";
import api from "../services/api";
import "./Produtos.css";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [editandoCodigo, setEditandoCodigo] = useState(null);

  useEffect(() => {
    listarProdutos();
  }, []);

  function getToken() {
    return localStorage.getItem("token");
  }

  function authHeader() {
    return { Authorization: `Bearer ${getToken()}` };
  }

  async function listarProdutos() {
    try {
      const response = await api.get("/produto", { headers: authHeader() });
      setProdutos(response.data);
    } catch {
      alert("Erro ao carregar produtos. Verifique se está logado.");
    }
  }

  async function salvarProduto() {
    if (!nome || !descricao || !preco) {
      alert("Preencha todos os campos.");
      return;
    }
    const dados = { nome, descricao, preco: parseFloat(preco) };
    try {
      if (editandoCodigo) {
        await api.put(
          `/produto/${editandoCodigo}`,
          { ...dados, codigo: editandoCodigo },
          { headers: authHeader() }
        );
        setEditandoCodigo(null);
      } else {
        await api.post("/produto", dados, { headers: authHeader() });
      }
      setNome("");
      setDescricao("");
      setPreco("");
      listarProdutos();
    } catch {
      alert("Erro ao salvar produto.");
    }
  }

  function editarProduto(produto) {
    setEditandoCodigo(produto.codigo);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
  }

  function cancelarEdicao() {
    setEditandoCodigo(null);
    setNome("");
    setDescricao("");
    setPreco("");
  }

  async function excluirProduto(codigo) {
    if (!window.confirm("Deseja excluir este produto?")) return;
    try {
      await api.delete(`/produto/${codigo}`, { headers: authHeader() });
      listarProdutos();
    } catch {
      alert("Erro ao excluir produto.");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Produtos</h1>
        <div className="nav-links">
          <a href="/clientes">Clientes</a>
          <button className="btn-sair" onClick={sair}>Sair</button>
        </div>
      </div>

      <div className="formulario">
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          placeholder="Preço (ex: 19.90)"
          type="number"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <button onClick={salvarProduto}>
          {editandoCodigo ? "Atualizar" : "Salvar"}
        </button>
        {editandoCodigo && (
          <button className="btn-cancelar" onClick={cancelarEdicao}>
            Cancelar
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.codigo}>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>
                {Number(produto.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => editarProduto(produto)}
                >
                  Editar
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => excluirProduto(produto.codigo)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Produtos;
