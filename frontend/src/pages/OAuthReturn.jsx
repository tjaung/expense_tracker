import React, { useEffect } from 'react';
import axios from 'axios';

const FinishOAuth = ({ navigateTo, setIsConnected }) => {
  useEffect(() => {
    const finishOAuth = async () => {
      const storedTokenData = localStorage.getItem('linkTokenData');
      console.log(`I retrieved ${storedTokenData} from local storage`);
      const linkTokenData = JSON.parse(storedTokenData);

      const handler = window.Plaid.create({
        token: linkTokenData.link_token,
        receivedRedirectUri: window.location.href,
        onSuccess: async (publicToken, metadata) => {
          console.log(`I have a public token: ${publicToken} I should exchange this`);
          await exchangeToken(publicToken);
        },
        onExit: (err, metadata) => {
          console.log(`I'm all done. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(metadata)}`);
          if (err !== null) {
            document.querySelector("#userMessage").innerHTML =
              "Oh no! We got some kind of error! Please <a href='/connect'>try again.</a>";
          }
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
        console.log("Done exchanging our token");
        setIsConnected(true); // Update connection status
        navigateTo('home'); // Redirect to home
      } catch (error) {
        console.error("Error exchanging public token:", error);
      }
    };

    finishOAuth();
  }, []);

  return (
    <div>
      <div id="userMessage">Welcome back!</div>
    </div>
  );
};

export default FinishOAuth;
