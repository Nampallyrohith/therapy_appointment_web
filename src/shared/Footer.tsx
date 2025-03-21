import { Link } from "react-router-dom";
import logo from "@/assets/images/Logo2.png";
import { Image } from "@chakra-ui/react";
import { FaPhoneAlt, FaAddressCard } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
const Footer = () => {
  return (
    <div className="flex bg-green-primary-2 flex-col w-full h-full items-center  p-3 justify-center">
      <div className="w-4/5 h-full flex flex-col md:flex-row border-b-2 border-b-green-primary-1 border-0 justify-around items-center gap-10 p-7">
        <Link to="/user/home">
          <Image src={logo} className="w-56 md:w-[250px]" />
        </Link>
        <div className="flex flex-col text-green-primary-1 gap-5">
          <p className="flex items-center gap-2 text-xs md:text-sm ">
            <FaPhoneAlt size={20} /> 6300330258
          </p>
          <p className="flex items-center gap-2 text-xs md:text-sm">
            <FaAddressCard size={20} /> Hyderabad, Telangana, India.
          </p>
          <p className="flex items-center gap-2 text-xs md:text-sm">
            <MdOutlineMail size={20} /> therapyappointment.help@gmail.com
          </p>
        </div>
      </div>
      <div className="flex md:flex-row items-center gap-3 md:gap-6 text-sm mt-3 text-green-primary-1">
        <Link to="/privacy-policy.html">Privacy policy</Link> |{" "}
        <Link to="/terms-of-service.html">Terms of Services</Link>
      </div>
    </div>
  );
};

export default Footer;
