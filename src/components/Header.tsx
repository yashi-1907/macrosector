import React from "react";
import { Download, RotateCcw, FileCode, LogOut, User, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "heatmap" | "memo" | "code";
  setActiveTab: (tab: "dashboard" | "heatmap" | "memo" | "code") => void;
  onResetShocks: () => void;
  onOpenCode: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetShocks,
  onOpenCode,
  isAuthenticated,
  userEmail,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E3D8] px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <span className="font-editorial text-xl font-bold tracking-tight text-[#1F2421]">
            Macro-Financial Stress Engine
          </span>
        </div>

        {/* Zone 2: Navigation Links (Only shown when authenticated) */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#5C625C]">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === "dashboard"
                  ? "text-[#1F2421] border-b-2 border-[#1F2421]"
                  : "hover:text-[#1F2421]"
              }`}
            >
              Sector Stress Tester
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === "heatmap"
                  ? "text-[#1F2421] border-b-2 border-[#1F2421]"
                  : "hover:text-[#1F2421]"
              }`}
            >
              Factor Beta Heatmap
            </button>
            <button
              onClick={() => setActiveTab("memo")}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === "memo"
                  ? "text-[#1F2421] border-b-2 border-[#1F2421]"
                  : "hover:text-[#1F2421]"
              }`}
            >
              Rotation Memo & Tilts
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`transition-colors pb-0.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "code"
                  ? "text-[#1F2421] border-b-2 border-[#1F2421]"
                  : "hover:text-[#1F2421]"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Python & Streamlit Source
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#5C625C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#245A46]" />
            <span className="hidden sm:inline">Institutional Security Gateway</span>
          </div>
        )}

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <button
                onClick={onResetShocks}
                title="Reset all macro shocks to baseline"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5C625C] hover:text-[#1F2421] bg-[#F2EDE2] hover:bg-[#EAE4D7] rounded border border-[#E0D9CB] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
              <button
                onClick={onOpenCode}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1F2421] hover:bg-[#245A46] rounded transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Deliverables</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title={`Sign out (${userEmail || "current session"})`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#A44234] hover:text-white hover:bg-[#A44234] bg-white border border-[#E8E3D8] hover:border-[#A44234] rounded transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden lg:inline text-[11px] font-mono-tabular">Sign Out</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-[11px] font-mono-tabular text-[#5C625C] bg-[#FAF8F3] px-2.5 py-1 border border-[#E0D9CB] rounded">
              Status: <span className="text-[#A44234] font-semibold">Authentication Required</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

