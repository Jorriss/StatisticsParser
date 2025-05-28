// Import CSS
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import 'datatables.net';
import 'datatables.net-bs5';
import ClipboardJS from 'clipboard';

// Import our modules
import { parseText } from './statisticsparser.js';
import { initializeLanguage } from './modules/language.js';
import {
    initializeUI,
    displayVersionNumber,
    clearResult,
    clearResultElement,
    includeExample,
    toggleCheckmark
} from './modules/ui.js';

// Initialize version number
displayVersionNumber();

// Initialize on document ready using native JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const languageType = urlParams.get('lang') || 'en';
    const urlStatsOutput = urlParams.get('data');
    
    // Initialize language
    window.langText = await initializeLanguage(languageType, urlStatsOutput);
    
    // Initialize UI
    initializeUI(window.langText);

    // Handle scrollbar option
    if(localStorage.getItem("tableScrollbar") === 'true') {
        scrollbarOptionCheck.style.display = ''
    }
    
    // Initialize clipboard.js
    let clipboard = new ClipboardJS('#copyResultButton');
    
    // Add success/error handlers
    clipboard.on('success', function(e) {
        // Change button text temporarily
        const button = e.trigger;
        const originalText = button.innerHTML;
        button.innerHTML = window.langText.buttoncopyresultmessage;
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
        
        e.clearSelection();
    });
    
    clipboard.on('error', function(e) {
        console.error('Failed to copy text: ', e.action);
    });

    // Scroll to top button functionality
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) { // Show button after scrolling 100px
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when button is clicked
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Button handlers
    document.getElementById('parseButton').onclick = function() {
        let lang = window.langText;
        
        clearResultElement(document.getElementById("result"), lang);
        let parsedData = parseText(lang);
          
        if (lang.buttonclearresult) {
            document.getElementById("clearButton").innerHTML = lang.buttonclearresult;
        }
        
        // Show copy button if there are results
        if (parsedData.data.length > 0) {
            document.getElementById("resultControls").style.display = 'block';
        } else {
            document.getElementById("resultControls").style.display = 'none';
        }
    };

    document.getElementById('clearButton').onclick = function() {
        clearResult(window.langText);
    };

    document.getElementById('exampleOptionCheck').parentElement.onclick = function(e) {
        e.preventDefault();
        includeExample(true, window.langText);
    };

    document.getElementById('scrollbarOptionCheck').parentElement.onclick = function(e) {
        e.preventDefault();
        toggleCheckmark(scrollbarOptionCheck, 'tableScrollbar');
    };

    // Language dropdown click handlers
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.onclick = async function(e) {
            e.preventDefault();
            window.langText = await initializeLanguage(this.dataset.lang);
        };
    });
});
