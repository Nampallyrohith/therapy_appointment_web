import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MyAppointmentsPage from "./components/MyAppointmentsPage";
import AuthenticationPage from "./components/AuthenticationPage";
import ProtectedRoute from "./Handler/ProtectedRoute";
import BookAppointment from "./components/BookAppointment";
import ProfilePage from "./components/ProfilePage";
import NotFound from "./shared/NotFound";

const App = () => {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthenticationPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/user/home" element={<HomePage />} />
          <Route
            path="/user/my-appointments"
            element={<MyAppointmentsPage />}
          />
          <Route path="/user/book-appointment" element={<BookAppointment />} />
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
