// import { Input } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState } from "react";
// import { DatePicker } from "@orange_digital/chakra-datepicker";
import { Button } from "./ui/button";
import { supabaseClient } from "@/supabase/connection";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuInfo } from "react-icons/lu";
import avatar from "@/assets/images/doctor-avatar.png";

const TherapyOptions = {
  behavioural: "Behavioural Therapy",
  psychodynamic: "Psychodynamic Therapy",
  cognitiveBehavioural: "Cognitive Behavioral Therapy",
  humanistic: "Humanistic Therapy",
};

const DoctorOptions = {
  doctor1: {
    name: "Doctor Name 1",
    avatar: avatar,
  },
  doctor2: {
    name: "Doctor Name 2",
    avatar: avatar,
  },
  doctor3: {
    name: "Doctor Name 3",
    avatar: avatar,
  },
  doctor4: {
    name: "Doctor Name 4",
    avatar: avatar,
  },
};

type TherapyKeys = keyof typeof TherapyOptions;

type DoctorKeys = keyof typeof DoctorOptions;

interface FormInputs {
  therapy: TherapyKeys;
  doctor: DoctorKeys;
}

const BookAppointment: React.FC = () => {
  const [activeTherapy, setActiveTherapy] = useState<TherapyKeys | "">("");
  const [activeDoctor, setActiveDoctor] = useState<DoctorKeys | "">("");
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  // const [guests, setGuests] = useState<string[]>([""]);
  const [eventDescription, setEventDescription] = useState<string>("");

  const { register, handleSubmit } = useForm<FormInputs>();
  // TODO: Add onSubmit functionality
  const onSubmit: SubmitHandler<FormInputs> = () => {};

  const createEventWithGuestsAndReminders = async () => {
    const requestId = Date.now().toString();
    console.log(requestId);
    const event = {
      summary: "Testing2",
      description: "Temperory meeting checkup testing",
      start: {
        dateTime: "2025-01-18T06:00:00-07:00", // Start time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: "2025-01-18T08:00:00-07:00", // End time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //Asia/Kolkata
      },
      attendees: [
        { email: "rohithnampelly123@gmail.com" },
        { email: "lokesh.pasam29@gmail.com" },
      ],
      reminders: {
        useDefault: false, // Set to true if you want default reminders
        overrides: [
          { method: "email", minutes: 24 * 60 }, // Reminder 1 day before
          { method: "popup", minutes: 10 }, // Popup reminder 10 minutes before
        ],
      },
      // Google meet
      conferenceData: {
        createRequest: {
          requestId: requestId, // Replace with a unique string
          conferenceSolutionKey: {
            type: "hangoutsMeet", // Specifies Google Meet
          },
        },
      },
    };

    try {
      const { data } = await supabaseClient.auth.getSession();
      console.log("data:", data);
      const accessToken = data.session?.provider_token;
      console.log(accessToken);
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add a space after 'Bearer'
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );
      console.log(response);
      const responseData = await response.json();
      if (response.ok) {
        console.log("Event created successfully:", responseData);
        console.log(responseData.hangoutLink);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // const handleGuestInput = () => {
  //   setGuests([...guests, ""]);
  // };
  // const handleGuestChange = (index: number, value: string) => {
  //   const updatedGuests = guests.map((guest, i) =>
  //     i === index ? value : guest
  //   );
  //   setGuests(updatedGuests);
  // };

  // Renders
  const renderTherapyOptions = () => (
    <>
      <h1 className="text-green-primary-1 text-lg">Select Therapy</h1>
      <div
        {...register("therapy")}
        className="flex gap-6 flex-wrap justify-center mt-6 mb-6"
      >
        {Object.entries(TherapyOptions).map(([id, name]) => (
          <label
            key={id}
            className={`min-w-[70%] sm:min-w-[80%] md:min-w-[40%] p-3 rounded-xl shadow-inset cursor-pointer flex justify-center items-center gap-2
                ${
                  activeTherapy === id
                    ? "bg-[#2CC3B4] text-white"
                    : "bg-[#AAE9E3] text-green-primary-1"
                }`}
            htmlFor={id}
          >
            <input
              type="radio"
              id={id}
              value={id}
              name="therapy"
              className="hidden"
              onChange={() => setActiveTherapy(id as TherapyKeys)}
            />
            <span className="text-sm">{name}</span>
          </label>
        ))}
      </div>
    </>
  );

  const renderDoctorOptions = () => (
    <div className="bg-[#CBF6EF] w-3/4 px-6 py-4 my-4 shadow-inset rounded-3xl">
      <h1 className="text-green-primary-1 text-lg">Select Doctor</h1>
      <div
        {...register("doctor")}
        className="flex gap-6 flex-wrap justify-center mt-6 mb-6"
      >
        {Object.entries(DoctorOptions).map(([id, { name, avatar }]) => (
          <label
            key={id}
            className={`bg-white text-[#2CC3B4] min-w-[80%] md:min-w-[40%] px-2 py-1 rounded-xl shadow-inset-2 cursor-pointer flex justify-center items-center gap-2
                ${
                  activeDoctor === id ? "border-2 border-green-primary-1" : ""
                }`}
            htmlFor={id}
          >
            <img src={avatar} alt="doc-avatar" className="w-[40px]" />
            <input
              type="radio"
              id={id}
              value={id}
              name="doctor"
              className="hidden"
              onChange={() => setActiveDoctor(id as DoctorKeys)}
            />
            <span className="text-sm">{name}</span>
            <Tooltip
              showArrow
              content={`${
                DoctorOptions[id as DoctorKeys].name
              } specialized in ${TherapyOptions[activeTherapy as TherapyKeys]}`}
              contentProps={{
                css: {
                  "--tooltip-bg": "#F5DEBF",
                  color: "#4E3C22",
                  padding: "4px",
                },
              }}
              positioning={{ offset: { mainAxis: -2, crossAxis: 4 } }}
              openDelay={500}
              closeDelay={100}
            >
              <Button size="xs" variant="outline">
                <LuInfo />
              </Button>
            </Tooltip>
          </label>
        ))}
      </div>
    </div>
  );

  const renderDateAndTimeSection = () => (
    <div className="bg-[#CBF6EF] w-3/4 py-8 px-6 my-4 flex flex-col items-center justify-center gap-4 shadow-inset rounded-3xl">
      <h1 className="text-lg text-green-primary-1">
        Select meeting date & time
      </h1>
      <p className="text-green-primary-1 text-xs mb-4">
        (Please note that you can only select available time slots)
      </p>
      <div className="w-full flex flex-wrap justify-center gap-6">
        <input
          type="date"
          value={meetingDate}
          onChange={(event) => setMeetingDate(event.target.value)}
          className="text-green-primary-1 border-0 rounded-xl min-w-full sm:min-w-[40%] p-3 shadow-inset-2"
        />
        <input
          type="time"
          value={meetingTime}
          onChange={(event) => setMeetingTime(event.target.value)}
          className="text-green-primary-1 border-0 rounded-xl min-w-full sm:min-w-[40%] p-3 shadow-inset-2"
        />
      </div>
    </div>
  );

  const renderDescriptionAndBookButton = () => (
    <>
      <div className="bg-[#CBF6EF] w-3/4 py-8 px-6 my-4 flex flex-col justify-center gap-3 shadow-inset rounded-3xl">
        <h1 className="text-lg text-green-primary-1">Description</h1>
        <p className="text-green-primary-1 text-xs mb-4">
          (Provide us with some detailed description of your issues so the
          consultant understands you better)
        </p>
        <textarea
          rows={4}
          value={eventDescription}
          onChange={(event) => setEventDescription(event.target.value)}
          className="text-black px-6 py-4 border-0 rounded-xl w-full shadow-inset-2 outline-0"
        ></textarea>
      </div>
      {/* TODO: Integrate createEvent functionality on clicking the Book Event button */}
      <Button
        type="submit"
        onClick={createEventWithGuestsAndReminders}
        disabled={eventDescription === ""}
        className="bg-green-primary-1 text-white shadow-inset px-12 mt-8 mb-8 rounded-3xl"
      >
        Book Event
      </Button>
      <p className="text-[#2CC3B4] text-xs mb-20 max-w-60">
        * After clicking on "Book Event", you will be sent an email regarding
        the appointment that has been created
      </p>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-[#FDF8EF] flex flex-col justify-start items-center pt-28 md:px-6 shadow-inset">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-center flex flex-col items-center"
      >
        {renderTherapyOptions()}
        {activeTherapy && renderDoctorOptions()}
        {activeDoctor && renderDateAndTimeSection()}
        {meetingDate && meetingTime && renderDescriptionAndBookButton()}
      </form>
      {/* <div>
        Necessary
        <p>Add Guest to join</p>
        <Button type="button" onClick={handleGuestInput}>
          Add guest
        </Button>
        {guests.map((guest, index) => (
          <Input
            key={index}
            value={guest}
            onChange={(e) => handleGuestChange(index, e.target.value)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default BookAppointment;
