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

      var ua = navigator.userAgent;
      var platform = navigator.platform || '';

      // Platform detection
      var isIOS = /iPad|iPhone|iPod/.test(ua) ||
                  (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var isAndroid = /Android/i.test(ua);
      var isSafari = /^((?!chrome|android).)*safari/i.test(ua);

      // Quirky mobile browsers
      var isYandex = /YaBrowser/i.test(ua);
      var isOperaMobile = /OPR|Opera Mini|Opera Mobi/i.test(ua);
      var isUCBrowser = /UCBrowser|UCWEB/i.test(ua);
      var isMiBrowser = /MiuiBrowser/i.test(ua);
      var isQuirkyMobileBrowser = isYandex || isOperaMobile || isUCBrowser || isMiBrowser;

      var isMobile = isIOS || isAndroid ||
                     /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
                     (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

      // Low-end device detection
      var isLowEndDevice = (function() {
        var memory = navigator.deviceMemory;
        var cores = navigator.hardwareConcurrency;
        if (memory && memory <= 2) return true;
        if (cores && cores <= 2) return true;
        if (isAndroid && /Android [4-6]/i.test(ua)) return true;
        if (isUCBrowser || isMiBrowser) return true;
        return false;
      })();

      var needsConservativeSettings = isQuirkyMobileBrowser || isLowEndDevice;

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

      // Optimistic load - try source directly, handle errors via player events
      function tryLoadSource(initFn, fallbackFn) {
        try {
          initFn();
          return true;
        } catch (e) {
          if (fallbackFn) fallbackFn();
          return false;
        }
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
            }
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

        // Background video: prioritize stability over quality
        var useConservative = needsConservativeSettings || isMobile;

        streamPlayer = new Hls({
          maxBufferLength: useConservative ? 3 : 8,
          maxMaxBufferLength: useConservative ? 6 : 15,
          maxBufferSize: useConservative ? 4 * 1000000 : 20 * 1000000,
          maxBufferHole: useConservative ? 1 : 0.5,
          startLevel: useConservative ? 0 : -1,
          autoStartLoad: true,
          // Disable worker on low-end/quirky devices - causes issues
          enableWorker: !needsConservativeSettings,
          lowLatencyMode: false,
          backBufferLength: useConservative ? 2 : 10,
          abrEwmaDefaultEstimate: useConservative ? 400000 : 800000,
          abrEwmaFastVoD: useConservative ? 2 : 3,
          abrEwmaSlowVoD: useConservative ? 6 : 9,
          abrBandWidthFactor: useConservative ? 0.7 : 0.9,
          abrBandWidthUpFactor: useConservative ? 0.3 : 0.6,
          fragLoadingTimeOut: useConservative ? 15000 : 20000,
          fragLoadingMaxRetry: useConservative ? 8 : 6,
          manifestLoadingTimeOut: useConservative ? 15000 : 10000,
          progressive: isMobile || isQuirkyMobileBrowser,
          // Cap quality on mobile to save bandwidth/battery
          capLevelToPlayerSize: isMobile
        });
        streamPlayer.loadSource(STREAM_CONFIG.hlsSource);
        streamPlayer.attachMedia(video);

        var hlsRecoveryAttempts = 0;
        streamPlayer.on(Hls.Events.ERROR, function(_event, data) {
          if (data.fatal) {
            hlsRecoveryAttempts++;
            if (hlsRecoveryAttempts > 5) {
              fallbackToMP4();
              return;
            }
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

      function initStream() {
        var fmt = STREAM_CONFIG.preferredFormat;

        // iOS/Safari: Always use native HLS - better battery and performance for background
        if (STREAM_CONFIG.hlsEnabled && features.nativeHls && (isIOS || isSafari)) {
          tryLoadSource(initNativeHLS, initStreamFallback);
          return;
        }

        // Non-Apple: prefer DASH
        if (STREAM_CONFIG.dashEnabled && (fmt === 'dash' || fmt === 'auto') && features.dash && !isAppleDevice()) {
          tryLoadSource(initDASH, initStreamFallback);
          return;
        }

        // HLS.js for other browsers
        if (STREAM_CONFIG.hlsEnabled && (fmt === 'hls' || fmt === 'auto') && features.hls) {
          tryLoadSource(initHLS, initStreamFallback);
          return;
        }

        // Fallback to native HLS if available
        if (STREAM_CONFIG.hlsEnabled && features.nativeHls) {
          tryLoadSource(initNativeHLS, initStreamFallback);
          return;
        }

        initStreamFallback();
      }

      function initStreamFallback() {
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

      // ---- Recovery: handle stall and visibility changes ----
      // Note: Don't aggressively resume on pause - can fight with browser power saving
      var pauseRecoveryTimeout = null;
      var isPowerSaving = false;

      video.addEventListener('pause', function() {
        // Only try to resume if tab is visible and we're not in power saving mode
        if (document.hidden || isPowerSaving) return;

        clearTimeout(pauseRecoveryTimeout);
        pauseRecoveryTimeout = setTimeout(function() {
          // Check if still paused and tab still visible
          if (video.paused && !document.hidden && !isPowerSaving) {
            tryAutoplay();
          }
        }, 500);
      });

      // Resume if video stalls (but not too aggressively)
      var stallRecoveryTimeout = null;
      video.addEventListener('stalled', function() {
        clearTimeout(stallRecoveryTimeout);
        stallRecoveryTimeout = setTimeout(tryAutoplay, 1000);
      });

      video.addEventListener('waiting', function() {
        // If waiting too long, try to recover
        clearTimeout(stallRecoveryTimeout);
        stallRecoveryTimeout = setTimeout(function() {
          if ((video.paused || video.readyState < 3) && !document.hidden) {
            tryAutoplay();
          }
        }, 3000);
      });

      // Resume when tab becomes visible again
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          isPowerSaving = false;
          // Delay slightly to let browser restore resources
          setTimeout(tryAutoplay, 200);
        } else {
          // Tab hidden - don't fight to resume
          isPowerSaving = true;
          clearTimeout(pauseRecoveryTimeout);
          clearTimeout(stallRecoveryTimeout);
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
