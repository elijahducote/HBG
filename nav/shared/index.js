import {paths as sectionIds} from "../../sitemap.json";
import {Loader} from "vanjs-feather";
import van from "vanjs-core";

let leavingPage = false;

function initAnimations() {
  const siteHeader = document.querySelector("div.wrapper.topnav");
  siteHeader.style.opacity = "0.5";

  const loading = Loader({ class: "icon spinner" });
  loading.style.animationPlayState = "running";
  van.add(siteHeader, loading); 

  loading.addEventListener("animationiteration", function () {
    siteHeader.style.opacity = "0.5";
    loading.style.animationPlayState = "paused";
    if (!leavingPage) loading.classList.add("fadeAway");
    if (!leavingPage) loading.classList.remove("spinner");

    loading.style.animationPlayState = "running";


    loading.addEventListener("animationend", function () {
      siteHeader.style.opacity = "1.0";
      if (!leavingPage) loading.style.animationPlayState = "paused";
      if (!leavingPage) loading.remove(); // Remove the loader
    }, { once: true });
  }, { once: true });
}

function initNavHoverEffects() {
  const currentPath = window.location.pathname.substring(1) || "home",
        navIcons = document.querySelectorAll("div.wrapper.topnav div svg"),
        navText = document.querySelectorAll("div.wrapper.topnav div h2"),
        nth = navIcons.length;
  
  // Apply styles based on state: active (current page), hovered, or inactive
  function applyNavItemStyles(index, isActive, isHovered) {
    const icon = navIcons[index],
          text = navText[index],
          container = icon.parentElement;
    
    if (isHovered) {
      // Hovered state: full opacity, glow animation
      container.style.animation = "glow 4s ease-in-out infinite";
      Object.assign(icon.style, { opacity: "1", filter: "none" });
      text.style.setProperty("opacity", "1", "important");
    } else if (isActive) {
      // Active page state (when not hovering): glow animation
      container.style.animation = "glow 4s ease-in-out infinite";
      Object.assign(icon.style, { opacity: "1", filter: "none" });
      text.style.setProperty("opacity", "1", "important");
    } else {
      // Inactive/dimmed state: no animation, reduced opacity
      container.style.animation = "none";
      Object.assign(icon.style, { opacity: ".75", filter: "grayscale(50%)" });
      text.style.setProperty("opacity", "0.75", "important");
    }
  }
  
  // Check if nav item at index corresponds to current page
function isCurrentNav(index) {
  const icon = navIcons[index],
        dataLink = icon.parentElement.dataset.link || "/",
        // Normalize by removing leading slash from dataLink
        normalizedLink = dataLink === "/" ? "home" : dataLink.replace(/^\//, "");
  return normalizedLink === currentPath;
}
  
  // Reset all nav items to default state (active glows, others dimmed)
  function resetToDefault() {
    let itR8 = nth, ndx;
    for (; itR8; --itR8) {
      ndx = nth - itR8;
      applyNavItemStyles(ndx, isCurrentNav(ndx), false);
    }
  }
  
  // Setup hover event listeners for each nav item
  let itR8 = nth, ndx, icon, container;
  for (; itR8; --itR8) {
    ndx = nth - itR8;
    icon = navIcons[ndx];
    container = icon.parentElement;
    
    // Closure to capture current index
    (function(currentIndex) {
      container.addEventListener("mouseenter", function() {
        // On hover: highlight hovered item, dim all others (including active)
        let j = nth, idx;
        for (; j; --j) {
          idx = nth - j;
          applyNavItemStyles(idx, false, idx === currentIndex);
        }
      });
      
      container.addEventListener("mouseleave", function() {
        // On leave: restore default state
        resetToDefault();
      });
    })(ndx);
  }
  
  // Initialize with default state
  resetToDefault();
}


function simulateLinkClick(url, target = "_self") {
    // Ensure URL is absolute (starts with /)
    if (!url.startsWith('/') && !url.startsWith('http')) {
        url = '/' + url;
    }
    
    leavingPage = true;
    initAnimations();
    
    // Add slight delay for animations to start
    setTimeout(() => {
        if (target === "_blank" || target === "_new") {
            window.open(url, target);
        } else {
            window.location.href = url;
        }
    }, 50); // Adjust timing based on your animation duration
}

function updateNavIcons() {
  const currentPath = window.location.pathname.substring(1) || "home",
  navIcons = document.querySelectorAll("div.wrapper.topnav div svg"),
  navText = document.querySelectorAll("div.wrapper.topnav div h2"),
  nth = navIcons.length,
  root = document.querySelector("div.wrapper.topnav");
  let itR8 = nth, ndx, icon, text, dataLink, normalizedLink;
  root.addEventListener("click", function(e) {
    const node = e.target;
    if (node.tagName === "DIV") simulateLinkClick(node.dataset.link);
    if (node.tagName === "path") {
      let parent = node.parentElement;
      if (parent.tagName === "g") parent = parent.parentElement;
      simulateLinkClick(parent.parentElement.dataset.link);
      return;
    }
    if (node.tagName === "H2" || node.tagName === "svg") simulateLinkClick(node.parentElement.dataset.link);
  });
  
  for (;itR8;--itR8) {
    ndx = nth - itR8;
    icon = navIcons[ndx];
    text = navText[ndx];
    dataLink = icon.parentElement.dataset.link || "/";
    // Normalize by removing leading slash
    normalizedLink = dataLink === "/" ? "home" : dataLink.replace(/^\//, "");
    if (normalizedLink === currentPath) icon.parentElement.style.animation = "glow 4s ease-in-out infinite";
    else {
      Object.assign(icon.style, {opacity:".75", filter:"grayscale(50%)"});
      text.style.setProperty("opacity","0.75","important");
      /*Object.assign(text.style, {opacity:".5", filter:"grayscale(50%)"});*/
    }
  }
}

function throttle(func, wait) {
  let timeout;
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, wait);
    }
  };
}

