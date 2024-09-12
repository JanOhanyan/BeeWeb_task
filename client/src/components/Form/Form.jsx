import React, { useState, useEffect } from 'react';
import './form.css';

const FormComponent = ({ onClose }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [variants, setVariants] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === '' || slug.trim() === '') {
            alert('Please enter both name and slug');
            return;
        }

        try {
            const checkSlugResponse = await fetch(`http://localhost:3001/workspace/check?slug=${encodeURIComponent(slug)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: 'include',
            });

            if (!checkSlugResponse.ok) {
                const errorData = await checkSlugResponse.json();
                throw new Error(errorData.message || 'An error occurred while processing the request');
            }

            const data = await checkSlugResponse.json();
            if (data.isFree === true) {
                const response = await fetch("http://localhost:3001/workspace", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name, slug }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'An error occurred while processing the request');
                }

            } else {
                setVariants(data.variants || []);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError(error.message); 
        }
        window.location.reload();
    };

    const handleVariantClick = (variant) => {
        setSlug(variant); 
        setVariants([]);
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2>Enter Workspace Details</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Slug:
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </label>
                    {variants.length > 0 && (
                        <div className="variant-list">
                            {variants.map((variant, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className="variant-button"
                                    onClick={() => handleVariantClick(variant)}
                                >
                                    {variant}
                                </button>
                            ))}
                        </div>
                    )}
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default FormComponent;
