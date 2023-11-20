// Player.js
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Player = () => {
  const navigate = useNavigate();

  const {
    playerHolderText,
    guessNumber,
    setGuessNumber,
    setPlayerHolderText,
    winningCoupons,
    setotalWinningsinningCoupons,
    playerTotalWinnings,
    setPlayerTotalWinnings,
    playerName,
    setPlayerName,
    playerBalance,
    setPlayerBalance,
    tickets,
    setTickets,
    winningCouponsCount,
    setotalWinningsinningCouponsCount,
    operatorBalance,
    setOperatorBalance,

    winningCouponsCountInPLayer,
    setotalWinningsinningCouponsCountInPlayer,
    drawnNumbers,
    setDrawnNumbers,
    activePlayer,
    setActivePlayer,
    reload,
    setReload,
  } = useContext(UserContext);

  const addTicket = (ticket) => {
    const newUser = axios
      .post(
        `
https://lotto-backend.onrender.com/addTicket`,
        {
          playerName: ticket.playerName,
          numbers: ticket.numbers,
          hits: ticket.hits, // Implement calculateHits function
          winnings: ticket.winnings,
        }
      )
      .then((response) => {
        // console.log("ticket created", response);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  // Add a user to the database
  const addUser = (username) => {
    const newUser = axios
      .post(
        `
https://lotto-backend.onrender.com/addUser`,
        {
          name: playerName,
          playerBalance: 10000,
          tickets: [],
          totalWinnings: 0,
        }
      )
      .then((response) => {
        localStorage.setItem("lottoId", response?.data?.name);
        setPlayerBalance(response?.data?.playerBalance);
        setTickets(response?.data?.tickets);
        setPlayerTotalWinnings(response?.data?.totalWinnings);
        setActivePlayer(response?.data?.name);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  // Get all users from the database

  const getUser = () => {
    // console.log("playerName", playerName);

    const user = axios
      .get(
        `
https://lotto-backend.onrender.com/getUser`,
        {
          params: {
            name: playerName,
          },
        }
      )
      .then((response) => {
        // console.log("user from backend", response);
        if (response.data !== null) {
          setPlayerName(response.data?.name);
          localStorage.setItem("lottoId", response?.data?.name);
          setActivePlayer(response.data?.name);
          setPlayerBalance(response.data?.playerBalance);
          setPlayerTotalWinnings(response.data?.totalWinnings);
        } else {
          addUser(playerName);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const operatorUpdate = (balance) => {
    // console.log("ob", balance);

    axios
      .post(
        `
https://lotto-backend.onrender.com/operatorUpdate`,
        {
          balance: balance,
          name: "operator",
        }
      )
      .then((response) => {
        // console.log("operator balance updated", response);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const startGame = () => {
    const drawNumbers = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 39) + 1
    );

    setGuessNumber(drawNumbers);

    const ticket = {
      playerName: activePlayer,
      numbers: drawNumbers,
      hits: calculateHits(drawNumbers, winningCoupons), // Implement calculateHits function
      winnings: calculateWinnings(
        drawNumbers,
        calculateHits(drawNumbers, winningCoupons)
      ),
    };

    addTicket(ticket);

    setTickets([...tickets, ticket]);

    setTimeout(() => {
      if (ticket.winnings !== 0) {
        alert(`wow you won ${ticket.winnings} amount for ${ticket.hits} hits`);

        const gameplayDeduction = playerBalance - 500;

        const winningAddition = gameplayDeduction + ticket.winnings;

        setPlayerBalance(winningAddition);

        setPlayerTotalWinnings(playerTotalWinnings + ticket.winnings);

        addWinnings(winningAddition, playerTotalWinnings + ticket.winnings);

        const operatorAddition = operatorBalance + 500;

        const afterWinningDedcutionInOperatorBalance =
          operatorAddition - ticket.winnings;

        setOperatorBalance(afterWinningDedcutionInOperatorBalance);

        operatorUpdate(afterWinningDedcutionInOperatorBalance);

        setPlayerHolderText("PLAY AGAIN");
        // setPlayerBalance(playerBalance + ticket.winnings);
      } else {
        alert("no winning hits  ,better luck next time");
        setPlayerBalance(playerBalance - 500);

        addNoWinningsDeduction(playerBalance - 500);

        setOperatorBalance(operatorBalance + 500);

        operatorUpdate(operatorBalance + 500);

        setPlayerHolderText("PlAY AGAIN");
      }
    }, 2000);
  };

  useEffect(() => {
    const userName = localStorage.getItem("lottoId");

    if (userName) {
      const user = axios
        .get(
          `
https://lotto-backend.onrender.com/getUser`,
          {
            params: {
              name: userName,
            },
          }
        )
        .then((response) => {
          // console.log("user from backend", response);

          if (response.data !== null) {
            setPlayerName(response.data?.name);
            setActivePlayer(response.data?.name);
            setPlayerBalance(response.data?.playerBalance);
            setPlayerTotalWinnings(response.data?.totalWinnings);
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
      setPlayerTotalWinnings(0);
    }
  }, [reload]);

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

  const addNoWinningsDeduction = (balance, totalWinnings) => {
    // alert("winnings hitting");

    axios
      .post(
        `
https://lotto-backend.onrender.com/userUpdate`,
        {
          balance: balance,
          totalWinnings: totalWinnings,
          name: playerName,
        }
      )
      .then((response) => {
        // console.log("user updated", response);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const addWinnings = (balance, totalWinnings) => {
    // alert("winnings hitting");

    axios
      .post(
        `
https://lotto-backend.onrender.com/userUpdate`,
        {
          balance: balance,
          totalWinnings: totalWinnings,
          name: playerName,
        }
      )
      .then((response) => {
        // console.log("user updated", response);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const playGame = () => {
    // Logic to generate 5 random numbers

    if (!playerName) {
      return alert("enter player name");
    }

    if (winningCoupons.length === 0) {
      return alert("no winning coupons active ");
    }

    startGame();
  };

  const calculateHits = (drawNumbers, winningNumbers) => {
    // console.log("d", drawNumbers);

    const checkHits = winningNumbers.filter((num) =>
      drawNumbers?.includes(num)
    ).length;

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
          {guessNumber && winningCoupons && (
            <div className="d-flex flex-column winning-block">
              <p> winning Numbers </p>

              <div className="winning-numbers-sections">
                {winningCoupons?.map((item) => (
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

          {winningCoupons && guessNumber && (
            <div className="d-flex flex-column winning-block">
              <p> Matched Numbers </p>
              <div className="winning-numbers-sections">
                {winningCoupons.filter(
                  (element) => guessNumber.indexOf(element) !== -1
                ).length === 0
                  ? "no numbers matched"
                  : winningCoupons
                      .filter((element) => guessNumber.indexOf(element) !== -1)
                      .map((item) => (
                        <span className="match-number"> {item} </span>
                      ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
