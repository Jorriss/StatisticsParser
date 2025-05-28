// Language module for handling translations and language-specific functionality

/**
 * Determines the filename for the language file based on the language type
 * @param {string} langType - The language code (e.g., 'en', 'es', 'it')
 * @returns {string} The path to the language file
 */
function determineLangFilename(langType) {
    const languageFiles = {
        'en': './data/languagetext-en.json',
        'es': './data/languagetext-es.json',
        'it': './data/languagetext-it.json'
    };
    
    return languageFiles[langType] || languageFiles['en'];
}

/**
 * Fetches and loads language text for the specified language
 * @param {string} languageType - The language code to load
 * @returns {Promise<Object>} Promise resolving to the language text object
 */
export async function getLanguageText(languageType = 'en') {
    try {
        const filename = determineLangFilename(languageType);
        const response = await fetch(filename);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const langText = await response.json();
        
        // Update URL without refresh
        const url = new URL(window.location.href);
        url.searchParams.set('lang', languageType);
        window.history.pushState({}, '', url);
        
        return langText;
    } catch (error) {
        console.error('Error loading language file:', error);
        // Fallback to English if there's an error
        if (languageType != 'en') {
            return getLanguageText('en');
        } else {
            throw new Error('Error loading language file: ' + error);
        }
    }
}

/**
 * Updates UI elements with the current language text
 * @param {Object} langText - The language text object
 */
export function updateUIElements(langText) {
    // Update text elements
    if (langText.showexample) {
        document.getElementById("exampleText").innerHTML = langText.showexample;
    }

    if (langText.tableshavescrollbars) {
        document.getElementById("scrollbarOptionText").innerHTML = langText.tableshavescrollbars;
    }
    
    // Update button texts
    if (langText.buttonclear) {
        const clearButton = document.getElementById("clearButton");
        clearButton.innerHTML = document.getElementById("result").style.display === 'none' 
            ? langText.buttonclear 
            : langText.buttonclearresult;
    }
    
    if (langText.buttonparse) {
        document.getElementById("parseButton").innerHTML = langText.buttonparse;
    }
    
    if (langText.buttoncopyresult) {
        document.getElementById("copyResultButton").innerHTML = langText.buttoncopyresult;
    }
    
    // Update language dropdown
    document.getElementById("languageDropdown").textContent = langText.langname || "Language";
}

/**
 * Initializes language-related functionality
 * @param {string} [initialLang] - Optional initial language code
 * @param {string} [urlStatsOutput] - Optional stats output from URL
 * @returns {Promise<Object>} Promise resolving to the language text object
 */
export async function initializeLanguage(initialLang = 'en',) {
    const langText = await getLanguageText(initialLang);
    updateUIElements(langText);
    return langText;
} 