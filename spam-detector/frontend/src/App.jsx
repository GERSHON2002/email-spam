import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setText('');
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null);
        setError('');

        try {
            let response;
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                response = await axios.post(`${API_BASE_URL}/analyze-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else if (text.trim()) {
                response = await axios.post(`${API_BASE_URL}/analyze-text`, { text });
            } else {
                throw new Error('Please provide text or an image.');
            }

            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setText('');
        setImage(null);
        setPreview(null);
        setResult(null);
        setError('');
    };

    return (
        <div className="container">
            <h1>AI Spam Detector</h1>
            <p className="subtitle">Secure your inbox with advanced AI email analysis</p>

            <div className="input-section">
                {!preview && (
                    <textarea
                        placeholder="Paste your email content here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />
                )}

                <div
                    className="upload-zone"
                    onClick={() => !loading && fileInputRef.current.click()}
                >
                    {preview ? (
                        <div>
                            <img src={preview} alt="Preview" className="preview-img" />
                            <p style={{ marginTop: '1rem' }}>Click to change image</p>
                        </div>
                    ) : (
                        <p>Or drag & drop / click to upload an email screenshot</p>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                {error && <p style={{ color: 'var(--accent-spam)', textAlign: 'center' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="analyze-btn"
                        style={{ flex: 2 }}
                        onClick={handleAnalyze}
                        disabled={loading || (!text.trim() && !image)}
                    >
                        {loading ? <div className="loader"></div> : 'Analyze Email'}
                    </button>

                    {(text || image) && (
                        <button
                            className="analyze-btn"
                            style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}
                            onClick={reset}
                            disabled={loading}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {result && (
                <div className="results">
                    <div className="result-header">
                        <h2 style={{ fontFamily: 'Outfit' }}>Analysis Result</h2>
                        <span className={`badge ${result.classification === 'Spam' ? 'badge-spam' : 'badge-ham'}`}>
                            {result.classification}
                        </span>
                    </div>

                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Confidence Level: {(result.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="confidence-bar">
                        <div
                            className="confidence-fill"
                            style={{
                                width: `${result.confidence * 100}%`,
                                background: result.classification === 'Spam' ? 'var(--accent-spam)' : 'var(--accent-ham)'
                            }}
                        ></div>
                    </div>

                    <div className="reasoning">
                        <p>{result.reasoning}</p>
                    </div>

                    {result.key_flags && result.key_flags.length > 0 && (
                        <div className="flags">
                            {result.key_flags.map((flag, i) => (
                                <span key={i} className="flag">🚨 {flag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
