import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Tital from "../components/admin/Tital";
import BlurCircle from "../components/BlurCircle";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios, getToken, user, image_base_url } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + (dashboardData.totalRevenue || "0"),
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UserIcon,
    },
  ];

  const fetchDashboardData = async () => {
    // Simulating fetch
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching dashboard Data: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Tital text1="Admin" text2="Dashboard" />

      {/* Dashboard cards */}
      <div className="flex flex-wrap gap-4 mt-5 w-full">
        <BlurCircle top="-100px" left="0" />
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 bg-[#FD5965]/20 rounded-md max-w-48 w-full"
          >
            <div>
              <h1 className="text-sm">{card.title}</h1>
              <p className="text-xl font-medium mt-1">{card.value}</p>
            </div>
            <card.icon className="w-6 h-6" />
          </div>
        ))}
      </div>

      {/* Active shows */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-7xl">
        <BlurCircle top="100px" left="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-60 rounded-lg overflow-hidden h-full pb-3 bg-[#FD5965]/10 border border-[#FD5965]/20 hover:-translate-y-1 transition duration-300"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              className="h-60 w-full object-cover"
              alt={show.movie.title}
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {currency} {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 text-[#FD5965]" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
