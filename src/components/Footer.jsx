import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import OfferIcon from "../assets/svg/localOfferIcon.svg?react";
import ExploreIcon from "../assets/svg/exploreIcon.svg?react";
import PersonOutlineIcon from "../assets/svg/personOutlineIcon.svg?react";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const matchPathRoute = (route) => {
    return route === location.pathname;
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          {/* Explore link */}
          <li onClick={() => navigate("/")} className="navbarListItem">
            <ExploreIcon
              width="36px"
              height="36px"
              fill={matchPathRoute("/") ? "#2c2c2c" : "#8f8f8f"}
            />
            <h4
              className={`${matchPathRoute("/") ? "navbarListItemNameActive" : "navbarListItemName"}`}
            >
              Explore
            </h4>
          </li>

          {/* offers link */}
          <li onClick={() => navigate("/offers")} className="navbarListItem">
            <OfferIcon
              width="36px"
              height="36px"
              fill={matchPathRoute("/offers") ? "#2c2c2c" : "#8f8f8f"}
            />
            <h4
              className={`${matchPathRoute("/offers") ? "navbarListItemNameActive" : "navbarListItemName"}`}
            >
              Offers
            </h4>
          </li>

          {/* Profile */}
          <li onClick={() => navigate("/profile")} className="navbarListItem">
            <PersonOutlineIcon
              width="36px"
              height="36px"
              fill={matchPathRoute("/profile") ? "#2c2c2c" : "#8f8f8f"}
            />
            <h4
              className={`${matchPathRoute("/profile") ? "navbarListItemNameActive" : "navbarListItemName"}`}
            >
              Profile
            </h4>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
