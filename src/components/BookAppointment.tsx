import { Tooltip } from "@/components/ui/tooltip";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { env, supabaseClient } from "@/supabase/connection";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuInfo } from "react-icons/lu";
import { Input, Textarea } from "@chakra-ui/react";
import { convertISTTOUTC } from "./utils/commonFunction";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { GoAlertFill } from "react-icons/go";
import { useFetchData } from "@/hooks/apiCall";
import { DateType, Doctor, TimeType } from "@/models/typeDefinitions";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/shared/Loader";
import { ThreeDot } from "react-loading-indicators";
import { DatePicker } from "rsuite";
import "rsuite/DatePicker/styles/index.css";

const TherapyOptions = {
  behavioural: "Behavioural Therapy",
  psychodynamic: "Psychodynamic Therapy",
  cognitiveBehavioural: "Cognitive Behavioral Therapy",
  humanistic: "Humanistic Therapy",
};

interface Therapy {
  id: string;
  therapyName: string;
}

type TherapyKeys = keyof typeof TherapyOptions;

interface FormInputs {
  therapy: TherapyKeys;
  doctor: number | null;
  date: string;
  time: string;
  eventDescription: string;
}

const BookAppointment: React.FC = () => {
  // const [guests, setGuests] = useState<string[]>([""]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, selectedTherapy, selectedDoctor } = useAppointmentContext();

  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      therapy: "" as TherapyKeys,
      doctor: null,
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

  // API's Call
  const {
    data: therapiesResult,
    call: TherapyAPICaller,
    loading,
  } = useFetchData<{
    therapies: Therapy[];
  }>();

  const { data: doctorsResult, call: DoctorsAPICaller } = useFetchData<{
    doctors: Doctor[];
  }>();

  const { data: dateResult, call: DateAPICaller } = useFetchData<{
    date: DateType;
  }>();

  const { data: timeResult, call: TimeAPICaller } = useFetchData<{
    time: TimeType;
  }>();

  const {
    data: insertResult,
    call: CreateEventAPICaller,
    loading: createEventLoading,
  } = useFetchData<{
    message: string;
    error: string;
  }>();

  useEffect(() => {
    const getTherapies = async () => {
      await TherapyAPICaller("user/appointment/therapies");
    };
    getTherapies();
  }, []);

  useEffect(() => {
    if (activeTherapy) {
      getDoctors();
    }
  }, [activeTherapy]);

  useEffect(() => {
    if (activeDoctor) {
      getDate();
      setValue("date", "");
      setValue("time", "");
    }
  }, [activeDoctor]);

  useEffect(() => {
    if (meetingDate) {
      getTime();
      setValue("time", "");
      setValue("eventDescription", "");
    }
  }, [meetingDate]);

  const getDoctors = async () => {
    await DoctorsAPICaller(`user/appointment/${activeTherapy}/doctors`);
  };

  const getDate = async () => {
    await DateAPICaller(`user/appointment/${activeDoctor}/available_date`);
  };

  const getTime = async () => {
    await TimeAPICaller(
      `user/appointment/${activeDoctor}/available_time?date=${meetingDate}`
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.dob && !user?.gender && !user?.phone) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user]);

  useEffect(() => {
    if (selectedTherapy) {
      setValue("therapy", selectedTherapy as TherapyKeys);
      if (selectedDoctor) {
        setValue("doctor", selectedDoctor);
      }
    }
  }, [selectedTherapy, selectedDoctor, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await createEventWithGuestsAndReminders(data);
  };

  useEffect(() => {
    if (insertResult?.message) {
      toast.success("Appointment created successfully.", {
        duration: 3000,
        style: {
          backgroundColor: "#1f5d5d",
          color: "#fff",
          fontWeight: 700,
        },
      });
      // After 3 seconds it'll navigate
      setTimeout(() => {
        navigate("/user/my-appointments");
      }, 3000);
    }
  }, [insertResult, navigate]);

  const createEventWithGuestsAndReminders = async (
    eventDetails: FormInputs
  ) => {
    const requestId = Date.now().toString();
    const doctor =
      doctorsResult &&
      doctorsResult?.doctors.find((doc) => doc.id === Number(activeDoctor));
    const event = {
      summary: user?.name + " is scheduled with " + doctor?.name,
      description: eventDetails.eventDescription,
      start: {
        dateTime: convertISTTOUTC(eventDetails.date, eventDetails.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: convertISTTOUTC(eventDetails.date, eventDetails.time, 1),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [
        { email: user?.email },
        { email: doctor?.email },
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
      colorId: "3",
    };

    const { data } = await supabaseClient.auth.getSession();
    const accessToken = data.session?.provider_token;
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
    const responseData = await response.json();
    if (responseData.error) {
      toast.error(responseData.error.errors[0].message, {
        duration: 3000,
        style: { backgroundColor: "#eb5766", color: "#fff", fontWeight: 700 },
      });
      return;
    }

    const therapy = therapiesResult?.therapies.find(
      (therapy) => therapy.id === activeTherapy
    );

    if (response.ok) {
      console.log(responseData.hangoutLink);
      const body = {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        hangoutLink: responseData.hangoutLink,
        doctorId: doctor?.id,
        eventId: responseData.id,
        therapyType: therapy?.therapyName,
      };
      console.log("event:", body);

      await CreateEventAPICaller(
        `user/appointment/create-event/${user?.googleUserId}`,
        "POST",
        body
      );
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
      <div className="grid md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-6 mt-6 mb-6">
        {therapiesResult &&
          therapiesResult.therapies.map((therapy: Therapy) => (
            <label
              key={therapy.id}
              className={`lg:min-w-[35%] md:min-w-1/2 p-3 rounded-xl shadow-inset cursor-pointer flex justify-center items-center gap-2
                ${
                  activeTherapy === therapy.id
                    ? "bg-[#2CC3B4] text-white"
                    : "bg-[#AAE9E3] text-green-primary-1"
                }`}
              htmlFor={therapy.id}
            >
              <input
                type="radio"
                id={therapy.id}
                value={therapy.id}
                {...register("therapy")}
                className="hidden"
              />
              <span className="text-sm">{therapy.therapyName}</span>
            </label>
          ))}
      </div>
    </>
  );

  const renderDoctorOptions = () => (
    <div className="bg-[#CBF6EF] w-3/4 px-6 py-4 my-4 shadow-inset rounded-3xl">
      <h1 className="text-green-primary-1 text-lg">Select Doctor</h1>
      <div className="flex gap-6 flex-wrap justify-center mt-6 mb-6">
        {doctorsResult &&
          doctorsResult.doctors.map((doctor) => (
            <label
              key={doctor.id}
              className={`bg-white text-[#2CC3B4] min-w-full md:min-w-[60%] lg:min-w-[40%] px-5 py-1 rounded-xl shadow-inset-2 cursor-pointer flex justify-between items-center gap-2
                  ${
                    Number(activeDoctor) === doctor.id
                      ? "border-2 border-green-primary-1"
                      : ""
                  }`}
              htmlFor={doctor.name}
            >
              <img
                src={doctor.avatarUrl}
                alt="doc-avatar"
                className="w-[40px] border-2 border-green-primary-1 rounded-full"
              />
              <Input
                type="radio"
                id={doctor.name}
                {...register("doctor")}
                value={doctor.id}
                name="doctor"
                className="hidden"
              />
              <span className="text-sm text-left w-full">{doctor.name}</span>
              <Tooltip
                showArrow
                content={`${doctor.name} specialized in ${
                  TherapyOptions[activeTherapy as TherapyKeys]
                }`}
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

  const renderDateAndTimeSection = () => {
    const disabledDate = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const twentyDaysLater = new Date();
      twentyDaysLater.setDate(today.getDate() + 20);

      const formattedDate = date.toLocaleDateString("en-CA");
      const leaveDates = dateResult?.date?.leaveDates || [];

      return (
        date < today ||
        date > twentyDaysLater ||
        date.getDay() === 0 ||
        leaveDates.includes(formattedDate)
      );
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-CA");
    };

    return (
      <div className="bg-[#CBF6EF] w-3/4 py-8 px-6 my-4 flex flex-col items-center justify-center gap-4 shadow-inset rounded-3xl">
        <h1 className="text-lg text-green-primary-1">
          Select meeting date & time
        </h1>
        <p className="text-green-primary-1 text-xs mb-4">
          (Please note that you can only select available time slots)
        </p>
        <div className="w-full flex flex-col md:flex-row justify-center gap-6">
          <DatePicker
            format="yyyy-MM-dd"
            shouldDisableDate={disabledDate}
            className="custom-datepicker"
            {...register("date")}
            onChange={(date) => setValue("date", date ? formatDate(date) : "")}
            oneTap
          />
          <select
            value={meetingTime}
            {...register("time")}
            className="border-0 text-green-primary-1 outline-none rounded-xl min-w-full sm:min-w-[40%] p-2 shadow-inset-2"
          >
            <option value="" className="text-green-primary-1" disabled>
              Select time
            </option>
            {timeResult?.time?.availableTimeSlots?.map((timeSlot) => (
              <option
                key={timeSlot}
                value={timeSlot}
                className="text-green-primary-1"
              >
                {timeSlot}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

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
        disabled={eventDescription.length < 100 || createEventLoading}
        className="bg-green-primary-1 text-white shadow-inset px-12 mt-8 mb-8 rounded-3xl"
      >
        {createEventLoading ? (
          <ThreeDot easing="ease-in" size="small" color="#fff" />
        ) : (
          " Book Event"
        )}
      </Button>
      <p className="text-[#2CC3B4] text-xs mb-20 w-11/12 md:w-3/4">
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
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            ariaHideApp={false}
            contentLabel="Incomplete Profile Warning"
            className="bg-white text-green-primary-1 flex flex-col outline-0 rounded-md shadow-lg px-4 py-10 relative"
            style={{
              content: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "400px",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(2px)",
                zIndex: 1000,
              },
            }}
          >
            <div className="w-full flex flex-col justify-center space-y-4 items-center">
              <GoAlertFill size={80} fill="#FF9F1C" className="animate-shake" />
              <p className="text-sm text-center mb-4">
                Please complete your profile to proceed smoothly with therapy
                selection.
              </p>
              <Link
                to="/user/profile"
                className="bg-green-primary-1 text-white text-xs px-6 py-3 border-radius rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Go to Profile Page
              </Link>
            </div>
          </Modal>
        )}
        {loading ? (
          <Loader />
        ) : (
          <>
            {renderTherapyOptions()}
            {activeTherapy && renderDoctorOptions()}
            {activeDoctor && renderDateAndTimeSection()}
            {meetingDate && meetingTime && renderDescriptionAndBookButton()}
          </>
        )}
      </form>

      <Toaster position="bottom-right" />
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
