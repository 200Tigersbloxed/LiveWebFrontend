import {useState} from "react";

export function CopyField({ label, value }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold small">
                {label}
            </label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    value={value}
                    readOnly
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={copy}
                    title={`Copy ${label}`}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
