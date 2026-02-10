import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      console.log(data);
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/dashboard")) {
        navigate("/");
        toast.error("Access denied. Admins only.");
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      console.log("[AppContext] fetchShows response:", data);
      if (data.success) {
        const showsData = data.shows || data.movies || [];
        setShows(showsData);
      } else {
        toast.error(data.message || "Failed to fetch shows");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoritesMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [shows]);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoritesMovies();
    }
  }, [user]);

  const value = {
    fetchIsAdmin,
    axios,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoritesMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
