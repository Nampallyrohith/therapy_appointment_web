import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-green-primary-2 w-screen h-full mt-10 md:flex md:justify-around md:items-center gap-10 p-10">
      <Link to="/">
        <h1 className="text-4xl mb-5 md:mb-0">Logo</h1>
      </Link>
      <div className="space-y-2">
        <h3>Phone Number: 0987654321</h3>
        <h3>Address: 123 Main St, Anytown, USA</h3>
        <h3>Email: therapyInfo@gmail.com</h3>
      </div>
    </div>
  );
};

export default Footer;
