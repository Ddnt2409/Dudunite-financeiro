// === FNFin006_TabelaPrecos.jsx – Consulta e edição da Tabela de Preços (Firestore) ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState({});
  const [historico, setHistorico] = useState({});

  useEffect(() => {
    const carregarPrecos = async () => {
      const querySnapshot = await getDocs(collection(db, 'tabela_precos'));
      const novosPrecos = {};
      const novosHistoricos = {};

      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        novosPrecos[doc.id] = {
          revenda: dados.valor_revenda,
          varejo: dados.valor_varejo,
          data: dados.data,
        };
        novosHistoricos[doc.id] = dados.historico || [];
      });

      setPrecos(novosPrecos);
      setHistorico(novosHistoricos);
    };

    carregarPrecos();
  }, []);

  const handleAlterar = () => {
    setModoEdicao(true);
  };

  const handleCancelar = () => {
    setModoEdicao(false);
  };

  const handleSalvar = async () => {
    const dataAtual = new Date().toISOString().split('T')[0];

    for (const id in precos) {
      const docRef = doc(db, 'tabela_precos', id);
      const precoAtual = precos[id];
      const historicoAtual = historico[id] || [];

      const novoHistorico = [
        ...historicoAtual,
        {
          data: dataAtual,
          valor: precoAtual.revenda,
        },
      ];

      await setDoc(docRef, {
        produto: id,
        valor_revenda: precoAtual.revenda,
        valor_varejo: precoAtual.varejo,
        data: dataAtual,
        ativo: true,
        historico: novoHistorico,
      });
    }

    setModoEdicao(false);
  };

  const handleAlteracao = (id, campo, valor) => {
    setPrecos((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  return (
    <div className="bg-[#FFF3E9] min-h-screen p-4 text-[#5C1D0E]">
      <button
        onClick={() => window.history.back()}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
      >
        Voltar
      </button>

      <h2 className="text-2xl font-bold mb-4">📋 Tabela de Preços Atuais</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#5C1D0E]">
          <thead>
            <tr className="bg-orange-200">
              <th className="px-4 py-2 border">Produto</th>
              <th className="px-4 py-2 border">Revenda</th>
              <th className="px-4 py-2 border">Varejo</th>
              <th className="px-4 py-2 border">Última Alteração</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(precos).map((id) => (
              <tr key={id} className="border-t">
                <td className="px-4 py-2 border">{id.replace(/brw|pkt/g, (m) => m.toUpperCase())}</td>
                <td className="px-4 py-2 border">
                  {modoEdicao ? (
                    <input
                      type="number"
                      value={precos[id].revenda}
                      onChange={(e) => handleAlteracao(id, 'revenda', parseFloat(e.target.value))}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  ) : (
                    `R$ ${precos[id].revenda?.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {modoEdicao ? (
                    <input
                      type="number"
                      value={precos[id].varejo}
                      onChange={(e) => handleAlteracao(id, 'varejo', parseFloat(e.target.value))}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  ) : (
                    `R$ ${precos[id].varejo?.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2 border">{precos[id].data || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        {!modoEdicao && (
          <button
            onClick={handleAlterar}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
          >
            Alterar
          </button>
        )}

        {modoEdicao && (
          <>
            <button
              onClick={handleSalvar}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Salvar
            </button>
            <button
              onClick={handleCancelar}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FnFin006_TabelaPrecos;
