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
    <div className="grid grid-cols-2 grid-row-1 items-center gap-10 my-auto px-60 py-10 w-full">
      <Image
        src={image}
        alt={name + "image"}
        className={`${id % 2 === 0 && "order-2"} rounded-lg`}
      />
      <div className="space-y-4">
        <h1 className="text-2xl">{name}</h1>
        <p>{about}</p>
        <ActionButton buttonText="Book Therapy" />
      </div>
    </div>
  );
};

export default AboutTherapyCard;
