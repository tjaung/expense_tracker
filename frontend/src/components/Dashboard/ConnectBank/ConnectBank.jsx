import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../../../hooks/useAuthContext";

const ConnectBank = ({ navigateTo, setIsConnected }) => {
  const { user } = useAuthContext();
  const [linkTokenData, setLinkTokenData] = useState(null);

  useEffect(() => {
    const initializeLink = async () => {
      try {
        const response = await axios.get('/api/create_link_token');
        const data = response.data;
        setLinkTokenData(data);
        localStorage.setItem("linkTokenData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };

    initializeLink();
  }, []);

  const startLink = () => {
    if (!linkTokenData) return;

    const handler = window.Plaid.create({
      token: linkTokenData.link_token,
      onSuccess: async (publicToken, metadata) => {
        console.log(`I have a public token: ${publicToken} I should exchange this`);
        await exchangeToken(publicToken);
      },
      onExit: (err, metadata) => {
        console.log(`I'm all done. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(metadata)}`);
      },
      onEvent: (eventName, metadata) => {
        console.log(`Event ${eventName}`);
      },
    });

    handler.open();
  };

  const exchangeToken = async (publicToken) => {
    try {
      const response = await axios.post('/api/exchange_public_token', { public_token: publicToken });
      const data = response.data;
      console.log("Done exchanging our token");
      const tokenBody = JSON.stringify({
          // '_id': user._id,
          'access_token': data.accessToken
        })
        console.log(tokenBody)
        console.log(typeof tokenBody)
      //send our token to backend
      const tokenResponse = await fetch("/api/user/storetoken", {
        method: "POST",
        body: tokenBody,
        headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      });
      const json = await tokenResponse.json();
  
      if (!tokenResponse.ok) {
        console.error(json.error);
      }
      if (tokenResponse.ok) {
        setIsConnected(true); // Update connection status
        navigateTo('/'); // Redirect to home
    } 
  }catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  return (
    <div className="text-center">
      <button
        className={`bg-blue-600 text-white rounded-lg p-5 inline-block drop-shadow-md m-5 ${!linkTokenData ? 'opacity-50' : ''}`}
        onClick={startLink}
        disabled={!linkTokenData}
      >
        Connect my bank
      </button>
    </div>
  );
};

export default ConnectBank;