let scrollContainer = null,
    footer = null,
    footerStyle = null,
    sections = [];

function initScrollHandler() {
  const containers = document.querySelectorAll("div.container");
  let itR8 = containers.length, style;
  
  // Find the scrollable container
  for (;itR8;--itR8) {
    style = window.getComputedStyle(containers[itR8 - 1]);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      scrollContainer = containers[itR8 - 1];
      break;
    }
  }
  
  footer = document.querySelector("footer > div");
  if (footer) footerStyle = footer.style;
  
  if (!scrollContainer || !footer) return;
  
  // 1. Existing scroll and resize listeners
  scrollContainer.addEventListener("scroll", throttle(checkOverlapAndScroll, 100));
  window.addEventListener("resize", throttle(checkOverlapAndScroll, 200));

  // 2. NEW: Watch for content changes (e.g. images loading, dynamic content)
  const tabList = document.querySelector("div.wrapper.tab-list");
  if (tabList) {
    const resizeObserver = new ResizeObserver(throttle(() => {
        checkOverlapAndScroll();
    }, 100));
    resizeObserver.observe(tabList);
    
    // Also observe children to catch specific element resizing
    Array.from(tabList.children).forEach(child => resizeObserver.observe(child));
  }
  
  // Initial check
  setTimeout(checkOverlapAndScroll, 100);
}

function checkOverlapAndScroll() {
  if (!footer || !scrollContainer) return;
  
  const tabList = document.querySelector("div.wrapper.tab-list");
  if (!tabList) {
    setFooterVisibility(true);
    return;
  }
  
  const footerRect = footer.getBoundingClientRect();
  
  // ROBUST FIX: Check all direct children instead of specific tags
  const contentElements = tabList.children; 
  
  if (contentElements.length === 0) {
    setFooterVisibility(true);
    return;
  }
  
  let actualContentBottom = 0;
  for (let i = 0; i < contentElements.length; i++) {
    const rect = contentElements[i].getBoundingClientRect();
    // Check rect.bottom to find the lowest point
    if (rect.bottom > actualContentBottom) {
      actualContentBottom = rect.bottom;
    }
  }
  
  const hasOverlap = actualContentBottom > footerRect.top;
  setFooterVisibility(!hasOverlap);
}

