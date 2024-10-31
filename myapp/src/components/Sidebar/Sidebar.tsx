import { Link } from "react-router-dom";
import "../../styles/Admin/Sidebar.css";
import logo from "../../assets/images/Logo.png";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdBookmarkAdd } from "react-icons/md";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar_content">
        <div className="sidebar_logo">
          <Link to="/mybusiness">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div>
          <ul>
            <li>
              <Link to="/mybusiness/profile">
                <RiAccountCircleLine /> <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/mybusiness/reservations">
                <MdBookmarkAdd />
                <span>Reservations</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
