import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormate";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Mybooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { axios, getToken, user, image_base_url } = useAppContext();

  const getMyBooking = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBooking();
    }
  }, [user]);

  return !isLoading ? (
    <div className="relative px-6 md:px lg:px-36 pt-28 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" right="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Booking</h1>
      {bookings.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between mb-[#FD5965]/8 border border-[#FD5965]/20 rounded-lg mt-4 p-2 max-w-3xl"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={image_base_url + item.show.movie.poster_path}
                alt=""
                className="md:max-w-32 aspect-square h-auto object-bottom rounded"
              />
              <div className="flex flex-col p-4">
                <p className="text-lg font-semibold">{item.show.movie.title}</p>
                <p className="text-gray-400 text-sm">
                  {timeFormat(item.show.movie.runtime)}
                </p>
                <p className="text-gray-400 text-sm mt-auto">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency}
                  {item.amount}
                </p>
                {!item.isPaid ? (
                  <Link
                    to={item.paymentLink}
                    className="bg-[#FD5965] px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                  >
                    Pay Now
                  </Link>
                ) : (
                  <span className="text-green-500 font-semibold">Paid</span>
                )}
              </div>
              <div className="text-sm">
                <p>
                  <span className="text-gray-400">Total Tickets:</span>
                  {item.bookedSeats.length}
                </p>
                <p>
                  <span className="text-gray-400">Seat Number:</span>
                  {item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <Loading />
  );
};

export default Mybooking;
