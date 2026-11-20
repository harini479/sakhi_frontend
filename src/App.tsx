import React, { useEffect, useState } from "react";
import { TopNav, type UILang } from "./components/TopNav";
import { SakhiLandingPage } from "./pages/SakhiLandingPage";
import { SakhiTryPage } from "./pages/SakhiTryPage";

type RouteKey = "landing" | "try";

function resolveRoute(pathname: string): RouteKey {
  if (pathname.startsWith("/sakhi/try")) {
    return "try";
  }
  return "landing";
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<RouteKey>(() =>
    resolveRoute(window.location.pathname)
  );
  const [lang, setLang] = useState<UILang>("en");
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const onPopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath: "/sakhi" | "/sakhi/try", initialPrompt?: string) => {
    if (initialPrompt) {
      setPendingPrompt(initialPrompt);
    }
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setRoute(nextPath === "/sakhi/try" ? "try" : "landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (route === "try") {
    return (
      <SakhiTryPage
        lang={lang}
        onLangChange={setLang}
        initialPrompt={pendingPrompt}
        onConsumeInitialPrompt={() => setPendingPrompt(undefined)}
        onExitToLanding={() => navigate("/sakhi")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav
        lang={lang}
        onLangChange={setLang}
        onTrySakhi={(prompt) => navigate("/sakhi/try", prompt)}
      />
      <SakhiLandingPage
        lang={lang}
        onTrySakhi={(prompt) => navigate("/sakhi/try", prompt)}
      />
    </div>
  );
};

export default App;
