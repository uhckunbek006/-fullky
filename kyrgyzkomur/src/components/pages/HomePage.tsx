import React from "react";
import Hero from "./hero/Hero";
import NewHero from "./hero/NewHero";
import BasesMapWrapper from "./BasesMapWrapper";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <BasesMapWrapper />
      <NewHero />
    </div>
  );
};

export default HomePage;
