import { Button } from "@chakra-ui/react";
import React from "react";

interface ButtonProps {
  buttonText: string;
  id: string;
  filter: string;
  onClickEvent: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FilterButton: React.FC<ButtonProps> = ({
  buttonText,
  id,
  filter,
  onClickEvent,
}) => {
  return (
    <Button
      id={id}
      className={`text-xs shadow-inset p-6 rounded-lg font-[400] w-4/5 md:w-1/3 lg:w-1/4 ${
        filter === id ? "bg-green-primary-1 text-white" : "bg-[#FDF8EF]"
      }`}
      onClick={onClickEvent}
    >
      {buttonText}
    </Button>
  );
};

export default FilterButton;
