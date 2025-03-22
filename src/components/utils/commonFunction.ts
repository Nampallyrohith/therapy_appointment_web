import { useAppointmentContext } from "@/context/AppointmentContext";
import { useNavigate } from "react-router-dom";

export const convertISTTOUTC = (
  date: string,
  time: string,
  addHour?: number
): string => {
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
  const dateTimeString = `${date}T${hour
    .toString()
    .padStart(2, "0")}:${minutes}:00`;
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

export const parseDate = (dateString: string) => {
  // Converts date from this format "19/03/2025 11:00AM" to a suitable format
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hour, minute] = timePart.slice(0, -2).split(":");
  const ampm = timePart.slice(-2).toUpperCase();

  let adjustedHour = parseInt(hour, 10);
  if (ampm === "PM" && adjustedHour !== 12) {
    adjustedHour += 12;
  } else if (ampm === "AM" && adjustedHour === 12) {
    adjustedHour = 0;
  }

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    adjustedHour,
    parseInt(minute, 10)
  );
};
