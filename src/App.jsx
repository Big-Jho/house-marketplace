import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { HelmetProvider } from "react-helmet-async";

import Explore from "./components/pages/Explore";
import Categories from "./components/pages/Categories";
import Profile from "./components/pages/Profile";
import Offers from "./components/pages/Offers";
import Listings from "./components/pages/Listings";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import ForgotPassword from "./components/pages/ForgotPassword";
import Contact from "./components/pages/Contact";
import CreateListing from "./components/pages/CreateListing";
import EditListing from "./components/pages/EditListing";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/category/:categoryName" element={<Categories />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/:hello" element={<Offers />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listings />}
          />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
