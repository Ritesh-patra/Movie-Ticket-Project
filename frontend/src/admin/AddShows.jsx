import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Tital from "../components/admin/Tital";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../lib/kConverter";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios, getToken, user, image_base_url } = useAppContext();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [price, setPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/show/now-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        // backend returns `movies` array
        setNowPlayingMovies(data.movies || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateTime = () => {
    if (!dateTimeInput) return;

    const selectedDate = new Date(dateTimeInput);

    const date = selectedDate.toLocaleDateString("en-CA");
    const time = selectedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      // Filter out the removed time
      const filteredTimes = prev[date]?.filter((t) => t !== time) || [];

      // If no times left for that date, remove the date key itself
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }

      // Otherwise, update only that date's time list
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      // const token = await getToken();
      setAddingShow(true);

      if (
        !selectedMovie ||
        Object.keys(dateTimeSelection).length === 0 ||
        !price
      ) {
        toast.error("Missing required fields");
        setAddingShow(false);
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, times]) => ({ date, times }),
      );

      const payload = {
        movieId: selectedMovie,
        showPrice: Number(price),
        showsInput,
      };

      console.log("📦 Payload sending:", payload); // Debug

      // 🧨 API CALL
      const { data } = await axios.post("/api/show/add", payload, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      console.log("📩 API Response:", data);

      if (data.success) {
        toast.success(data.message);
        // reset all inputs
        setSelectedMovie(null);
        setDateTimeSelection({});
        setPrice("");
        setDateTimeInput("");
      } else {
        toast.error(data.message || "failed show add show");
      }
    } catch (error) {
      console.error("❌ Error adding show:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setAddingShow(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Tital text1="Add" text2="Shows" />
      <p className="mt-10 text-lg  font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4 no-scrollbar">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:translate-y-1 transition duration-300`}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={image_base_url + movie.poster_path}
                  className="w-full object-cover brightness-90"
                  alt=""
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-[#FD5965] fill-[#FD5965]" />{" "}
                    {movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p className="text-gray-300 text-right">
                  {kConverter(movie.vote_count)} Votes
                </p>
              </div>
              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-[#FD5965] w-6 h-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="font-medium truncate">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>
      {/* show price input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none"
          />
        </div>
      </div>

      {/* {dateandtime} */}
      <div className="mt-6">
        <label htmlFor="" className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            step="60"
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md"
          />
          <button
            onClick={handleDateTime}
            className="bg-[#FD5965]/80 text-white px-3 text-sm rounded-lg hover:bg-[#FD5965] cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* {display selected times} */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 font-medium text-gray-800 dark:text-gray-200">
            Selected Date & Time
          </h2>
          <ul className="space-y-4">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date} className="space-y-2">
                {/* Date */}
                <p className="font-semibold text-gray-600 dark:text-gray-400">
                  {date}
                </p>

                {/* Times */}
                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-[#FD5965] px-2 py-1 flex items-center rounded text-gray-700 dark:text-gray-200"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-[#FD5965] text-white px-8 py-2 mt-6 rounded hover:bg-[#FD5965] transition-all cursor-pointer"
      >
        Add Show
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
