const button = document.getElementById('button');

button.addEventListener('click', async () => {
  try {
    const fingerprintData = {
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      hardware_concurrency: navigator.hardwareConcurrency || 0,
      device_memory: navigator.deviceMemory || 0,
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
    canvas.width = 256;
    canvas.height = 256;
    // пытаемся получить WebGL через разные способы
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
      || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!gl) return 'webgl-not-supported';

    // 2) Рисуем простую треугольную сцену
    const vertShaderSrc = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
    }`;
    const fragShaderSrc = `
    precision mediump float;
    uniform vec2 u_res;
    void main() {
      // градиент от центра
      float d = distance(gl_FragCoord.xy, u_res * 0.5) / (u_res.x * 0.5);
      gl_FragColor = vec4(d, 1.0 - d, sin(d * 3.1415), 1);
    }`;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertShaderSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragShaderSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Буфер для квадрата, покрывающего экран
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
      1,-1,  1,1,   -1,1
    ]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Передаём разрешение
    const resLoc = gl.getUniformLocation(program, 'u_res');
    gl.uniform2f(resLoc, canvas.width, canvas.height);

    // Рендерим
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 3) Читаем «сырые» пиксели
    const pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    // 4) Сразу собираем несколько WebGL-параметров
    const ext  = gl.getExtension('WEBGL_debug_renderer_info');
    const info = {
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : 'none',
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'none',
      version: gl.getParameter(gl.VERSION),
      shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };

    // 5) Подготовим один большой буфер для хеша:
    // сначала параметры в строку, потом raw-пиксели
    const encoder = new TextEncoder();
    const infoBytes = encoder.encode(
      info.vendor + '|' +
      info.renderer + '|' +
      info.version + '|' +
      info.shadingLanguage + '|'
    );
    const total = new Uint8Array(infoBytes.length + pixels.length);
    total.set(infoBytes, 0);
    total.set(pixels, infoBytes.length);

    // 6) Посчитаем SHA-256
    const hashBuf = await crypto.subtle.digest('SHA-256', total);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2,'0')).join('');
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
