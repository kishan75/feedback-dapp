import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { loadAll, loadBalance, loadProfessorData } from './scripts/loader'

// Pages
import HomePage from './pages/HomePage/homePage';

import "./App.css";

const App = () => {
  const [state, setState] = useState({
    web3: null,
    transactorContract: null,
    bhuTokenContract: null,
    accountAddress: null,
    accountBalance: null,
    professorEmails: [],
    professerDatas: [],
  })

  // React useEffects
  useEffect(() => {
    loadAll().then((e) => {
      setState({
        web3: e.web3,
        transactorContract: e.transactorContract,
        bhuTokenContract: e.bhuTokenContract,
        accountAddress: e.accountAddress,
        accountBalance: e.accountBalance,
        professorEmails: e.professorEmails,
        professerDatas: e.professerDatas
      });
    });
  }, [state.accountAddress])

  // Handlers
  const handleBalanceChange = () => {
    loadBalance(state.transactorContract, state.accountAddress).then((e) => {
      setState({
        ...state,
        accountBalance: e.accountBalance
      });
    });
  }

  const handleProfessorDataChange = () => {
    loadProfessorData().then((e) => {
      setState({
        ...state,
        professerDatas: e.professerDatas
      });
    });
  }

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<HomePage
          state={state}
          onBalanceChange={handleBalanceChange}
          onProfessorDataChange={handleProfessorDataChange}
        />} />
      </Routes>
    </div>
  );
}

export default App;
