import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight, FaCertificate } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast.success(`Welcome back, ${user?.userName || "Admin"}`);
      navigate("/dashboard/overview", { replace: true });
    },
    onError: (err) => {
      setErrMsg(err?.response?.data?.message || "Login failed");
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.warning("Please fill in all fields");
    loginMutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0e111d] text-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Login Form Container - Centered */}
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-dark-lighter p-8 rounded-3xl border border-white/10 shadow-2xl relative backdrop-blur-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white border border-white/10 shadow-lg font-bold">
                <FaCertificate size={32} className="text-amber-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Freemason Ledger</h2>
            <p className="text-gray-400">Sign in to brotherhood dashboard</p>
          </div>

          {errMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-[#0e111d] border border-gray-700 focus:border-primary rounded-xl px-4 py-3.5 text-white outline-none transition-all placeholder:text-gray-600"
                placeholder="admin@freemasonledger.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={visiblePassword ? "text" : "password"}
                  className="w-full bg-[#0e111d] border border-gray-700 focus:border-primary rounded-xl px-4 py-3.5 text-white outline-none transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVisiblePassword(!visiblePassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {visiblePassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-red-655 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? "Authenticating..." : "Login to Dashboard"}
              {!isPending && <FaArrowRight />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
