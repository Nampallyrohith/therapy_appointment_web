import { useAppointmentContext } from "@/context/AppointmentContext";
import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import Loader from "@/shared/Loader";
import { Navigate, Outlet, useLocation } from "react-router-dom"; 
const ProtectedRoute = () => {
  const { isAuthToken, isLoading } = useAppointmentContext();
  const location = useLocation(); // Get current location

  if (isLoading) {
      return <Loader />;
  }

  if (!isAuthToken) {
      // Store the intended URL before redirecting
      sessionStorage.setItem('intendedRoute', location.pathname); // or localStorage
      return <Navigate to="/login" />;
  }

  return (
      <>
          <Header />
          <Outlet />
          <Footer />
      </>
  );
};

export default ProtectedRoute;
