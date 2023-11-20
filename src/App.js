import logo from "./logo.svg";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import "./App.css";
import Player from "./Components/Player";
// import Operator from "./Components/operator";
import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Winnings from "./Components/winning";
import Home from "./Components/Home";
import Operator from "./Components/Operator";
// import { useNavigate } from "react-router-dom";

// var db = new loki('example.db');

export const UserContext = createContext();


function App() {
  const [playerName, setPlayerName] = useState("");
  const [reload, setReload] = useState(false);
  const [reloadHome, setReloadHome] = useState(false);
  const [operatorReload,setOperatorReload] = useState(false);
  const [activePlayer,setActivePlayer] = useState('')
  const [playerHolderText,setplayerHolderText]  = useState("PLAY GAME")
  const [playerBalance, setPlayerBalance] = useState(10000);  
  const [tickets, setTickets] = useState([]);
  const [sectionsToGenerate, setSectionsToGenerate] = useState(0);
  const [generatedSections, setGeneratedSections] = useState([]);
  const [playerTotalWinnings, setplayerTotalWinnings] = useState(0);
  const [couponsCount, setcouponsCount] = useState(0);

  const [operatorBalance, setOperatorBalance] = useState(0);
  const [sectionsToGenerateInPLayer, setSectionsToGenerateInPlayer] =
    useState(0);
  const [generatedSectionsInPlayer, setGeneratedSectionsInPlayer] = useState(
    []
  );
  const [drawnNumbers, setDrawnNumbers] = useState([]);


  return (
    <UserContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerTotalWinnings,
        setplayerTotalWinnings,
        generatedSections,
        setGeneratedSections,
        playerBalance,
        setPlayerBalance,
        tickets,
        setTickets,
        sectionsToGenerate,
        setSectionsToGenerate,
        generatedSections,
        setGeneratedSections,
        operatorBalance,
        setOperatorBalance,

        sectionsToGenerateInPLayer,
        setSectionsToGenerateInPlayer,
        drawnNumbers,
        setDrawnNumbers,
        playerHolderText,
        setplayerHolderText,
        activePlayer,
        reload, setReload,
        operatorReload,setOperatorReload,
        couponsCount, setcouponsCount,
        setActivePlayer,
        reloadHome, setReloadHome
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/winnings" element={<Winnings />} />
          <Route path="/" element={<Home />} />
          <Route path="/operator" element={<Operator/>} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
