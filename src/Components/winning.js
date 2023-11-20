import React, { useContext, useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import { UserContext } from "../App";
import axios from "axios";

const DatatablePage = () => {
  const { tickets: T } = useContext(UserContext);

  const [tickets, setTickets] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const LID = localStorage.getItem("lottoId");

    if (LID) {
      const user = axios
        .get(`http://localhost:3001/getUser`, {
          params: {
            name: LID,
          },
        })
        .then((response) => {
          console.log("user tickets", response);
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
                //   {
                //     label: "Age",
                //     field: "age",
                //     sort: "asc",
                //     width: 100,
                //   },
                //   {
                //     label: "Start date",
                //     field: "date",
                //     sort: "asc",
                //     width: 150,
                //   },
                //   {
                //     label: "Salary",
                //     field: "salary",
                //     sort: "asc",
                //     width: 100,
                //   },
              ],
              rows: FT,
            };

            setData(data);
          } else {
            // addUser(playerName);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }

    // const FT = T.map((item) => {
    //   return {
    //     name:item.playerName,
    //     hits: item.hits,
    //     numbers: item.numbers.join(","),
    //     winnings: item.winnings,
    //     ticket:500
    //   };
    // });

    // setTickets(tickets);

    // const data = {
    //   columns: [

    //     {
    //       label: "Name",
    //       field: "name",
    //       sort: "asc",
    //       width: 150,
    //     },

    //     {
    //       label: "Ticket",
    //       field: "numbers",
    //       sort: "asc",
    //       width: 150,
    //     },

    //     {
    //       label: "ticket price",
    //       field: "ticket",
    //       sort: "asc",
    //       width: 200,
    //     },
    //     {
    //       label: "No. of Hits",
    //       field: "hits",
    //       sort: "asc",
    //       width: 200,
    //     },
    //     {
    //       label: "Winnings",
    //       field: "winnings",
    //       sort: "asc",
    //       width: 270,
    //     },
    //     //   {
    //     //     label: "Age",
    //     //     field: "age",
    //     //     sort: "asc",
    //     //     width: 100,
    //     //   },
    //     //   {
    //     //     label: "Start date",
    //     //     field: "date",
    //     //     sort: "asc",
    //     //     width: 150,
    //     //   },
    //     //   {
    //     //     label: "Salary",
    //     //     field: "salary",
    //     //     sort: "asc",
    //     //     width: 100,
    //     //   },
    //   ],
    //   rows: FT,
    // };

    // setData(data);
  }, []);

  return (
    <div className="winnings-table">
      <MDBDataTable striped bordered small data={data} />;
    </div>
  );
};

export default DatatablePage;
