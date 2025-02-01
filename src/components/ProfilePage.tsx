import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { useState } from "react";
import ProfilePic from "../assets/images/profile_pic.png";

interface UserProfileData {
  name: string;
  email: string;
  gender: string;
  age: number;
  phone: number;
}

const UserProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "N. Rohith",
      email: "rohith@gmail.com",
      gender: "Male",
      age: 20,
      phone: 9876543210,
    },
  });

  const onSubmit = (data: UserProfileData) => {
    console.log("Updated Profile Data:", data);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setValue("name", "N. Rohith");
      setValue("email", "rohith@gmail.com");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-[#CBF6EF] rounded-2xl mx-3 space-y-4 p-6 shadow-lg w-[650px]"
      >
        {!isEditing && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={handleEditClick}
              className="p-2 bg-white rounded-full"
            >
              <FaPen className="text-gray-700" />
            </button>
          </div>
        )}
        <div className="flex flex-col items-center">
          <img
            src={ProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="flex items-center w-full gap-2">
            <label className=" text-teal-700">Name:</label>
            <p className="text-green-primary-3 cursor-not-allowed">Rohith</p>
          </div>
          <div className="flex items-center w-full gap-2 ">
            <label className="font-medium text-green-primary-3">Email:</label>
            <p className="cursor-not-allowed text-green-primary-3">
              rohith@gmail.com
            </p>
          </div>
          <div className="flex items-center w-full text-green-primary-3">
            <label>Gender:</label>
            {isEditing && (
              <select
                {...register("gender", { required: "Gender is required" })}
                className={`bg-transparent focus:outline-none border-0 ${
                  isEditing ? "border-b-2" : ""
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}

            {!isEditing && (
              <span className="ml-5">{watch("gender") || "Not specified"}</span>
            )}

            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>

          <div className="flex items-center w-full text-green-primary-3">
            <label>Phone:</label>
            <input
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^\+?[0-9\s]+$/,
                  message: "Invalid phone number",
                },
              })}
              className={`bg-transparent  border-0 ${
                isEditing
                  ? "border-b-2 w-1/2 border-b-green-primary-3 focus:outline-none outline-none"
                  : ""
              }`}
              type="text"
              placeholder="9949289098"
              disabled={!isEditing}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex items-center text-green-primary-3 ">
            <label className="">Age:</label>
            <input
              {...register("age", {
                required: "Age is required",
                pattern: { value: /^[0-9]+$/, message: "Age must be a number" },
              })}
              className={`bg-transparent focus:outline-none border-0 ${
                isEditing ? "border-b-2 w-1/6" : ""
              }`}
              type="text"
              placeholder="20"
              disabled={!isEditing}
            />
            {errors.age && (
              <p className="text-red-500 text-xs">{errors.age.message}</p>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-4 justify-end font-Young Serif my-2 ">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-[#2EC4B6] rounded-md border-2 border-[#2EC4B6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2EC4B6] text-white rounded-md"
            >
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfileCard;
