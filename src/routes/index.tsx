import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="landing-frame-shell">
      <iframe
        className="landing-frame"
        src="/landing/index.html"
        title="Destrave suas Frases em Inglês"
      />
    </main>
  );
}