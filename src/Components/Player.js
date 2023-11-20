// Player.js
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { db, users } from "../db/db";
import axios from "axios";

const Player = () => {
  const [guessNumber, setGuessNumber] = useState();
  const navigate = useNavigate();

  const [matchedNumber, setMatchedNumber] = useState();

  const {
    playerHolderText,
    setplayerHolderText,
    generatedSections,
    setGeneratedSections,
    playerTotalWinnings,
    setplayerTotalWinnings,
    playerName,
    setPlayerName,
    playerBalance,
    setPlayerBalance,
    tickets,
    setTickets,
    sectionsToGenerate,
    setSectionsToGenerate,
    operatorBalance,
    setOperatorBalance,

    sectionsToGenerateInPLayer,
    setSectionsToGenerateInPlayer,
    drawnNumbers,
    setDrawnNumbers,
    activePlayer,
    setActivePlayer,
    reload,
    setReload,
  } = useContext(UserContext);

  const addTicket = (ticket) => {
    const newUser = axios
      .post(`http://localhost:3001/addTicket`, {
        playerName: ticket.playerName,
        numbers: ticket.numbers,
        hits: ticket.hits, // Implement calculateHits function
        winnings: ticket.winnings,
      })
      .then((response) => {
        console.log("ticket created", response);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Add a user to the database
  const addUser = (username) => {
    // localStorage.setItem("lottoId", username);

    const newUser = axios
      .post(`http://localhost:3001/addUser`, {
        name: playerName,
        playerBalance: 10000,
        tickets: [],
        tw: 0,
      })
      .then((response) => {
        console.log("new user created", response, response.data.name);

        // setPlayerName(response?.data?.name);
        localStorage.setItem("lottoId", response?.data?.name);
        setPlayerBalance(response?.data?.playerBalance);
        setTickets(response?.data?.tickets);
        setplayerTotalWinnings(response?.data?.tw);
        setActivePlayer(response?.data?.name);
      })
      .catch((err) => {
        console.log("err", err);
      });

    // db.saveDatabase();
  };

  // Get all users from the database

  const getUser = () => {
    console.log("playerName", playerName);

    const user = axios
      .get(`http://localhost:3001/getUser`, {
        params: {
          name: playerName,
        },
      })
      .then((response) => {
        console.log("user from backend", response);
        if (response.data !== null) {
          setPlayerName(response.data?.name);
          localStorage.setItem("lottoId", response?.data?.name);
          setActivePlayer(response.data?.name);
          setPlayerBalance(response.data?.playerBalance);
          setplayerTotalWinnings(response.data?.tw);
        } else {
          addUser(playerName);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const operatorUpdate = (balance) => {
    console.log("ob", balance);

    axios
      .post(`http://localhost:3001/operatorUpdate`, {
        balance: balance,
        // Tw: Tw,
        name: "operator",
      })
      .then((response) => {
        // alert("tickets price deducted");
        console.log("operator balance updated", response);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const start = () => {
    console.log("check name", playerName, playerBalance);

    const drawNumbers = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 39) + 1
    );

    setGuessNumber(drawNumbers);

    const ticket = {
      playerName: activePlayer,
      numbers: drawNumbers,
      hits: calculateHits(drawNumbers, generatedSections), // Implement calculateHits function
      winnings: calculateWinnings(
        drawNumbers,
        calculateHits(drawNumbers, generatedSections)
      ),
    };

    addTicket(ticket);

    setTickets([...tickets, ticket]);

    setTimeout(() => {
      if (ticket.winnings !== 0) {
        alert(`wow you won ${ticket.winnings} amount for ${ticket.hits} hits`);

        console.log(ticket.winnings);

        console.log("pB", playerBalance);

        const gameplayDeduction = playerBalance - 500;

        console.log("gd", gameplayDeduction);

        console.log("wdd", ticket.winnings);

        const winningAddition = gameplayDeduction + ticket.winnings;

        // console.log( 'wAd',gameplayDeduction)

        console.log("c", winningAddition);

        setPlayerBalance(winningAddition);

        setplayerTotalWinnings(playerTotalWinnings + ticket.winnings);

        addWinnings(winningAddition, playerTotalWinnings + ticket.winnings);

        const operatorAddition = operatorBalance + 500;

        const afterWinningDedcutionInOperatorBalance =
          operatorAddition - ticket.winnings;

        setOperatorBalance(afterWinningDedcutionInOperatorBalance);

        operatorUpdate(afterWinningDedcutionInOperatorBalance);

        setplayerHolderText("PLAY AGAIN");
        // setPlayerBalance(playerBalance + ticket.winnings);
      } else {
        alert("no winning hits  ,better luck next time");
        setPlayerBalance(playerBalance - 500);

        addWinningsDeduction(playerBalance - 500);

        setOperatorBalance(operatorBalance + 500);

        operatorUpdate(operatorBalance + 500);

        setplayerHolderText("PlAY AGAIN");
      }
    }, 2000);
  };

  useEffect(() => {
    const LID = localStorage.getItem("lottoId");

    console.log(LID);

    if (LID) {
      const user = axios
        .get(`http://localhost:3001/getUser`, {
          params: {
            name: LID,
          },
        })
        .then((response) => {
          console.log("user from backend", response);

          if (response.data !== null) {
            setPlayerName(response.data?.name);
            setActivePlayer(response.data?.name);
            setPlayerBalance(response.data?.playerBalance);
            setplayerTotalWinnings(response.data?.tw);
          } else {
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      setActivePlayer("");
      setPlayerName("");
      setPlayerBalance(10000);
      setplayerTotalWinnings(0);
    }

    console.log("users", users.data);
  }, [reload]);

  // console.log('GeneratedSections',generatedSections)

  // console.log('GeneratedSections1',setSectionsToGenerateInPlayer)

  const generateWinningNumbers = () => {
    const newSections = Array.from({ length: 1 }, () => ({
      numbers: Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 39) + 1
      ),
      isGenerated: true,
    }));

    console.log("lp", newSections);

    const FA = newSections.map((item) => item.numbers).flat();

    console.log("FA", FA);

    setSectionsToGenerateInPlayer(FA);

    return FA;
  };

  // console.log(generatedSections);

  const calculateWinnings = (drawnNumbers, hits) => {
    // Implement the logic to calculate winnings
    // For simplicity, let's assume a fixed payout structure

    const payouts = {
      2: 100,
      3: 500,
      4: 1000,
      5: 5000,
    };

    let totalWinnings = 0;

    const winning = payouts[hits] ? payouts[hits] : 0;

    return winning;
  };

  // console.log("usersData", users);

  const addWinningsDeduction = (balance, Tw) => {
    // alert("winnings hitting");

    console.log("op", balance);

    console.log("tw", Tw);

    axios
      .post(`http://localhost:3001/userUpdate`, {
        balance: balance,
        Tw: Tw,
        name: playerName,
      })
      .then((response) => {
        // alert("tickets price deducted");
        console.log("user updated", response);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const addWinnings = (balance, Tw) => {
    // alert("winnings hitting");

    console.log("op", balance);
    console.log("tw", Tw);

    axios
      .post(`http://localhost:3001/userUpdate`, {
        balance: balance,
        Tw: Tw,
        name: playerName,
      })
      .then((response) => {
        // alert("winnings updated");
        console.log("user updated", response);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  console.log("gs", generatedSections);

  const playGame = () => {
    // Logic to generate 5 random numbers

    if (!playerName) {
      return alert("enter player name");
    }

    if (generatedSections.length === 0) {
      return alert("no winning coupons active ");
    }

    start();
  };

  console.log("playerBalance", playerBalance);

  const addPlayerName = (value) => {
    console.log(value);

    setPlayerName(value);
  };

  const calculateHits = (drawNumbers, winningNumbers) => {
    // Implement the logic to calculate hits based on the drawn numbers
    // For simplicity, let's assume hits are calculated based on matching numbers

    console.log("d", drawNumbers);

    console.log("wn", winningNumbers);

    const checkHits = winningNumbers.filter((num) =>
      drawNumbers?.includes(num)
    ).length;

    console.log("ch", checkHits);

    return checkHits;
  };

  return (
    <div>
      <h2>Player</h2>

      <div className="">
        <div className="d-flex player-details-info">
          <p className="text-left">Name:</p>
          <p className="text-left px-4"> {playerName} </p>
        </div>
        <div className="d-flex player-details-info">
          <p className="text-left">Balance:</p>
          <p className="text-left px-4"> {playerBalance} coins </p>
        </div>
        <div className="d-flex player-details-info">
          <p className="text-left"> Total Winnings </p>
          <p className="text-left px-4"> {playerTotalWinnings} </p>
        </div>
      </div>

      {/* <p>No. of tickets used: {playerBalance} coins</p> */}
      {/* <p>Balance: {playerBalance} coins</p> */}

      <div className="d-flex justify-content-center align-items-center">
        {activePlayer && (
          <button
            onClick={() => navigate("/winnings")}
            className="btn btn-primary mx-4 home-info"
          >
            winnings
          </button>
        )}

        {!activePlayer && (
          <div class="form-group">
            <label for="exampleInputEmail1"> </label>

            <input
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={playerName || "Enter your name"}
              type="text"
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            />
            {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
          </div>
        )}

        {activePlayer && (
          <button className="btn btn-success mx-4 home-info" onClick={playGame}>
            {playerHolderText}
          </button>
        )}
        {!activePlayer && (
          <button className="btn btn-success mx-4 home-info" onClick={getUser}>
            {"submit"}
          </button>
        )}
      </div>
      {activePlayer && (
        <div className="">
          {guessNumber && generatedSections && (
            <div className="d-flex flex-column winning-block">
              <p> winning Numbers </p>

              <div className="winning-numbers-sections">
                {generatedSections?.map((item) => (
                  <span className="number"> {item} </span>
                ))}
              </div>
            </div>
          )}

          {guessNumber && (
            <div className="d-flex flex-column winning-block">
              <p> ticket drawn Numbers </p>

              <div className="winning-numbers-sections">
                {guessNumber?.map((item) => (
                  <span className="number"> {item} </span>
                ))}
              </div>
            </div>
          )}

          {generatedSections && guessNumber && (
            <div className="d-flex flex-column winning-block">
              <p> Matched Numbers </p>
              <div className="winning-numbers-sections">
                {generatedSections.filter(
                  (element) => guessNumber.indexOf(element) !== -1
                ).length === 0
                  ? "no numbers matched"
                  : generatedSections
                      .filter((element) => guessNumber.indexOf(element) !== -1)
                      .map((item) => (
                        <span className="match-number"> {item} </span>
                      ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Display list of tickets and results */}
    </div>
  );
};

export default Player;
