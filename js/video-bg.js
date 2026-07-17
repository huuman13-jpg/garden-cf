(function() {
  'use strict';

  var video = document.getElementById('bg-video');
  if (!video) {
    console.error('[VideoBG] Không tìm thấy #bg-video!');
    return;
  }

  var oldCanvas = document.getElementById('bg-canvas');
  if (oldCanvas) oldCanvas.style.display = 'none';

  // ============================================================
  // 1. CSS VIDEO
  // ============================================================
  var supportsDvh = window.CSS && CSS.supports && CSS.supports('height', '100dvh');
  video.style.cssText =
    'position:fixed !important;' +
    'top:0 !important;left:0 !important;' +
    'width:100vw !important;height:' + (supportsDvh ? '100dvh' : '100vh') + ' !important;' +
    'object-fit:cover !important;' +
    'z-index:-1 !important;' +
    'pointer-events:none !important;' +
    'opacity:1 !important;' +
    'margin:0 !important;padding:0 !important;' +
    'background:#000 !important;';

  var wrapper = document.querySelector('.section-wrapper');
  if (wrapper) {
    wrapper.style.position = 'relative';
    wrapper.style.zIndex = '1';
  }

  // ============================================================
  // 2. OVERLAY
  // ============================================================
  var overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'z-index:0;pointer-events:none;' +
    'background:linear-gradient(135deg,rgba(13,17,23,0.65) 0%,rgba(13,17,23,0.4) 50%,rgba(13,17,23,0.55) 100%);';
  document.body.appendChild(overlay);

  var vignette = document.createElement('div');
  vignette.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'z-index:0;pointer-events:none;' +
    'background:radial-gradient(ellipse at center,transparent 35%,rgba(13,17,23,0.7) 100%);';
  document.body.appendChild(vignette);

  // ============================================================
  // 3. PLAY
  // ============================================================
  var source = video.querySelector('source');
  var videoSrc = source ? source.getAttribute('src') : 'không có src';

  video.addEventListener('error', function() {
    var err = video.error;
    var msg = 'Lỗi không xác định';
    if (err) {
      switch(err.code) {
        case 1: msg = 'VIDEO_ABORTED: Người dùng hủy việc tải'; break;
        case 2: msg = 'NETWORK_ERROR: Không tải được file (kiểm tra đường dẫn)'; break;
        case 3: msg = 'DECODE_ERROR: File video bị hỏng hoặc không hỗ trợ'; break;
        case 4: msg = 'SRC_NOT_SUPPORTED: Định dạng không hỗ trợ hoặc file không tồn tại'; break;
      }
    }
    console.error('[VideoBG] ' + msg);
    console.error('[VideoBG] Đường dẫn: "' + videoSrc + '"');
  });

  video.play().then(function() {
    console.log('[VideoBG] Đang phát:', videoSrc);
  }).catch(function(err) {
    console.warn('[VideoBG] Tự động phát bị chặn, chờ click:', err.message);
    function tryPlay() {
      video.play().then(function() {
        console.log('[VideoBG] Phát sau click');
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      }).catch(function() {});
    }
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
  });

  video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
  });

  // ============================================================
  // 4. SPARKLES
  // ============================================================
  var styleSheet = document.createElement('style');
  styleSheet.textContent =
    '@keyframes sf{0%{opacity:0;transform:translateY(0) scale(.4)}' +
    '25%{opacity:.6;transform:translateY(-12px) scale(1)}' +
    '50%{opacity:.3;transform:translateY(-28px) scale(.7)}' +
    '75%{opacity:.5;transform:translateY(-18px) scale(1.1)}' +
    '100%{opacity:0;transform:translateY(-40px) scale(.2)}}';
  document.head.appendChild(styleSheet);

  for (var i = 0; i < 18; i++) {
    var el = document.createElement('div');
    var sz = 2 + Math.random() * 3;
    var dur = 4 + Math.random() * 6;
    el.style.cssText =
      'position:fixed;border-radius:50%;pointer-events:none;z-index:2;' +
      'width:' + sz + 'px;height:' + sz + 'px;' +
      'left:' + (Math.random()*100) + 'vw;top:' + (Math.random()*100) + 'vh;' +
      'background:radial-gradient(circle,rgba(197,168,128,.8) 0%,transparent 70%);' +
      'opacity:0;animation:sf ' + dur + 's ' + (Math.random()*dur) + 's infinite ease-in-out';
    document.body.appendChild(el);
  }

  // ============================================================
  // 5. SCROLL PARALLAX
  // ============================================================
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        var max = document.body.scrollHeight - window.innerHeight;
        var p = max > 0 ? window.scrollY / max : 0;
        var s = 1 + p * 0.18;
        var d = 0.4 + p * 0.25;
        video.style.transform = 'scale(' + s + ')';
        overlay.style.background =
          'linear-gradient(135deg,rgba(13,17,23,' + (d+.2) + ') 0%,' +
          'rgba(13,17,23,' + d + ') 50%,' +
          'rgba(13,17,23,' + (d+.15) + ') 100%)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();
