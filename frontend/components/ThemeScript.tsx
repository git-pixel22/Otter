// Runs synchronously before React hydration to prevent dark mode flash.
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
      }}
    />
  );
}
