import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FnFin006_TabelaPrecos from '../components/financeiro/FnFin006_TabelaPrecos';

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Módulo Financeiro – Dudunitê</h1>
        
        {/* Menu */}
        <nav className="mb-4">
          <Link
            to="/tabela-precos"
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded mr-2"
          >
            Tabela de Preços
          </Link>
        </nav>

        {/* Rotas */}
        <Routes>
          <Route path="/tabela-precos" element={<FnFin006_TabelaPrecos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
