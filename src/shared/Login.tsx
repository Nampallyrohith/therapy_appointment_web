import profileIcon from "../assets/images/AuthenticationIcons/profile-icon.png";
import { useForm } from "react-hook-form";
import ActionButton from "@/shared/ActionButton";
import userIcon from "../assets/images/AuthenticationIcons/user-icon.png";
import passwordIcon from "../assets/images/AuthenticationIcons/password-icon.png";
import { Image } from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabaseClient } from "@/supabase/connection";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character(s)" }),
});

type Inputs = z.infer<typeof schema>;

const Login: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.log(error);
      }
      console.log(data.session?.provider_token);
    };
    fetchData();
  }, []);

  return (
    <div className="lg:mt-36 self-center flex flex-col justify-center items-center space-y-5 w-full h-full">
      <Image
        src={profileIcon}
        alt="Profile Icon"
        className="w-10 self-center"
      />
      <h1 className="text-2xl text-orange-primary-1 whitespace-nowrap">
        Login
      </h1>
      <div className="w-11/12 md:w-3/4 lg:w-[400px]  inset-6 flex items-center justify-center">
        <form className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              {...register("email")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1 "
              placeholder="Email"
            />
            <Image src={userIcon} alt="Icon" className="w-5 mr-4" />
          </div>
          {errors.email && (
            <div className="text-red-500 text-xs">{errors.email.message}</div>
          )}

          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              {...register("password")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1"
              placeholder="Password"
            />
            <Image src={passwordIcon} alt="Icon" className="w-5 mr-4" />
          </div>
          {errors.password && (
            <div className="text-red-500 text-xs">
              {errors.password.message}
            </div>
          )}
          <div className="flex items-center gap-3 w-full">
            <label className="flex items-center space-x-2 ">
              <input
                type="radio"
                name="option"
                value="rememberMe"
                className="form-radio text-orange-primary-1 focus:ring-0"
              />
              <span className="text-orange-primary-2">Remember Me</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="forget"
                className="form-radio text-orange-primary-1 focus:ring-0"
              />
              <span className="text-orange-primary-2">Forget password</span>
            </label>
          </div>

          <div className="text-center my-5">
            <ActionButton buttonText="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
