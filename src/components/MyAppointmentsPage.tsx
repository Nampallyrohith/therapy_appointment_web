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
import { supabaseClient } from "@/supabase/connection";
import toast, { Toaster } from "react-hot-toast";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isWithin30Minutes, setIsWithin30Minutes] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  const { user } = useAppointmentContext();
  const {
    data: appointmentsResult,
    call: AppointmentAPICaller,
    loading,
  } = useFetchData<{
    appointments: Appointment[];
  }>();

  const { call: CancelAPICaller } = useFetchData();

  const { call: UpdateCancellAppointmentAPICaller } = useFetchData();

  const getAppointments = async () => {
    await AppointmentAPICaller(`user/my-appointments/${user?.googleUserId}`);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    const checkAppointmentInGoogleCalendar = async () => {
      let filteredAppointments = appointmentsResult?.appointments.filter(
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
    const checkTime = () => {
      if (!selectedAppointment?.startTime) return;

      const startTime = new Date(selectedAppointment.startTime);
      const now = new Date();

      setIsWithin30Minutes(
        now.getTime() >= startTime.getTime() - 30 * 60 * 1000
      );
    };

    checkTime();

    const interval = setInterval(checkTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedAppointment]);

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

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

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
      closeModal();
      closeReasonModal();
      setFilter("cancelled");
    }
  };

  const isMeetingUpcoming = !(
    (selectedAppointment &&
      "cancelledOn" in selectedAppointment &&
      selectedAppointment["cancelledOn"]) ||
    (selectedAppointment &&
      "attended" in selectedAppointment &&
      selectedAppointment["attended"])
  );

  // const isMeetingCancelled =
  //   selectedAppointment &&
  //   "cancelledOn" in selectedAppointment &&
  //   selectedAppointment["cancelledOn"];

  // Renders
  const renderAppointmentFilters = () => (
    <div className="flex flex-wrap justify-center gap-4 w-full">
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
      <div className="mt-6 pb-8 px-6 w-full flex flex-grow justify-center items-start bg-[#FDF8EF] h-screen shadow-inner">
        {/* <h2 className="mt-8 mb-6 text-center text-2xl font-bold">
          {filterDetails.find((f) => f.filterId === filter)?.filterButtonText}
        </h2> */}
        <div
          className={`${
            filteredAppointments?.length === 0
              ? "flex justify-center items-center w-full h-full"
              : "sm:mx-4 md:mx-12 lg:mx-40 my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className={`px-8 py-4 flex flex-col gap-1 rounded-xl border border-gray-200 cursor-pointer ${
                  appointment.status === "upcoming"
                    ? "border-0 border-l-8 border-l-green-primary-1 bg-white text-green-primary-1"
                    : appointment.status === "cancelled"
                    ? "text-gray-500 bg-gray-200"
                    : "border-0 border-l-8 border-l-gray-500 bg-white text-gray-500"
                }`}
                onClick={() => openModal(appointment)}
              >
                <p className="text-xl font-semibold mb-2">
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
                {"cancelledOn" in appointment && appointment["cancelledOn"] && (
                  <p className="text-sm">
                    <strong>Cancelled on:</strong> {appointment.cancelledOn}
                  </p>
                )}
                {"attended" in appointment &&
                  appointment["attended"] !== null && (
                    <p className="text-sm">
                      <strong>Attended:</strong>{" "}
                      {appointment.attended ? "Yes" : "No"}
                    </p>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderAppropriateModal = () => (
    //TODO: Display user and doctor dps in modal
    <Modal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
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
        onClick={closeModal}
      >
        <IoClose size={40} strokeWidth={16} />
      </Button>
      <h1 className="text-lg font-bold my-4 text-green-primary-1">
        Meeting: {selectedAppointment?.typeOfTherapy}
      </h1>
      <h2 className="underline mb-2 font-semibold text-green-primary-1">
        Guests:
      </h2>
      {/* TODO: Add user and doctor emails */}
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
      {selectedAppointment &&
        "attended" in selectedAppointment &&
        selectedAppointment["attended"] && (
          <div>
            <h2 className="underline text-white my-2">Attended:</h2>
            <p>{selectedAppointment?.attended ? "Yes" : "No"}</p>
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
              href={isWithin30Minutes ? selectedAppointment?.hangoutLink : "#"}
              target={isWithin30Minutes ? "_blank" : ""}
            >
              <button
                className={`text-white flex gap-3 items-center shadow-inset-2 mb-4 px-6 py-2 rounded-3xl bg-green-primary-1 ${
                  isWithin30Minutes ? "" : "opacity-50 cursor-not-allowed"
                }`}
                title={
                  !isWithin30Minutes
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

  return (
    <div className="flex flex-col items-center pt-6 text-orange-primary-1 shadow-inset w-full h-full lg:h-screen ">
      <h1 className="text-2xl mb-6 mt-20">My Appointments</h1>
      {renderAppointmentFilters()}
      {loading ? (
        <Loader />
      ) : (
        <>
          {renderAppointments()}
          {renderAppropriateModal()}
        </>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default MyAppointmentsPage;
