import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };

const handleSeatClick = (seatId) => {
  if (!selectedTime) {
    return toast("Please select time first");
  }

  // If the seat is already selected, deselect it
  if (selectedSeats.includes(seatId)) {
    setSelectedSeats((prev) => prev.filter((seat) => seat !== seatId));
  } else {
    // If already 5 seats selected, show toast
    if (selectedSeats.length >= 5) {
      return toast("You can only select up to 5 seats");
    }
    // Otherwise, select the new seat
    setSelectedSeats((prev) => [...prev, seatId]);
  }
};


  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-[#FD5965]/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-[#FD5965] text-white"}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, []);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-10 lg:px-10 py-30 md:pt-52">
      {/* {Available Timings} */}
      <div className="w-60 bg-[#FD5965]/10 border border-[#FD5965]/20 rounded-lg py-10 h-max md:sticky md:top-28">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 spa ce-y-1">
          {show.dateTime[date].map((item) => (
            <div
              onClick={() => setSelectedTime(item)}
              key={item.time}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-[#FD5965] text-white" : "hover:bg-[#FD5965]/20"}`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* seats Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16 ">
        <BlurCircle top="100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-row items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 text-xs font-light">
          {groupRows.slice(1).map((group, index) => (
            <div key={index}>{group.map((row) => renderSeats(row))}</div>
          ))}
        </div>
          <button onClick={() => navigate('/my-bookings')} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-[#FD5965] rounded-full font-medium cursor-pointer active:scale-95 transition">
        Proceed to Checkout

        <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
      </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
