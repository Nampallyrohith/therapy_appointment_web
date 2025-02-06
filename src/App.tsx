import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MyAppointmentsPage from "./components/MyAppointmentsPage";
import AuthenticationPage from "./components/AuthenticationPage";
import ProtectedRoute from "./Handler/ProtectedRoute";
import BookAppointment from "./components/BookAppointment";

const App = () => {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/login" element={<AuthenticationPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/user/home" element={<HomePage />} />
          <Route
            path="/user/my-appointments"
            element={<MyAppointmentsPage />}
          />
          <Route path="/user/book-appointment" element={<BookAppointment />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
