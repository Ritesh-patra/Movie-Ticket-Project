import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import Moviedetails from './pages/Moviedetails.jsx'
import SeatLayout from './pages/SeatLayout.jsx'
import Mybooking from './pages/Mybooking.jsx'
import Favorite from './pages/Favorite.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { Toaster } from 'react-hot-toast'
import Layout from './admin/Layout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import AddShows from './admin/AddShows.jsx'
import ListShows from './admin/ListShows.jsx'
import ListBooking from './admin/ListBooking.jsx'

const App = () => {

    const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
 
    <>
    <Toaster />
    {!isAdminRoute && <Navbar /> }
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/movies' element={<Movies />} />
      <Route path='/movies/:id' element={<Moviedetails />} />
      <Route path='/movies/:id/:date' element={<SeatLayout />} />
      <Route path='/my-bookings' element={<Mybooking />} />
      <Route path='/favorite' element={<Favorite />} />
      <Route path='/admin/*' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='add-shows' element={<AddShows />} />
        <Route path='list-shows' element={<ListShows />} />
        <Route path='list-Bookings' element={<ListBooking />} />
      </Route>
    </Routes>
    {!isAdminRoute && <Footer /> }

    </>
  )
}

export default App