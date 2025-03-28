import { useFetchData } from "@/hooks/apiCall";
import { ourTherapiesList } from "@/mock-data/staticData";
import { Doctor } from "@/models/typeDefinitions";
import AboutTherapyCard from "@/shared/AboutTherapyCard";
import Banner from "@/shared/Banner";
import OurTherapists from "@/shared/OurTherapists";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const {
    call: AllDoctorsAPICaller,
    data: therapistsResult,
    loading: therapistLoading,
  } = useFetchData<{
    doctors: Doctor[];
  }>();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/user/home") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    await AllDoctorsAPICaller(`doctors`);
  };
  return (
    <div className="w-full h-full flex flex-col justify-around items-start">
      <>
        <Banner />
        <h1 className="text-3xl text-center w-full mt-10">About Therapies</h1>
        <hr className="border-2 border-green-primary-1 rounded-full mt-2 w-36 mx-auto" />
        <div className="w-full grid grid-cols-1 items-start lg:grid-cols-1 gap-5">
          {ourTherapiesList.map((therapy) => (
            <AboutTherapyCard key={therapy.id} therapy={therapy} />
          ))}
        </div>

        <h1 className="text-3xl text-center w-full mt-10">Our Therapists</h1>
        <hr className="border-2 border-green-primary-1 rounded-full  my-2 w-36 mx-auto" />
        {therapistsResult && (
          <OurTherapists
            Therapists={therapistsResult.doctors}
            loading={therapistLoading}
          />
        )}
        {/* TODO: Review component (displaying the review of users),
            Approach: Take all user ratings of this particular doctor into an array,
            take the average of the array and display it as a badge/field in doctor card
            Ex: Average rating: 4.6 */}
      </>
    </div>
  );
};

export default HomePage;
