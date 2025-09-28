import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setErrorMsg("This email is already registered. Please log in.");
      } else {
        setErrorMsg("Sign up failed: " + error.message);
      }
      return;
    }

    setLoading(false);
    setSuccessful(true);
    setTimeout(() => navigate("/Landing"), 500);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-full max-w-md md:max-w-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Vertical_logo.png"
            alt="Logo"
            className="h-40 sm:h-52 md:h-60"
          />
          <h1 className="my-2 text-primary font-bold text-2xl">Sign Up</h1>
        </div>

        <form className="space-y-4 w-full text-accent" onSubmit={handleSubmit}>
          {["email", "password"].map((field) => (
            <div key={field} className="flex flex-col items-start">
              <label
                htmlFor={field}
                className="text-sm font-medium capitalize mb-1"
              >
                {field}:
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className="mt-1 block w-full border border-gray-300 bg-white text-accent rounded-md shadow-sm p-3 focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {loading && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-xs sm:text-sm animate-pulse">
                Signing up...
              </p>
            </div>
          )}
          {successful && (
            <p className="text-green-500 text-sm mb-2">
              Sign up successful! Please check your email to confirm your
              account.
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
