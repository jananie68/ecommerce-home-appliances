export function cleanupGoogleTranslate() {
  const styleId = "google-translate-style";
  const floatingUiSelector = [
    ".goog-te-banner-frame.skiptranslate",
    "iframe.goog-te-banner-frame",
    ".goog-te-banner-frame",
    ".goog-te-balloon-frame",
    "iframe.VIpgJd-ZVi9od-ORHb-OEVmcd",
    "iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd",
    "iframe.VIpgJd-ZVi9od-SmfZ-OEVmcd",
    ".VIpgJd-yAWNEb-L7lbkb",
    "#goog-gt-tt"
  ].join(", ");
  const bannerStyle = document.getElementById(styleId);

  if (!bannerStyle) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      ${floatingUiSelector} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        max-height: 0 !important;
        border: 0 !important;
      }

      body {
        top: 0px !important;
        position: static !important;
      }

      html {
        top: 0px !important;
      }

      .goog-tooltip {
        display: none !important;
        background: none !important;
        box-shadow: none !important;
      }

      .goog-text-highlight {
        background: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  let intervalId;
  const suppress = () => {
    document.body.style.setProperty("top", "0px", "important");
    document.body.style.setProperty("position", "static", "important");
    document.documentElement.style.setProperty("top", "0px", "important");

    document.querySelectorAll(floatingUiSelector).forEach((node) => {
      node.style.setProperty("display", "none", "important");
      node.style.setProperty("visibility", "hidden", "important");
      node.style.setProperty("opacity", "0", "important");
      node.style.setProperty("pointer-events", "none", "important");
      node.style.setProperty("max-height", "0", "important");
      node.style.setProperty("border", "0", "important");
    });
  };

  suppress();
  intervalId = window.setInterval(suppress, 500);

  const observer = new MutationObserver(suppress);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"]
  });

  return () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    observer.disconnect();
  };
}
