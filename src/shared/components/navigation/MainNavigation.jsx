import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import { useState } from "react";
import "./MainNavigation.css";
import NavLinks from "./NavLink";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UI/Backdrop";

const MainNavigation = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const openDrawerHandle = () => {
    setOpenDrawer(true);
  };
  const closeDrawerHandle = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      {openDrawer && <Backdrop onClick={closeDrawerHandle} />}
      <SideDrawer show={openDrawer} onClick={closeDrawerHandle}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <h1 className="main-navigation__title">
          <Link to='/' >Your Junk</Link>
        </h1>
        <button
          className={`main-navigation__menu-btn ${openDrawer ? "open" : ""}`}
          onClick={openDrawerHandle}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
