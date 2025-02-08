import { TherapistType, therapyType } from "@/models/typeDefinations";
import Psychodynamic from "@/assets/images/therapies/psychodynamic.jpg";
import Behavioural from "@/assets/images/therapies/behavioural.jpg";
import CBT from "@/assets/images/therapies/cbt.jpg";
import Humanistic from "@/assets/images/therapies/humanistic.jpg";

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
  },
  {
    id: "doctor2",
    name: "Dr. Emily Johnson",
    experience: "8 years",
    specialisationId: "behavioural",
    specialist: "Behavioral therapy",
    about:
      "Focuses on changing maladaptive behaviors through learning principles like classical and operant conditioning. Experienced in treating phobias, addictions, and OCD.",
  },
  {
    id: "doctor3",
    name: "Dr. Michael Brown",
    experience: "12 years",
    specialisationId: "cognitiveBehavioural",
    specialist: "Cognitive Behavioral Therapy (CBT)",
    about:
      "Integrates cognitive and behavioral approaches to identify and reframe distorted thoughts, helping clients manage anxiety, depression, and stress effectively.",
  },
  {
    id: "doctor4",
    name: "Dr. Sarah Lee",
    experience: "7 years",
    specialist: "Humanistic Therapy",
    specialisationId: "humanistic",
    about:
      "Emphasizes personal growth and self-actualization, using empathy and unconditional positive regard to enhance self-awareness, self-esteem, and interpersonal relationships.",
  },
];
