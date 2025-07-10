import React, { useEffect, useState } from 'react';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [precos, setPrecos] = useState({
    brw7x7: 6.0,
    brw6x6: 5.5,
    esc: 4.65,
    dudu: 4.65,
    pkt5x5: 3.9,
    pkt6x6: 4.4,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrecos({ ...precos, [name]: parseFloat(value) });
  };

  const salvar = () => {
    localStorage.setItem('tabela_precos', JSON.stringify(precos));
    setModoEdicao(false);
  };

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('tabela_precos');
    if (dadosSalvos) {
      setPrecos(JSON.parse(dadosSalvos));
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tabela de Preços</h2>
      <table className="w-full mb-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Produto</th>
            <th className="text-left p-2">Preço (R$)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(precos).map(([key, value]) => (
            <tr key={key} className="border-b">
              <td className="p-2">{key.toUpperCase()}</td>
              <td className="p-2">
                {modoEdicao ? (
                  <input
                    type="number"
                    step="0.01"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="border rounded p-1 w-24"
                  />
                ) : (
                  `R$ ${value.toFixed(2)}`
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modoEdicao ? (
        <button
          onClick={salvar}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
        >
          Salvar
        </button>
      ) : (
        <button
          onClick={() => setModoEdicao(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
        >
          Alterar
        </button>
      )}
    </div>
  );
};
