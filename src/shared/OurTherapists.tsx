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

//import therapistImg from "@/assets/images/therapist1.png";
import ActionButton from "./ActionButton";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { useNavigate } from "react-router-dom";
import { Doctor } from "@/models/typeDefinations";

interface ourTherapistProps {
  Therapists: Doctor[];
}

const OurTherapists: React.FC<ourTherapistProps> = ({ Therapists }) => {
  const { setSelectedTherapy, setSelectedDoctor } = useAppointmentContext();
  const navigate = useNavigate();

  const handleTherapistAppointment = (id: string, specialisationId: string) => {
    setSelectedTherapy(specialisationId);
    setSelectedDoctor(id);
    window.scrollTo(0, 0);
    navigate("/user/book-appointment");
  };

  return (
    <div className="mx-auto relative w-3/4 h-full mb-6">
      <button className="custom-swiper-button-prev absolute -left-[42px] sm:-left-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
        <ChevronLeft size={42} className="text-[#5281A2]" />
      </button>
      <button className="custom-swiper-button-next absolute -right-[42px] sm:-right-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
        <ChevronRight size={42} className="text-[#5281A2]" />
      </button>

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
          768: { slidesPerView: 2 },
          1026: { slidesPerView: 2 },
        }}
        className="w-full h-full"
      >
        {Therapists.map((therapist) => (
          <SwiperSlide key={therapist.id} className="h-full w-full">
            <div className="flex justify-center mt-2 w-full h-full rounded-lg">
              <div className="flex flex-col justify-center space-y-2 mb-2">
                <Image
                  src={therapist.avatarUrl}
                  alt="therapist image"
                  className="bg-green-primary-2 rounded-t-2xl"
                />

                <div className="pl-4 space-y-2 text-green-primary-1">
                  <h2>{therapist.name}</h2>
                  <p className="text-xs lg:text-base">
                    {therapist.specialistIn}
                  </p>
                  <p className="text-xs lg:text-base">{therapist.experience}</p>
                </div>
                <ActionButton
                  buttonText="Schedule an appointment"
                  onClick={() =>
                    handleTherapistAppointment(
                      therapist.id.toString(),
                      therapist.therapyId
                    )
                  }
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OurTherapists;
