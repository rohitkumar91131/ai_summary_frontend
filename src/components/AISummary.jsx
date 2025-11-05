import React, { useState } from 'react';

export default function AISummary({ endpoint = '/api/summarize' }) {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSummarize() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSummary('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setSummary(data.summary ?? data.result ?? data.data ?? '');
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[100dvh] w-[100dvw]  bg-gradient-to-b from-white to-gray-50 flex items-center justify-center ">
      <div className="w-full max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">AI Summariser</h1>
          <p className="mt-2 text-sm text-gray-500">Paste text below and get a concise summary in one click.</p>
        </header>

        <main className="bg-white shadow-md rounded-lg p-6">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            Input text
          </label>
          <textarea
            id="inputText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste or type text here..."
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y text-sm text-gray-800"
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Summarising...' : 'Summarise'}
            </button>

            <button
              onClick={() => {
                setText('');
                setSummary('');
                setError(null);
              }}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>

            <div className="ml-auto text-xs text-gray-500">
              {text.length} chars
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              Error: {error}
            </div>
          )}

          {summary && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
              <div className="whitespace-pre-wrap bg-gray-50 border border-gray-100 rounded-md p-4 text-sm text-gray-800">
                {summary}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(summary)}
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    setText(summary);
                    setSummary('');
                    setError(null);
                  }}
                  className="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Use as input
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}