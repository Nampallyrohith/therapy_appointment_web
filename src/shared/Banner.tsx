import { Image } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import BannerBg from "@/assets/images/banner-background.png";

const Banner = () => {
  return (
    <section className="bg-[#FDF8EF] w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:items-center gap-10 my-auto px-14 py-8 mt-[72px] lg:px-60 lg:py-10 lg:mt-16 space-y-8 banner">
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold text-orange-primary-1">
          Welcome back,{" "}
          <span className="text-green-primary-1 font-bold">Rohan Kumar!</span>
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
        <ActionButton buttonText="Book Appointment" />
      </div>
      <Image src={BannerBg} alt="banner image" className="hidden lg:block" />
    </section>
  );
};

export default Banner;
