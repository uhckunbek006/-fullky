import React from "react";
import Hero from "./hero/Hero";
import NewHero from "./hero/NewHero";
import BasesMap from "./basesMap/BasesMap";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <BasesMap />
      <NewHero />
    </div>
  );
};

export default HomePage;
