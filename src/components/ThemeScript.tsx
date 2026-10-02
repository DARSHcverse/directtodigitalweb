/**
 * Applies the saved theme before first paint.
 *
 * The preference lives in localStorage, which React cannot read until after
 * hydration — so without this, someone who picked dark would get a white flash
 * on every page load. This runs synchronously in <head>, before the browser
 * paints anything, and sets the same data-theme attribute the CSS already
 * keys off.
 *
 * Kept as a raw string rather than a real function because it has to execute
 * before the bundle loads. It is wrapped in try/catch: Safari's private mode
 * throws on localStorage access, and a theme preference is never worth
 * breaking the page over.
 */
const script = `(function(){try{var t=localStorage.getItem("twc-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
