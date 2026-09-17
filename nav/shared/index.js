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
  const navIcons = document.querySelectorAll("div.wrapper.topnav div svg"),
        nth = navIcons.length;
  
  // Apply glow animation and full opacity to all nav items
  let itR8 = nth, ndx;
  for (; itR8; --itR8) {
    ndx = nth - itR8;
    navIcons[ndx].parentElement.style.animation = "glow 4s ease-in-out infinite";
    Object.assign(navIcons[ndx].style, { opacity: "1", filter: "none" });
  }
}


function simulateLinkClick(url, target = "_self") {
    const link = document.createElement("a");
    link.href = url;
    link.target = target;
    link.style.display = "none";
    document.body.appendChild(link);
    leavingPage = true;
    initAnimations();
    checkOverlapAndScroll();
    link.click();
    document.body.removeChild(link);
}


function updateNavIcons() {
  const navIcons = document.querySelectorAll("div.wrapper.topnav div svg"),
  nth = navIcons.length,
  root = document.querySelector("div.wrapper.topnav");
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
  
  let itR8 = nth, ndx;
  for (;itR8;--itR8) {
    ndx = nth - itR8;
    navIcons[ndx].parentElement.style.animation = "glow 4s ease-in-out infinite";
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
    sections = [],
    topNav = null,
    lastScrollTop = 0,
    navHidden = false;

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

  topNav = document.querySelector("div.wrapper.topnav");

  if (!scrollContainer || !footer) return;

  scrollContainer.addEventListener("scroll", throttle(handleScroll, 100));
  window.addEventListener("resize", throttle(checkOverlapAndScroll, 200));

  // Initial check with slight delay to ensure layout is ready
  setTimeout(checkOverlapAndScroll, 100);
}

function handleScroll() {
  checkOverlapAndScroll();
  handleNavVisibility();
}

function handleNavVisibility() {
  if (!scrollContainer || !topNav) return;

  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight;
  const clientHeight = scrollContainer.clientHeight;
  const maxScroll = scrollHeight - clientHeight;
  const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  // Convert 3em to pixels (assuming base font size of 16px)
  const hideThreshold = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3;
  const scrollingDown = scrollTop > lastScrollTop;

  // Hide nav: scrolled down past 3em AND scrolling down
  // Show nav: scrolling up OR at top 5% of page
  const shouldHide = scrollTop > hideThreshold && scrollingDown && scrollPercent > 5;
  const shouldShow = !scrollingDown || scrollPercent <= 5;

  if (shouldHide && !navHidden) {
    topNav.style.transform = "translateY(-100%)";
    topNav.style.transition = "transform 0.3s ease-in-out";
    navHidden = true;
  } else if (shouldShow && navHidden) {
    topNav.style.transform = "translateY(0)";
    topNav.style.transition = "transform 0.3s ease-in-out";
    navHidden = false;
  }

  lastScrollTop = scrollTop;
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