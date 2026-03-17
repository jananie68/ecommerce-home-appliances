import { useEffect, useState } from "react";
import { cleanupGoogleTranslate } from "../utils/googleTranslateCleanup";

const GOOGLE_TRANSLATE_EVENT = "google-translate-language-change";
const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
const GOOGLE_TRANSLATE_MOUNT_ID = "google-translate-element-root";
const GOOGLE_TRANSLATE_COOKIE = "googtrans";
const PAGE_LANGUAGE = "en";
const TRANSLATE_SELECT_MAX_ATTEMPTS = 80;
const TRANSLATE_SELECT_WAIT_MS = 150;

let googleTranslateLoaderPromise;
let googleTranslateElementPromise;

function readCookie(name) {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

function getSelectedLanguageFromCookie() {
  const rawValue = readCookie(GOOGLE_TRANSLATE_COOKIE);

  if (!rawValue) {
    return PAGE_LANGUAGE;
  }

  const [, , targetLanguage] = decodeURIComponent(rawValue).split("/");
  return targetLanguage || PAGE_LANGUAGE;
}

function notifyLanguageChange(languageCode) {
  window.dispatchEvent(
    new CustomEvent(GOOGLE_TRANSLATE_EVENT, {
      detail: languageCode
    })
  );
}

function getGoogleTranslateMountNode() {
  let mountNode = document.getElementById(GOOGLE_TRANSLATE_MOUNT_ID);

  if (!mountNode) {
    mountNode = document.createElement("div");
    mountNode.id = GOOGLE_TRANSLATE_MOUNT_ID;
    mountNode.style.position = "absolute";
    mountNode.style.left = "-9999px";
    mountNode.style.top = "0";
    mountNode.style.width = "1px";
    mountNode.style.height = "1px";
    mountNode.style.overflow = "hidden";
    mountNode.style.opacity = "0";
    document.body.appendChild(mountNode);
  }

  return mountNode;
}

function waitForTranslateSelect(attempt = 0) {
  const mountNode = getGoogleTranslateMountNode();
  const select = mountNode.querySelector(".goog-te-combo");

  if (select) {
    return Promise.resolve(select);
  }

  if (attempt >= TRANSLATE_SELECT_MAX_ATTEMPTS) {
    return Promise.reject(new Error("Google Translate control did not initialize."));
  }

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      waitForTranslateSelect(attempt + 1).then(resolve).catch(reject);
    }, TRANSLATE_SELECT_WAIT_MS);
  });
}

function loadGoogleTranslateScript() {
  if (window.google?.translate?.TranslateElement) {
    return Promise.resolve();
  }

  if (googleTranslateLoaderPromise) {
    return googleTranslateLoaderPromise;
  }

  googleTranslateLoaderPromise = new Promise((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      rejectOnce(new Error("Google Translate script timed out while loading."));
    }, 10000);

    const resolveOnce = () => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };

    const rejectOnce = (error) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      reject(error);
    };

    window.googleTranslateElementInit = () => resolveOnce();

    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener(
        "error",
        () => rejectOnce(new Error("Google Translate script failed to load.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => rejectOnce(new Error("Google Translate script failed to load."));
    document.body.appendChild(script);
  }).catch((error) => {
    googleTranslateLoaderPromise = undefined;
    throw error;
  });

  return googleTranslateLoaderPromise;
}

function ensureTranslateElement() {
  if (googleTranslateElementPromise) {
    return googleTranslateElementPromise;
  }

  googleTranslateElementPromise = loadGoogleTranslateScript()
    .then(() => {
      const mountNode = getGoogleTranslateMountNode();

      if (!mountNode.querySelector(".goog-te-combo")) {
        mountNode.replaceChildren();
        new window.google.translate.TranslateElement(
          {
            pageLanguage: PAGE_LANGUAGE,
            includedLanguages: LANGUAGES.map((lang) => lang.code).join(","),
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
          },
          GOOGLE_TRANSLATE_MOUNT_ID
        );
      }

      return waitForTranslateSelect();
    })
    .catch((error) => {
      googleTranslateElementPromise = undefined;
      throw error;
    });

  return googleTranslateElementPromise;
}

function resetToPageLanguage() {
  const cookieValue = `/${PAGE_LANGUAGE}/${PAGE_LANGUAGE}`;
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${cookieValue};path=/`;
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${cookieValue};path=/;domain=${window.location.hostname}`;
  notifyLanguageChange(PAGE_LANGUAGE);
  window.location.reload();
}

