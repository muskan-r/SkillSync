import Hero from "../components/home/Hero";
import HomeNavbar from "../components/home/HomeNavbar";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div>
      <HomeNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
}