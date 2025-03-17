import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import Modal from "react-modal";
import { useAppointmentContext } from "../context/AppointmentContext"; // Ensure correct import
import { useNavigate } from "react-router-dom"; // Ensure correct import
import { IoIosClose } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
//import { IoLocationOutline } from "react-icons/io5";
import { LiaGraduationCapSolid } from "react-icons/lia";
interface OurTherapistProps {
  Therapists: {
    id: number;
    name: string;
    avatarUrl: string;
    specialistIn: string;
    experience: number;
    therapyId: string;
    about: string;
  }[];
}

const OurTherapists: React.FC<OurTherapistProps> = ({ Therapists }) => {
  const { setSelectedTherapy, setSelectedDoctor } = useAppointmentContext();
  const navigate = useNavigate();
  const [selectedTherapist, setSelectedTherapist] = useState<
    null | OurTherapistProps["Therapists"][0]
  >(null);

  const handleTherapistAppointment = (id: number, specialisationId: string) => {
    setSelectedTherapy(specialisationId);
    setSelectedDoctor(id);
    window.scrollTo(0, 0);
    navigate("/user/book-appointment");
  };

  return (
    <div className="mx-auto relative w-3/4 h-full mb-6">
      {/* Navigation Buttons */}
      <button className="custom-swiper-button-prev absolute -left-[42px] sm:-left-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
        <ChevronLeft size={42} className="text-[#5281A2]" />
      </button>
      <button className="custom-swiper-button-next absolute -right-[42px] sm:-right-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
        <ChevronRight size={42} className="text-[#5281A2]" />
      </button>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-swiper-button-prev",
          nextEl: ".custom-swiper-button-next",
        }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1026: { slidesPerView: 2 },
        }}
        className="w-full h-full"
      >
        {Therapists.map((therapist) => (
          <SwiperSlide key={therapist.id} className="h-full w-full">
            <div
              className="flex justify-center mt-2 w-full h-full rounded-2xl cursor-pointer"
              onClick={() => setSelectedTherapist(therapist)}
            >
              <div className="flex flex-col justify-center space-y-2 mb-2 md:min-w-[300px] min-w-[200px] min-h-auto">
                <div className="relative">
                  <p className="text-white text-xs bg-red-500 self-end px-5 py-1 rounded-tr-2xl rounded-bl-2xl absolute top-2 right-0">
                    {therapist.therapyId}
                  </p>
                </div>
                <Image
                  src={therapist.avatarUrl}
                  alt="therapist image"
                  className="bg-green-primary-2 rounded-t-2xl"
                />

                <div className="pl-4 space-y-2 text-green-primary-1">
                  <h2 className="sm:text-base text-sm">{therapist.name}</h2>
                  <p className="text-xs md:text-sm">{therapist.specialistIn}</p>
                  <p className="text-xs md:text-sm">
                    {therapist.experience} Years Of Experience
                  </p>
                </div>
                <ActionButton
                  buttonText="Schedule an appointment"
                  onClick={() =>
                    handleTherapistAppointment(
                      therapist.id,
                      therapist.therapyId
                    )
                  }
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal */}
      {selectedTherapist && (
        <Modal
          isOpen={!!selectedTherapist}
          onRequestClose={() => setSelectedTherapist(null)}
          ariaHideApp={false}
          className="bg-white text-green-primary-1 flex flex-col outline-0 rounded-md shadow-lg relative h-3/4 md:h-auto overflow-y-auto"
          style={{
            content: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "650px",
              padding: "10px",
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
          <div className="relative">
            <button
              onClick={() => setSelectedTherapist(null)}
              className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 text-2xl"
            >
              <IoIosClose size={35} />
            </button>
          </div>
          <div className="flex md:flex-row flex-col sm:items-center gap-6 px-4 text-sm ">
            <div className="flex-1 md:text-left text-center space-y-3 font-medium sm:order-first order-last">
              <h1 className="text-lg font-semibold">
                {selectedTherapist.name}
              </h1>

              <div className="flex flex-col justify-center md:justify-start items-center md:items-start">
                <h2 className="flex items-center  gap-2 ">
                  <FaStethoscope /> Experience
                </h2>
                <p>{selectedTherapist.experience}</p>
              </div>

              <div className="flex flex-col justify-center md:justify-start items-center md:items-start">
                <h2 className="flex items-center  gap-2">
                  <SlBadge /> Specialization
                </h2>
                <p>{selectedTherapist.specialistIn}</p>
              </div>

              <div className="flex flex-col justify-center md:justify-start items-center md:items-start">
                <h2 className="flex items-center  gap-2">
                  <LiaGraduationCapSolid /> Qualification
                </h2>
                <p>MD Psychiatry</p>
              </div>
            </div>
            <img
              src={selectedTherapist.avatarUrl}
              className="w-60 h-89 "
              alt="Therapist"
            />
          </div>
          <div className="px-4 py-4 md:text-left text-center">
            <h1 className="text-lg font-semibold">About</h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              {selectedTherapist.about}
            </p>
          </div>
          <div className="my-4 text-sm mx-auto">
            <ActionButton
              buttonText="Schedule an appointment"
              onClick={() =>
                handleTherapistAppointment(
                  selectedTherapist.id,
                  selectedTherapist.therapyId
                )
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OurTherapists;
