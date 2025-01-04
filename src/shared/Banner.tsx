import { Image } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import BannerBg from "@/assets/images/banner-background.png";

const Banner = () => {
  return (
    <section className="bg-[#FDF8EF] w-full h-full grid grid-cols-2 grid-row-1 items-center gap-10 my-auto px-60 py-10 mt-16 space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold text-orange-primary-1">
          Welcome back,{" "}
          <span className="text-green-primary-1 font-bold">Rohan Kumar!</span>
        </h1>
        <p className=" text-green-primary-1">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
          perferendis inventore animi quod sint cupiditate accusamus, autem
          provident amet labore iusto odio nulla consequatur commodi, facilis
          veniam alias molestias dignissimos!
        </p>
        <ActionButton buttonText="Book Appointment" />
      </div>
      <Image src={BannerBg} alt="banner image" className="" />
    </section>
  );
};

export default Banner;
