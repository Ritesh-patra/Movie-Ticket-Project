import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Tital from "../components/admin/Tital";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllShow = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      // backend returns { success: true, shows }
      setShows(data.shows || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if(user) {
        getAllShow();
    }
  }, [user]);

  return !loading ? (
    <>
      <Tital text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-hidden"></div>
      <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
        <thead>
          <tr className="bg-[#FD5965]/20 text-left text-white">
            <th className="p-2 font-medium pl-5">Movie Name</th>
            <th className="p-2 font-medium ">Show Time</th>
            <th className="p-2 font-medium ">Total Booking</th>
            <th className="p-2 font-medium ">Earnings</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {shows.map((show, index) => (
            <tr
              key={show._id || index}
              className="border-b border-[#FD5965]/10 bg-[#FD5965]/5 even:bg-[#FD5965]/10"
            >
              <td className="p2 min-w-48 pl-5">{show.movie.title}</td>
              <td className="p2">{dateFormat(show.showDateTime)}</td>
              <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
              <td className="p-2">
                {currency}{" "}
                {Object.keys(show.occupiedSeats).length * show.showPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
