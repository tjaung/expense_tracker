import React, { useState, useEffect } from 'react';
import ConnectBank from '../components/Dashboard/ConnectBank/ConnectBank';
import FinishOAuth from './OAuthReturn';
import Dashboard from '../components/Dashboard/Dashboard';

const UserPage = () => {
  const [currentPage, setCurrentPage] = useState('/'); // 'home', 'connect', 'oauth-return'
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnectedStatus();
  }, []);

  const checkConnectedStatus = async () => {
    try {
      const response = await fetch('/api/is_user_connected');
      const data = await response.json();
      setIsConnected(data.status);
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === '/') {
      checkConnectedStatus(); // Check status when navigating back to home
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'connect':
        return <ConnectBank navigateTo={navigateTo} setIsConnected={setIsConnected} />;
      case 'oauth-return':
        return <FinishOAuth navigateTo={navigateTo} setIsConnected={setIsConnected} />;
      case '/':
      default:
        return <Dashboard navigateTo={navigateTo} isConnected={isConnected} setIsConnected={setIsConnected} />;
    }
  };
  
  return (
    <div>
      {renderPage()}
    </div>
  );
};

// const Connection = ({ navigateTo, isConnected }) => (
  
//   <div className="m-5 text-center">
//     <div className="m-5 font-semibold">Welcome!</div>
//     {isConnected ? (
//       <div id="connectedUI">
//         <span id="connectDetails">You're connected!</span> But if you want to
//         create another connection,
//         <a className="underline" href="#" onClick={() => navigateTo('connect')}>go here</a>.

//         <div className="m-5">
//           <button
//             className="bg-blue-600 text-white rounded-lg p-5 inline-block drop-shadow-md m-5"
//             onClick={}
//           >
//             Get transactions!
//           </button>
//         </div>
//       </div>
//     ) : (
//       <div id="disconnectedUI">
//         Say, you should
//         <a className="underline" href="#" onClick={() => navigateTo('connect')}>connect to your bank</a> to
//         continue.
//       </div>
//     )}
//     <div className="m-5">
//       <a
//         className="bg-blue-600 text-white rounded-lg p-5 inline-block drop-shadow-md m-5"
//         href="#"
//         onClick={() => navigateTo('oauth-return')}
//       >
//         Go to OAuth Return Page
//       </a>
//     </div>
//   </div>
// );

export default UserPage;
