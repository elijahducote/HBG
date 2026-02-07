// Background Video Player - Lightweight init
// Reuses the same streaming core (DASH/HLS/native) from the watch player,
// but strips away all UI: no controls, no timeline, no keyboard shortcuts.
// Autoplays muted, loops indefinitely, covers the page as a background.

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  (function() {
    'use strict';

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBgPlayer);
    } else {
      initBgPlayer();
    }

    function initBgPlayer() {
      var video = document.querySelector('.bg-video-wrap video');
      if (!video) return;

      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (navigator.maxTouchPoints > 1);

      // ---- Streaming config (same sources as watch player) ----
      var STREAM_CONFIG = {
        preferredFormat: 'auto',
        hlsSource: '/assets/hbg/hls/master.m3u8',
        dashSource: '/assets/hbg/dash/manifest.mpd',
        dashEnabled: true,
        hlsEnabled: true
      };

      var streamPlayer = null;
      var streamType = null;

      var features = {
        hls: typeof Hls !== 'undefined' && Hls.isSupported(),
        dash: typeof dashjs !== 'undefined' && dashjs.supportsMediaSource(),
        nativeHls: typeof video.canPlayType === 'function' && video.canPlayType('application/vnd.apple.mpegurl') !== ''
      };

      // ---- Force background-friendly attrs ----
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.removeAttribute('preload');
      video.setAttribute('preload', 'auto');
      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;
      video.setAttribute('disablepictureinpicture', '');
      video.setAttribute('disableremoteplayback', '');
      video.addEventListener('contextmenu', function(e) { e.preventDefault(); });

      // ---- Stream init (same priority chain as watch player) ----
      function isAppleDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.userAgentData?.platform === 'macOS' && navigator.maxTouchPoints > 1) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      }

      async function checkFileExists(url) {
        try { var r = await fetch(url, { method: 'HEAD' }); return r.ok; }
        catch { return false; }
      }

      function initDASH() {
        streamType = 'dash';
        streamPlayer = dashjs.MediaPlayer().create();
        streamPlayer.initialize(video, STREAM_CONFIG.dashSource, true);
        streamPlayer.updateSettings({
          streaming: {
            buffer: {
              fastSwitchEnabled: true,
              stableBufferTime: isMobile ? 3 : 10,
              bufferTimeAtTopQuality: isMobile ? 5 : 15,
              bufferToKeep: isMobile ? 2 : 8,
              bufferPruningInterval: isMobile ? 3 : 5,
              initialBufferLevel: isMobile ? 1 : undefined
            },
            abr: {
              autoSwitchBitrate: { video: true, audio: true },
              limitBitrateByPortal: true,
              initialBitrate: isMobile ? { video: 600 } : undefined
            },
            lowLatencyEnabled: false
          }
        });
        streamPlayer.on(dashjs.MediaPlayer.events.ERROR, function() { fallbackToMP4(); });
        // DASH streams may not fire 'ended' reliably, so loop on PLAYBACK_ENDED
        streamPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, function() {
          video.currentTime = 0;
          video.play().catch(function() {});
        });
      }

      function initHLS() {
        streamType = 'hls';
        streamPlayer = new Hls({
          maxBufferLength: isMobile ? 3 : 8,
          maxMaxBufferLength: isMobile ? 6 : 15,
          maxBufferSize: isMobile ? 5 * 1000000 : 20 * 1000000,
          maxBufferHole: 0.5,
          startLevel: isMobile ? 0 : -1,
          autoStartLoad: true,
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: isMobile ? 3 : 10,
          abrEwmaDefaultEstimate: isMobile ? 600000 : undefined,
          abrEwmaFastVoD: isMobile ? 2 : 3,
          abrEwmaSlowVoD: isMobile ? 6 : 9,
          abrBandWidthUpFactor: isMobile ? 0.5 : 0.7,
          fragLoadingTimeOut: isMobile ? 8000 : 20000,
          progressive: isMobile
        });
        streamPlayer.loadSource(STREAM_CONFIG.hlsSource);
        streamPlayer.attachMedia(video);
        streamPlayer.on(Hls.Events.ERROR, function(_event, data) {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) streamPlayer.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) streamPlayer.recoverMediaError();
            else fallbackToMP4();
          }
        });
        // HLS streams may not fire 'ended' reliably, so loop on BUFFER_EOS
        streamPlayer.on(Hls.Events.BUFFER_EOS, function() {
          video.currentTime = 0;
          video.play().catch(function() {});
        });
      }

      function initNativeHLS() {
        streamType = 'native';
        video.src = STREAM_CONFIG.hlsSource;
      }

      function fallbackToMP4() {
        if (streamPlayer) {
          streamType === 'hls' ? streamPlayer.destroy() : streamPlayer.reset();
          streamPlayer = null;
        }
        streamType = 'mp4';
        if (STREAM_CONFIG.mp4Fallback) {
          video.src = STREAM_CONFIG.mp4Fallback;
        }
      }

      async function initStream() {
        var fmt = STREAM_CONFIG.preferredFormat;

        if (STREAM_CONFIG.dashEnabled && (fmt === 'dash' || fmt === 'auto') && features.dash && !isAppleDevice()) {
          if (await checkFileExists(STREAM_CONFIG.dashSource)) { initDASH(); return; }
        }
        if (STREAM_CONFIG.hlsEnabled && (fmt === 'hls' || fmt === 'auto') && features.hls) {
          if (await checkFileExists(STREAM_CONFIG.hlsSource)) { initHLS(); return; }
        }
        if (STREAM_CONFIG.hlsEnabled && features.nativeHls) {
          if (await checkFileExists(STREAM_CONFIG.hlsSource)) { initNativeHLS(); return; }
        }
        streamType = 'mp4';
        if (STREAM_CONFIG.mp4Fallback) video.src = STREAM_CONFIG.mp4Fallback;
      }

      // ---- Autoplay ----
      function tryAutoplay() {
        if (video.paused) {
          var p = video.play();
          if (p && p.catch) p.catch(function() {});
        }
      }

      video.addEventListener('canplay', tryAutoplay, { once: true });

      // ---- Loop (belt-and-suspenders for streams that don't honour loop attr) ----
      video.addEventListener('ended', function() {
        video.currentTime = 0;
        tryAutoplay();
      });

      // ---- Recovery: handle pause, stall, and visibility changes ----
      // Resume if video gets paused unexpectedly
      video.addEventListener('pause', function() {
        // Small delay to avoid fighting with intentional pauses
        setTimeout(tryAutoplay, 100);
      });

      // Resume if video stalls
      video.addEventListener('stalled', tryAutoplay);
      video.addEventListener('waiting', function() {
        // If waiting too long, try to recover
        setTimeout(function() {
          if (video.paused || video.readyState < 3) {
            tryAutoplay();
          }
        }, 3000);
      });

      // Resume when tab becomes visible again
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          tryAutoplay();
        }
      });

      // ---- Cleanup ----
      window.addEventListener('beforeunload', function() {
        if (streamPlayer) {
          streamType === 'hls' ? streamPlayer.destroy() : streamPlayer.reset();
        }
      });

      // ---- Go ----
      initStream();
    }
  })();
}
