import FilterButton from "@/shared/FilterButton";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { RiShareForward2Fill } from "react-icons/ri";
import React, { useState } from "react";
import { Button } from "@chakra-ui/react";

import { Appointment } from "@/context/AppointmentContext";
import { filterDetails } from "@/context/AppointmentContext";
import { dummyData } from "@/context/AppointmentContext";

const MyAppointmentsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("upcoming");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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

  const isMeetingUpcoming = !(
    (selectedAppointment && "cancelledOn" in selectedAppointment) ||
    (selectedAppointment && "attended" in selectedAppointment)
  );

  const isMeetingCancelled =
    selectedAppointment && "cancelledOn" in selectedAppointment;

  // Renders
  const renderAppointmentFilters = () => (
    <div className="flex flex-wrap justify-center gap-4">
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

  const renderAppointments = () => (
    <div className="mt-6 pb-8 px-6 w-full bg-[#FDF8EF] shadow-inner">
      {/* <h2 className="mt-8 mb-6 text-center text-2xl font-bold">
          {filterDetails.find((f) => f.filterId === filter)?.filterButtonText}
        </h2> */}
      <div className="sm:mx-4 md:mx-12 lg:mx-40 my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyData[filter]?.map((appointment, index) => (
          <div
            key={index}
            className={`px-8 py-4 flex flex-col gap-1 rounded-xl border border-gray-200 cursor-pointer ${
              filter === "upcoming"
                ? "text-green-primary-1 bg-white"
                : filter === "cancelled"
                ? "text-gray-500 bg-gray-300"
                : "bg-green-primary-1 text-white"
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
              <strong>Booked by:</strong> {appointment.bookedBy}
            </p>
            <p className="text-sm">
              <strong>Booked on:</strong> {appointment.bookedOn}
            </p>
            <p className="text-sm">
              <strong>Meeting time:</strong>{" "}
              {new Date(appointment.timingOfMeeting).toLocaleString()}
            </p>
            {"cancelledOn" in appointment && (
              <p className="text-sm">
                <strong>Cancelled on:</strong> {appointment.cancelledOn}
              </p>
            )}
            {"attended" in appointment && (
              <p className="text-sm">
                <strong>Attended:</strong> {appointment.attended ? "Yes" : "No"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppropriateModal = () => (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Appointment Details"
      className={`flex flex-col outline-0 text-center md:text-left ${
        isMeetingUpcoming
          ? "bg-white text-green-primary-1"
          : isMeetingCancelled
          ? "bg-gray-300 text-gray-500"
          : "bg-green-primary-1 text-white"
      }`}
      style={{
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "500px",
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
        <IoClose
          size={40}
          color={isMeetingCancelled ? "white" : ""}
          strokeWidth={16}
        />
      </Button>
      <h1
        className={`text-lg font-semibold my-4 ${
          isMeetingUpcoming
            ? "text-green-primary-1"
            : isMeetingCancelled
            ? "text-gray-500"
            : "text-white"
        }`}
      >
        Meeting: {selectedAppointment?.typeOfTherapy}
      </h1>
      <h2 className="underline mb-2">Guests:</h2>
      {/* TODO: Add user and doctor emails */}
      <p className="text-sm">
        <span className="font-bold">Client:</span>{" "}
        {selectedAppointment?.bookedBy}
      </p>
      <p className="text-sm">
        <span className="font-bold">Consultant:</span>{" "}
        {selectedAppointment?.doctorName}
      </p>
      <h2 className="underline my-2">Description:</h2>
      <p className="text-sm indent-8 mb-4">
        {selectedAppointment?.description}
      </p>
      <h2 className="underline mb-2">Meeting date & time:</h2>
      <p>
        {selectedAppointment?.timingOfMeeting
          ? new Date(selectedAppointment.timingOfMeeting).toLocaleString()
          : "No meeting time available"}
      </p>
      {selectedAppointment && "cancelledOn" in selectedAppointment && (
        <div>
          <h2 className="underline my-2">Cancelled on:</h2>
          <p>{selectedAppointment?.cancelledOn}</p>
        </div>
      )}
      {selectedAppointment && "attended" in selectedAppointment && (
        <div>
          <h2 className="underline my-2">Attended:</h2>
          <p>{selectedAppointment?.attended ? "Yes" : "No"}</p>
        </div>
      )}
      {/* TODO: Redirect to google.meet.com on clicking the link */}
      {/* TODO: Disable the button all the time, enable just 30 minutes before the meet */}
      <button
        className={`self-end text-white flex gap-3 items-center shadow-inset-2 my-4 px-6 py-2 rounded-3xl
          ${
            isMeetingUpcoming
              ? "bg-green-primary-1"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {isMeetingUpcoming ? (
          <>
            <span>Join meet</span>
            <RiShareForward2Fill size={20} />
          </>
        ) : (
          <span>Can't join meet</span>
        )}
      </button>
      {!isMeetingUpcoming ? (
        <p className="self-end text-[10px] text-red-400 max-w-40">
          * The meeting is either a previous or a cancelled one
        </p>
      ) : (
        ""
      )}
    </Modal>
  );

  return (
    <div className="flex flex-col items-center pt-6 text-orange-primary-1 shadow-inset w-full">
      <h1 className="text-2xl mb-6 mt-16 lg:mt-20">My Appointments</h1>
      {renderAppointmentFilters()}
      {renderAppointments()}
      {renderAppropriateModal()}
    </div>
  );
};

export default MyAppointmentsPage;
