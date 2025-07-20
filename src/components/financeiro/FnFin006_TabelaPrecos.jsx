// === FnFin006_TabelaPrecos.jsx ===

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState({});
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarPrecos = async () => {
      const colecao = collection(db, 'tabela_precos');
      const snapshot = await getDocs(colecao);
      const dados = {};
      const datas = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        dados[doc.id] = {
          revenda: data.valor_revenda,
          varejo: data.valor_varejo,
        };

        const historico = data.historico || [];
        const ultimaData = historico.length > 0
          ? historico[0].data
          : data.data || '';

        datas[doc.id] = ultimaData;
      });

      setPrecos(dados);
      setUltimaAtualizacao(datas);
      setCarregando(false);
    };

    carregarPrecos();
  }, []);

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const produtosOrdenados = Object.keys(precos).sort();

  return (
    <div>
      {/* === INÍCIO RT06 – Tabela de Preços === */}
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span role="img" aria-label="tabela" className="mr-2">📋</span>
        Tabela de Preços Atuais
      </h2>

      {carregando ? (
        <p>Carregando tabela...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-orange-200">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="px-4 py-2 border">Produto</th>
                <th className="px-4 py-2 border">Revenda</th>
                <th className="px-4 py-2 border">Varejo</th>
                <th className="px-4 py-2 border">Última Alteração</th>
              </tr>
            </thead>
            <tbody>
              {produtosOrdenados.map((id) => (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2 uppercase">{id}</td>
                  <td className="px-4 py-2">
                    {formatarValor(precos[id].revenda)}
                  </td>
                  <td className="px-4 py-2">
                    {formatarValor(precos[id].varejo)}
                  </td>
                  <td className="px-4 py-2">
                    {ultimaAtualizacao[id] || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => setModoEdicao(!modoEdicao)}
        className="mt-6 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
      >
        {modoEdicao ? 'Salvar' : 'Alterar'}
      </button>
      {/* === FIM RT06 === */}
    </div>
  );
};

export default FnFin006_TabelaPrecos;
