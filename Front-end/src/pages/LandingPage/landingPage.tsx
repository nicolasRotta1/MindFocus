import Benefits from "../../components/Benefits/benefits";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import Hero from "../../components/Hero/hero";
import Motivation from "../../components/Motivation/motivation";

import './landingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <Benefits />
      <Motivation />
      <Footer />
      
    </div>
  );
}
