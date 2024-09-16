import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Alt' || event.key === 'Tab' || event.key === 'Escape') {
        alert(`${event.key} key pressed!`);
        console.log(`${event.key} key pressed!`);
        navigate('/exit');
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.error(err));
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen().catch((err) => console.error(err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen().catch((err) => console.error(err));
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div tabIndex={0} onKeyDown={(e) => e.preventDefault()}>
      <button onClick={requestFullscreen}>Enter Fullscreen</button>
      {/* Content */}
    </div>
  );
};

export default App;