const LANGUAGES = [
  { label: "Afrikaans", code: "af", flag: "🇿🇦" },
  { label: "Albanian", code: "sq", flag: "🇦🇱" },
  { label: "Amharic", code: "am", flag: "🇪🇹" },
  { label: "Arabic", code: "ar", flag: "🇸🇦" },
  { label: "Armenian", code: "hy", flag: "🇦🇲" },
  { label: "Azerbaijani", code: "az", flag: "🇦🇿" },
  { label: "Basque", code: "eu", flag: "🇪🇸" },
  { label: "Belarusian", code: "be", flag: "🇧🇾" },
  { label: "Bengali", code: "bn", flag: "🇧🇩" },
  { label: "Bosnian", code: "bs", flag: "🇧🇦" },
  { label: "Bulgarian", code: "bg", flag: "🇧🇬" },
  { label: "Catalan", code: "ca", flag: "🇪🇸" },
  { label: "Cebuano", code: "ceb", flag: "🇵🇭" },
  { label: "Chinese (Simplified)", code: "zh-CN", flag: "🇨🇳" },
  { label: "Chinese (Traditional)", code: "zh-TW", flag: "🇹🇼" },
  { label: "Corsican", code: "co", flag: "🇫🇷" },
  { label: "Croatian", code: "hr", flag: "🇭🇷" },
  { label: "Czech", code: "cs", flag: "🇨🇿" },
  { label: "Danish", code: "da", flag: "🇩🇰" },
  { label: "Dutch", code: "nl", flag: "🇳🇱" },
  { label: "English", code: "en", flag: "🇬🇧" },
  { label: "Esperanto", code: "eo", flag: "🏳️" },
  { label: "Estonian", code: "et", flag: "🇪🇪" },
  { label: "Finnish", code: "fi", flag: "🇫🇮" },
  { label: "French", code: "fr", flag: "🇫🇷" },
  { label: "Frisian", code: "fy", flag: "🇳🇱" },
  { label: "Galician", code: "gl", flag: "🇪🇸" },
  { label: "Georgian", code: "ka", flag: "🇬🇪" },
  { label: "German", code: "de", flag: "🇩🇪" },
  { label: "Greek", code: "el", flag: "🇬🇷" },
  { label: "Gujarati", code: "gu", flag: "🇮🇳" },
  { label: "Haitian Creole", code: "ht", flag: "🇭🇹" },
  { label: "Hausa", code: "ha", flag: "🇳🇬" },
  { label: "Hawaiian", code: "haw", flag: "🇺🇸" },
  { label: "Hebrew", code: "iw", flag: "🇮🇱" },
  { label: "Hindi", code: "hi", flag: "🇮🇳" },
  { label: "Hmong", code: "hmn", flag: "🇨🇳" },
  { label: "Hungarian", code: "hu", flag: "🇭🇺" },
  { label: "Icelandic", code: "is", flag: "🇮🇸" },
  { label: "Igbo", code: "ig", flag: "🇳🇬" },
  { label: "Indonesian", code: "id", flag: "🇮🇩" },
  { label: "Irish", code: "ga", flag: "🇮🇪" },
  { label: "Italian", code: "it", flag: "🇮🇹" },
  { label: "Japanese", code: "ja", flag: "🇯🇵" },
  { label: "Javanese", code: "jw", flag: "🇮🇩" },
  { label: "Kannada", code: "kn", flag: "🇮🇳" },
  { label: "Kazakh", code: "kk", flag: "🇰🇿" },
  { label: "Khmer", code: "km", flag: "🇰🇭" },
  { label: "Korean", code: "ko", flag: "🇰🇷" },
  { label: "Kurdish", code: "ku", flag: "🇹🇷" },
  { label: "Kyrgyz", code: "ky", flag: "🇰🇬" },
  { label: "Lao", code: "lo", flag: "🇱🇦" },
  { label: "Latin", code: "la", flag: "🇻🇦" },
  { label: "Latvian", code: "lv", flag: "🇱🇻" },
  { label: "Lithuanian", code: "lt", flag: "🇱🇹" },
  { label: "Luxembourgish", code: "lb", flag: "🇱🇺" },
  { label: "Macedonian", code: "mk", flag: "🇲🇰" },
  { label: "Malagasy", code: "mg", flag: "🇲🇬" },
  { label: "Malay", code: "ms", flag: "🇲🇾" },
  { label: "Malayalam", code: "ml", flag: "🇮🇳" },
  { label: "Maltese", code: "mt", flag: "🇲🇹" },
  { label: "Maori", code: "mi", flag: "🇳🇿" },
  { label: "Marathi", code: "mr", flag: "🇮🇳" },
  { label: "Mongolian", code: "mn", flag: "🇲🇳" },
  { label: "Myanmar (Burmese)", code: "my", flag: "🇲🇲" },
  { label: "Nepali", code: "ne", flag: "🇳🇵" },
  { label: "Norwegian", code: "no", flag: "🇳🇴" },
  { label: "Nyanja (Chichewa)", code: "ny", flag: "🇲🇼" },
  { label: "Pashto", code: "ps", flag: "🇦🇫" },
  { label: "Persian", code: "fa", flag: "🇮🇷" },
  { label: "Polish", code: "pl", flag: "🇵🇱" },
  { label: "Portuguese", code: "pt", flag: "🇵🇹" },
  { label: "Punjabi", code: "pa", flag: "🇮🇳" },
  { label: "Romanian", code: "ro", flag: "🇷🇴" },
  { label: "Russian", code: "ru", flag: "🇷🇺" },
  { label: "Samoan", code: "sm", flag: "🇼🇸" },
  { label: "Scots Gaelic", code: "gd", flag: "🏴" },
  { label: "Serbian", code: "sr", flag: "🇷🇸" },
  { label: "Sesotho", code: "st", flag: "🇱🇸" },
  { label: "Shona", code: "sn", flag: "🇿🇼" },
  { label: "Sindhi", code: "sd", flag: "🇵🇰" },
  { label: "Sinhala (Sinhalese)", code: "si", flag: "🇱🇰" },
  { label: "Slovak", code: "sk", flag: "🇸🇰" },
  { label: "Slovenian", code: "sl", flag: "🇸🇮" },
  { label: "Somali", code: "so", flag: "🇸🇴" },
  { label: "Spanish", code: "es", flag: "🇪🇸" },
  { label: "Sundanese", code: "su", flag: "🇮🇩" },
  { label: "Swahili", code: "sw", flag: "🇰🇪" },
  { label: "Swedish", code: "sv", flag: "🇸🇪" },
  { label: "Tagalog (Filipino)", code: "tl", flag: "🇵🇭" },
  { label: "Tajik", code: "tg", flag: "🇹🇯" },
  { label: "Tamil", code: "ta", flag: "🇮🇳" },
  { label: "Telugu", code: "te", flag: "🇮🇳" },
  { label: "Thai", code: "th", flag: "🇹🇭" },
  { label: "Turkish", code: "tr", flag: "🇹🇷" },
  { label: "Ukrainian", code: "uk", flag: "🇺🇦" },
  { label: "Urdu", code: "ur", flag: "🇵🇰" },
  { label: "Uzbek", code: "uz", flag: "🇺🇿" },
  { label: "Vietnamese", code: "vi", flag: "🇻🇳" },
  { label: "Welsh", code: "cy", flag: "🏴" },
  { label: "Xhosa", code: "xh", flag: "🇿🇦" },
  { label: "Yiddish", code: "yi", flag: "🇮🇱" },
  { label: "Yoruba", code: "yo", flag: "🇳🇬" },
  { label: "Zulu", code: "zu", flag: "🇿🇦" }
];

function TranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(PAGE_LANGUAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [translationReady, setTranslationReady] = useState(false);
  const [translationFailed, setTranslationFailed] = useState(false);

  useEffect(() => {
    const disposeCleanup = cleanupGoogleTranslate();
    let isMounted = true;

    const syncSelectedLanguage = (event) => {
      setSelectedLang(event.detail || getSelectedLanguageFromCookie());
    };

    ensureTranslateElement()
      .then(() => {
        if (!isMounted) {
          return;
        }

        setTranslationReady(true);
        setTranslationFailed(false);
        setSelectedLang(getSelectedLanguageFromCookie());
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setTranslationReady(false);
        setTranslationFailed(true);
        console.error("Google Translate initialization failed.", error);
      });

    window.addEventListener(GOOGLE_TRANSLATE_EVENT, syncSelectedLanguage);

    return () => {
      isMounted = false;
      window.removeEventListener(GOOGLE_TRANSLATE_EVENT, syncSelectedLanguage);
      disposeCleanup?.();
    };
  }, []);

  const applyLanguage = async (langCode) => {
    if (langCode === PAGE_LANGUAGE) {
      resetToPageLanguage();
      return;
    }

    try {
      const select = await ensureTranslateElement();
      const hasRequestedLanguage = Array.from(select.options).some((option) => option.value === langCode);

      if (!hasRequestedLanguage) {
        throw new Error(`Language ${langCode} is not available in Google Translate.`);
      }

      select.value = langCode;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setSelectedLang(langCode);
      setTranslationReady(true);
      setTranslationFailed(false);
      setIsOpen(false);
      notifyLanguageChange(langCode);
    } catch (error) {
      setTranslationReady(false);
      setTranslationFailed(true);
      console.error("Unable to switch Google Translate language.", error);
    }
  };

  const changeLanguage = (langCode) => applyLanguage(langCode);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-40">
      <button
        onClick={() => setIsOpen((value) => !value)}
        disabled={!translationReady}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-soft backdrop-blur transition duration-200 hover:border-slate-300 hover:bg-white"
      >
        <span className="text-xl">
          {LANGUAGES.find((l) => l.code === selectedLang)?.flag || "🌐"}
        </span>
        <span className="text-sm font-semibold text-slate-800">
          {translationReady
            ? LANGUAGES.find((l) => l.code === selectedLang)?.label || "Language"
            : translationFailed
              ? "Unavailable"
              : "Loading..."}
        </span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${isOpen ? "-rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl transition-all">
          <div className="border-b border-slate-100 bg-slate-50 p-3">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 shadow-inner transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-1">
            {filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-1 gap-0.5">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    disabled={!translationReady}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      selectedLang === lang.code
                        ? "bg-brand-gradient-soft text-brand-primary"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex-1 text-sm font-medium">{lang.label}</span>
                    {selectedLang === lang.code && (
                      <svg
                        className="h-4 w-4 text-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-500">No languages found</div>
            )}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

export default TranslateWidget;