function setFooterVisibility(visible) {
  if (!footerStyle) return;
  
  if (visible) {
    // Show footer: make it fully interactive
    footerStyle.opacity = "1";
    footerStyle.visibility = "visible";
    footerStyle.pointerEvents = "auto";
    footerStyle.zIndex = "999";
    footerStyle.transition = "opacity 0.3s ease-in-out";
  } else {
    // Hide footer: make it completely non-interactive
    footerStyle.opacity = "0";
    footerStyle.visibility = "hidden";
    footerStyle.pointerEvents = "none";
    footerStyle.zIndex = "-1";
    footerStyle.transition = "opacity 0.3s ease-in-out, visibility 0s 0.3s";
  }
}

function initSmoothScroll() {
  if (!scrollContainer) return;
  
  // State variables
  let targetScroll = scrollContainer.scrollTop;
  let currentScroll = scrollContainer.scrollTop;
  let isAnimating = false;
  let animationId = null;
  
  // Flags to detect native override behaviors
  let useNativeScroll = false;
  let middleClickActive = false;
  
  // 1. Handle Middle-Click (Auto-scroll)
  // We must detect this to disable our interference while the user is auto-scrolling
  scrollContainer.addEventListener('mousedown', function(e) {
    if (e.button === 1) { // Middle mouse button
      middleClickActive = true;
      useNativeScroll = true;
    }
  });
  
  document.addEventListener('mouseup', function(e) {
    if (e.button === 1) {
      middleClickActive = false;
      // Re-sync positions after middle-click scroll ends
      setTimeout(() => {
        targetScroll = scrollContainer.scrollTop;
        currentScroll = scrollContainer.scrollTop;
        useNativeScroll = false;
      }, 100);
    }
  });
  
  // 2. The Main Wheel Listener
  // We removed the "isTouchDevice" check. Now we only intercept if it's actually a mouse wheel event.
  scrollContainer.addEventListener('wheel', function(e) {
    // Allow native behavior for:
    // - Middle-click auto-scrolling
    // - Shift+Wheel (Horizontal scrolling)
    // - Ctrl+Wheel (Pinch to zoom)
    if (middleClickActive || e.shiftKey || e.ctrlKey || useNativeScroll) {
      return;
    }
    
    // Prevent default browser scrolling so we can handle it
    e.preventDefault();
    
    // Calculate delta (0.25 is the speed factor - adjust as needed)
    targetScroll += e.deltaY * 0.25;
    
    // Clamp the target to the scroll bounds
    targetScroll = Math.max(0, Math.min(targetScroll, scrollContainer.scrollHeight - scrollContainer.clientHeight));
    
    // Start animation loop if not already running
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }, { passive: false }); // passive: false is required to use preventDefault()
  
  // 3. The Animation Loop
  function animate() {
    // If user switched to native scrolling (middle click), stop animating custom physics
    if (useNativeScroll || middleClickActive) {
      isAnimating = false;
      return;
    }
    
    const diff = targetScroll - currentScroll;
    const delta = Math.abs(diff);
    
    // Stop animation when we are close enough (pixel perfect)
    if (delta > 0.5) {
      currentScroll += diff * 0.1; // Easing factor (0.1 = smooth, 0.5 = snappy)
      scrollContainer.scrollTop = currentScroll;
      animationId = requestAnimationFrame(animate);
    } else {
      // Snap to exact target when finished to prevent micro-jitters
      currentScroll = targetScroll;
      scrollContainer.scrollTop = currentScroll;
      isAnimating = false;
    }
  }
}

window.addEventListener("DOMContentLoaded", function() {
  initAnimations();
  updateNavIcons();
  initNavHoverEffects();
  initScrollHandler();
  initSmoothScroll();
});