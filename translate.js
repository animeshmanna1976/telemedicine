function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn,pa',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Aggressive banner removal
(function() {
    const removeBanner = () => {
        const elements = [
            '.goog-te-banner-frame',
            '.goog-te-banner-frame.skiptranslate',
            '#goog-gt-tt',
            '.goog-te-balloon-frame'
        ];
        
        elements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.remove();
        });
        
        document.body.style.top = '0px';
        document.body.style.position = 'static';
    };
    
    const interval = setInterval(removeBanner, 100);
    setTimeout(() => clearInterval(interval), 10000);
    
    new MutationObserver(removeBanner).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// Load translate script
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(script);