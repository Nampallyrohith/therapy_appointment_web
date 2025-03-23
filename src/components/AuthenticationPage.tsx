import top from "../assets/images/AuthenticationIcons/top.png";
import { Button, Image } from "@chakra-ui/react";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { supabaseClient } from "@/supabase/connection";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/Logo2.png";

const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string;

const AuthenticationPage = () => {
  const { isAuthToken } = useAppointmentContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthToken) {
      const intendedRoute =
        localStorage.getItem("intendedRoute") || "/user/home";
      localStorage.removeItem("intendedRoute");
      navigate(intendedRoute, { replace: true });
    }
  }, [isAuthToken, navigate]);

  const handleOAuthSignUp = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "openid email profile https://www.googleapis.com/auth/calendar",
        redirectTo: `${GOOGLE_REDIRECT_URI}/user/home`,
      },
    });
    console.log(data);

    if (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className="w-full h-screen ">
      <div className="relative hidden lg:block w-1/3">
        <Image src={top} className="absolute -top-5 -left-16" alt="Top Image" />
        <div className="absolute mx-36 my-24">
          {/* <h1 className="text-3xl">LOGO</h1> */}
          <Image src={logo} className="w-[350px]" />
        </div>
      </div>
      {/* <h1 className="text-4xl block lg:hidden mt-16 mb-10 text-center w-full">
        Logo
      </h1> */}

      <Image
        src={logo}
        width={80}
        className="block lg:hidden mt-16 mb-10 text-center w-11/12 mx-auto"
      />
      <Button
        onClick={handleOAuthSignUp}
        className="flex w-full lg:h-full justify-center items-center gap-2 text-green-primary-1"
      >
        <span className="flex items-center p-2 border border-green-primary-1 gap-2 rounded-lg hover:shadow-lg hover:scale-105 hover:linear hover:delay-100">
          Sign in with
          {/* hover:drop-shadow-[0_6px_6px_rgba(72,187,120,1)] */}
          <FcGoogle size={30} />
        </span>
      </Button>
    </div>
  );
};

export default AuthenticationPage;
