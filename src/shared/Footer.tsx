import { Link } from "react-router-dom";
import logo from "@/assets/images/Logo2.png";
import { Image } from "@chakra-ui/react";


const Footer = () => {
  return (
    <div className="bg-green-primary-2 w-full h-full flex flex-col md:flex-row justify-around items-center gap-10 p-10">
      <Link to="/user/home">
        {/* <h1 className="text-4xl">Logo</h1> */}
        <Image src={logo} className="w-[250px]" />
      </Link>
      <div className="space-y-2">
        <h3>Phone Number: 0987654321</h3>
        <h3>Address: 123 Main St, Anytown, USA</h3>
        <h3>Email: therapyappointment.help@gmail.com</h3>
      </div>
    </div>
  );
};

export default Footer;
