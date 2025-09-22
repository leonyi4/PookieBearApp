import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";
import vert_logo from "../../assets/Vertical_logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert("Sign up failed: " + error.message);
      return;
    }

    const user = data.user;
    if (user) {
      // Insert minimal row into users table
      await supabase.from("users").insert({
        id: user.id,
        email: formData.email,
        profile_complete: false,
      });
    }

    alert("Sign up successful! Please confirm your email.");
    navigate("/Landing");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-background rounded-2xl shadow-lg w-[90%] max-w-md space-y-4">
        <div className="flex flex-col items-center mb-6">
          <img src={vert_logo} alt="Logo" className="h-60" />
          <h1 className="my-2 text-primary font-bold text-2xl">Sign Up</h1>
        </div>
        <form
          className="space-y-4 w-[90%] max-w-lg mx-auto text-accent"
          onSubmit={handleSubmit}
        >
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
                className="mt-1 block w-full border bg-primary border-background text-background rounded-md shadow-sm p-2"
              />
            </div>
          ))}

          <div className="flex justify-center p-4 space-x-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-background rounded hover:bg-opacity-80"
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
}
