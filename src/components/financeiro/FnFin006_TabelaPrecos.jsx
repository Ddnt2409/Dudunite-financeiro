import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import db from '../../firebase';

const produtosIniciais = {
  brw7x7: { r1: 6.0, r2: 6.25, v1: 7.0, v2: 7.5 },
  brw6x6: { r1: 5.5, r2: 5.75, v1: 6.5, v2: 7.0 },
  esc:    { r1: 4.65, r2: 4.8,  v1: 5.5, v2: 6.0 },
  dudu:   { r1: 4.65, r2: 4.8,  v1: 5.5, v2: 6.0 },
  pkt5x5: { r1: 3.9,  r2: 4.0,  v1: 4.5, v2: 5.0 },
  pkt6x6: { r1: 4.4,  r2: 4.6,  v1: 5.5, v2: 6.0 },
};

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState(produtosIniciais);
  const [historico, setHistorico] = useState([]);
  const [telaHistorico, setTelaHistorico] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [tabelaAntiga, setTabelaAntiga] = useState(null);

  const handleChange = (produto, tipo, valor) => {
    setPrecos((prev) => ({
      ...prev,
      [produto]: {
        ...prev[produto],
        [tipo]: parseFloat(valor),
      },
    }));
  };

  const salvar = async () => {
    const revendaData = {};
    Object.keys(precos).forEach((produto) => {
      revendaData[produto] = {
        r1: precos[produto].r1,
        r2: precos[produto].r2,
      };
    });

    await addDoc(collection(db, 'tabela_precos_revenda'), {
      data: Timestamp.now(),
      precos: revendaData,
    });

    localStorage.setItem('tabela_precos_varejo', JSON.stringify(precos));
    setModoEdicao(false);
  };

  const carregarVarejo = () => {
    const dados = localStorage.getItem('tabela_precos_varejo');
    if (dados) setPrecos(JSON.parse(dados));
  };

  const carregarHistorico = async () => {
    const q = query(collection(db, 'tabela_precos_revenda'), orderBy('data', 'desc'));
    const snap = await getDocs(q);
    const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHistorico(lista);
  };

  const abrirTabelaAntiga = (registro) => {
    setDataSelecionada(registro.data.toDate().toLocaleDateString('pt-BR'));
    setTabelaAntiga(registro.precos);
  };

  useEffect(() => {
    carregarVarejo();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tabela de Preços</h2>

      {!telaHistorico && (
        <table className="w-full mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Produto</th>
              <th className="text-left p-2">Revenda 1</th>
              <th className="text-left p-2">Revenda 2</th>
              <th className="text-left p-2">Varejo 1</th>
              <th className="text-left p-2">Varejo 2</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(precos).map(([produto, valores]) => (
              <tr key={produto} className="border-b">
                <td className="p-2 font-medium">{produto.toUpperCase()}</td>
                {['r1', 'r2', 'v1', 'v2'].map((tipo) => (
                  <td key={tipo} className="p-2">
                    {modoEdicao ? (
                      <input
                        type="number"
                        step="0.01"
                        value={valores[tipo]}
                        onChange={(e) => handleChange(produto, tipo, e.target.value)}
                        className="border rounded p-1 w-20"
                      />
                    ) : (
                      `R$ ${valores[tipo].toFixed(2)}`
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modoEdicao ? (
        <button onClick={salvar} className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded mr-2">
          Salvar
        </button>
      ) : (
        <button onClick={() => setModoEdicao(true)} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded mr-2">
          Alterar
        </button>
      )}

      <button
        onClick={() => {
          if (!telaHistorico) carregarHistorico();
          setTelaHistorico(!telaHistorico);
        }}
        className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-4 rounded mr-2"
      >
        {telaHistorico ? 'Voltar' : 'Consultar Alterações'}
      </button>

      {telaHistorico && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Datas de Alteração</h3>
          {historico.map((reg) => (
            <button
              key={reg.id}
              onClick={() => abrirTabelaAntiga(reg)}
              className="block w-full text-left border-b py-1 hover:bg-orange-100"
            >
              {reg.data.toDate().toLocaleDateString('pt-BR')}
            </button>
          ))}
        </div>
      )}

      {tabelaAntiga && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-bold mb-2">Tabela de {dataSelecionada}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Produto</th>
                <th className="p-2 text-left">Revenda 1</th>
                <th className="p-2 text-left">Revenda 2</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tabelaAntiga).map(([produto, valores]) => (
                <tr key={produto} className="border-b">
                  <td className="p-2 font-medium">{produto.toUpperCase()}</td>
                  <td className="p-2">R$ {valores.r1.toFixed(2)}</td>
                  <td className="p-2">R$ {valores.r2.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FnFin006_TabelaPrecos;
