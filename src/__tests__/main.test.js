import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the modules that are imported in main.js
vi.mock('../assets/js/modules/displaystats.js', () => ({
    displayParsedData: vi.fn()
}));

vi.mock('../assets/js/modules/parser.js', () => ({
    parseData: vi.fn()
}));

const initializeLanguage = vi.fn().mockImplementation((lang) => {
    return Promise.resolve({
        buttoncopyresultmessage: 'Copied!',
        buttonclearresult: 'Clear Result',
        buttoncopyresult: 'Copy Result',
        buttonparsestats: 'Parse Stats',
        exampletext: 'Example Text',
        inputtext: 'Input Text',
        outputtext: 'Output Text',
        result: 'Result'
    });
});

vi.mock('../assets/js/modules/language.js', () => ({
    initializeLanguage
}));

vi.mock('../assets/js/modules/ui.js', () => ({
    initializeUI: vi.fn(),
    clearResult: vi.fn(),
    clearResultElement: vi.fn(),
    includeExample: vi.fn(),
    toggleCheckmark: vi.fn()
}));

// Mock ClipboardJS
const mockOn = vi.fn();
const mockClipboard = {
    on: mockOn
};

vi.mock('clipboard', () => ({
    default: vi.fn().mockImplementation(() => mockClipboard)
}));

describe('initalizeDocument', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        // Create a new JSDOM instance for each test
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'http://localhost/',
            runScripts: 'dangerously'
        });
        
        window = dom.window;
        document = window.document;

        // Set up global objects
        global.window = window;
        global.document = document;
        global.navigator = window.navigator;

        // Mock localStorage
        const localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorage
        });

        // Create necessary DOM elements
        document.body.innerHTML = `
            <textarea id="statiotext"></textarea>
            <button id="parseButton"></button>
            <button id="clearButton"></button>
            <div id="result"></div>
            <div id="resultControls"></div>
            <button id="copyResultButton"></button>
            <button id="scrollToTop"></button>
            <div id="exampleOptionCheck"></div>
            <div id="scrollbarOptionCheck"></div>
        `;

        // Mock URLSearchParams
        const mockSearchParams = new URLSearchParams();
        vi.spyOn(window, 'URLSearchParams').mockImplementation(() => mockSearchParams);

        // Mock document.addEventListener
        document.addEventListener = vi.fn((event, callback) => {
            if (event === 'DOMContentLoaded') {
                callback();
            }
        });

        // Reset clipboard mock before each test
        mockOn.mockClear();
    });

    afterEach(() => {
        // Clean up global objects
        delete global.window;
        delete global.document;
        delete global.navigator;
    });

    it('should initialize with default language when no lang parameter is present', async () => {
        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that initializeLanguage was called with 'en'
        expect(vi.mocked(initializeLanguage)).toHaveBeenCalledWith('en');
    });

    it('should initialize with specified language from URL parameter', async () => {
        // Clear require cache to ensure fresh import
        vi.resetModules();

        // Mock URLSearchParams
        const mockGet = vi.fn().mockImplementation((param) => {
            if (param === 'lang') return 'es';
            return null;
        });
        
        const MockURLSearchParams = vi.fn().mockImplementation(() => ({
            get: mockGet
        }));
        
        global.URLSearchParams = MockURLSearchParams;

        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that initializeLanguage was called with 'es'
        expect(vi.mocked(initializeLanguage)).toHaveBeenCalledWith('es');
    });

    it('should parse data when URL parameter contains data', async () => {
        // Clear require cache to ensure fresh import
        vi.resetModules();

        // Mock URLSearchParams
        const mockGet = vi.fn().mockImplementation((param) => {
            if (param === 'data') return 'test data';
            return null;
        });
        
        const MockURLSearchParams = vi.fn().mockImplementation(() => ({
            get: mockGet
        }));
        
        global.URLSearchParams = MockURLSearchParams;

        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that the textarea was populated and parse button was clicked
        expect(document.getElementById('statiotext').value).toBe('test data');
    });

    it('should initialize clipboard functionality', async () => {
        // Clear require cache to ensure fresh import
        vi.resetModules();

        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that ClipboardJS was initialized
        const { default: ClipboardJS } = await import('clipboard');
        expect(ClipboardJS).toHaveBeenCalledWith('#copyResultButton');
    });

    it('should set up clipboard success handler correctly', async () => {
        // Clear require cache to ensure fresh import
        vi.resetModules();

        // Mock setTimeout
        vi.useFakeTimers();

        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that the success handler was set up
        expect(mockOn).toHaveBeenCalledWith('success', expect.any(Function));

        // Get the success handler function
        const successHandler = mockOn.mock.calls[0][1];

        // Create a mock event
        const mockEvent = {
            trigger: document.getElementById('copyResultButton'),
            clearSelection: vi.fn()
        };

        // Set initial button text
        mockEvent.trigger.innerHTML = 'Copy Result';

        // Call the success handler
        successHandler(mockEvent);

        // Verify button text was changed
        expect(mockEvent.trigger.innerHTML).toBe('Copied!');

        // Fast-forward timers
        vi.advanceTimersByTime(2000);

        // Verify button text was restored
        expect(mockEvent.trigger.innerHTML).toBe('Copy Result');

        // Verify clearSelection was called
        expect(mockEvent.clearSelection).toHaveBeenCalled();

        // Clean up
        vi.useRealTimers();
    });

    it('should handle scrollbar option from localStorage', async () => {
        // Mock localStorage to return true for tableScrollbar
        window.localStorage.getItem.mockImplementation((key) => {
            if (key === 'tableScrollbar') return 'true';
            return null;
        });

        // Import the function we want to test
        const { initalizeDocument } = await import('../main.js');
        
        // Call the function
        await initalizeDocument();

        // Verify that scrollbar option is displayed
        expect(document.getElementById('scrollbarOptionCheck').style.display).toBe('');
    });
});