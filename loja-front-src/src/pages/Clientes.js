import { useEffect, useState } from "react";
import api from "../services/api";
import "./Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    listarClientes();
  }, []);

  function getToken() {
    return localStorage.getItem("token");
  }

  function authHeader() {
    return { Authorization: `Bearer ${getToken()}` };
  }

  async function listarClientes() {
    try {
      const response = await api.get("/cliente", { headers: authHeader() });
      setClientes(response.data);
    } catch {
      alert("Erro ao carregar clientes. Verifique se está logado.");
    }
  }

  async function salvarCliente() {
    if (!nome || !email || !telefone) {
      alert("Preencha todos os campos.");
      return;
    }
    try {
      await api.post("/cliente", { nome, email, telefone }, { headers: authHeader() });
      setNome("");
      setEmail("");
      setTelefone("");
      listarClientes();
    } catch {
      alert("Erro ao salvar cliente.");
    }
  }

  async function excluirCliente(codigo) {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    try {
      await api.delete(`/cliente/${codigo}`, { headers: authHeader() });
      listarClientes();
    } catch {
      alert("Erro ao excluir cliente.");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Clientes</h1>
        <div className="nav-links">
          <a href="/produtos">Produtos</a>
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <button onClick={salvarCliente}>Salvar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.codigo}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button
                  className="btn-excluir"
                  onClick={() => excluirCliente(cliente.codigo)}
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

export default Clientes;
