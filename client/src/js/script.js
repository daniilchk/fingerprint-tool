const button = document.getElementById('button');

button.addEventListener('click', async () => {
  try {
    const fingerprintData = {
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      hardware_concurrency: navigator.hardwareConcurrency || 0,
      device_memory: navigator.deviceMemory || 0,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      available_resolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
      color_depth: window.screen.colorDepth,
      pixel_ratio: window.devicePixelRatio || 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezone_offset: new Date().getTimezoneOffset(),
      cookies_enabled: navigator.cookieEnabled,
      local_storage: !!window.localStorage,
      session_storage: !!window.sessionStorage,
      indexed_db: !!window.indexedDB,
      webgl_vendor: getWebGLVendor(),
      webgl_renderer: getWebGLRenderer(),
      canvas_fingerprint: await getCanvasFingerprint(),
      audio_fingerprint: await getAudioFingerprint(),
      plugins: Array.from(navigator.plugins).map(p => p.name),
      mime_types: Array.from(navigator.mimeTypes).map(m => m.type),
      touch_support: {
        max_touch_points: navigator.maxTouchPoints || 0,
        touch_event: 'ontouchstart' in window,
        pointer_event: 'onpointerdown' in window
      },
      media_devices_count: await getMediaDevicesCount()
    };

    const response = await fetch('http://localhost:3000/api/fingerprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fingerprintData)
    });

    const result = await response.json();
    if (!response.ok) {
      const errorMsg = result.message || result.error || 'Unknown server error';
      throw new Error(errorMsg);
    }

    alert('Verification passed successfully');
  } catch(e) {
    alert(`Error: ${e.message}`);
  }
})

function getWebGLVendor() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl ? gl.getParameter(gl.VENDOR) : 'unsupported';
  } catch (e) {
    return 'error';
  }
}

function getWebGLRenderer() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl ? gl.getParameter(gl.RENDERER) : 'unsupported';
  } catch (e) {
    return 'error';
  }
}

async function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Fingerprint', 2, 15);
    return canvas.toDataURL();
  } catch (e) {
    return 'error';
  }
}

async function getMediaDevicesCount() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.length;
  } catch (e) {
    return 0;
  }
}

async function getAudioFingerprint() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return 'unsupported';

    const context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    oscillator.connect(analyser);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, 0);

    oscillator.start(0);
    context.startRendering();

    return new Promise((resolve) => {
      context.oncomplete = (event) => {
        analyser.getByteFrequencyData(dataArray);
        oscillator.stop();
        oscillator.disconnect();

        resolve(
          Array.from(dataArray)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .slice(0, 32)
        );
      };
    });

  } catch (e) {
    console.error('Audio fingerprint error:', e);
    return 'error';
  }
}
