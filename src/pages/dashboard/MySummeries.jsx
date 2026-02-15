import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Share2, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShareModal from "../../components/ShareModal";

export default function MySummary() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [currentShareTitle, setCurrentShareTitle] = useState("");

  const navigate = useNavigate();

  const fetchMySummaries = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/article/user/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setArticles(data);
      else console.error("Failed to fetch:", data.message);
    } catch (err) {
      console.error("Error fetching summaries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySummaries();
  }, []);

  const handleShare = (article) => {
    const url = `${window.location.origin}/share/${article._id}`;
    setCurrentShareUrl(url);
    setCurrentShareTitle(article.title || "Check out this summary!");
    setShareModalOpen(true);
  };

  const handleAskAI = (id) => {
    navigate(`/summaries/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="w-8 h-8 animate-spin text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  if (articles.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg px-4 text-center">
        No summaries found.
      </div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto !mt-[70px] px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          🧠 My Summaries
        </h1>

        <div className="flex flex-col gap-3">
          {articles.map((article) => (
            <div
              key={article._id}
              className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-1">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAskAI(article._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                      title="Ask AI about this"
                    >
                      <Bot className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleShare(article)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                      title="Share this summary"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 text-sm sm:text-base line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-auto">
                {new Date(article.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={currentShareUrl}
        title={currentShareTitle}
      />
    </>
  );
}
