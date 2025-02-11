import { Image } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import BannerBg from "@/assets/images/banner-background.png";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { useBookAppointment } from "@/components/utils/commonFunction";

const Banner = () => {
  const { user } = useAppointmentContext();
  const handleBookAppointment = useBookAppointment();
  return (
    <section className="bg-[#FDF8EF] w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:items-center gap-10 my-auto px-14 py-8 mt-[72px] lg:px-60 lg:py-10 lg:mt-16 space-y-8 banner">
      <div className="space-y-8">
        <h1 className="text-xl md:text-[27px] font-semibold text-orange-primary-1">
          Welcome back,{" "}
          <span className="text-green-primary-1 font-bold">{user?.name}!</span>
        </h1>
        <p className=" text-green-primary-1 italic ">
          "Mental health is not a destination, but a process. It’s about how you
          drive, not where you’re going."
          <br />
          "You are not your illness. You have a story to tell, a path to walk,
          and a purpose to live."
          <br />
          "Healing takes time, and asking for help is a courageous step."
        </p>
        <ActionButton
          buttonText="Book Appointment"
          onClick={handleBookAppointment}
        />
      </div>
      <Image src={BannerBg} alt="banner image" className="hidden lg:block" />
    </section>
  );
};

export default Banner;
