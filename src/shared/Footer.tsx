import { Link } from "react-router-dom";
import logo from "@/assets/images/Logo2.png";
import { Image } from "@chakra-ui/react";
import { FaPhoneAlt, FaAddressCard } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
const Footer = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="bg-green-primary-2 w-full h-full flex flex-col md:flex-row justify-around items-center gap-10 p-10">
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
      <Link to="/privacy-policy.html">Privacy policy</Link> |{" "}
      <Link to="/terms-of-service.html"></Link>
    </div>
  );
};

export default Footer;
