import { useAppointmentContext } from "@/context/AppointmentContext";
import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import Loader from "@/shared/Loader";
import { Navigate, Outlet } from "react-router-dom"; 

const ProtectedRoute = () => {
  const { isAuthToken, isLoading } = useAppointmentContext();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return isAuthToken ? (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectedRoute;
