import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { DatePicker } from "@orange_digital/chakra-datepicker";
import { Button } from "./ui/button";
import { supabaseClient } from "@/supabase/connection";

const BookAppointment = () => {
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [guests, setGuests] = useState<string[]>([""]);
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");

  const handleGuestInput = () => {
    setGuests([...guests, ""]);
  };

  const createEventWithGuestsAndReminders = async () => {
    const requestId = Date.now().toString();
    console.log(requestId);
    const event = {
      summary: "Testing2",
      description: "Temperory meeting checkup testing",
      start: {
        dateTime: "2025-01-18T06:00:00-07:00", // Start time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: "2025-01-18T08:00:00-07:00", // End time in ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //Asia/Kolkata
      },
      attendees: [
        { email: "rohithnampelly123@gmail.com" },
        { email: "lokesh.pasam29@gmail.com" },
      ],
      reminders: {
        useDefault: false, // Set to true if you want default reminders
        overrides: [
          { method: "email", minutes: 24 * 60 }, // Reminder 1 day before
          { method: "popup", minutes: 10 }, // Popup reminder 10 minutes before
        ],
      },
      // Google meet
      conferenceData: {
        createRequest: {
          requestId: requestId, // Replace with a unique string
          conferenceSolutionKey: {
            type: "hangoutsMeet", // Specifies Google Meet
          },
        },
      },
    };

    try {
      const { data } = await supabaseClient.auth.getSession();
      console.log("data:", data);
      const accessToken = data.session?.provider_token;
      console.log(accessToken);
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add a space after 'Bearer'
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );
      console.log(response);
      const responseData = await response.json();
      if (response.ok) {
        console.log("Event created successfully:", responseData);
        console.log(responseData.hangoutLink);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleGuestChange = (index: number, value: string) => {
    const updatedGuests = guests.map((guest, i) =>
      i === index ? value : guest
    );
    setGuests(updatedGuests);
  };
  return (
    <div className="w-3/5 flex flex-col justify-center items-center">
      <div>
        <p>Event name</p>
        <Input
          type="text"
          placeholder="Enter event name"
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div>
        <p>Event description</p>
        <Input type="date" />
        <Input
          type="text"
          placeholder="Enter event description"
          onChange={(e) => setEventDescription(e.target.value)}
        />
      </div>
      <div>
        <p>Start time</p>
        <div className="no-effect-tw">
          <DatePicker onDateChange={setStart} />
        </div>
      </div>
      <div className="tw-none">
        <p className="text-red-500">End time</p>
        <DatePicker onDateChange={setEnd} />
      </div>
      <div>
        <p>Add Guest to join</p>
        <Button type="button" onClick={handleGuestInput}>
          Add guest
        </Button>
        {guests.map((guest, index) => (
          <Input
            key={index}
            value={guest}
            onChange={(e) => handleGuestChange(index, e.target.value)}
          />
        ))}

        <Button
          type="button"
          onClick={createEventWithGuestsAndReminders}
          className=""
        >
          Book event
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;
