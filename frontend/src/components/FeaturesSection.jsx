import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const FeaturesSection = () => {
  const { shows, image_base_url} = useAppContext();


  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-10 lg:px-24 xl:px-20 overflow-hidden ">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm cursor-pointer"
        >
          View All{" "}
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5 " />
        </button>
      </div>
      <div className="flex justify-self-start flex-wrap max-sm:justify-center  w-full gap-10 mt-8">
        {shows.slice(0,4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>
      <div
        onClick={() => {
          navigate("/movies");
          scrollTo(0, 0);
        }}
        className="flex justify-center mt-20"
      >
        <button className="px-10 py-3 text-sm bg-[#FD5965] transition rounded-md font-medium cursor-pointer">
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturesSection;
