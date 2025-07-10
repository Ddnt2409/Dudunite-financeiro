import React, { useState } from 'react';
import FnFin006_TabelaPrecos from './components/financeiro/FnFin006_TabelaPrecos';

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

            <button
              onClick={() => setTela('historicoPrecos')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Histórico de Alterações
            </button>

            <button
              onClick={() => setTela('ctsReceber')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Contas a Receber
            </button>

            <button
              onClick={() => setTela('ctsPagar')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Contas a Pagar
            </button>

            <button
              onClick={() => setTela('fluxoCaixa')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
            >
              Fluxo de Caixa
            </button>
          </div>
        </div>
      )}

      {tela !== 'inicio' && (
        <div>
          <button
            onClick={() => setTela('inicio')}
            className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          >
            Voltar
          </button>

          {tela === 'tabelaPrecos' && <FnFin006_TabelaPrecos />}

          {tela === 'historicoPrecos' && (
            <div className="text-lg">📅 Em breve: histórico de alterações da tabela de preços.</div>
          )}

          {tela === 'ctsReceber' && (
            <div className="text-lg">💰 Em breve: módulo de contas a receber.</div>
          )}

          {tela === 'ctsPagar' && (
            <div className="text-lg">📤 Em breve: módulo de contas a pagar.</div>
          )}

          {tela === 'fluxoCaixa' && (
            <div className="text-lg">📊 Em breve: fluxo de caixa.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
