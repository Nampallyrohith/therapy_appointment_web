import { useAppointmentContext } from "@/context/AppointmentContext";
import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import Loader from "@/shared/Loader";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Modal from "react-modal";
import { Button } from "@chakra-ui/react";

Modal.setAppElement("#root");

const ProtectedRoute = () => {
  const { isAuthToken, isLoading, isSessionExpired, handleUserSignOut } =
    useAppointmentContext();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthToken) {
    sessionStorage.setItem("intendedRoute", location.pathname);
    return <Navigate to="/login" />;
  }

  if (isSessionExpired) {
    return (
      <Modal
        isOpen={true}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 40px",
            textAlign: "center",
            borderRadius: "10px",
          },
        }}
      >
        <h2 className="text-xl font-semibold text-red-600">Session Expired</h2>
        <p className="mt-4 mb-2">
          Your session has expired. Please log in again.
        </p>
        <Button
          onClick={() => handleUserSignOut()}
          className="mt-4 bg-orange-primary-1 p-3 text-white"
        >
          Return to Login
        </Button>
      </Modal>
    );
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
