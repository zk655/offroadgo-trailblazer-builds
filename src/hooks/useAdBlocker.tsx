import { useState, useEffect } from 'react';

export const useAdBlocker = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdBlocker = () => {
      try {
        // Create a test element that ad blockers typically block
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox ad-placement google-ad';
        testAd.style.position = 'absolute';
        testAd.style.left = '-10000px';
        testAd.style.width = '1px';
        testAd.style.height = '1px';
        
        document.body.appendChild(testAd);
        
        // Check if the element is hidden (blocked)
        setTimeout(() => {
          const isHidden = testAd.offsetHeight === 0 || 
                          testAd.style.display === 'none' || 
                          testAd.style.visibility === 'hidden';
          
          setIsBlocked(isHidden);
          setIsChecking(false);
          document.body.removeChild(testAd);
        }, 100);
      } catch (error) {
        setIsBlocked(false);
        setIsChecking(false);
      }
    };

    checkAdBlocker();
  }, []);

  return { isBlocked, isChecking };
};