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
    winningCouponsCount,

    setWinningCouponsCount,
    winningCoupons,
    setWinningCoupons,
    operatorBalance,
    setOperatorBalance,
    winningCouponsCountInPLayer,
    setWinningCouponsCountInPlayer,
    drawnNumbers,
    setDrawnNumbers,
    operatorReload,
    setOperatorReload,
    couponsCount,
    setCouponsCount,
    reloadHome,
    setReloadHome,
  } = useContext(UserContext);

  useEffect(() => {
    const user = axios
      .get(
        `
https://lotto-backend.onrender.com/getOperator`
      )
      .then((response) => {
        // console.log("user from backend", response);

        if (response.data !== null) {
          setOperatorBalance(response?.data?.balance);

          setWinningCouponsCount(response?.data?.number_of_coupons);
          setWinningCoupons(response?.data?.coupons);
          setCouponsCount(response?.data?.number_of_coupons);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
  }, []);

  const generateWinningCoupons = () => {
    // Logic to simulate additional players

    const newSections = Array.from({ length: winningCouponsCount }, () => ({
      numbers: Array.from(
        { length: 5 },
        () => Math.floor(Math.random() * 39) + 1
      ),
      isGenerated: true,
    }));

    const winningNumbers = newSections.map((item) => item.numbers).flat();

    setOperatorBalance(operatorBalance + winningCouponsCount * 500);

    setWinningCoupons(winningNumbers);

    addCoupons(winningNumbers, operatorBalance + winningCouponsCount * 500);
  };

  const addCoupons = (coupons, operatorBalance) => {
    const user = axios
      .post(
        `
https://lotto-backend.onrender.com/add/coupons`,
        {
          coupons: coupons,
          number_of_coupons: winningCouponsCount,
          balance: operatorBalance,
        }
      )
      .then((response) => {
        // console.log("operator user updated", response);

        if (response.data !== null) {
          setReloadHome(!reloadHome);
          setOperatorBalance(response?.data?.balance);
          setWinningCouponsCount(response?.data?.number_of_coupons);
          setWinningCoupons(response?.data?.coupons);
          setCouponsCount(response?.data?.number_of_coupons);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
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
            onChange={(e) => setWinningCouponsCount(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={generateWinningCoupons}>
          create coupons
        </button>
      </div>
    </div>
  );
};

export default Operator;
