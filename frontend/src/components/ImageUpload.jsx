import React from "react";

export default function ImageUpload({ onFileSelect }) {
    const handleChange = e => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange} />
        </div>
    );
}