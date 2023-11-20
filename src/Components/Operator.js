// Operator.js
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Operator = () => {
  // console.log("op", Operator);

  const navigate = useNavigate();
  const {
    playerName,
    setPlayerName,
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
    operatorReload,setOperatorReload,
    couponsCount, setcouponsCount,
    reloadHome, setReloadHome
  } = useContext(UserContext);

  useEffect(() => {
    const user = axios
      .get(`http://localhost:3001/getOperator`)
      .then((response) => {
        console.log("user from backend", response);

        if (response.data !== null) {
          
          setOperatorBalance(response?.data?.balance);
     
          setSectionsToGenerate(response?.data?.number_of_coupons);
          setGeneratedSections(response?.data?.coupons) 
          setcouponsCount(response?.data?.number_of_coupons)
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);


  const simulatePlayers = () => {
    // Logic to simulate additional players

    const newSections = Array.from({ length: sectionsToGenerate }, () => ({
      numbers: Array.from(
        { length: 5 },
        () => Math.floor(Math.random() * 39) + 1
      ),
      isGenerated: true,
    }));

    // Add the cost of the coupons to the operator's balance


    const FA = newSections.map((item) => item.numbers).flat();

    setOperatorBalance(operatorBalance + sectionsToGenerate * 500);

    setGeneratedSections(FA);

    addCoupons(FA, operatorBalance + sectionsToGenerate * 500);
  };

  const addCoupons = (coupons, operatorBalance) => {
    console.log("c", coupons);
    console.log("ob", operatorBalance);

    const user = axios
      .post(`http://localhost:3001/add/coupons`, {
        coupons: coupons,
        number_of_coupons: sectionsToGenerate,
        balance: operatorBalance,
      })
      .then((response) => {
        console.log("operator user updated", response);

        if (response.data !== null) {
          setReloadHome(!reloadHome)
          setOperatorBalance(response?.data?.balance);
          setSectionsToGenerate(response?.data?.number_of_coupons);
          setGeneratedSections(response?.data?.coupons) 
          setcouponsCount(response?.data?.number_of_coupons)
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const drawNumbers = () => {
    // Logic to draw 5 random numbers
    const newDrawnNumbers = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 39) + 1
    );

    // Deduct winnings from the operator's balance
    const totalWinnings = calculateWinnings(newDrawnNumbers, generatedSections);

    console.log("ob", operatorBalance);
    console.log("tw", totalWinnings);

    setOperatorBalance(operatorBalance - totalWinnings);

    setDrawnNumbers(newDrawnNumbers);
  };

  const calculateWinnings = (drawnNumbers, generatedSections) => {
    // Implement the logic to calculate winnings
    // For simplicity, let's assume a fixed payout structure
    const payouts = {
      2: 100,
      3: 500,
      4: 1000,
      5: 5000,
    };

    let totalWinnings = 0;

    generatedSections.forEach((section) => {
      const hits = calculateHits(drawnNumbers, section.numbers);
      console.log("checkHits", hits);
      console.log("p", payouts[hits]);
      totalWinnings += payouts[hits] ? payouts[hits] : 0;
    });

    console.log("totalWinnings", totalWinnings);

    return totalWinnings;
  };

  const calculateHits = (drawnNumbers, playerNumbers) => {
    // Implement the logic to calculate hits based on the drawn numbers and player's numbers

    console.log("drawnNumbers", drawnNumbers);
    console.log("playerNumbers", playerNumbers);
    return drawnNumbers.filter((num) => playerNumbers.includes(num)).length;
  };

  return (
    <div>
      <h2>Operator</h2>
      <p>
        Balance:{" "}
        <span className="operator-balance"> {operatorBalance} credits </span>
      </p>
      <p>
        No. of Current Coupons:{" "}
        <span className="operator-balance"> {couponsCount} </span>
      </p>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div class="form-group">
          {/* <label for="exampleInputEmail1"> </label> */}
          <label for="exampleInputEmail1"> </label>

          <input
            class="form-control"
            id="exampleInputEmail1"
            className="operator-input"
            // aria-describedby="emailHelp"
            placeholder="Enter number of winning coupons"
            type="number"
            onChange={(e) => setSectionsToGenerate(e.target.value)}
          />
          {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
        </div>

        <button className="btn btn-primary" onClick={simulatePlayers}>
          create coupons
        </button>
      </div>

      {/* <button onClick={drawNumbers}>Draw Numbers</button> */}
      {/* Display list of submitted vouchers and results */}
    </div>
  );
};

export default Operator;
