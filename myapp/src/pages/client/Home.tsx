import React from "react";
import logo from "../../assets/images/Logo.png";
import "../../styles/Home/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBusinessTime } from "react-icons/fa6";
import { FaMapLocation } from "react-icons/fa6";
const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSwitchToBusiness = () => {
    navigate("/login", { state: { fromSwitch: true } });
  };

  return (
    <div>
      <div className="all_home_page">
        <header>
          <div>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            <div>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="gain">Your Gain</Link>
                </li>
              </ul>
            </div>
            <div>
              <Link to="/login">
                <button type="button" onClick={handleSwitchToBusiness}>
                  <FaBusinessTime /> Switch to Business
                </button>
              </Link>
            </div>
          </div>
        </header>
        <main className="all_main_home">
          <section className="search_section_home">
            <div>
              <div>
                <h2>
                  Book local beauty and wellness <br /> services
                </h2>
                <div>
                  <button type="button">
                    <FaMapLocation />
                    <span> Use my location</span>
                  </button>
                  <div>
                    <input type="text" placeholder="Enter your city" />
                    <button type="submit">Search</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
