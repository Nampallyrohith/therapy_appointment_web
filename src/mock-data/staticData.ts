import {
  Appointment,
  TherapistType,
  therapyType,
} from "@/models/typeDefinations";
import Psychodynamic from "@/assets/images/therapies/psychodynamic.jpg";
import Behavioural from "@/assets/images/therapies/behavioural.jpg";
import CBT from "@/assets/images/therapies/cbt.jpg";
import Humanistic from "@/assets/images/therapies/humanistic.jpg";
import DOC1 from "../assets/images/DoctorImages/doc1.png";
import DOC2 from "../assets/images/DoctorImages/doc2.png";
import DOC3 from "../assets/images/DoctorImages/doc3.png";
import DOC4 from "../assets/images/DoctorImages/doc4.png";

export const ourTherapiesList: therapyType[] = [
  {
    id: "psychodynamic",
    image: Psychodynamic,
    name: "Psychodynamic Therapy",

    about:
      "Psychodynamic therapy focuses on exploring unconscious thoughts, emotions, and past experiences to understand how they influence current behavior and relationships. It aims to resolve internal conflicts through techniques like free association and dream analysis. ",
  },
  {
    id: "behavioural",
    image: Behavioural,
    name: "Behavioral therapy",
    about:
      " Behavioral therapy emphasizes changing maladaptive behaviors by applying learning principles such as classical and operant conditioning, often used to treat phobias, addictions, and OCD.",
  },
  {
    id: "cognitiveBehavioural",
    image: CBT,
    name: "Cognitive behavioral Therapy",
    about:
      "Cognitive Behavioral Therapy (CBT) integrates cognitive and behavioral approaches, focusing on identifying and reframing distorted thoughts to influence emotions and behaviors, commonly used for anxiety, depression, and stress.",
  },
  {
    id: "humanistic",
    image: Humanistic,
    name: "Humanistic Therapy",
    about:
      "Humanistic therapy, centered on personal growth and self-actualization, uses empathy and unconditional positive regard to foster self-awareness and fulfillment, often applied to enhance self-esteem and interpersonal relationships.",
  },
];

export const Therapists: TherapistType[] = [
  {
    id: "doctor1",
    name: "Dr. John Smith",
    experience: "10 years",
    specialisationId: "psychodynamic",
    specialist: "Psychodynamic Therapy",
    about:
      "Specializes in exploring unconscious thoughts, emotions, and past experiences to resolve internal conflicts using techniques like free association and dream analysis.",
    image: DOC1,
  },
  {
    id: "doctor2",
    name: "Dr. Emily Johnson",
    experience: "8 years",
    specialisationId: "behavioural",
    specialist: "Behavioral therapy",
    about:
      "Focuses on changing maladaptive behaviors through learning principles like classical and operant conditioning. Experienced in treating phobias, addictions, and OCD.",
    image: DOC2,
  },
  {
    id: "doctor3",
    name: "Dr. Michael Brown",
    experience: "12 years",
    specialisationId: "cognitiveBehavioural",
    specialist: "Cognitive Behavioral Therapy (CBT)",
    about:
      "Integrates cognitive and behavioral approaches to identify and reframe distorted thoughts, helping clients manage anxiety, depression, and stress effectively.",
    image: DOC3,
  },
  {
    id: "doctor4",
    name: "Dr. Sarah Lee",
    experience: "7 years",
    specialist: "Humanistic Therapy",
    specialisationId: "humanistic",
    about:
      "Emphasizes personal growth and self-actualization, using empathy and unconditional positive regard to enhance self-awareness, self-esteem, and interpersonal relationships.",
    image: DOC4,
  },
];

// TODO: Replace dummy data with actual data from db
// TODO: Add meetingLink field inside every appointment
export const dummyData: Record<string, Appointment[]> = {
  upcoming: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
  ],
  cancelled: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-08",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-07",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-09",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-10",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
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
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: false,
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: false,
    },
  ],
};
