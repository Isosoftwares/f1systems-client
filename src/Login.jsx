import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight, FaLock, FaEnvelope, FaUserShield } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import MasonicEmblem from "./components/MasonicEmblem";
import masonicWatermark from "./assets/masonicWatermark.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (data) =>
      axios.post("/auth/login", data, { withCredentials: true }),
    onSuccess: (response) => {
      const { accessToken, user, sessionInfo } = response?.data?.data;
      const roles = user?.roles || [user?.role];

      setAuth({
        roles,
        accessToken,
        user,
        userId: user?._id,
        session: sessionInfo,
      });
      toast.success(`Welcome to the Ledger, ${user?.userName || "Admin"}`);
      navigate("/dashboard/overview", { replace: true });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Authentication failed. Please verify credentials.";
      setErrMsg(msg);
      toast.error(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.warning("Please fill in all fields");
    loginMutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#2A2A28] text-[#F4F0E8] overflow-hidden relative selection:bg-[#B9975B] selection:text-[#1c221a]">
      {/* Background Ambience with Faded Masonic Symbols Watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle radial ambient gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,_rgba(59,74,53,0.35)_0%,_rgba(42,42,40,0.95)_70%)]"></div>

        {/* Large Faded Freemason Watermark Emblem (Left Side, as in reference image) */}
        <div
          className="absolute -left-28 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.14] bg-no-repeat bg-contain pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: `url(${masonicWatermark})` }}
        />

        {/* Faint secondary compass pattern top right */}
        <div
          className="absolute -right-36 -top-36 w-[550px] h-[550px] opacity-[0.06] bg-no-repeat bg-contain pointer-events-none"
          style={{ backgroundImage: `url(${masonicWatermark})` }}
        />
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-[500px] p-4 sm:p-6 relative z-10">
        <div className="bg-[#1c221a]/95 backdrop-blur-xl p-8 sm:p-10 rounded-[28px] border border-[#B9975B]/25 shadow-2xl shadow-black/80 relative transition-all duration-300">
          
          {/* Top Masonic Crest & Branding */}
          <div className="mb-7 text-center">
            <div className="flex justify-center mb-3">
              <MasonicEmblem className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(185,151,91,0.3)]" color="#B9975B" />
            </div>

            {/* 1. Admin Login Branding (UPPERCASE & BOLD) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.18em] text-[#F4F0E8] font-serif mb-1 drop-shadow-sm">
              FREEMASON LEDGER
            </h1>

            {/* 2. Admin Login Portal Headline */}
            <div className="flex items-center justify-center gap-2 my-2 text-[#B9975B] text-xs uppercase tracking-[0.25em] font-semibold">
              <span className="w-8 h-[1px] bg-[#B9975B]/40"></span>
              <span>BROTHERHOOD MEMBER PORTAL</span>
              <span className="w-8 h-[1px] bg-[#B9975B]/40"></span>
            </div>

            <p className="text-xs sm:text-sm text-[#F4F0E8]/70 mt-2 font-normal leading-relaxed max-w-sm mx-auto">
              Secure access to your membership records, lodge information, communications, and Masonic resources.
            </p>
          </div>

          {errMsg && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registered Email */}
            <div>
              <label className="block text-xs font-semibold text-[#F4F0E8]/90 mb-1.5 uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9975B]/70">
                  <FaEnvelope size={15} />
                </span>
                <input
                  type="email"
                  required
                  className="w-full bg-[#141812] border border-[#3B4A35] focus:border-[#B9975B] focus:ring-1 focus:ring-[#B9975B] rounded-xl pl-11 pr-4 py-3 text-sm text-[#F4F0E8] outline-none transition-all placeholder:text-[#F4F0E8]/30 shadow-inner"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#F4F0E8]/90 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9975B]/70">
                  <FaLock size={15} />
                </span>
                <input
                  type={visiblePassword ? "text" : "password"}
                  required
                  className="w-full bg-[#141812] border border-[#3B4A35] focus:border-[#B9975B] focus:ring-1 focus:ring-[#B9975B] rounded-xl pl-11 pr-11 py-3 text-sm text-[#F4F0E8] outline-none transition-all placeholder:text-[#F4F0E8]/30 shadow-inner"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVisiblePassword(!visiblePassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F4F0E8]/40 hover:text-[#B9975B] transition-colors"
                >
                  {visiblePassword ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Keep me signed in & Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#F4F0E8]/80 hover:text-[#F4F0E8]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#3B4A35] bg-[#141812] text-[#B9975B] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#B9975B]"
                />
                <span>Keep me signed in</span>
              </label>
              <Link
                to="/reset/password"
                className="text-[#B9975B] hover:text-[#caa868] underline-offset-4 hover:underline font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* 3. Admin Login Button Text Update */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#B9975B] hover:bg-[#c9a769] text-[#1c221a] font-bold text-sm tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-[#B9975B]/20 hover:shadow-[#B9975B]/30 flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? "VERIFYING CREDENTIALS..." : "SIGN IN TO LEDGER"}
              {!isPending && <FaArrowRight size={14} />}
            </button>
          </form>

          {/* Need Access Link */}
          <div className="mt-5 text-center">
            <a
              href="mailto:contact@freemasonledger.com"
              className="inline-flex items-center gap-2 text-xs text-[#B9975B] hover:text-[#caa868] transition-colors font-medium"
            >
              <FaUserShield size={13} />
              <span>Need Access? Contact Lodge Administration</span>
            </a>
          </div>

          {/* 4. Admin Login Security Disclaimer and System Branding */}
          <div className="mt-6 pt-5 border-t border-[#3B4A35]/60 relative text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1c221a] px-2 text-[#B9975B]">
              <div className="w-5 h-5 rounded-full border border-[#B9975B]/50 flex items-center justify-center text-[10px]">
                <FaLock size={8} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-[#B9975B] uppercase flex items-center justify-center gap-1.5">
                <span>🔒</span> SECURE MEMBER ACCESS ONLY
              </p>
              <p className="text-[11px] text-[#F4F0E8]/50 leading-relaxed max-w-xs mx-auto">
                Authorized members only. Your access and account activity are protected and securely recorded.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
