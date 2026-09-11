import React from "react";
import Header from "./Header";
import TopBar from "../topbar/TopBar";
import "./HeaderTop.scss";

const HeaderTop = () => {
  return (
    <div className="HeaderWrap">
      <TopBar />
      <Header />
    </div>
  );
};

export default HeaderTop;
