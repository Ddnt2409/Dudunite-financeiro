import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import db from '../../firebase';

const FnFin006_TabelaPrecos = () => {
  const [modoEdicao, setModoEdicao] = useState('novo'); // novo ou alterar
  const [precos, setPrecos] = useState({
    brw77: '',
    brw66: '',
    esc: '',
    dudu: '',
    pkt55: '',
    pkt66: ''
  });
  const [docId, setDocId] = useState('');
  const [dataCadastro, setDataCadastro] = useState('');

  useEffect(() => {
    if (modoEdicao === 'alterar') {
      carregarPrecos();
    } else {
      setPrecos({
        brw77: '',
        brw66: '',
        esc: '',
        dudu: '',
        pkt55: '',
        pkt66: ''
      });
      setDataCadastro(new Date().toLocaleDateString('pt-BR'));
    }
  }, [modoEdicao]);
