import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MyAppointmentsPage from "./components/MyAppointmentsPage";
import AuthenticationPage from "./components/AuthenticationPage";
import ProtectedRoute from "./Handler/ProtectedRoute";
import ProfilePage from "./components/ProfilePage";

const App = () => {
  const isAuthenticated = true; // Replace with actual authentication logic

  return (
    <div className="w-full h-full container">
      <Routes>
        <Route path="/login" element={<AuthenticationPage />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/user/my-appointments"
            element={<MyAppointmentsPage />}
          />
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
