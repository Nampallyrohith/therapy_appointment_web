import notFoundImg from "@/assets/images/notfound.jpg";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-sans font-semibold text-2xl md:text-3xl my-3">Page not found</h1>
      <img src={notFoundImg} alt="not-found" className="w-1/2 md:w-1/4" />
      <Link to="/" className="bg-green-primary-1 text-white px-5 py-2 rounded-2xl">Go to Home</Link>
    </div>
  );
};

export default NotFound;
