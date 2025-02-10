// import { Input } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useEffect } from "react";
// import { DatePicker } from "@orange_digital/chakra-datepicker";
import { Button } from "./ui/button";
import { env, supabaseClient } from "@/supabase/connection";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuInfo } from "react-icons/lu";
import avatar from "@/assets/images/doctor-avatar.png";
import { Input, Textarea } from "@chakra-ui/react";
import { convertToISO8601 } from "./utils/commonFunction";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { Therapists } from "@/mock-data/staticData";

const TherapyOptions = {
  behavioural: "Behavioural Therapy",
  psychodynamic: "Psychodynamic Therapy",
  cognitiveBehavioural: "Cognitive Behavioral Therapy",
  humanistic: "Humanistic Therapy",
};

const DoctorOptions = Therapists.reduce((acc, therapist) => {
  acc[therapist.id] = {
    name: therapist.name,
    avatar: avatar,
  };
  return acc;
}, {} as Record<string, { name: string; avatar: string }>);

type TherapyKeys = keyof typeof TherapyOptions;

type DoctorKeys = keyof typeof DoctorOptions;

interface FormInputs {
  therapy: TherapyKeys;
  doctor: DoctorKeys;
  date: string;
  time: string;
  eventDescription: string;
}

const BookAppointment: React.FC = () => {
  // const [guests, setGuests] = useState<string[]>([""]);
  const { user, selectedTherapy, selectedDoctor } = useAppointmentContext();

  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      therapy: "" as TherapyKeys,
      doctor: "" as DoctorKeys,
      date: "",
      time: "",
      eventDescription: "",
    },
  });

  const [
    activeTherapy,
    activeDoctor,
    meetingDate,
    meetingTime,
    eventDescription,
  ] = watch(["therapy", "doctor", "date", "time", "eventDescription"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (selectedTherapy) {
      setValue("therapy", selectedTherapy as TherapyKeys);
      if (selectedDoctor) {
        setValue("doctor", selectedDoctor as DoctorKeys);
      }
    }
  }, [selectedTherapy, selectedDoctor, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log("data", data);
    await createEventWithGuestsAndReminders(data);
  };

  const createEventWithGuestsAndReminders = async (
    eventDetails: FormInputs
  ) => {
    const requestId = Date.now().toString();
    console.log(requestId);
    const event = {
      summary: user?.name + " is scheduled with " + eventDetails.doctor,
      description: eventDetails.eventDescription,
      start: {
        dateTime: convertToISO8601(eventDetails.date, eventDetails.time), // Start time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: convertToISO8601(eventDetails.date, eventDetails.time, 1), // End time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //Asia/Kolkata
      },
      // TODO: Add doctors email further
      attendees: [
        { email: "rohithnampelly57@gmail.com" },
        { email: env.VITE_DEFAULT_THERAPY_EMAIL as string },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
      // Google meet
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };
    console.log("event", event);

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
            Authorization: `Bearer ${accessToken}`,
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
      <div className="flex gap-6 flex-wrap justify-center mt-6 mb-6">
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
              {...register("therapy")}
              className="hidden"
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
      {/* TODO: Dynamically update doctor list based on selected therapy
                retrieve only doctors who have specialisationId as the
                current selected therapy option */}
      <div className="flex gap-6 flex-wrap justify-center mt-6 mb-6">
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
            <Input
              type="radio"
              id={id}
              {...register("doctor")}
              value={id}
              name="doctor"
              className="hidden"
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
      <div className="w-full flex flex-col md:flex-row justify-center gap-6">
        <Input
          type="date"
          {...register("date")}
          value={meetingDate}
          className="text-green-primary-1 border-0 rounded-xl min-w-full sm:min-w-[40%] p-3 shadow-inset-2"
        />
        <Input
          type="time"
          value={meetingTime}
          {...register("time")}
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
        <Textarea
          rows={4}
          minLength={100}
          maxLength={1000}
          value={eventDescription}
          {...register("eventDescription")}
          className="text-green-primary-1 px-6 py-4 border-0 rounded-xl w-full shadow-inset-2 outline-0"
        ></Textarea>
        <div className="text-right text-xs text-green-primary-1">
          {eventDescription.length}/1000
        </div>
      </div>
      <Button
        type="submit"
        disabled={eventDescription.length < 100}
        className="bg-green-primary-1 text-white shadow-inset px-12 mt-8 mb-8 rounded-3xl"
      >
        Book Event
      </Button>
      <p className="text-[#2CC3B4] text-xs mb-20">
        *After clicking on "Book Event", you will be sent an email regarding the
        appointment that has been created
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
