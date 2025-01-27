import { Button, Image } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Link } from "react-router-dom";
import profileIcon from "@/assets/images/profile-icon.png";
import { useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";

import { IoMenu } from "react-icons/io5";
import { useAppointmentContext } from "@/context/AppointmentContext";

const Header = () => {
  const [isDropdown, setDropdown] = useState<boolean>(false);
  const { handleUserSignOut } = useAppointmentContext();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    handleUserSignOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside of dropdown and button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    // larger screen
    <>
      <nav className="flex justify-around items-center py-4 fixed w-full z-10 bg-green-primary-2">
        <Link to="/user/home">
          <p className="text-3xl text-orange-primary-1">Logo</p>
        </Link>

        <div className="hidden lg:block">
          <div className="list-none flex items-center justify-between gap-10">
            <li className="text-orange-primary-1">
              <Link to="/user/my-appointments">My Appointments</Link>
            </li>
            <li>
              <Button
                type="button"
                className="bg-orange-primary-1 text-white px-5 tracking-wider rounded-lg shadow-inset"
              >
                Book Appointment
              </Button>
            </li>
            <li>
              <Button
                type="button"
                ref={buttonRef}
                onClick={() => setDropdown(!isDropdown)}
                className="border-2 border-orange-primary-1 p-2 rounded-full"
              >
                <Image src={profileIcon} alt="Profile Icon" className="w-4" />
              </Button>
            </li>
          </div>
        </div>
        {isDropdown && (
          // TO-DO: Dumming data for UI testing
          <div
            ref={dropdownRef}
            className="w-1/6 px-5 py-3 bg-white border-2 border-orange-primary-3 text-orange-primary-1 flex flex-col text-center shadow-md absolute top-20 right-20 rounded-md gap-2"
          >
            <p className="my-2">Rohan Kumar</p>
            <hr className="border-orange-primary-2" />
            <Link to="/user/profile" className="my-2">
              Profile
            </Link>
            <div onClick={handleLogout}>
              <ActionButton buttonText="Logout" />
            </div>
          </div>
        )}

        <MenuRoot>
          <MenuTrigger asChild className="block lg:hidden">
            <Button className="p-0 text-orange-primary-1 outline-none w-10 h-10">
              <IoMenu />
            </Button>
          </MenuTrigger>
          <MenuContent className="text-orange-primary-2 border-2 border-orange-primary-2">
            <MenuItem asChild value="profile">
              <Link to="/user/profile">Profile</Link>
            </MenuItem>
            <MenuItem asChild value="my-appointment">
              <Link to="/user/my-appointments">My Appointments</Link>
            </MenuItem>
            <MenuItem asChild value="book-a-appointment">
              <Link to="/user/booking-appointment">Book a Appointment</Link>
            </MenuItem>
            <MenuItem asChild value="logout">
              <Button onClick={handleLogout}>Logout</Button>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </nav>
    </>
  );
};

export default Header;
