/**
 * Document initialization logic - extracted for testability.
 * Handles language setup, URL params, clipboard, scroll-to-top, and button handlers.
 */
import ClipboardJS from 'clipboard';
import { displayParsedData } from './assets/js/modules/displaystats.js';
import { parseData } from './assets/js/modules/parser.js';
import { initializeLanguage } from './assets/js/modules/language.js';
import {
    initializeUI,
    clearResult,
    clearResultElement,
    includeExample,
    toggleCheckmark
} from './assets/js/modules/ui.js';

export async function initalizeDocument() {
    const urlParams = new URLSearchParams(window.location.search);
    const languageType = urlParams.get('lang') || 'en';
    const urlStatsOutput = urlParams.get('data');

    // Initialize language
    window.langText = await initializeLanguage(languageType);

    // If there is a data in the URL parameter, parse the text
    if (urlStatsOutput != undefined && urlStatsOutput != '') {
        document.getElementById("statiotext").value = urlStatsOutput;
        document.getElementById("parseButton").click();
    }

    // Initialize UI
    initializeUI(window.langText);

    // Handle scrollbar option
    const scrollbarOptionCheck = document.getElementById('scrollbarOptionCheck');
    if (localStorage.getItem("tableScrollbar") === 'true') {
        scrollbarOptionCheck.style.display = '';
    }

    // Initialize clipboard.js
    const clipboard = new ClipboardJS('#copyResultButton');

    clipboard.on('success', function (e) {
        const button = e.trigger;
        const originalText = button.innerHTML;
        button.innerHTML = window.langText.buttoncopyresultmessage;

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Failed to copy text: ', e.action);
    });

    // Scroll to top button functionality
    const scrollToTopButton = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
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

    // Button handlers
    document.getElementById('parseButton').onclick = function () {
        const lang = window.langText;
        const iotext = document.getElementById("statiotext").value;
        const showScrollbar = localStorage.getItem("tableScrollbar") === 'true';

        clearResultElement(document.getElementById("result"), lang);
        const parsedData = parseData(iotext, lang);
        displayParsedData(parsedData, showScrollbar, lang);

        if (lang.buttonclearresult) {
            document.getElementById("clearButton").innerHTML = lang.buttonclearresult;
        }

        if (parsedData.data.length > 0) {
            document.getElementById("resultControls").style.display = 'block';
        } else {
            document.getElementById("resultControls").style.display = 'none';
        }
    };

    document.getElementById('clearButton').onclick = function () {
        clearResult(window.langText);
    };

    document.getElementById('exampleOptionCheck').parentElement.onclick = function (e) {
        e.preventDefault();
        includeExample(true, window.langText);
    };

    document.getElementById('scrollbarOptionCheck').parentElement.onclick = function (e) {
        e.preventDefault();
        toggleCheckmark(scrollbarOptionCheck, 'tableScrollbar');
    };

    document.querySelectorAll('[data-lang]').forEach(element => {
        element.onclick = async function (e) {
            e.preventDefault();
            window.langText = await initializeLanguage(this.dataset.lang);
        };
    });
}
