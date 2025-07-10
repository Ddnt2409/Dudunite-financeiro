import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState({
    brw7x7: { rev1: 6.0, rev2: 6.25, var1: 6.5, var2: 6.5 },
    brw6x6: { rev1: 5.5, rev2: 5.75, var1: 6.0, var2: 6.0 },
    esc: { rev1: 4.65, rev2: 4.9, var1: 5.1, var2: 5.1 },
    dudu: { rev1: 4.65, rev2: 4.9, var1: 5.1, var2: 5.1 },
    pkt5x5: { rev1: 3.9, rev2: 4.1, var1: 4.5, var2: 4.5 },
    pkt6x6: { rev1: 4.4, rev2: 4.6, var1: 5.0, var2: 5.0 },
  });

  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const handleChange = (e, tipo, campo) => {
    const value = parseFloat(e.target.value);
    setPrecos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], [tipo]: value },
    }));
  };

  const salvar = async () => {
    const hoje = new Date().toISOString().split('T')[0];

    // Salva a revenda 1 e 2 com data
    await addDoc(collection(db, 'tabela_precos_revenda'), {
      data: hoje,
      precos: Object.fromEntries(
        Object.entries(precos).map(([produto, valores]) => [produto, { rev1: valores.rev1, rev2: valores.rev2 }])
      ),
    });

    // Armazena o varejo como dado simples (sem histórico)
    localStorage.setItem('tabela_precos_varejo', JSON.stringify(precos));
    setModoEdicao(false);
    alert('Preços atualizados com sucesso!');
  };

  const carregarUltimo = async () => {
    const q = query(collection(db, 'tabela_precos_revenda'), orderBy('data', 'desc'));
    const snap = await getDocs(q);
    const ultimos = snap.docs.map(doc => doc.data());
    setHistorico(ultimos);

    if (ultimos.length > 0) {
      const dados = ultimos[0].precos;
      setPrecos(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([produto, valores]) => ({
            [produto]: {
              ...valores,
              rev1: dados[produto]?.rev1 ?? valores.rev1,
              rev2: dados[produto]?.rev2 ?? valores.rev2,
            },
          }))
        )
      );
    }
  };

  const exibirHistorico = async () => {
    setMostrarHistorico(true);
    await carregarUltimo();
  };

  const aplicarData = (dados) => {
    const precosComData = dados.precos;
    setPrecos(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([produto, valores]) => ({
          [produto]: {
            ...valores,
            rev1: precosComData[produto]?.rev1 ?? valores.rev1,
            rev2: precosComData[produto]?.rev2 ?? valores.rev2,
          },
        }))
      )
    );
    setMostrarHistorico(false);
  };

  useEffect(() => {
    const dadosVarejo = localStorage.getItem('tabela_precos_varejo');
    if (dadosVarejo) {
      const varejo = JSON.parse(dadosVarejo);
      setPrecos(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([produto, valores]) => ({
            [produto]: {
              ...valores,
              var1: varejo[produto]?.var1 ?? valores.var1,
              var2: varejo[produto]?.var2 ?? valores.var2,
            },
          }))
        )
      );
    }
    carregarUltimo();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tabela de Preços</h2>

      <div className="overflow-x-auto">
        <table className="w-full mb-4 text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Produto</th>
              <th className="p-2">Revenda 1</th>
              <th className="p-2">Revenda 2</th>
              <th className="p-2">Varejo 1</th>
              <th className="p-2">Varejo 2</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(precos).map(([produto, valores]) => (
              <tr key={produto} className="border-b">
                <td className="p-2 font-bold">{produto.toUpperCase()}</td>
                {['rev1', 'rev2', 'var1', 'var2'].map(tipo => (
                  <td key={tipo} className="p-2">
                    {modoEdicao ? (
                      <input
                        type="number"
                        step="0.01"
                        value={valores[tipo]}
                        onChange={(e) => handleChange(e, tipo, produto)}
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
      </div>

      {modoEdicao ? (
        <button
          onClick={salvar}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded mr-2"
        >
          Salvar
        </button>
      ) : (
        <button
          onClick={() => setModoEdicao(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded mr-2"
        >
          Alterar
        </button>
      )}

      <button
        onClick={exibirHistorico}
        className="bg-gray-700 hover:bg-gray-800 text-white py-1 px-4 rounded mr-2"
      >
        Histórico de Revenda
      </button>

      {mostrarHistorico && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Selecione uma data:</h3>
          <ul className="space-y-1">
            {historico.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => aplicarData(item)}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded text-sm"
                >
                  {item.data}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-4 rounded">
          Contas a Receber
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded">
          Contas a Pagar
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded">
          Fluxo de Caixa
        </button>
      </div>
    </div>
  );
};

export default FnFin006_TabelaPrecos;
