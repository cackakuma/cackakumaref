import { Routes, Route } from "react-router-dom";
import Footer from "./Footer";
import AboutUs from "./AboutUs";
import Programs from "./ProgramsClient";
import Home from "./Home";
import TheBoard from "./TheBoard";
import Layout from "./Layout";

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
      <Footer />
    </div>
  );
};

export default ClientMaster;
