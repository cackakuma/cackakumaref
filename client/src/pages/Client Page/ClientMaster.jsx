import { Routes, Route, Outlet } from "react-router-dom";
import Footer from "./Footer";
import AboutUs from "./AboutUs";
import Programs from "./ProgramsClient";
import Home from "./Home";
import TheBoard from "./TheBoard";
import DonateButton from "./Buttons/donateButton"

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const ClientMaster = () => {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="programs/*" element={<Programs />} />
          <Route path="board" element={<TheBoard />} />
          <Route path="about" element={<AboutUs />} />
        </Route>
      </Routes>
      
       <DonateButton 
          style="bg-blue-700 p-2 text-white font-bold fixed bottom-3 right-0 pr-3 rounded-tl-lg rounded-bl-lg shadow-2xl shadow-black" 
          data="donate"
        />
      <Footer />
    </div>
  );
};

export default ClientMaster;