import { useAppointmentContext } from "@/context/AppointmentContext";
import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { authFailed } = useAppointmentContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (authFailed) {
      navigate("/login");
    }
  }, [authFailed]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedRoute;
