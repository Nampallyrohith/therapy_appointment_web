import { ourTherapiesList } from "@/mock-data/staticData";
import AboutTherapyCard from "@/shared/AboutTherapyCard";
import Banner from "@/shared/Banner";
import OurTherapists from "@/shared/OurTherapists";

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col justify-around items-start">
      <Banner />
      <h1 className="text-3xl text-center w-full mt-10">About Therapies</h1>
      <hr className="border-2 border-green-primary-1 rounded-full  mt-2 w-36 mx-auto" />
      <div>
        {ourTherapiesList.map((therapy) => (
          <AboutTherapyCard key={therapy.id} therapy={therapy} />
        ))}
      </div>

      <h1 className="text-3xl text-center w-full mt-10">Our Therapists</h1>
      <hr className="border-2 border-green-primary-1 rounded-full  my-2 w-36 mx-auto" />
      <OurTherapists />
      
    </div>
  );
};

export default HomePage;
