
    const audio = document.getElementById('myAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const waveform = document.getElementById('waveform');
    const spans = document.querySelectorAll('.transcript-text');
  
    function timeToSeconds(t) {
      if (!t.includes(':')) return parseFloat(t);
      const parts = t.split(':').map(Number);
      return parts.length === 2 ? parts[0] * 60 + parts[1] : parseFloat(t);
    }
  
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });
  
    audio.addEventListener('play', () => {
      playIcon.className = 'pause-icon';
      playIcon.innerHTML = '<div></div><div></div>';
      waveform.style.display = 'flex';
    });
  
    audio.addEventListener('pause', () => {
      playIcon.className = 'play-icon';
      playIcon.innerHTML = '';
      waveform.style.display = 'none';
    });
  
    if (audio.paused) {
      playIcon.className = 'play-icon';
      playIcon.innerHTML = '';
      waveform.style.display = 'none';
    }
  
    audio.ontimeupdate = () => {
      const time = audio.currentTime;
      spans.forEach(span => {
        const start = timeToSeconds(span.getAttribute('data-start'));
        const end = timeToSeconds(span.getAttribute('data-end'));
  
        if (time >= start && time < end) {
          span.classList.add('active');
        } else {
          span.classList.remove('active');
        }
      });
    };

  

    document.getElementById("year").textContent = new Date().getFullYear();