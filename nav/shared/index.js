import {paths as sectionIds} from "../../sitemap.json";
import {Loader} from "vanjs-feather";
import van from "vanjs-core";

eruda.init();

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
          normalizedLink = dataLink === "/" ? "home" : dataLink;
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
    // Ensure URL is absolute
    if (!url.startsWith('/') && !url.startsWith('http')) {
        url = '/' + url;
    }
    
    leavingPage = true;
    initAnimations();
    
    // Wait for animation to complete (adjust timeout to match animation duration)
    setTimeout(() => {
        if (target === "_blank" || target === "_new") {
            window.open(url, target);
        } else {
            window.location.href = url;
        }
    }, 500); // Match your animation duration
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
    normalizedLink = dataLink === "/" ? "home" : dataLink;
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
  
  scrollContainer.addEventListener("scroll", throttle(checkOverlapAndScroll, 100));
  window.addEventListener("resize", throttle(checkOverlapAndScroll, 200));
  
  // Initial check with slight delay to ensure layout is ready
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
  
  // Get all child elements that have actual content
  const contentElements = tabList.querySelectorAll("section, div, h1, h2, p, svg, hr");
  
  // If no content, show footer
  if (contentElements.length === 0) {
    setFooterVisibility(true);
    return;
  }
  
  // Find the actual bottom of content by checking all elements
  let actualContentBottom = 0;
  for (let i = 0; i < contentElements.length; i++) {
    const rect = contentElements[i].getBoundingClientRect();
    if (rect.bottom > actualContentBottom && rect.height > 0) {
      actualContentBottom = rect.bottom;
    }
  }
  
  // Check if content overlaps footer
  const hasOverlap = actualContentBottom > footerRect.top;
  
  // Hide footer if overlapping, show if not
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
  
  // Detect if device supports touch (mobile/tablet)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // On mobile, use native scrolling entirely
  if (isTouchDevice) {
    scrollContainer.style.scrollBehavior = 'smooth';
    return;
  }
  
  // Desktop smooth scrolling
  let targetScroll = scrollContainer.scrollTop;
  let currentScroll = scrollContainer.scrollTop;
  let isAnimating = false;
  let animationId = null;
  let useNativeScroll = false;
  
  // Detect middle-click auto-scroll
  let middleClickActive = false;
  
  scrollContainer.addEventListener('mousedown', function(e) {
    if (e.button === 1) {
      middleClickActive = true;
      useNativeScroll = true;
    }
  });
  
  document.addEventListener('mouseup', function(e) {
    if (e.button === 1) {
      middleClickActive = false;
      // Re-sync after middle-click ends
      setTimeout(() => {
        targetScroll = scrollContainer.scrollTop;
        currentScroll = scrollContainer.scrollTop;
        useNativeScroll = false;
      }, 100);
    }
  });
  
  // Intercept wheel events for smooth scrolling
  scrollContainer.addEventListener('wheel', function(e) {
    // Don't interfere with middle-click scrolling or shift+wheel
    if (middleClickActive || e.shiftKey || useNativeScroll) {
      return;
    }
    
    e.preventDefault();
    targetScroll += e.deltaY * 0.25;
    targetScroll = Math.max(0, Math.min(targetScroll, scrollContainer.scrollHeight - scrollContainer.clientHeight));
    
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }, { passive: false });
  
  function animate() {
    if (useNativeScroll || middleClickActive) {
      isAnimating = false;
      return;
    }
    
    const diff = targetScroll - currentScroll;
    
    if (Math.abs(diff) > 0.5) {
      currentScroll += diff * 0.1;
      scrollContainer.scrollTop = currentScroll;
      animationId = requestAnimationFrame(animate);
    } else {
      // Animation complete
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