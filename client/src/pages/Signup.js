import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Simple client-side validation
    if (!form.name || !form.email || !form.password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Please login.");
        setForm({ name: "", email: "", password: "" });
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Signup failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-7 text-center">
          Sign Up for MoneyMatic
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-500 font-semibold">{message}</div>
        )}
        <p className="mt-4 text-center text-gray-500">
          Already have an account?
          <Link to="/" className="text-blue-700 font-semibold ml-1 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
