import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

import "./navbar.css";

const Navbar = () => {
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Expense Tracker</h1>
        </Link>
        <nav>
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </nav>
        <div>
          <button className="btn" onClick={handleClick}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
