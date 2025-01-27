import { useAppointmentContext } from "@/context/AppointmentContext";
import { ourTherapiesList } from "@/mock-data/staticData";
import AboutTherapyCard from "@/shared/AboutTherapyCard";
import Banner from "@/shared/Banner";
import Loader from "@/shared/Loader";
import OurTherapists from "@/shared/OurTherapists";

const HomePage = () => {
  const { user } = useAppointmentContext();

  return (
    <div className="w-full h-full flex flex-col justify-around items-start">
      {!user ? (
        <Loader />
      ) : (
        <>
          <Banner />
          <h1 className="text-3xl text-center w-full mt-10">About Therapies</h1>
          <hr className="border-2 border-green-primary-1 rounded-full  mt-2 w-36 mx-auto" />
          <div className="w-full grid grid-cols-1 items-start lg:grid-cols-1 gap-5">
            {ourTherapiesList.map((therapy) => (
              <AboutTherapyCard key={therapy.id} therapy={therapy} />
            ))}
          </div>

          <h1 className="text-3xl text-center w-full mt-10">Our Therapists</h1>
          <hr className="border-2 border-green-primary-1 rounded-full  my-2 w-36 mx-auto" />
          <OurTherapists />
        </>
      )}
    </div>
  );
};

export default HomePage;
