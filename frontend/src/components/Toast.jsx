import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        {type === 'success' ? (
          <CheckCircle2 size={18} color="#10b981" />
        ) : (
          <AlertCircle size={18} color="#ef4444" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
