import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { loadAll, loadBalance, loadProfessorData } from './scripts/loader'

// Pages
import HomePage from './pages/HomePage/homePage';

import "./App.css";

require('dotenv').config()

const App = () => {
  const [mainState, setMainState] = useState({
    web3: null,
    contract: {
      transactor: null,
      bhuToken: null,
      feedbackData: null
    },
    account: {
      address: '0x0',
      balance: 0
    },
    professor: {

    },

  })


  // React useEffects
  useEffect(() => {
    loadAll().then((e) => {
      setMainState({
        web3: null,
        contract: {
          transactor: e.transactorContract,
          bhuToken: e.bhuTokenContract,
          feedbackData: e.feedbackDataContract
        },
        account: {
          address: e.accountAddress,
          balance: e.accountBalance
        },
        professor: {
          emails: e.professorEmails,
          datas: e.professerDatas,
        },
      });
      console.log(e.feedbackDataContract);
    });
  }, [mainState.accountAddress])

  // Handlers
  const handleBalanceChange = () => {
    loadBalance(mainState.transactorContract, mainState.accountAddress).then((e) => {
      setMainState({
        ...mainState,
        account: { ...mainState.account, balance: e.accountBalance }
      });
    });
  }

  const handleProfessorDataChange = () => {
    loadProfessorData().then((e) => {
      setMainState({
        ...mainState,
        professor: { ...mainState.professor, datas: e.professerDatas }
      });
    });
  }

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<HomePage
          mainState={mainState}
          handleBalanceChange={handleBalanceChange}
          handleProfessorDataChange={handleProfessorDataChange}
        />} />
      </Routes>
    </div>
  );
}

export default App;
