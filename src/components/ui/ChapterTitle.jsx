import React, { useState, useRef, useEffect } from 'react';
import './ChapterTitle.css';

const ChapterTitle = ({ title, className = "", inline = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMarquee = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setShouldMarquee(textWidth > containerWidth);
      }
    };

    checkMarquee();
    
    // Re-check on window resize
    window.addEventListener('resize', checkMarquee);
    return () => window.removeEventListener('resize', checkMarquee);
  }, [title]);

  if (!shouldMarquee) {
    return (
      <span className={`font-medium text-gray-900 ${className}`} title={title}>
        {title}
      </span>
    );
  }

  // Add a small delay before starting marquee to improve UX
  const handleMouseEnter = () => {
    setTimeout(() => setIsHovered(true), 300);
  };

  const containerClasses = inline 
    ? `chapter-title-container inline-block ${className}` 
    : `chapter-title-container ${className}`;
  const textClasses = 'chapter-title-text font-medium text-gray-900';

  return (
    <span 
      ref={containerRef}
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{ maxWidth: '100%' }}
    >
      <span 
        ref={textRef}
        className={textClasses}
        style={{
          width: 'max-content'
        }}
      >
        {title}
      </span>
    </span>
  );
};

export default ChapterTitle;
