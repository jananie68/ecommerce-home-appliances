import { useEffect } from "react";

function TranslateWidget() {
  useEffect(() => {
    const existingScript = document.getElementById("google-translate-script");
    let cleanupInterval;
    let observer;

    const suppressGoogleBanner = () => {
      document.body.style.top = "0px";
      document.documentElement.style.top = "0px";

      document.querySelectorAll("iframe.goog-te-banner-frame, .goog-te-banner-frame").forEach((node) => {
        node.style.display = "none";
        node.style.visibility = "hidden";
      });
    };

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      const mountNode = document.getElementById("google_translate_element");
      if (!mountNode || mountNode.childElementCount) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "en,ta,hi,te,kn,ml,gu,mr,bn,pa,ur",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        "google_translate_element"
      );

      suppressGoogleBanner();
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }

    cleanupInterval = window.setInterval(suppressGoogleBanner, 500);
    observer = new MutationObserver(() => {
      suppressGoogleBanner();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });

    suppressGoogleBanner();

    return () => {
      if (cleanupInterval) {
        window.clearInterval(cleanupInterval);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return <div id="google_translate_element" className="min-h-8 text-sm" />;
}

export default TranslateWidget;
