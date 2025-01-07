import profileIcon from "../assets/images/AuthenticationIcons/profile-icon.png";    
import {SubmitHandler, useForm } from "react-hook-form";
import ActionButton from "@/shared/ActionButton";
import userIcon from "../assets/images/AuthenticationIcons/user-icon.png";  
import passwordIcon from "../assets/images/AuthenticationIcons/password-icon.png";
import { Image } from "@chakra-ui/react";
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({ 
  email: z.string().email(),
  password: z.string().min(8,{ message: "Password must contain at least 8 character(s)" }),
});

type Inputs = z.infer<typeof schema>;

const Login:React.FC = () => {
  const { register, 
            handleSubmit , 
            formState:{errors }} = useForm<Inputs>({
              resolver: zodResolver(schema)
            });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
   console.log(data);
  }

  return (
    <div className="relative ">
      <div className="relative left-[945px] top-[52px] w-[6.67%] h-[10.25%] ">
        <Image
          src={profileIcon}
          alt="Profile Icon"
          className="relative left-[65px]  w-[40px]"
        />
        <div className="relative inset-6 flex items-center justify-center">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-[400px] h-12 text-orange-primary-1">
              <input
                {...register("email")}
                className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1 "
                placeholder="Email"
              />
                <Image 
                  src={userIcon} 
                  alt="Icon" 
                  className="w-5 mr-4" />
            </div>
            {errors.email && <div className="text-red-500">{errors.email.message}</div>} 

            <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
              <input
                {...register("password")}
                className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1"
                placeholder="Password"
              />
                <Image src={passwordIcon} alt="Icon" className="w-5 mr-4" />
            </div>
             {errors.password && <div className="text-red-500">{errors.password.message}</div>}  
            <div className="flex items-center space-x-8" >
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="option"
                    value="rememberMe"
                    className="form-radio text-orange-primary-1 focus:ring-0"
                  />
                  <span >Remember Me</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="option"
                    value="forget"
                    className="form-radio text-orange-primary-1 focus:ring-0"
                  />
                  <span>Forget</span>
                </label>
              </div>

            <div className="text-center my-5">
              <ActionButton buttonText="Login"/>
            </div>
          </form>
        </div>
       
      </div>
    </div>
  );
};

export default Login;
