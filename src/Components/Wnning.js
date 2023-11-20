import React, { useContext, useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import { UserContext } from "../App";
import axios from "axios";

const PlayerWinnings = () => {
  const [tickets, setTickets] = useState([]);

  const [data, setData] = useState([]);

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
          // console.log("user tickets", response);
          if (response?.data?.tickets !== null) {
            const FT = response?.data?.tickets.map((item) => {
              return {
                name: item.playerName,
                hits: item.hits,
                numbers: item.numbers.join(","),
                winnings: item.winnings,
                ticket: 500,
              };
            });

            setTickets(tickets);

            const data = {
              columns: [
                {
                  label: "Name",
                  field: "name",
                  sort: "asc",
                  width: 150,
                },

                {
                  label: "Ticket",
                  field: "numbers",
                  sort: "asc",
                  width: 150,
                },

                {
                  label: "ticket price",
                  field: "ticket",
                  sort: "asc",
                  width: 200,
                },
                {
                  label: "No. of Hits",
                  field: "hits",
                  sort: "asc",
                  width: 200,
                },
                {
                  label: "Winnings",
                  field: "winnings",
                  sort: "asc",
                  width: 270,
                },
              ],
              rows: FT,
            };

            setData(data);
          } else {
          }
        })
        .catch((err) => {
          // console.log("err", err);
        });
    }
  }, []);

  return (
    <div className="winnings-table">
      <MDBDataTable striped bordered small data={data} />;
    </div>
  );
};

export default PlayerWinnings;
