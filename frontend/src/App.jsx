import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import Moviedetails from "./pages/Moviedetails.jsx";
import SeatLayout from "./pages/SeatLayout.jsx";
import Mybooking from "./pages/Mybooking.jsx";
import Favorite from "./pages/Favorite.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";
import Layout from "./admin/Layout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import AddShows from "./admin/AddShows.jsx";
import ListShows from "./admin/ListShows.jsx";
import ListBooking from "./admin/ListBooking.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";
import Loading from "./components/Loading.jsx";

const App = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const { user } = useAppContext();

  return (
    <>
      <Toaster />
      {!isDashboardRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<Moviedetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<Mybooking />} />
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/favorite" element={<Favorite />} />

        {/* ✅ Changed from /admin/* to /dashboard/* */}
        <Route
          path="/dashboard/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <SignIn fallbackRedirectUrl={"/dashboard"} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBooking />} />
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
