import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./navbar.css";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
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
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}

          {user && (
            <div>
              <span>{user.email}</span>
              <button className="btn" onClick={handleClick}>
                Log out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
