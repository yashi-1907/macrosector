import React, { useState } from "react";
import { MacroHeaderIllustration } from "./MacroHeaderIllustration";
import { ScenarioShock } from "../utils/quantEngine";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, User } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string) => void;
  shock: ScenarioShock;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, shock }) => {
  const [email, setEmail] = useState("analyst@macro-research.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email || "analyst@macro-research.com");
    }, 400);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin("institutional.pm@macro-research.com");
    }, 250);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl bg-white border border-[#E8E3D8] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Related Picture & Branding (5 cols) */}
        <div className="md:col-span-6 bg-[#FAF8F3] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E3D8]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#245A46] bg-[#245A46]/10 px-2.5 py-0.5 rounded font-mono-tabular">
                Institutional Access
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2421] leading-tight mb-4">
              Macro-Financial Sector Stress Tester
            </h1>

            {/* The Related Institutional Picture */}
            <div className="border border-[#E0D9CB] rounded-md overflow-hidden bg-white shadow-2xs">
              <div className="px-3 py-1.5 border-b border-[#EAE4D8] bg-[#F7F4EB] text-[10px] font-mono-tabular text-[#5C625C] flex justify-between items-center">
                <span>Multi-Factor Stress Manifold</span>
                <span className="text-[#245A46] font-bold">11 Sectors</span>
              </div>
              <MacroHeaderIllustration shock={shock} className="h-44 sm:h-52 w-full border-0 rounded-none" />
            </div>
          </div>
        </div>

        {/* Right Column: Clean Login Form (7 cols) */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-6">
              <h2 className="font-editorial text-xl font-bold text-[#1F2421]">
                Sign In to Workstation
              </h2>
              <p className="text-xs text-[#5C625C] mt-1">
                Enter your institutional credentials to open the stress tester dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2421] mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C625C]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F3] border border-[#DCD5C6] rounded-md text-xs text-[#1F2421] focus:outline-none focus:border-[#245A46] focus:ring-1 focus:ring-[#245A46] transition-colors font-mono-tabular"
                    placeholder="analyst@firm.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1F2421]">
                    Access Key / Password
                  </label>
                  <span className="text-[11px] text-[#5C625C] hover:text-[#245A46] cursor-pointer">
                    Demo Mode Active
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C625C]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F3] border border-[#DCD5C6] rounded-md text-xs text-[#1F2421] focus:outline-none focus:border-[#245A46] focus:ring-1 focus:ring-[#245A46] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#5C625C]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#245A46] rounded border-[#DCD5C6] focus:ring-0"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] text-[#245A46] font-mono-tabular">
                  OLS / Ridge
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1F2421] hover:bg-[#245A46] text-white text-xs font-semibold rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Opening Dashboard...</span>
                ) : (
                  <>
                    <span>Sign In & Open Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* 1-Click Quick Demo Access */}
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#F5F2EA] hover:bg-[#EAE4D7] border border-[#E0D9CB] text-[#1F2421] text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245A46]" />
                <span>Quick 1-Click Demo Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
