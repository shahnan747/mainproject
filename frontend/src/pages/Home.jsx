import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import ProductsList from "../components/ProductsList"
import Reviews from "../components/Reviews";
import Media from "../components/Media";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <Features/>
        <DashboardPreview/>
        <ProductsList/>
        <Reviews/>
        <Media/>
        <Footer/>
    </div>
  );
}
