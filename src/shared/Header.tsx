import { Button, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import profileIcon from "@/assets/images/profile-icon.png";
import { useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";

const Header = () => {
  const [isDropdown, setDropdown] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      <nav className="relative flex justify-around items-center py-4 px-0 bg-green-primary-2">
        <Link to="/">
          <p className="text-3xl text-orange-primary-1">Logo</p>
        </Link>

        <div className="list-none flex items-center justify-between gap-10 ">
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
        {isDropdown && (
          // TO-DO: Dumming data for UI testing
          <div
            ref={dropdownRef}
            className="w-1/6 px-5 py-3 text-orange-primary-1 flex flex-col text-center shadow-md absolute top-20 right-20 rounded-md gap-2"
          >
            <p className="my-2">Rohan Kumar</p>
            <hr className="border-orange-primary-2" />
            <Link to="/user/profile" className="my-2">Profile</Link>
            <ActionButton buttonText="Logout" />
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
