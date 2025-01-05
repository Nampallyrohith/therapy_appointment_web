import FilterButton from "@/shared/FilterButton";
import React, { useState } from "react";

interface FilterProps {
  filterId: string;
  filterButtonText: string;
}

interface BaseUpcoming {
  typeOfTherapy: string;
  doctorName: string;
  bookedBy: string;
  bookedOn: string;
  timingOfMeeting: string;
}

interface Cancelled extends BaseUpcoming {
  cancelledOn: string;
}

interface Previous extends BaseUpcoming {
  attended: boolean;
}

type Appointment = BaseUpcoming | Cancelled | Previous;

const filterDetails: FilterProps[] = [
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

const dummyData: Record<string, Appointment[]> = {
  upcoming: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
    },
  ],
  cancelled: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      cancelledOn: "2025-01-08",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      cancelledOn: "2025-01-07",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      cancelledOn: "2025-01-09",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      cancelledOn: "2025-01-10",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      cancelledOn: "2025-01-11",
    },
  ],
  previous: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      attended: true,
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      attended: false,
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      attended: true,
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      attended: true,
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      attended: false,
    },
  ],
};

const MyAppointmentsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("upcoming");

  const onFilterChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilter(event.currentTarget.id);
  };

  return (
    <div className="flex flex-col items-center pt-6 text-orange-primary-1 shadow-inset">
      <h1 className="text-2xl mb-6">My Appointments</h1>
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
      <div className="mt-6 pb-8 px-6 w-full bg-[#FDF8EF] shadow-inset">
        <h2 className="mt-8 mb-6 text-center text-2xl font-bold">
          {filterDetails.find((f) => f.filterId === filter)?.filterButtonText}
        </h2>
        <div className="sm:mx-4 md:mx-12 lg:mx-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyData[filter]?.map((appointment, index) => (
            <div
              key={index}
              className={`px-8 py-4 flex flex-col gap-1 rounded-xl border border-gray-200 ${
                filter === "upcoming"
                  ? "text-green-primary-1 bg-white"
                  : filter === "cancelled"
                  ? "text-gray-500 bg-gray-300"
                  : "bg-green-primary-1 text-white"
              }`}
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
                  <strong>Attended:</strong>{" "}
                  {appointment.attended ? "Yes" : "No"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
