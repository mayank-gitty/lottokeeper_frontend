import React, { useEffect, useContext } from "react";
import Player from "./Player";
import Operator from "./Operator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const Home = () => {
  const navigate = useNavigate();

  const {
    setWinningCoupons,
    setReload,
    reload,
    activePlayer,
    setActivePlayer,
    reloadHome,
    setReloadHome,
    guessNumber,
    setGuessNumber,
  } = useContext(UserContext);

  const logoutUser = () => {
    localStorage.removeItem("lottoId");

    setTimeout(() => {
      navigate("/");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    //initial winning coupons
    const user = axios
      .get(
        `
https://lotto-backend.onrender.com/getOperator`
      )
      .then((response) => {
        // console.log("operator balance", response);

        if (response.data !== null) {
          setWinningCoupons(response?.data?.coupons);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
  }, [reloadHome]);

  return (
    <div className="App">
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/operator")}
        >
          {" "}
          operator{" "}
        </button>

        {activePlayer && (
          <button className="btn btn-primary " onClick={() => logoutUser()}>
            {" "}
            exit game{" "}
          </button>
        )}
      </div>

      <h4 className="mt-2 lottery-game-heading d-flex flex-column">
        {" "}
        <span className="LOTTO"> Lottokeeper </span>
        <small className="mt-2 lottery-info ">
          win prizes for 2,3,4,5 number of hits{" "}
        </small>
      </h4>
      <div className="d-flex">
        <div className="player-profile">
          <Player />
        </div>
      </div>
    </div>
  );
};

export default Home;
