import FilterButton from "@/shared/FilterButton";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { RiShareForward2Fill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { Appointment, AppointmentFilterProps } from "@/models/typeDefinitions";
import { Button } from "@chakra-ui/react";
import { useFetchData } from "@/hooks/apiCall";
import { useAppointmentContext } from "@/context/AppointmentContext";
import emptyBox from "@/assets/images/empty-box.png";
import Loader from "@/shared/Loader";
import { parseDate } from "./utils/commonFunction";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { RatingGroup } from "@chakra-ui/react";
import { supabaseClient } from "@/supabase/connection";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarGroup } from "@chakra-ui/react";

const emojiMap: Record<string, string> = {
  1: "😡",
  2: "😖",
  3: "😐",
  4: "😊",
  5: "😍",
};

export const filterDetails: AppointmentFilterProps[] = [
  {
    filterId: "upcoming",
    filterButtonText: "Upcoming Appointments",
  },
  {
    filterId: "cancelled",
    filterButtonText: "Cancelled Appointments",
  },
  {
    filterId: "previous",
    filterButtonText: "Previous Appointments",
  },
];

const MyAppointmentsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("upcoming");
  // For appointment specific modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isWithin10Minutes, setIsWithin10Minutes] = useState<boolean>(false);
  // For cancel appointment
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  // For attendance of appointment
  const [activeAttendanceAppointment, setActiveAttendanceAppointment] =
    useState<Appointment | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] =
    useState<boolean>(false);
  const [modalStep, setModalStep] = useState<string>("attendance");
  const [feedback, setFeedback] = useState<{
    doctorRating: number;
    doctorFeedback: string;
    meetFeedback: string;
  }>({ doctorRating: 3, doctorFeedback: "", meetFeedback: "" });
  const [absentReason, setAbsentReason] = useState<string>("");

  const { user } = useAppointmentContext();
  const {
    data: appointmentsResult,
    call: AppointmentAPICaller,
    loading,
  } = useFetchData<{
    appointments: Appointment[];
  }>();

  const { call: CancelAPICaller } = useFetchData();
  const { call: UpdateAttendedFlagCaller } = useFetchData();
  const { call: PostAppointmentFeedbackCaller } = useFetchData();
  const { call: PostAbsentReasonCaller } = useFetchData();
  const { call: UpdateCancellAppointmentAPICaller } = useFetchData();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/user/my-appointments") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const getAppointments = async () => {
    await AppointmentAPICaller(`user/my-appointments/${user?.googleUserId}`);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    const checkAppointmentInGoogleCalendar = async () => {
      const filteredAppointments = appointmentsResult?.appointments.filter(
        (eachAppointment) => eachAppointment.status === filter
      );
      if (filter === "upcoming") {
        if (!filteredAppointments?.length) return;

        // Fetch all appointment data
        const appointmentDetails = await Promise.all(
          filteredAppointments.map((appointment) =>
            fetchAppointmentByEventId(appointment.eventId)
          )
        );

        // Check for cancelled appointments and update them
        for (const [index, appointment] of appointmentDetails.entries()) {
          if (appointment.status === "cancelled") {
            console.log(
              `Updating status of appointment ID ${filteredAppointments[index].eventId} to 'cancelled'`
            );

            // API call to update status
            await UpdateCancellAppointmentAPICaller(
              `user/upcoming-cancelled/cancel/${filteredAppointments[index].eventId}`,
              "PUT"
            );
            await getAppointments();
          }
        }
      }
    };
    checkAppointmentInGoogleCalendar();
  }, [filter]);

  useEffect(() => {
    if (!selectedAppointment?.startTime) return;

    const startTime = parseDate(selectedAppointment.startTime);
    const thresholdTime = startTime.getTime() - 10 * 60 * 1000;
    const now = Date.now();

    setIsWithin10Minutes(now >= thresholdTime);

    if (now < thresholdTime) {
      const timeout = setTimeout(
        () => setIsWithin10Minutes(true),
        thresholdTime - now
      );
      return () => clearTimeout(timeout);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    const now = new Date();

    appointmentsResult?.appointments.forEach((appointment) => {
      const endTime = parseDate(appointment.endTime);
      const showModalTime = new Date(endTime.getTime());

      if (
        now >= showModalTime &&
        appointment["status"] !== "cancelled" &&
        "attended" in appointment &&
        appointment["attended"] === null &&
        appointment["attendedModalDismissed"] === false
      ) {
        setActiveAttendanceAppointment(appointment);
        setIsAttendanceModalOpen(true);
      }
    });
  }, [appointmentsResult?.appointments]);

  const fetchAppointmentByEventId = async (eventId: string) => {
    const { data } = await supabaseClient.auth.getSession();
    const accessToken = data.session?.provider_token;
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?conferenceDataVersion=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const responseData = response.json();
    console.log(responseData);
    return responseData;
  };

  const onFilterChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilter(event.currentTarget.id);
  };

  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Functions needed for cancelling appointments
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const openReasonModal = () => {
    closeConfirmModal();
    setIsReasonModalOpen(true);
  };
  const closeReasonModal = () => setIsReasonModalOpen(false);

  const handleCancelAppointment = async (
    appointmentId: number,
    cancelReason: string,
    eventId: string
  ) => {
    const body = { cancelReason };

    try {
      const { data } = await supabaseClient.auth.getSession();
      const accessToken = data.session?.provider_token;

      if (!accessToken) {
        throw new Error("Access token not found. Please re-authenticate.");
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?conferenceDataVersion=1&sendUpdates=all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        // Ignore JSON parsing error if response is empty (204 No Content)
      }

      console.log(responseData);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error as string, {
        duration: 3000,
        style: { backgroundColor: "#eb5766", color: "#fff", fontWeight: 700 },
      });
    } finally {
      await CancelAPICaller(
        `user/appointment/cancel/${appointmentId}`,
        "POST",
        body
      );
      getAppointments();
      closeAppointmentModal();
      closeReasonModal();
      setFilter("cancelled");
      setCancelReason("");
    }
  };

  const handleAttendanceResponse = (response: string) => {
    setModalStep(response === "Yes" ? "feedback" : "reason");
  };

  const handleSubmitFeedback = async (appointmentId: number) => {
    const body = feedback;
    try {
      await PostAppointmentFeedbackCaller(
        `user/appointment/${appointmentId}/submit-feedback`,
        "POST",
        body
      );

      setIsAttendanceModalOpen(false);
      setModalStep("attendance");
      setFeedback({
        doctorRating: 3,
        doctorFeedback: "",
        meetFeedback: "",
      });
      getAppointments();
    } catch (error) {
      console.log("Error submitting appointment feedback:", error);
    }
  };

  const handleSubmitReason = async (appointmentId: number) => {
    const body = { absentReason };
    try {
      await PostAbsentReasonCaller(
        `user/appointment/${appointmentId}/submit-absent-reason`,
        "POST",
        body
      );

      setIsAttendanceModalOpen(false);
      setModalStep("attendance");
      setAbsentReason("");
      getAppointments();
    } catch (error) {
      console.log("Error submitting absent reason:", error);
    }
  };

  const handleCloseAttendanceModal = async (appointmentId: number) => {
    try {
      await UpdateAttendedFlagCaller(
        `user/appointment/${appointmentId}/update-attended-modal-flag`,
        "POST"
      );
      setIsAttendanceModalOpen(false);
    } catch (err) {
      console.log("Error updating attended modal flag:", err);
    }
  };

  const isMeetingUpcoming =
    selectedAppointment && selectedAppointment.status === "upcoming";
  const isMeetingPrevious =
    selectedAppointment && selectedAppointment.status === "previous";

  // Renders
  const renderAppointmentFilters = () => (
    <div className="flex flex-wrap justify-center gap-4 w-full mt-24">
      {filterDetails.map((eachFilter) => (
        <FilterButton
          key={eachFilter.filterId}
          id={eachFilter.filterId}
          buttonText={eachFilter.filterButtonText}
          filter={filter}
          onClickEvent={onFilterChange}
        />
      ))}
    </div>
  );

  const renderAppointments = () => {
    const filteredAppointments = appointmentsResult?.appointments.filter(
      (eachAppointment) => eachAppointment.status === filter
    );

    return (
      // FIXME: I gave min-h-screen to this div but it is not looking good at all,
      // I tried giving flex-grow to it so it can fill the empty space on the screen,
      // but it's not working for some reason.
      <div className="mt-6 py-10 px-6 w-full flex flex-grow justify-center items-start bg-[#FDF8EF] h-full shadow-inner min-h-screen">
        {/* <h2 className="mt-8 mb-6 text-center text-2xl font-bold">
          {filterDetails.find((f) => f.filterId === filter)?.filterButtonText}
        </h2> */}
        <div
          className={`${
            filteredAppointments?.length === 0
              ? "flex justify-center items-center w-full h-full"
              : "sm:mx-4 md:mx-12 lg:mx-20 my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          }`}
        >
          {filteredAppointments?.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={emptyBox}
                alt="empty icon"
                className="w-14 md:w-28 mt-3"
              />
              <p className="text-center text-xs md:text-base ">
                You don't have any {filter} appointments
              </p>
            </div>
          ) : (
            filteredAppointments?.map((appointment, index) => (
              <div
                key={index}
                className={`relative px-8 py-4 flex flex-col gap-1 rounded-xl border border-gray-200 cursor-pointer ${
                  appointment.status === "upcoming"
                    ? "border-0 border-l-8 border-l-green-primary-1 bg-white text-green-primary-1"
                    : appointment.status === "cancelled"
                    ? "text-gray-500 bg-gray-200"
                    : "border-0 border-l-8 border-l-gray-500 bg-white text-gray-500"
                }`}
                onClick={() => openAppointmentModal(appointment)}
              >
                <AvatarGroup gap="0" spaceX="-3" size="lg" className="my-3">
                  <Avatar.Root>
                    <Avatar.Fallback name={user?.name} />
                    <Avatar.Image
                      src={user?.avatarUrl}
                      className="h-full rounded-full border border-white"
                    />
                  </Avatar.Root>
                  <Avatar.Root>
                    <Avatar.Fallback name={appointment.doctorName} />
                    <Avatar.Image
                      src={appointment.doctorAvatarUrl}
                      className="border border-white"
                    />
                  </Avatar.Root>
                </AvatarGroup>
                <p className="text-base md:text-lg font-semibold mb-2">
                  {appointment.typeOfTherapy}
                </p>
                <p className="text-sm">
                  <strong>Doctor:</strong> {appointment.doctorName}
                </p>
                <p className="text-sm">
                  <strong>Booked by:</strong> {user?.name}
                </p>
                <p className="text-sm">
                  <strong>Booked on:</strong> {appointment.createdAt}
                </p>
                <p className="text-sm">
                  <strong>Meeting time:</strong> {appointment.startTime} -{" "}
                  {appointment.endTime}
                </p>
                {
                  // This works, but it doesn't check actively, it works after render or a page refresh
                  parseDate(appointment.startTime).getTime() <= Date.now() &&
                    parseDate(appointment.endTime).getTime() >= Date.now() && (
                      <div className="absolute top-5 right-2 group">
                        <span className="flex w-2 h-2 me-3 bg-green-400 rounded-full animate-ping"></span>
                        <div className="absolute top-4 -left-8 translate-x-1/2 hidden md:group-hover:flex bg-gray-500 w-28 text-white text-xs px-2 py-1 rounded-md shadow-md">
                          Join the live meet now!
                        </div>
                      </div>
                    )
                }
                {"cancelledOn" in appointment && appointment["cancelledOn"] && (
                  <p className="text-sm">
                    <strong>Cancelled on:</strong> {appointment.cancelledOn}
                  </p>
                )}
                {appointment["status"] === "previous" &&
                  "attended" in appointment &&
                  appointment["attended"] !== null && (
                    <p className="text-sm">
                      <strong>Attended:</strong>{" "}
                      {appointment.attended ? (
                        <span className="bg-green-300 p-1 rounded-md text-black">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-red-400 p-1 rounded-md text-white">
                          No
                        </span>
                      )}
                    </p>
                  )}
                {appointment["status"] === "previous" &&
                  "attended" in appointment &&
                  appointment["attended"] === null && (
                    <p>
                      <strong>Attended:</strong>{" "}
                      <span className="bg-orange-primary-2 px-2 rounded-md text-black">
                        ?
                      </span>
                    </p>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentModal = () => (
    <Modal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={closeAppointmentModal}
      contentLabel="Appointment Details"
      className="flex flex-col outline-0 text-center md:text-left bg-gray-200 text-gray-600 max-h-[75%] overflow-auto"
      style={{
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "600px",
          padding: "20px 30px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(2px)",
          zIndex: 1000,
        },
      }}
    >
      <Button
        type="button"
        className="absolute top-3 right-3 hover:scale-125 ease-in delay-200"
        onClick={closeAppointmentModal}
      >
        <IoClose size={40} strokeWidth={16} />
      </Button>
      <AvatarGroup gap="0" spaceX="-3" size="2xl" className="my-3">
        <Avatar.Root>
          <Avatar.Fallback name={user?.name} />
          <Avatar.Image
            src={user?.avatarUrl}
            className="h-full rounded-full border border-white"
          />
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback name={selectedAppointment?.doctorName} />
          <Avatar.Image
            src={selectedAppointment?.doctorAvatarUrl}
            className="border border-white"
          />
        </Avatar.Root>
      </AvatarGroup>
      <h1 className="text-lg font-bold my-4 text-green-primary-1">
        Meeting: {selectedAppointment?.typeOfTherapy}
      </h1>
      <h2 className="underline mb-2 font-semibold text-green-primary-1">
        Guests:
      </h2>
      <p className="text-sm">
        <span className="font-bold">Client:</span> {user?.name}
      </p>
      <p className="text-sm">
        <span className="font-bold">Consultant:</span>{" "}
        {selectedAppointment?.doctorName}
      </p>
      <h2 className="underline my-2 font-semibold text-green-primary-1">
        Description:
      </h2>
      <p className="text-sm indent-8 mb-4">
        {selectedAppointment?.description}
      </p>
      <p>
        <span className="underline my-2 font-semibold text-green-primary-1">
          Booked on:
        </span>{" "}
        {selectedAppointment?.createdAt}
      </p>
      <h2 className="underline my-2 font-semibold text-green-primary-1">
        Meeting date & time:
      </h2>
      <p>
        {selectedAppointment?.startTime ? (
          <>
            {selectedAppointment?.startTime} - {selectedAppointment?.endTime}
          </>
        ) : (
          "No meeting time available"
        )}
      </p>
      {selectedAppointment &&
        "cancelledOn" in selectedAppointment &&
        selectedAppointment["cancelledOn"] && (
          <div>
            <p className="underline my-2 font-semibold text-green-primary-1">
              Cancelled on:
            </p>
            <p>{selectedAppointment?.cancelledOn}</p>
            <p className="underline my-2 font-semibold text-green-primary-1">
              Cancel reason:
            </p>
            <p>{selectedAppointment?.cancelReason}</p>
          </div>
        )}
      {isMeetingPrevious &&
        selectedAppointment &&
        "attended" in selectedAppointment &&
        selectedAppointment["attended"] !== null && (
          <div className="mt-2">
            <span className="underline my-2 font-semibold text-green-primary-1">
              Attended:
            </span>{" "}
            {selectedAppointment?.attended ? <span>Yes</span> : <span>No</span>}
            {selectedAppointment?.attended ? (
              <div className="flex justify-center md:justify-start items-center gap-2">
                <p className="underline my-2 font-semibold text-green-primary-1">
                  Doctor rating:
                </p>
                <span>{selectedAppointment?.doctorRating}</span>
              </div>
            ) : (
              <div className="flex justify-center md:justify-start items-center gap-2">
                <p className="underline my-2 font-semibold text-green-primary-1">
                  Absent reason:
                </p>
                <span>{selectedAppointment?.absentReason}</span>
              </div>
            )}
          </div>
        )}
      {isMeetingUpcoming ? (
        <div className="w-full self-center flex justify-center items-center mt-8 cursor-default flex-col md:flex-row md:justify-between md:items-start gap-5">
          <button
            className="bg-transparent text-red-400 border-2 border-red-400 rounded-lg px-4 py-2"
            onClick={() => openConfirmModal()}
          >
            Cancel meet
          </button>
          {renderConfirmCancelModal()}
          {renderReasonModal()}
          <div>
            <a
              href={isWithin10Minutes ? selectedAppointment?.hangoutLink : "#"}
              target={isWithin10Minutes ? "_blank" : ""}
            >
              <button
                className={`text-white flex gap-3 items-center shadow-inset-2 mb-4 px-6 py-2 rounded-3xl bg-green-primary-1 ${
                  isWithin10Minutes ? "" : "opacity-50 cursor-not-allowed"
                }`}
                title={
                  !isWithin10Minutes
                    ? "You can only join meet within half an hour of the scheduled time"
                    : "Click to join meet"
                }
              >
                <span>Join meet</span>
                <RiShareForward2Fill size={20} />
              </button>
            </a>
          </div>
        </div>
      ) : null}
      {isMeetingPrevious &&
        selectedAppointment &&
        "attended" in selectedAppointment &&
        selectedAppointment["attended"] === null && (
          <p
            className="flex-grow flex gap-2 justify-center items-center text-center text-orange-primary-1 text-sm sm:text-lg mt-4 cursor-pointer w-fit mx-auto"
            onClick={() => {
              setIsModalOpen(false);
              setActiveAttendanceAppointment(selectedAppointment);
              setIsAttendanceModalOpen(true);
              setModalStep("attendance");
            }}
          >
            Fill this appointment's attendance:
            <FaAngleRight size={20} />
          </p>
        )}
    </Modal>
  );

  const renderConfirmCancelModal = () => (
    <Modal
      isOpen={isConfirmModalOpen}
      onRequestClose={closeConfirmModal}
      style={{
        content: {
          width: "350px",
          height: "fit-content",
          padding: "30px 20px",
          borderRadius: "8px",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(2px)",
          zIndex: 1100,
        },
      }}
    >
      <h2 className="text-orange-primary-1 text-lg mb-3">
        Are you sure you want to cancel this appointment?
      </h2>
      <div className="flex gap-4">
        <button
          className="bg-orange-primary-2 text-white px-5 py-2 rounded-md"
          onClick={openReasonModal}
        >
          Yes
        </button>
        <button
          className="bg-green-primary-1 text-white px-5 py-2 rounded-md"
          onClick={closeConfirmModal}
        >
          No
        </button>
      </div>
    </Modal>
  );

  const renderReasonModal = () => (
    <Modal
      isOpen={isReasonModalOpen}
      onRequestClose={closeReasonModal}
      style={{
        content: {
          width: "350px",
          height: "fit-content",
          padding: "50px 30px 20px",
          borderRadius: "8px",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(2px)",
          zIndex: 1100,
        },
      }}
    >
      <button
        type="button"
        className="absolute top-5 right-4 hover:scale-125 ease-in delay-200"
        onClick={closeReasonModal}
      >
        <IoClose size={20} strokeWidth={16} />
      </button>
      <h2 className="text-orange-primary-1 text-lg">
        Why do you want to cancel this appointment?
      </h2>
      <textarea
        rows={5}
        minLength={50}
        maxLength={500}
        className="shadow-inset border-0 rounded-md w-full text-gray-600"
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />
      <div className="self-end text-xs text-green-primary-1">
        {cancelReason.length}/500
      </div>
      {selectedAppointment && (
        <button
          className={`bg-red-400 text-white px-4 py-2 rounded-lg ${
            cancelReason.length < 50 && "opacity-50 cursor-not-allowed"
          }`}
          disabled={cancelReason.length < 50}
          onClick={() =>
            handleCancelAppointment(
              selectedAppointment?.id as number,
              cancelReason,
              selectedAppointment?.eventId
            )
          }
        >
          Cancel appointment
        </button>
      )}
    </Modal>
  );

  const renderAttendanceModalContent = () => {
    if (modalStep === "attendance") {
      return (
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-lg font-semibold">
            Did you attend this appointment?
          </h1>
          <p>
            A{" "}
            <span className="font-bold">
              {activeAttendanceAppointment?.typeOfTherapy}
            </span>{" "}
            session with{" "}
            <span className="font-bold">
              {activeAttendanceAppointment?.doctorName}
            </span>
            , which was at {activeAttendanceAppointment?.startTime}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-green-primary-1 text-white font-semibold px-4"
              onClick={() => handleAttendanceResponse("Yes")}
            >
              Yes
            </Button>
            <Button
              className="bg-red-400 text-white font-semibold px-4"
              onClick={() => handleAttendanceResponse("No")}
            >
              No
            </Button>
          </div>
        </div>
      );
    }

    if (modalStep === "feedback") {
      return (
        <>
          <h1 className="text-md font-semibold text-center my-4">
            Please provide us your feedback, it helps us improve our system
          </h1>
          <hr className="mb-4" />
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              How well would you rate {activeAttendanceAppointment?.doctorName}?
              (on a scale of 1 to 5)
            </label>
            <RatingGroup.Root
              count={5}
              defaultValue={3}
              value={feedback.doctorRating}
              onValueChange={({ value }) =>
                setFeedback({ ...feedback, doctorRating: value })
              }
              size="lg"
              className="self-center"
            >
              <RatingGroup.Control>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingGroup.Item
                    key={index}
                    index={index + 1}
                    minW="9"
                    filter={{ base: "grayscale(1)", _checked: "revert" }}
                    transition="scale 0.1s"
                    _hover={{ scale: "1.1" }}
                  >
                    {emojiMap[index + 1]}
                  </RatingGroup.Item>
                ))}
              </RatingGroup.Control>
            </RatingGroup.Root>
            <label className="text-sm">
              Your feedback on {activeAttendanceAppointment?.doctorName}
              <textarea
                value={feedback.doctorFeedback}
                onChange={(e) =>
                  setFeedback({ ...feedback, doctorFeedback: e.target.value })
                }
                minLength={10}
                placeholder="Please enter atleast 10 characters..."
                className="border p-2 w-full text-sm mt-3"
              />
            </label>
            <label className="text-sm">
              Your feedback on appointment (meet):
              <textarea
                value={feedback.meetFeedback}
                onChange={(e) =>
                  setFeedback({
                    ...feedback,
                    meetFeedback: e.target.value,
                  })
                }
                placeholder="Enter feedback here..."
                className="border p-2 w-full text-sm mt-3"
              />
            </label>
            <Button
              className="bg-green-primary-1 text-white font-semibold px-4"
              disabled={
                !feedback.doctorRating || feedback.doctorFeedback.length < 10
              }
              onClick={() =>
                handleSubmitFeedback(activeAttendanceAppointment?.id as number)
              }
            >
              Submit Feedback
            </Button>
            <Button
              className="absolute top-3 left-3"
              onClick={() => setModalStep("attendance")}
            >
              <FaAngleLeft />
            </Button>
          </div>
        </>
      );
    }

    if (modalStep === "reason") {
      return (
        <>
          <h1 className="text-lg font-semibold my-4">
            Can we know why did you not attend?
          </h1>
          <textarea
            value={absentReason}
            onChange={(e) => setAbsentReason(e.target.value)}
            minLength={10}
            className="border p-2 w-full"
            placeholder="Enter reason (atleast 10 characters)..."
          />
          <Button
            className="bg-red-400 text-white font-semibold px-4 mt-3"
            disabled={absentReason.length < 10}
            onClick={() =>
              handleSubmitReason(activeAttendanceAppointment?.id as number)
            }
          >
            Submit Reason
          </Button>
          <Button
            className="absolute top-3 left-3"
            onClick={() => setModalStep("attendance")}
          >
            <FaAngleLeft />
          </Button>
        </>
      );
    }
  };

  const renderAttendanceModal = () => (
    <Modal
      isOpen={isAttendanceModalOpen}
      onRequestClose={() => setIsAttendanceModalOpen(false)}
      contentLabel="Attendance Confirmation"
      style={{
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "450px",
          height: "fit-content",
          maxWidth: "80%",
          maxHeight: "450px",
          padding: "40px 30px",
          borderRadius: "8px",
          textAlign: "center",
          overflow: "auto",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      {renderAttendanceModalContent()}
      <Button
        className="absolute top-3 right-3"
        onClick={() => {
          handleCloseAttendanceModal(activeAttendanceAppointment?.id as number);
        }}
      >
        <IoClose size={40} strokeWidth={16} />
      </Button>
    </Modal>
  );

  return (
    <div className="flex flex-col items-center pt-6 text-orange-primary-1 shadow-inset w-full h-full">
      {/* <h1 className="text-2xl mb-6">My Appointments</h1> */}
      {renderAppointmentFilters()}
      {renderAttendanceModal()}
      {loading ? (
        <Loader />
      ) : (
        <>
          {renderAppointments()}
          {renderAppointmentModal()}
        </>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default MyAppointmentsPage;
