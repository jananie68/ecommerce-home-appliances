import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";

const PARTICLE_CONFIG = {
  particles: {
    number: {
      value: 180,
      density: {
        enable: true,
        value_area: 900
      }
    },
    color: {//yellow:#f7603b,blue:#0f172a,green:#fbbe24
      value: ["#f7603b", "#0f172a", "#fbbe24"]
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 0.6,
        opacity_min: 0.15,
        sync: false
      }
    },
    size: {
      value: 4,
      random: true,
      anim: {
        enable: true,
        speed: 3.5,
        size_min: 0.8,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 100,
      color: "#f7603b",//red:
      opacity: 0.62,
      width: 1
    },
    move: {
      enable: true,
      speed: 3.4,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: ["grab", "repulse"]
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 160,
        line_linked: {
          opacity: 0.5
        }
      },
      bubble: {
        distance: 200,
        size: 8,
        duration: 2,
        opacity: 0.45,
        speed: 3
      },
      repulse: {
        distance: 160,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
};

function loadParticlesScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.particlesJS) return Promise.resolve();
  if (window.__particlesJSLoading) return window.__particlesJSLoading;

  window.__particlesJSLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (event) => reject(event);
    document.body.appendChild(script);
  });

  return window.__particlesJSLoading;
}

function ParticleBackground({ id = "hero-particles" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    loadParticlesScript()
      .then(() => {
        if (isCancelled || !containerRef.current || !window.particlesJS) return;
        window.particlesJS(id, PARTICLE_CONFIG);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
      const container = containerRef.current;
      if (container) {
        const canvases = container.querySelectorAll("canvas");
        canvases.forEach((canvas) => canvas.remove());
      }
    };
  }, [id]);

  return (
    <div
      id={id}
      ref={containerRef}
      className="pointer-events-auto fixed inset-0"
      aria-hidden="true"
    />
  );
}

export default ParticleBackground;
