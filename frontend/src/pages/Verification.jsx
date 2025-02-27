import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { verifyUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";

const Verification = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");
  
    useEffect(() => {
      if (user) {
        if (cart?.products?.length > 0 && guestId) {
          dispatch(mergeCart({ guestId, user })).then(() => {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          });
        } else {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        }
      }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 5) {
      alert("Enter a valid 5-digit OTP");
      return;
    }

    if (!state?.activationToken) {
      console.error("No activation token found!");
      return;
    }

    const result = await dispatch(
      verifyUser({ otp, activationToken: state.activationToken })
    );

    if (result.payload?.message === "User registered successfully") {
      navigate("/login");
    } else {
        console.error("Verification failed", result);
    }
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleVerify}
          action=""
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">FashionClub.</h2>
          </div>
          <p className="text-center mb-6">Enter your OTP to Login.</p>
          <div className="mb-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter your OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            disabled={loading}
          >
            Verify OTP
          </button>
          <p className="mt-6 text-center text-sm">
            You haven&apos;t received the OTP yet?
            <Link to="" className="text-blue-500 ml-1">
              Resend
            </Link>
          </p>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Verification;
