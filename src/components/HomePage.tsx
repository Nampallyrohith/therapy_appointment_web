import { useFetchData } from "@/hooks/apiCall";
import { ourTherapiesList } from "@/mock-data/staticData";
import { Doctor } from "@/models/typeDefinations";
import AboutTherapyCard from "@/shared/AboutTherapyCard";
import Banner from "@/shared/Banner";
import OurTherapists from "@/shared/OurTherapists";
import { useEffect } from "react";

const HomePage = () => {
  const { call: AllDoctorsAPICaller, data: therapistsResult } = useFetchData<{
    doctors: Doctor[];
  }>();

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    await AllDoctorsAPICaller(`user/appointment/doctors`, "GET");
  };
  return (
    <div className="w-full h-full flex flex-col justify-around items-start">
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
        {therapistsResult && (
          <OurTherapists Therapists={therapistsResult.doctors} />
        )}

        {/* TODO: Review component (displaing the review of users) */}
      </>
    </div>
  );
};

export default HomePage;
