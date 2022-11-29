import React, { useState, useEffect } from "react";
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { load } from './scripts/loader'
import { tokensToWei, tokensFromWei } from './scripts/converter'

import "./App.css";

const App = () => {
  const [inputTicket, setInputTicket] = useState('');
  const [inputFeedback, setInputFeedback] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [transactor, setTransactor] = useState(null);
  const [bhuToken, setBHUToken] = useState(null);

  const tickets = ['apple', 'ball']


  // Handlers
  const handleSetTickets = async () => await transactor.setTickets(tickets, { from: account });
  const handleInputTicketChange = (e) => setInputTicket(e.currentTarget.value);
  const handleInputFeedbackChange = (e) => setInputFeedback(e.currentTarget.value);
  const handleRedeemTokens = async () => {
    await transactor.redeemTokens(inputTicket, { from: account });
    setInputTicket('');
    setRefresh(true);
  }
  const handleFeedbackSubmit = async() => {
    await bhuToken.approve(transactor.address, tokensToWei('1'), { from: account })
    await transactor.submitFeedback(inputFeedback, { from: account });
    setRefresh(true);
  }


  // React useEffect
  useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAccount(e.accountAddress);
      setTransactor(e.transactorContract);
      setBHUToken(e.bhuTokenContract);
      setAccountBalance(tokensFromWei(e.accountBalance));
    });
  });

  

  return (
    <div className="App">
      <h1>Good to Go!</h1>
      {/* <Button variant="outlined" onClick={handleSetTickets}>Set Tickets</Button>
      <TextField id="outlined-basic" label="Ticket" variant="outlined" onChange={handleInputTicketChange} />
      <Button variant="outlined" onClick={handleRedeemTokens}>Redeem Tokens</Button>
      <TextField id="outlined-multiline-flexible" label="Feedback" multiline maxRows={4} onChange={handleInputFeedbackChange}/>
      <Button variant="outlined" onClick={handleFeedbackSubmit} endIcon={<SendIcon />}>Submit Feedback</Button>
      <TextField id="outlined-basic" label="Tokens" variant="outlined" value={accountBalance} /> */}
    </div>
  );
}

export default App;
