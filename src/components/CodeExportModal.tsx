import React, { useState } from "react";
import { Download, Copy, Check, Terminal, FileCode, CheckCircle2 } from "lucide-react";
import { PYTHON_SCRIPT_CODE } from "../data/pythonScriptContent";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REQUIREMENTS_TEXT = `streamlit>=1.35.0
yfinance>=0.2.38
pandas>=2.2.0
numpy>=1.26.0
scikit-learn>=1.4.0
plotly>=5.20.0
scipy>=1.12.0
requests>=2.31.0
`;

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<"app.py" | "requirements.txt">("app.py");
  const [copied, setCopied] = useState<boolean>(false);
  const [appPyCode, setAppPyCode] = useState<string>(PYTHON_SCRIPT_CODE);

  // Attempt to load latest root app.py if accessible
  React.useEffect(() => {
    fetch("/app.py")
      .then((res) => {
        if (res.ok) return res.text();
        return Promise.reject();
      })
      .then((text) => setAppPyCode(text))
      .catch(() => {
        // Keeps PYTHON_SCRIPT_CODE
      });
  }, []);

  if (!isOpen) return null;

  const currentContent = activeFile === "app.py" ? appPyCode : REQUIREMENTS_TEXT;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2421]/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D8] bg-[#FBF9F5]">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-[#245A46]" />
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#1F2421]">
                Deliverable Code Hub: Streamlit & Python Pipeline
              </h3>
              <p className="text-xs text-[#5C625C]">
                Self-contained Python application and requirements matching quantitative specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-[#5C625C] hover:text-[#1F2421] bg-[#F2EDE2] rounded border border-[#E0D9CB]"
          >
            Close (Esc)
          </button>
        </div>

        {/* File Tabs & Actions */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#FAF8F3] border-b border-[#E8E3D8]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile("app.py")}
              className={`px-3 py-1.5 text-xs font-mono-tabular font-semibold rounded transition-colors ${
                activeFile === "app.py"
                  ? "bg-[#1F2421] text-white"
                  : "text-[#5C625C] hover:text-[#1F2421] hover:bg-[#F0EBE0]"
              }`}
            >
              app.py (Streamlit Application)
            </button>
            <button
              onClick={() => setActiveFile("requirements.txt")}
              className={`px-3 py-1.5 text-xs font-mono-tabular font-semibold rounded transition-colors ${
                activeFile === "requirements.txt"
                  ? "bg-[#1F2421] text-white"
                  : "text-[#5C625C] hover:text-[#1F2421] hover:bg-[#F0EBE0]"
              }`}
            >
              requirements.txt
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F2421] bg-[#FFFFFF] border border-[#E0D9CB] rounded hover:bg-[#F4F1EA] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#245A46]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#245A46] rounded hover:bg-[#1C4636] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeFile}</span>
            </button>
          </div>
        </div>

        {/* Quick Execution Tip */}
        <div className="px-6 py-2 bg-[#F5F2EA] border-b border-[#E8E3D8] text-[11px] text-[#5C625C] flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#245A46]" />
          <span>Execution command:</span>
          <code className="font-mono-tabular bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E0D9CB] text-[#1F2421]">
            pip install -r requirements.txt && streamlit run app.py
          </code>
        </div>

        {/* Code Content Viewport */}
        <div className="flex-1 overflow-auto p-4 bg-[#FBF9F5]">
          <pre className="font-mono-tabular text-xs text-[#1F2421] leading-relaxed p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-md overflow-x-auto whitespace-pre">
            {currentContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
