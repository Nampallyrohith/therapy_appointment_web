import { Button } from "@chakra-ui/react";
import React from "react";

interface buttonProps {
  buttonText: string;
  onClick?: () => void;
}

const ActionButton: React.FC<buttonProps> = ({ buttonText, onClick }) => {
  return (
    <Button
      type="submit"
      className="bg-orange-primary-1 text-white px-10 tracking-wider rounded-lg shadow-inset"
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};

export default ActionButton;
