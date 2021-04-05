
import Navbar from "react-bootstrap/Navbar";
import "./AppNavbar.css";
import packageJson from '../../package.alias.json';
import UserLoggedIn from "./UserLoggedIn";
import UserLoggedOut from "./UserLoggedOut";
//import logo from "../../assets/logo.svg";

export default function AppNavbar({user, login, logout, loading}) {
    return (
        <Navbar 
            variant="light"
            bg="white"
        >
            <Navbar.Brand className="mr-auto">
              LOSM    <span className="version">v{packageJson["version"]} by Tracestrack</span>
            </Navbar.Brand>
        {user.loggedIn ? 
            <UserLoggedIn 
                logout={logout} 
                user={user} 
            />
            : <UserLoggedOut 
                login={login} 
                loading={loading} 
            />
        }
        </Navbar>
    );
}
