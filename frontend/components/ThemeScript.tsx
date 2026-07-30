// Runs synchronously before React hydration to prevent a flash of the wrong theme.
// Explicit choice in localStorage wins; otherwise we follow the OS preference.
const script = `(function(){try{
var t=localStorage.getItem('theme');
var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
if(dark)document.documentElement.classList.add('dark');
}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
