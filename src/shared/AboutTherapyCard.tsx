import { therapyType } from "@/models/typeDefinitions";
import { Image } from "@chakra-ui/react";
import React from "react";
import ActionButton from "./ActionButton";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { useNavigate } from "react-router-dom";
import { ourTherapiesList } from "@/mock-data/staticData";

interface therapyCardProps {
  therapy: therapyType;
}

const AboutTherapyCard: React.FC<therapyCardProps> = ({ therapy }) => {
  const { name, about, image, id } = therapy;
  const { setSelectedTherapy, setSelectedDoctor } = useAppointmentContext();
  const navigate = useNavigate();

  const handleBookTherapy = () => {
    setSelectedTherapy(id);
    setSelectedDoctor("");
    window.scrollTo(0, 0);
    navigate("/user/book-appointment");
  };

  const isEvenIndex = (id: string): boolean => {
    const index = ourTherapiesList.findIndex((therapy) => therapy.id === id);
    return index !== -1 && index % 2 !== 0;
  };

  return (
    <div className="lg:grid lg:grid-cols-2 items-center md:w-3/4 mx-auto gap-10 lg:px-60 px-14 py-8 lg:w-full">
      <Image
        src={image}
        alt={name + "image"}
        className={`${
          isEvenIndex(id) && "order-2"
        } rounded-lg  md:mx-auto my-3 lg:my-0`}
      />
      <div className="space-y-4 text-center lg:text-left">
        <h1 className="text-2xl">{name}</h1>
        <p className="text-sm lg:text-base text-green-primary-1">{about}</p>
        <ActionButton buttonText="Book Therapy" onClick={handleBookTherapy} />
      </div>
    </div>
  );
};

export default AboutTherapyCard;
