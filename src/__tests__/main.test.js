import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock ClipboardJS - must use function (not arrow) for constructor
const mockClipboardOn = vi.fn();
vi.mock('clipboard', () => ({
    default: vi.fn(function() {
        return { on: mockClipboardOn };
    })
}));

// Mock the modules imported by initialize.js
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

describe('initalizeDocument', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'http://localhost/',
            runScripts: 'dangerously'
        });

        window = dom.window;
        document = window.document;

        global.window = window;
        global.document = document;
        global.navigator = window.navigator;

        const localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorage
        });

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

        const mockSearchParams = new URLSearchParams();
        vi.spyOn(window, 'URLSearchParams').mockImplementation(() => mockSearchParams);

        mockClipboardOn.mockClear();
    });

    afterEach(() => {
        delete global.window;
        delete global.document;
        delete global.navigator;
    });

    it('should initialize with default language when no lang parameter is present', async () => {
        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        expect(vi.mocked(initializeLanguage)).toHaveBeenCalledWith('en');
    });

    it('should initialize with specified language from URL parameter', async () => {
        vi.resetModules();

        const mockGet = vi.fn().mockImplementation((param) => {
            if (param === 'lang') return 'es';
            return null;
        });

        const MockURLSearchParams = vi.fn().mockImplementation(function() {
            return { get: mockGet };
        });

        global.URLSearchParams = MockURLSearchParams;

        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        expect(vi.mocked(initializeLanguage)).toHaveBeenCalledWith('es');
    });

    it('should parse data when URL parameter contains data', async () => {
        vi.resetModules();

        const mockGet = vi.fn().mockImplementation((param) => {
            if (param === 'data') return 'test data';
            return null;
        });

        const MockURLSearchParams = vi.fn().mockImplementation(function() {
            return { get: mockGet };
        });

        global.URLSearchParams = MockURLSearchParams;

        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        expect(document.getElementById('statiotext').value).toBe('test data');
    });

    it('should initialize clipboard functionality', async () => {
        vi.resetModules();

        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        const { default: ClipboardJS } = await import('clipboard');
        expect(ClipboardJS).toHaveBeenCalledWith('#copyResultButton');
    });

    it('should set up clipboard success handler correctly', async () => {
        vi.resetModules();

        vi.useFakeTimers();

        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        expect(mockClipboardOn).toHaveBeenCalledWith('success', expect.any(Function));

        const successHandler = mockClipboardOn.mock.calls.find(c => c[0] === 'success')[1];

        const mockEvent = {
            trigger: document.getElementById('copyResultButton'),
            clearSelection: vi.fn()
        };

        mockEvent.trigger.innerHTML = 'Copy Result';

        successHandler(mockEvent);

        expect(mockEvent.trigger.innerHTML).toBe('Copied!');

        vi.advanceTimersByTime(2000);

        expect(mockEvent.trigger.innerHTML).toBe('Copy Result');

        expect(mockEvent.clearSelection).toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('should handle scrollbar option from localStorage', async () => {
        window.localStorage.getItem.mockImplementation((key) => {
            if (key === 'tableScrollbar') return 'true';
            return null;
        });

        const { initalizeDocument } = await import('../initialize.js');

        await initalizeDocument();

        expect(document.getElementById('scrollbarOptionCheck').style.display).toBe('');
    });
});
