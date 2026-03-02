import ClipboardJS from 'clipboard';
import {
    getTableScrollbarPreference,
    toggleStoredBoolean,
    setTableScrollbarPreference
} from './storage.js';


// UI module for handling user interface elements and interactions

/**
 * Clears the result element and updates UI state
 * @param {HTMLElement} resultElement - The result container element
 * @param {Object} lang - Language object for text
 */
export function clearResultElement(resultElement, lang) {
    while (resultElement.firstChild) {
        resultElement.removeChild(resultElement.firstChild);
    }
    document.getElementById("resultControls").style.display = 'none';

    if(lang.buttonclear) {
        document.getElementById("clearButton").innerHTML = lang.buttonclear;
    }
}

/**
 * Clears the textarea or result based on current state
 * @param {Object} lang - Language object for text
 */
export function clearResult(lang) {
    const resultElement = document.getElementById("result");
    if (resultElement.children.length > 0) {
        clearResultElement(resultElement, lang);
    } else {
        document.getElementById("statiotext").value = '';
    }
}

/**
 * Toggles the visibility of a checkmark and updates localStorage
 * @param {HTMLElement} checkmarkSpan - The checkmark element
 * @param {string} storageKey - The localStorage key
 */
export function toggleCheckmark(checkmarkSpan, storageKey) {
    const newValue = toggleStoredBoolean(storageKey);
    checkmarkSpan.style.display = newValue ? '' : 'none';
}

/**
 * Includes example text in the textarea
 * @param {boolean} value - Whether to show example
 * @param {Object} lang - Language object containing example text
 */
export function includeExample(value, lang) {
    const txt = document.getElementById("statiotext");
    txt.value = value ? lang.sampleoutput : "";
}

/**
 * Initializes the scroll-to-top button functionality
 */
export function initializeScrollToTop() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });
    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initializes clipboard functionality
 * @param {Object} lang - Language object for button text
 */
export function initializeClipboard(lang) {
    const clipboard = new ClipboardJS('#copyResultButton');
    
    clipboard.on('success', function(e) {
        const button = e.trigger;
        const originalText = button.innerHTML;
        button.innerHTML = lang.buttoncopyresultmessage;
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
        
        e.clearSelection();
    });
    
    clipboard.on('error', function(e) {
        console.error('Failed to copy text: ', e.action);
    });
}

/**
 * Shows or hides the result controls based on data presence
 * @param {boolean} hasData - Whether there is data to display
 */
export function toggleResultControls(hasData) {
    document.getElementById("resultControls").style.display = hasData ? 'block' : 'none';
}

/**
 * Initializes all UI components
 * @param {Object} lang - Language object for text
 */
export function initializeUI(lang) {
    // Initialize scroll-to-top functionality
    initializeScrollToTop();
    
    // Initialize clipboard
    initializeClipboard(lang);
    
    // Set up scrollbar option
    if(getTableScrollbarPreference()) {
        document.getElementById("scrollbarOptionCheck").style.display = '';
    }
    
    // Set up button handlers
    setupButtonHandlers(lang);
}

/**
 * Sets up button click handlers
 * @param {Object} lang - Language object for text
 */
function setupButtonHandlers(lang) {
    // Parse button
    document.getElementById('parseButton').onclick = function() {
        clearResultElement(document.getElementById("result"), lang);
        const parsedData = parseText(lang);
        
        if (lang.buttonclearresult) {
            document.getElementById("clearButton").innerHTML = lang.buttonclearresult;
        }
        
        toggleResultControls(parsedData.data.length > 0);
    };

    // Clear button
    document.getElementById('clearButton').onclick = function() {
        clearResult(lang);
    };

    // Example option
    document.getElementById('exampleOptionCheck').parentElement.onclick = function(e) {
        e.preventDefault();
        includeExample(true, lang);
    };

    // Scrollbar option
    document.getElementById('scrollbarOptionCheck').parentElement.onclick = function(e) {
        e.preventDefault();
        toggleCheckmark(document.getElementById("scrollbarOptionCheck"), 'tableScrollbar');
    };
} 