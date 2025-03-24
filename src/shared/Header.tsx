import { Button, Image } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Link, useLocation } from "react-router-dom";
import profileIcon from "@/assets/images/profile-icon.png";
import logo from "@/assets/images/Logo2.png";
import { useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";

import { IoMenu } from "react-icons/io5";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { useBookAppointment } from "@/components/utils/commonFunction";

const Header = () => {
  const [isDropdown, setDropdown] = useState<boolean>(false);
  const { handleUserSignOut, user } = useAppointmentContext();
  const location = useLocation();
  const handleBookAppointment = useBookAppointment();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    handleUserSignOut();
  };

  useEffect(() => {
    if (location.pathname === "/user/profile") {
      setDropdown(false);
    }
  }, [location]);

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
      <nav className="flex justify-around items-center py-5 fixed w-full z-10 bg-green-primary-2 drop-shadow-lg">
        <Link to="/user/home">
          {/* <p className="text-3xl text-orange-primary-1">Logo</p> */}
          <Image src={logo} className="w-[200px]" />
        </Link>

        <div className="hidden lg:block">
          <div className="list-none flex items-center justify-between gap-10">
            <li className="text-orange-primary-1">
              <Link to="/user/my-appointments">My Appointments</Link>
            </li>
            <li>
              <ActionButton
                buttonText="Book Appointment"
                onClick={handleBookAppointment}
              />
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
          <div
            ref={dropdownRef}
            className="w-1/6 px-5 !z-[9999] py-3 bg-white border-2 border-orange-primary-3 text-orange-primary-1 flex flex-col text-center shadow-md absolute top-20 right-20 rounded-md gap-2"
          >
            <p className="my-2">{user?.name}</p>
            <hr className="border-orange-primary-2" />
            <Link to="/user/profile" className="my-2">
              Profile
            </Link>
            <Button
              type="button"
              className="bg-red-500 text-white rounded-full shadow-inset"
              onClick={handleLogout}
            >
              Logout
            </Button>
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
              <Link to="/user/book-appointment">Book an Appointment</Link>
            </MenuItem>
            <MenuItem asChild value="logout">
              <Button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 text-white rounded-full w-3/5 shadow-inset text-xs mx-auto my-2"
              >
                Logout
              </Button>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </nav>
    </>
  );
};

export default Header;
