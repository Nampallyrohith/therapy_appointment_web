import ActionButton from "./shared/ActionButton";

const App = () => {
  return (
    <div className="">
      <h1 className="text-blue-300">Hi, Book appointment</h1>
      <ActionButton buttonText="Login" />
      <ActionButton buttonText="Signup" />
      <ActionButton buttonText="Book Appointment" />
      <ActionButton buttonText="Logout" />
    </div>
  );
};

export default App;
