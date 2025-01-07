import { useState } from "react";
import top from "../assets/images/AuthenticationIcons/top.png";
import Login from "@/shared/Login";
import SignUp from "@/shared/SignUp";
import { Image } from "@chakra-ui/react";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true); 

  return (
    <div className="relative">
    <div className="absolute w-[535px]"> 
      <Image 
        src={top} 
        className="absolute -top-5 -left-16" 
        alt="Top Image" 
      />
      <div className="absolute mx-36 my-24">
        <p>LOGO</p>
      </div>
    </div>
      {isLogin ? <Login /> : <SignUp />}
      <div className="relative top-[80px] w-[543px] left-[870px] text-left text-[22px] ">
          {isLogin ? (
            <>
              <p >Don't have an account yet?</p>
              <div className="ml-6">
                <a
                  href="#"
                  className="underline block mt-2"
                  onClick={() => setIsLogin(false)}
                >
                  Create a new Account
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-orange-primary-1">Already have an account?</p>
              <div className="pl-28">
                <a
                  href="#"
                  className="text-orange-primary-1 underline block mt-2"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </a>
              </div>
            </>
          )}
        </div>

    </div>
  );
};

export default AuthenticationPage;
