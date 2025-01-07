import { therapyType } from "@/models/typeDefinations";
import { Image } from "@chakra-ui/react";
import React from "react";
import ActionButton from "./ActionButton";

interface therayCardProps {
  therapy: therapyType;
}

const AboutTherapyCard: React.FC<therayCardProps> = ({ therapy }) => {
  const { name, about, image, id } = therapy;
  return (
    <div className="lg:grid lg:grid-cols-2 items-center md:w-3/4 mx-auto gap-10 lg:px-60 px-14 py-8 lg:w-full">
      <Image
        src={image}
        alt={name + "image"}
        className={`${id % 2 === 0 && "order-2"} rounded-lg  md:mx-auto my-3 lg:my-0`}
      />
      <div className="space-y-4 text-center lg:text-left">
        <h1 className="text-2xl">{name}</h1>
        <p className="text-sm lg:text-base">{about}</p>
        <ActionButton buttonText="Book Therapy" />
      </div>
    </div>
  );
};

export default AboutTherapyCard;
