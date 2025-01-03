import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthenticationPage from "./components/AuthenticationPage";

const App = () => {
  return (
    <div className="">
     <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthenticationPage />} />
     </Routes>
    </div>
  );
};

export default App;
