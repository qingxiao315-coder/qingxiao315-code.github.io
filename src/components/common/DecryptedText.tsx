import React, { useState, useEffect } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayedText(
        text.split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === ' ' || char === '\n') return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};
