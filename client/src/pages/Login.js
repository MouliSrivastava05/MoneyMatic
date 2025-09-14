import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-7 text-center">Login to MoneyMatic</h2>
        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          Don't have an account?
          <Link to="/signup" className="text-blue-700 font-semibold ml-1 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
