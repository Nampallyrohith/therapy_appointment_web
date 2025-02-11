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
      <div className="space-y-4 text-green-primary-1">
        {/* TODO: Show icons instead of labels */}
        <p>Phone Number: 6300330258</p>
        <p>Hyderabad, Telangana, India.</p>
        <p>Email: therapyappointment.help@gmail.com</p>
      </div>
    </div>
  );
};

export default Footer;
