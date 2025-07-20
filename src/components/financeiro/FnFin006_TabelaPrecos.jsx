// === INÍCIO FN06 – Tabela de Preços com edição ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [dados, setDados] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);

  const carregarDados = async () => {
    const lista = [];
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lista.push({
        id: doc.id,
        produto: data.produto,
        valor_revenda: data.valor_revenda,
        valor_varejo: data.valor_varejo,
        ultima_alteracao: data.data || '',
      });
    });
    setDados(lista);
  };

  const salvarDados = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    for (let item of dados) {
      const ref = doc(db, 'produtos', item.id);
      await updateDoc(ref, {
        valor_revenda: item.valor_revenda,
        valor_varejo: item.valor_varejo,
        data: hoje,
        historico: [
          ...(item.historico || []),
          { data: hoje, valor: item.valor_revenda },
        ],
      });
    }
    setModoEdicao(false);
    carregarDados();
  };

  const handleInput = (index, campo, valor) => {
    const novos = [...dados];
    novos[index][campo] = valor;
    setDados(novos);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="p-4 bg-[#FFEFE4] min-h-screen text-[#5C1D0E]">
      <button
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
        onClick={() => window.history.back()}
      >
        Voltar
      </button>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span role="img">📋</span> Tabela de Preços Atuais
      </h2>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-orange-100 text-left">
            <th className="py-2 px-3 border-b">Produto</th>
            <th className="py-2 px-3 border-b">Revenda</th>
            <th className="py-2 px-3 border-b">Varejo</th>
            <th className="py-2 px-3 border-b">Última Alteração</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={item.id} className="border-t border-gray-200">
              <td className="py-2 px-3">{item.produto.toUpperCase()}</td>

              <td className="py-2 px-3">
                {modoEdicao ? (
                  <input
                    type="number"
                    value={item.valor_revenda}
                    onChange={(e) => handleInput(index, 'valor_revenda', parseFloat(e.target.value))}
                    className="border px-2 py-1 w-24"
                  />
                ) : (
                  `R$ ${item.valor_revenda.toFixed(2).replace('.', ',')}`
                )}
              </td>

              <td className="py-2 px-3">
                {modoEdicao ? (
                  <input
                    type="number"
                    value={item.valor_varejo}
                    onChange={(e) => handleInput(index, 'valor_varejo', parseFloat(e.target.value))}
                    className="border px-2 py-1 w-24"
                  />
                ) : (
                  `R$ ${item.valor_varejo.toFixed(2).replace('.', ',')}`
                )}
              </td>

              <td className="py-2 px-3">
                {item.ultima_alteracao ? item.ultima_alteracao : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <button
          onClick={modoEdicao ? salvarDados : () => setModoEdicao(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          {modoEdicao ? 'Salvar' : 'Alterar'}
        </button>
      </div>
    </div>
  );
};

export default FnFin006_TabelaPrecos;

// === FIM FN06 ===
