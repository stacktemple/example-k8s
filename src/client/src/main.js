import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Dynamically load runtime environment variables from env.js if available
(async () => {
  try {
    const headRes = await fetch("/env.js", { method: "HEAD" });
    if (headRes.ok) {
      const res = await fetch("/env.js", { cache: "no-store" });
      const js = await res.text();
      eval(js); // Set window.env
      console.info("✅ Loaded env.js into window.env");
    } else {
      console.warn("env.js not found");
    }
  } catch (e) {
    console.warn("Failed to load env.js:", e.message);
  }

  createApp(App).mount("#app");
})();
