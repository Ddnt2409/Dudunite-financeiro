// === INÍCIO FNFin006_TabelaPrecos – Consulta de Preços do Firebase ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [tabela, setTabela] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const ref = collection(db, 'tabela_precos');
        const snapshot = await getDocs(ref);
        const dados = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTabela(dados);
      } catch (err) {
        console.error('Erro ao carregar tabela:', err);
        setErro('Erro ao carregar tabela');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  if (carregando) return <div>⏳ Carregando tabela de preços...</div>;
  if (erro) return <div className="text-red-600">{erro}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📋 Tabela de Preços Atuais</h2>
      <table className="w-full table-auto border border-gray-300 bg-white text-sm text-left shadow">
        <thead className="bg-orange-200 text-[#5C1D0E]">
          <tr>
            <th className="border px-2 py-1">Produto</th>
            <th className="border px-2 py-1">Revenda</th>
            <th className="border px-2 py-1">Varejo</th>
            <th className="border px-2 py-1">Última Alteração</th>
          </tr>
        </thead>
        <tbody>
          {tabela.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.produto}</td>
              <td className="border px-2 py-1">R$ {item.valor_revenda?.toFixed(2)}</td>
              <td className="border px-2 py-1">R$ {item.valor_varejo?.toFixed(2)}</td>
              <td className="border px-2 py-1">{item.data_alteracao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FnFin006_TabelaPrecos;

// === FIM FNFin006_TabelaPrecos ===
