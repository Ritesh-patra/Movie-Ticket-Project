import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormate";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie = {} }) => {
  const { image_base_url } = useAppContext();

  const navigate = useNavigate();
  //   console.log("📌 MovieCard received:", movie);

  return (
    <div className="flex  flex-col justify-between  p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
        src={image_base_url + (movie.backdrop_path || movie.poster_path)}
        alt=""
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-sm text-gray-400 mt-2">
        {/* Release Year */}
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "N/A"}

        {" • "}

        {/* Genres */}
        {Array.isArray(movie.genres) && movie.genres.length > 0
          ? movie.genres
              .slice(0, 2)
              .map((genre) => genre.name)
              .join(" | ")
          : "Unknown"}

        {" • "}

        {/* Runtime */}
        {typeof movie.runtime === "number" ? timeFormat(movie.runtime) : "—"}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 bg-[#FD5965] rounded-full font-medium cursor-pointer     py-2 text-xs"
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 " />
          {typeof movie.vote_average === "number"
            ? movie.vote_average.toFixed(1)
            : "—"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
