import React, { useEffect, useState } from "react";
import axios from "axios";
import ConnectBank from "./ConnectBank/ConnectBank";
import { useAuthContext } from "../../hooks/useAuthContext";

const Dashboard = ({ navigateTo, isConnected, setIsConnected }) => {
    const { user } = useAuthContext();

  const [connected, setConnected] = useState(false);
  const [bankName, setBankName] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const checkConnectedStatus = async () => {
      try {
        const response = await axios.get("/api/is_user_connected");
        const data = response.data;
        if (data.status === true) {
          setConnected(true);
          console.log(connected);
          showInstitutionName();
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error(`We encountered an error: ${error}`);
      }
    };

    const showInstitutionName = async () => {
      try {
        const response = await axios.get("/api/get_bank_name");
        const data = response.data;
        setBankName(data.name ?? "Unknown");
      } catch (error) {
        console.error(`We encountered an error: ${error}`);
      }
    };

    checkConnectedStatus();
  }, []);

  const getTransactions = async () => {
    try {
      // call for query of user to get access token then chain to transactions
      // console.log(`Bearer ${user.token}`)
      await fetch('/api/user/findById', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        const jsonRes = await response.json();
        if (!response.ok) {
          throw new Error(jsonRes.error);
        }
        console.log(jsonRes)
        console.log('access key', jsonRes.plaidToken)

        return await fetch("/api/transactions", {
          method: "POST",
          body: JSON.stringify({'access_token': jsonRes.plaidToken})
        })
      })
      .then(async (response) => {
        console.log(response)
      })


      const response = await axios.get("/api/transactions");
      const data = response.data;
      const simplifiedData = data.transactions.map((item) => ({
        date: item.date,
        name: item.name,
        amount: `$${item.amount.toFixed(2)}`,
        categories: item.category.join(", "),
      }));
      console.table(simplifiedData);
      //   setTransactions(simplifiedData);
      return simplifiedData;
    } catch (error) {
      console.error(`We encountered an error: ${error}`);
    }
  };

  return (
    <div className="m-5 text-center">
      <div className="m-5 font-semibold">Welcome!</div>
      {connected ? (
        <div id="connectedUI">
          <span id="connectDetails">You're connected!</span> But if you want to
          create another connection,
          <ConnectBank navigateTo={navigateTo} setIsConnected={setIsConnected}/>
          <div className="m-5">
            <button
              className="bg-blue-600 text-white rounded-lg p-5 inline-block drop-shadow-md m-5"
              onClick={getTransactions}
            >
              Get transactions!
            </button>
          </div>
          <div className="m-5" id="output">
            {transactions.length > 0 && (
              <pre>{JSON.stringify(transactions, null, 2)}</pre>
            )}
          </div>
        </div>
      ) : (
        <div id="disconnectedUI">
          <ConnectBank navigateTo={navigateTo} setIsConnected={setConnected}/>
        </div>
      )}
      <div className="m-5">
        <a
          className="bg-blue-600 text-white rounded-lg p-5 inline-block drop-shadow-md m-5"
          href="#"
          onClick={() => navigateTo("oauth-return")}
        >
          Go to OAuth Return Page
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
