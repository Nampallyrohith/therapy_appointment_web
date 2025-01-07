import profileIcon from "../assets/images/AuthenticationIcons/profile-icon.png";
import { SubmitHandler, useForm } from "react-hook-form";
import ActionButton from "@/shared/ActionButton";
import userIcon from "../assets/images/AuthenticationIcons/user-icon.png";
import passwordIcon from "../assets/images/AuthenticationIcons/password-icon.png";
import emailIcon from "../assets/images/AuthenticationIcons/email-icon.png";
import { Image } from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    fullName: z.string().nonempty("Full Name is required"),
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Inputs = z.infer<typeof schema>;

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="lg:mt-28 self-center flex flex-col justify-center items-center space-y-5 w-full h-full">
      <Image
        src={profileIcon}
        alt="Profile Icon"
        className="w-10 self-center"
      />
      <h1 className="text-2xl text-orange-primary-1 whitespace-nowrap">
        Create a new Account
      </h1>
      <div className="w-11/12 md:w-3/4 lg:w-[400px] inset-6 flex items-center justify-center">
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Full Name */}
          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              {...register("fullName")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent placeholder-orange-primary-1 w-full"
              placeholder="Full Name"
            />
            <Image src={userIcon} alt="Icon" className="w-5 mr-4" />
          </div>
          {errors.fullName?.message && (
            <div className="text-red-500 text-xs">
              {errors.fullName.message}
            </div>
          )}
          {/* Email */}
          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              {...register("emailId")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1 "
              placeholder="Email Id"
            />
            <Image src={emailIcon} alt="Icon" className="w-5  mr-4" />
          </div>
          {errors.emailId?.message && (
            <div className="text-red-500 text-xs">{errors.emailId.message}</div>
          )}

          {/* Password */}
          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              type="password"
              {...register("password")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1"
              placeholder="Password"
            />
            <Image src={passwordIcon} alt="Icon" className="w-5 mr-4" />
          </div>
          {errors.password?.message && (
            <div className="text-red-500 text-xs">
              {errors.password.message}
            </div>
          )}

          {/* Confirm Password */}
          <div className="flex justify-between items-center bg-[#AAE9E3] placeholder-orange-primary-1 rounded-full w-full h-12 text-orange-primary-1">
            <input
              type="password"
              {...register("confirmPassword")}
              className="px-5 border-none outline-none focus:outline-none focus:ring-0 bg-transparent  placeholder-orange-primary-1 "
              placeholder="Confirm Password"
            />
            <Image src={passwordIcon} alt="Icon" className="w-5 mr-4" />
          </div>

          {/* Submit Button */}
          <div className="text-center my-6">
            <ActionButton buttonText="Sign in" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
