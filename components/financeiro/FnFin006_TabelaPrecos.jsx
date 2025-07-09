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
