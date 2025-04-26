import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) {
      alert('Please upload a resume and enter a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_desc', jobDesc);

    setLoading(true);
    try {
      const res = await fetch('https://resume-analyzer-ai-saas.onrender.com/analyze/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze resume.');
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Error analyzing resume.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center flex-col gap-6 p-8 text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-slate-800">Resume Analyzer</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        <label className="text-lg w-full text-left">
          Upload Resume (.txt, .pdf, .docx)
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block mt-2 w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="text-lg w-full text-left">
          Paste Job Description
          <textarea
            rows="6"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="block w-full border border-gray-300 p-2 mt-2 rounded"
            placeholder="Paste the job description here..."
          ></textarea>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-4 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-10 w-full max-w-4xl bg-gray-100 p-8 rounded-xl text-left shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Analysis Result</h2>

          <div className="mb-6">
            <p className="font-bold mb-2">Match Score:</p>
            <p className="text-xl">{result?.score}%</p>
          </div>

          <div className="mb-6">
            <p className="font-bold mb-2">Resume Preview:</p>
            <pre className="whitespace-pre-wrap bg-white p-4 rounded">{result?.preview || "No preview available."}</pre>
          </div>

          <div>
            <p className="font-bold mb-2">Job Description Preview:</p>
            <pre className="whitespace-pre-wrap bg-white p-4 rounded">{result?.job_desc || "No job description preview."}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
