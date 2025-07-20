// === INÍCIO FnFin006_TabelaPrecos.jsx ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = ({ setTela }) => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState({});
  const [idMap, setIdMap] = useState({});

  useEffect(() => {
    const carregarPrecos = async () => {
      try {
        const precoRef = collection(db, 'tabela_precos');
        const snapshot = await getDocs(precoRef);
        const dados = {};
        const idMapTemp = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          const nome = data.produto.toUpperCase();
          dados[nome] = {
            revenda: data.revenda,
            varejo: data.varejo,
            ultimaAlteracao: data.ultimaAlteracao,
          };
          idMapTemp[nome] = doc.id;
        });
        setPrecos(dados);
        setIdMap(idMapTemp);
      } catch (error) {
        console.error('Erro ao carregar preços:', error);
      }
    };

    carregarPrecos();
  }, []);

  const handleChange = (e, produto, tipo) => {
    const valor = e.target.value.replace(',', '.');
    setPrecos((prev) => ({
      ...prev,
      [produto]: {
        ...prev[produto],
        [tipo]: valor,
      },
    }));
  };

  const salvarAlteracoes = async () => {
    try {
      const promises = Object.entries(precos).map(async ([produto, valores]) => {
        const docId = idMap[produto];
        const ref = doc(db, 'tabela_precos', docId);
        await updateDoc(ref, {
          revenda: parseFloat(valores.revenda || 0),
          varejo: parseFloat(valores.varejo || 0),
          ultimaAlteracao: new Date().toISOString().split('T')[0],
        });
      });

      await Promise.all(promises);
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const formatarValor = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '—' : `R$ ${numero.toFixed(2).replace('.', ',')}`;
  };

  const produtosOrdenados = Object.keys(precos).sort();

  return (
    <div className="p-4">
      <button
        onClick={() => setTela('inicio')}
        className="mb-4 bg-gray-300 px-3 py-1 rounded"
      >
        Voltar
      </button>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="ícone">📋</span>
        Tabela de Preços Atuais
      </h2>

      <table className="min-w-full table-auto border rounded-md bg-white shadow">
        <thead className="bg-orange-100">
          <tr>
            <th className="px-4 py-2 border">Produto</th>
            <th className="px-4 py-2 border">Revenda</th>
            <th className="px-4 py-2 border">Varejo</th>
            <th className="px-4 py-2 border">Última Alteração</th>
          </tr>
        </thead>
        <tbody>
          {produtosOrdenados.map((produto) => (
            <tr key={produto}>
              <td className="px-4 py-2 border font-bold">{produto}</td>
              <td className="px-4 py-2 border">
                {modoEdicao ? (
                  <input
                    type="text"
                    value={precos[produto].revenda ?? ''}
                    onChange={(e) => handleChange(e, produto, 'revenda')}
                    className="w-full border rounded p-1"
                  />
                ) : (
                  formatarValor(precos[produto].revenda)
                )}
              </td>
              <td className="px-4 py-2 border">
                {modoEdicao ? (
                  <input
                    type="text"
                    value={precos[produto].varejo ?? ''}
                    onChange={(e) => handleChange(e, produto, 'varejo')}
                    className="w-full border rounded p-1"
                  />
                ) : (
                  formatarValor(precos[produto].varejo)
                )}
              </td>
              <td className="px-4 py-2 border">
                {precos[produto].ultimaAlteracao || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-start gap-2">
        {modoEdicao ? (
          <button
            onClick={salvarAlteracoes}
            className="bg-orange-700 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={() => setModoEdicao(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Alterar
          </button>
        )}
      </div>
    </div>
  );
};

export default FnFin006_TabelaPrecos;

// === FIM FnFin006_TabelaPrecos.jsx ===
