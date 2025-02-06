import { useAppointmentContext } from "@/context/AppointmentContext";
import { useNavigate } from "react-router-dom";

export const convertToISO8601 = (
  date: string,
  time: string,
  addHour?: number
): string => {
  const dateAndTimeString = `${date}T${time}:00`;
  const dateTime = new Date(dateAndTimeString);

  if (addHour) {
    dateTime.setHours(dateTime.getHours() + addHour);
  }

  return dateTime.toISOString();
};

export const useBookAppointment = () => {
  const { selectedTherapy, setSelectedTherapy } = useAppointmentContext();
  const navigate = useNavigate();

  return () => {
    if (selectedTherapy) {
      setSelectedTherapy("");
    }
    navigate("/user/book-appointment");
  };
};
