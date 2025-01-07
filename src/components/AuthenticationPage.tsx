import { useState } from "react";
import top from "../assets/images/AuthenticationIcons/top.png";
import Login from "@/shared/Login";
import SignUp from "@/shared/SignUp";
import { Image } from "@chakra-ui/react";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);

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
      <div className="flex flex-col justify-center items-center">
        {isLogin ? <Login /> : <SignUp />}
        {isLogin ? (
          <div className="flex justify-center gap-1 md:gap-3 items-center mt-3 w-full text-xs md:text-base">
            <p>Don't have an account yet?</p>
            <button
              className="underline text-green-primary-1 font-semibold"
              onClick={() => setIsLogin(false)}
            >
              Create a new Account
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-1 md:gap-3 items-center mt-3 w-full text-xs md:text-base">
            <p className="text-green-primary-1">Already have an account?</p>
            <button
              className="text-green-primary-1 font-semibold underline"
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationPage;
