// import { useState } from "react";
import top from "../assets/images/AuthenticationIcons/top.png";
// import Login from "@/shared/Login";
// import SignUp from "@/shared/SignUp";
import { Image } from "@chakra-ui/react";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { Navigate } from "react-router-dom";
import { supabaseClient } from "@/supabase/connection";
import { FcGoogle } from "react-icons/fc";

const AuthenticationPage = () => {
  // const [isLogin, setIsLogin] = useState(true);
  const { user } = useAppointmentContext();
  console.log(user);

  const handleOAuthSignUp = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: "http://localhost:5173/user/home",
      },
    });
    console.log(data);

    if (error) {
      console.log("error:", error);
    }
  };

  if (user?.id !== undefined) {
    return <Navigate to="/user/home" />;
  }

  return (
    <div className="w-full h-screen ">
      <div className="relative hidden lg:block w-1/3">
        <Image src={top} className="absolute -top-5 -left-16" alt="Top Image" />
        <div className="absolute mx-36 my-24">
          <h1 className="text-3xl">LOGO</h1>
        </div>
      </div>
      <h1 className="text-4xl block lg:hidden mt-16 mb-10 text-center w-full">
        Logo
      </h1>
      <div className="flex w-full lg:h-full justify-center items-center gap-2 text-green-primary-1">
        <span className="flex items-center p-2 border border-green-primary-1 rounded-lg hover:shadow-lg hover:scale-105 hover:linear hover:delay-100">
          Sign in with{" "}
          <button type="button" onClick={handleOAuthSignUp} className="p-1 ">
            {/* hover:drop-shadow-[0_6px_6px_rgba(72,187,120,1)] */}
            <FcGoogle size={30} />
          </button>
        </span>
      </div>
    </div>
  );
};

export default AuthenticationPage;
