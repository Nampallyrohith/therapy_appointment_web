import { useAppointmentContext } from "@/context/AppointmentContext";
import { useNavigate } from "react-router-dom";

export const convertISTTOUTC = (date: string, time: string, addHour?: number): string => {
  // Parse time in 12-hour format (e.g., "10:00AM")
  const timeRegex = /^(\d{1,2}):(\d{2})(AM|PM)$/;
  const match = time.match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format");
  }

  let [_, hours, minutes, ampm] = match;
  let hour = parseInt(hours, 10);

  // Convert to 24-hour format
  if (ampm === "PM" && hour !== 12) {
    hour += 12;
  }
  if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  // Create Date object in local time
  const dateTimeString = `${date}T${hour.toString().padStart(2, "0")}:${minutes}:00`;
  const localDate = new Date(dateTimeString);

  // Convert local date to UTC
  const utcDate = new Date(localDate.toISOString());

  if (addHour) {
    utcDate.setUTCHours(utcDate.getUTCHours() + addHour);
  }

  return utcDate.toISOString();
};


export const useBookAppointment = () => {
  const {
    selectedTherapy,
    setSelectedTherapy,
    selectedDoctor,
    setSelectedDoctor,
  } = useAppointmentContext();
  const navigate = useNavigate();

  return () => {
    if (selectedTherapy) {
      setSelectedTherapy("");
    }
    if (selectedDoctor) {
      setSelectedDoctor(null);
    }
    navigate("/user/book-appointment");
  };
};
