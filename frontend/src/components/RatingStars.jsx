import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating, count, showCount = true }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b' }}>
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= fullStars || (starNumber === fullStars + 1 && hasHalfStar);
          return (
            <Star
              key={index}
              size={15}
              fill={isFilled ? '#f59e0b' : 'none'}
              color={isFilled ? '#f59e0b' : '#64748b'}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginLeft: '0.2rem' }}>
        {rating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
