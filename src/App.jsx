import React, { useState } from 'react';
import FnFin006_TabelaPrecos from './components/FnFin006_TabelaPrecos';

const App = () => {
  const [tela, setTela] = useState('inicio');

  return (
    <div className="bg-[#FFF3E9] min-h-screen p-4 text-[#5C1D0E]">
      {tela === 'inicio' && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Módulo Financeiro – Dudunitê</h1>
          <p className="mb-4">Bem-vindo ao sistema! Selecione uma opção no menu.</p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTela('tabelaPrecos')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Tabela de Preços
            </button>
          </div>
        </div>
      )}

      {tela === 'tabelaPrecos' && (
        <div>
          <button
            onClick={() => setTela('inicio')}
            className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          >
            Voltar
          </button>
          <FnFin006_TabelaPrecos />
        </div>
      )}
    </div>
  );
};

export default App;
