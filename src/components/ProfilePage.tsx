import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/apiCall";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { User } from "@/models/typeDefinitions";
import { ThreeDot } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";
import { supabaseClient } from "@/supabase/connection";

const UserProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, userMeta, getUserDetailsFromDB } = useAppointmentContext();
  const [file, setFile] = useState<File | null>(null);

  const { call: UpdateUserAPICaller, loading } = useFetchData<User>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<User>();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = async (data: User) => {
    if (file) {
      const newAvatarUrl = await uploadAvatar();
      if (newAvatarUrl) {
        data.avatarUrl = newAvatarUrl;
      }
    }
    await UpdateUserAPICaller("auth/google/signin", "POST", {
      ...data,
      ...userMeta,
    });
    setIsEditing(false);
    toast.success("Profile updated", {
      duration: 3000,
      style: {
        backgroundColor: "#1f5d5d",
        color: "#fff",
        fontWeight: 700,
      },
    });
    getUserDetailsFromDB();
  };

  const handleCancel = () => {
    if (user) {
      reset(user);
    }
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!file) return null;

    const filePath = `users/${user?.googleUserId}/${file.name}`;
    const { error } = await supabaseClient.storage
      .from("users_avatar")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (error) {
      toast("Upload failed");
      return null;
    }

    // Get public URL
    const { data } = supabaseClient.storage
      .from("users_avatar")
      .getPublicUrl(filePath);
    setValue("avatarUrl", data.publicUrl);
    return data.publicUrl;
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-[#CBF6EF] rounded-2xl mx-3 space-y-4 p-6 shadow-lg w-11/12 text-sm md:w-[900px]"
      >
        {!isEditing && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white rounded-full"
            >
              <FaPen className="text-gray-700" />
            </button>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <img
              src={watch("avatarUrl")}
              className="w-24 h-24 rounded-full object-cover bg-gray-100"
              alt="Profile"
            />
            {isEditing && (
              <label
                htmlFor="fileInput"
                className="absolute -bottom-1 right-1 w-8 h-8 bg-white p-2 rounded-full text-gray-700 shadow border border-gray-300 flex items-center justify-center cursor-pointer"
              >
                <FaPen className="w-4 h-4" />
              </label>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            {...register("avatarUrl")}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {errors.avatarUrl && (
            <p className="text-red-500 text-xs">{errors.avatarUrl.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:mx-10 md:grid-cols-2 gap-2 md:gap-4">
          {/* Name */}
          <div className="flex justify-center md:justify-start items-center w-full gap-2">
            <label className=" text-teal-700">Name:</label>
            <p className="text-green-primary-3">{watch("name")}</p>
          </div>
          {/* Email */}
          <div className="flex justify-center md:justify-start items-center w-full gap-2">
            <label className="font-medium text-green-primary-3">Email:</label>
            <p className="text-green-primary-3">{watch("email")}</p>
          </div>
          {/* Gender */}
          <div className="flex gap-3 justify-center md:justify-start items-center w-full text-green-primary-3">
            <label>Gender:</label>
            {isEditing ? (
              <select
                {...register("gender", { required: "Gender is required" })}
                className="bg-transparent border-0 border-b-green-primary-1 focus:border-b-green-primary-1 focus:ring-0  border-b-2"
              >
                <option value="select gender" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="ml-5">{watch("gender")}</p>
            )}
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>
          {/* Phone */}
          <div className="flex gap-3 justify-center md:justify-start items-center text-green-primary-3">
            <label>Phone:</label>
            {isEditing ? (
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Invalid phone number",
                  },
                })}
                placeholder="mobile number"
                className="bg-transparent border-0 border-b-green-primary-1 focus:border-b-green-primary-1 focus:ring-0 border-b-2 focus:outline-none w-1/2"
                type="text"
              />
            ) : (
              <p>{watch("phone")}</p>
            )}
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
          {/* Age */}
          <div className="flex gap-3 justify-center md:justify-start items-center text-green-primary-3 w-full">
            <label>Age:</label>
            {isEditing ? (
              <input
                {...register("dob", {
                  required: "Age is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Age must be a number",
                  },
                })}
                placeholder="dob"
                className="bg-transparent border-0 border-b-green-primary-1 focus:border-b-green-primary-1 focus:ring-0 border-b-2 focus:outline-none w-1/5"
                type="text"
              />
            ) : (
              <p>{watch("dob")}</p>
            )}
            {errors.dob && (
              <p className="text-red-500 text-xs">{errors.dob.message}</p>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-4 justify-end my-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-[#2EC4B6] rounded-md border-2 border-[#2EC4B6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2EC4B6] text-white rounded-md"
            >
              {loading ? (
                <ThreeDot easing="ease-in" size="small" color="#fff" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
        {isEditing && (
          <p className="italic text-green-primary-3 text-[10px]">
            *Note: Name and email cannot be changed.
          </p>
        )}
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default UserProfileCard;
