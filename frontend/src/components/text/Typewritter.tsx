import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number; // en millisecondes
  onComplete?: () => void;
}

const Typewriter = ({ text, delay = 100, onComplete = () => {} }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const currentIndexRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (finishedRef.current) return;

      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimestampRef.current;

      if (elapsed >= delay) {
        lastTimestampRef.current = timestamp;

        if (currentIndexRef.current < text.length) {
          setDisplayText(prev => prev + text[currentIndexRef.current]);
          currentIndexRef.current += 1;
        } 
        
        if (currentIndexRef.current >= text.length) {
          finishedRef.current = true;
          onComplete();
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, delay, onComplete]);

  return <span>{displayText}</span>;
};

export default Typewriter;
