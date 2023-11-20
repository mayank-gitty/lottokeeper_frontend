import logo from "./logo.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./App.css";
import Player from "./Components/Player";

import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route, useActionData } from "react-router-dom";
import PlayerWinnings from "./Components/Wnning";
import Home from "./Components/Home";
import Operator from "./Components/Operator";

export const UserContext = createContext();

function App() {
  const [playerName, setPlayerName] = useState("");
  const [guessNumber, setGuessNumber] = useState();
  const [matchedNumber, setMatchedNumber] = useState();
  const [reload, setReload] = useState(false);
  const [reloadHome, setReloadHome] = useState(false);
  const [operatorReload, setOperatorReload] = useState(false);
  const [activePlayer, setActivePlayer] = useState("");
  const [playerHolderText, setPlayerHolderText] = useState("PLAY GAME");
  const [playerBalance, setPlayerBalance] = useState(10000);
  const [tickets, setTickets] = useState([]);
  const [winningCouponsCount, setWinningCouponsCount] = useState(0);
  const [winningCoupons, setWinningCoupons] = useState([]);
  const [playerTotalWinnings, setPlayerTotalWinnings] = useState(0);
  const [couponsCount, setCouponsCount] = useState(0);

  const [operatorBalance, setOperatorBalance] = useState(0);

  const [drawnNumbers, setDrawnNumbers] = useState([]);


  return (
    <UserContext.Provider
      value={{
        guessNumber,
        setGuessNumber,
        matchedNumber, setMatchedNumber,
        playerName,
        setPlayerName,
        playerTotalWinnings,
        setPlayerTotalWinnings,
        winningCoupons,
        setWinningCoupons,
        playerBalance,
        setPlayerBalance,
        tickets,
        setTickets,
        winningCouponsCount,
        setWinningCouponsCount,
        winningCoupons,
        setWinningCoupons,
        operatorBalance,
        setOperatorBalance,

        drawnNumbers,
        setDrawnNumbers,
        playerHolderText,
        setPlayerHolderText,
        activePlayer,
        reload,
        setReload,
        operatorReload,
        setOperatorReload,
        couponsCount,
        setCouponsCount,
        setActivePlayer,
        reloadHome,
        setReloadHome,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/winnings" element={<PlayerWinnings />} />
          <Route path="/" element={<Home />} />
          <Route path="/operator" element={<Operator />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
