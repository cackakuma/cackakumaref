import { BrowserRouter, Routes, Route } from "react-router-dom";
import DonateButton from "./pages/Client Page/Buttons/donateButton";
import CACDataInput from "./pages/Admin Page/CACDataInput";
import ClientMaster from "./pages/Client Page/ClientMaster";

const App = () => {
   return (
    <BrowserRouter>
      <div className="bg-blue-50 min-h-screen">
        <Routes>
          {/* Admin routes */}
           <Route path="/admin">
          <Route path="cac/*" element={<CACDataInput />} />
          </Route>
          
          {/* Client routes */}
          <Route path="/*" element={<ClientMaster />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;