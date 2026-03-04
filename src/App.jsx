import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Explore from "./components/pages/Explore";
import Profile from "./components/pages/Profile";
import Offers from "./components/pages/Offers";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import ForgotPassword from "./components/pages/ForgotPassword";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
