// === INÍCIO FN06 – TABELA DE PREÇOS ATUAIS COM ALTERAÇÃO ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tabela, setTabela] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const ref = collection(db, 'tabela_precos');
      const snapshot = await getDocs(ref);
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTabela(dados);
      setCarregando(false);
    };

    carregarDados();
  }, []);

  const handleAlterar = () => {
    setModoEdicao(true);
  };

  const handleSalvar = async () => {
    for (const item of tabela) {
      const ref = doc(db, 'tabela_precos', item.id);
      await updateDoc(ref, {
        valor_revenda: Number(item.valor_revenda),
        valor_varejo: Number(item.valor_varejo),
        data: new Date().toISOString().slice(0, 10)
      });
    }
    setModoEdicao(false);
  };

  const handleAlterarCampo = (index, campo, valor) => {
    const novaTabela = [...tabela];
    novaTabela[index][campo] = valor;
    setTabela(novaTabela);
  };

  return (
    <div className="bg-[#FFF3E9] min-h-screen p-4 text-[#5C1D0E]">
      <button
        onClick={() => window.history.back()}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
      >
        Voltar
      </button>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="tabela">📋</span> Tabela de Preços Atuais
      </h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-orange-300 bg-white">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="px-4 py-2 border">Produto</th>
                <th className="px-4 py-2 border">Revenda</th>
                <th className="px-4 py-2 border">Varejo</th>
                <th className="px-4 py-2 border">Última Alteração</th>
              </tr>
            </thead>
            <tbody>
              {tabela.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 border font-bold">{item.produto.toUpperCase()}</td>

                  <td className="px-4 py-2 border">
                    {modoEdicao ? (
                      <input
                        type="number"
                        value={item.valor_revenda}
                        onChange={(e) =>
                          handleAlterarCampo(index, 'valor_revenda', e.target.value)
                        }
                        className="w-24 p-1 border rounded"
                      />
                    ) : (
                      `R$ ${Number(item.valor_revenda).toFixed(2).replace('.', ',')}`
                    )}
                  </td>

                  <td className="px-4 py-2 border">
                    {modoEdicao ? (
                      <input
                        type="number"
                        value={item.valor_varejo}
                        onChange={(e) =>
                          handleAlterarCampo(index, 'valor_varejo', e.target.value)
                        }
                        className="w-24 p-1 border rounded"
                      />
                    ) : (
                      `R$ ${Number(item.valor_varejo).toFixed(2).replace('.', ',')}`
                    )}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.data || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        {modoEdicao ? (
          <button
            onClick={handleSalvar}
            className="bg-[#9C2B10] hover:bg-[#751d07] text-white py-2 px-4 rounded"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={handleAlterar}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
          >
            Alterar
          </button>
        )}
      </div>
    </div>
  );
};

export default FnFin006_TabelaPrecos;

// === FIM FN06 ===
