import { useState } from "react";
import vert_logo from "../../assets/Vertical_logo.png";
import LocationPicker from "../../components/LocationPicker";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    identification: "",
    birthdate: "",
    country: "",
    city: "",
    location: null,
    profilePicture: null,
  });

  const [tempLocation, setTempLocation] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const confirmLocation = () => {
    if (tempLocation) {
      setFormData((prev) => ({ ...prev, location: tempLocation }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can send formData to your backend here
  };

  return (
    <div className="flex h-screen w-full items-start justify-center p-4 m-4  bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-[80%] max-w-full space-y-4 items center">
        <div className="flex flex-col items-center mb-6">
          <img src={vert_logo} alt="Logo" className="h-60" />
          <h1 className="my-2 text-primary font-bold text-2xl">Sign Up</h1>
        </div>
        <form
          className="space-y-0 w-[90%] max-w-lg  mx-auto"
          onSubmit={handleSubmit}
        >
          {[
            "email",
            "password",
            "name",
            "identification",
            "birthdate",
            "country",
            "city",
          ].map((field) => (
            <div
              key={field}
              className="flex flex-col items-start text-accent p-2"
            >
              <label
                htmlFor={field}
                className="w-[40%] text-sm font-medium mr-4 capitalize"
              >
                {field}:
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "birthdate"
                    ? "date"
                    : "text"
                }
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className="mt-1 block w-full border bg-primary border-background text-background rounded-md shadow-sm p-2"
              />
            </div>
          ))}

          {/* Location Picker */}
          <div className="text-accent p-4">
            <label className="text-sm font-medium mb-2 block">
              Select Location:
            </label>
            <LocationPicker onLocationSelect={setTempLocation} />
            {tempLocation && (
              <button
                type="button"
                onClick={confirmLocation}
                className="mt-2 px-4 py-2 w-fill bg-primary text-background rounded hover:bg-opacity-80"
              >
                Confirm Location
              </button>
            )}
          </div>

          {/* optional profile picture */}
          <div className="text-accent p-4">
            <label className="text-sm font-medium mb-2 block">
              Upload Profile Picture (optional):
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-accent border border-accent bg-primary rounded-md px-2"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  profilePicture: e.target.files[0],
                }))
              }
            />
          </div>

          {/* Submit Button and Back to Sign in Button */}
          <div className="flex justify-center p-4 space-x-2">
            <button
              type="submit"
              className="ml-4 px-6 py-2 bg-primary text-background rounded hover:bg-opacity-80"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-accent text-background rounded hover:bg-opacity-80"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
