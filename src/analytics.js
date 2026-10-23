// GoatCounter page views, shared with the aryamans.goatcounter.com dashboard.
// Only the live host loads the script, so the dev server and `npm run preview`
// never count.
//
// Views switch in React state without touching the URL, so there is nothing for
// a client-side counter to follow: GoatCounter's automatic onload count records
// the single pageview (as /noize/) and that's the whole integration.
const LIVE_HOST = "aryaman73.github.io";

export function startAnalytics() {
  if (location.hostname !== LIVE_HOST) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = "https://aryamans.goatcounter.com/count";
  document.head.append(script);
}
