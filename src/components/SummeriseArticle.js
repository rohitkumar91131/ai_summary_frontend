import React, { useState } from "react";
import { toast } from "sonner";

export default function SummeriseArticle() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setLoading(true);
    setSummary("");
    const clearTime = setInterval(() => {
      setTitle((prev) => (prev.length < 13 ? prev + "." : "."));
    }, 300);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || "Untitled Article");
        setSummary(data.summary || "No summary returned.");
        toast.success("Summary generated successfully");
      } else {
        toast.error(data.error || data.message || "Failed to generate summary");
      }
      clearInterval(clearTime);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Summary copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy summary");
    }
  };

  return (
      <main className="min-h-[100dvh] w-[100dvw] flex items-center justify-center ">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-slate-800 mb-2 text-center">
            Summarize Article
          </h2>
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">{typeof title === "string" && title}</h3>

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Paste or write your article here..."
              className="w-full min-h-[200px] max-h-[400px] p-4 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (!text) {
                      toast.error("Clipboard is empty");
                      return;
                    }
                    setContent(text);
                    toast.success("Pasted from clipboard");
                  } catch (err) {
                    toast.error("Failed to read clipboard");
                  }
                }}
                disabled={loading}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-60"
              >
                Paste
              </button>

              <button
                type="button"
                onClick={() => setContent("")}
                disabled={loading}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-60"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 flex items-center gap-2 disabled:opacity-60"
              >
                {loading && (
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                <span>{loading ? "Summarizing..." : "Summarize"}</span>
              </button>
            </div>
          </form>

          {summary && (
            <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-6 relative">
              <button
                onClick={copySummary}
                aria-label="Copy summary to clipboard"
                title={copied ? "Copied" : "Copy summary"}
                className="absolute right-4 top-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-slate-200 hover:bg-slate-100 shadow-sm"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8M7 11h10M7 15h10M7 19h10" />
                  </svg>
                )}
                <span className="text-slate-600 hidden sm:block">{copied ? "Copied" : "Copy"}</span>
              </button>

              <h4 className="text-lg font-semibold text-slate-700 mb-3">Here is your summary</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{typeof summary ? summary : "Failed to summerise your article"}</p>
            </div>
          )}
        </div>
      </main>

  );
}
