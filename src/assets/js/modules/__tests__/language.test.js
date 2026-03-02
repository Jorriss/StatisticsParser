import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initializeLanguage, __test__ } from '../language.js'

const { determineLangFilename, getLanguageText, updateUIElements } = __test__

describe('Language Module', () => {
    // Mock DOM elements
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="exampleText"></div>
            <div id="scrollbarOptionText"></div>
            <button id="clearButton"></button>
            <button id="parseButton"></button>
            <button id="copyResultButton"></button>
            <div id="languageDropdown"></div>
            <div id="result" style="display: none;"></div>
        `
    })

    afterEach(() => {
        vi.clearAllMocks()
        document.body.innerHTML = ''
    })

    describe('determineLangFilename', () => {
        it('should return English file path for "en"', () => {
            const result = determineLangFilename('en');
            expect(result).toBe('./data/languagetext-en.json');
        });

        it('should return Spanish file path for "es"', () => {
            const result = determineLangFilename('es');
            expect(result).toBe('./data/languagetext-es.json');
        });

        it('should return Italian file path for "it"', () => {
            const result = determineLangFilename('it');
            expect(result).toBe('./data/languagetext-it.json');
        });

        it('should default to English for unknown language', () => {
            const result = determineLangFilename('fr');
            expect(result).toBe('./data/languagetext-en.json');
        });
    })

    describe('getLanguageText', () => {
        const mockLangText = {
            showexample: 'Test Example',
            tableshavescrollbars: 'Test Scrollbars',
            buttonclear: 'Clear',
            buttonclearresult: 'Clear Result',
            buttonparse: 'Parse',
            buttoncopyresult: 'Copy Result',
            langname: 'English'
        };

        beforeEach(() => {
            global.fetch = vi.fn();
            global.window = {
                location: { href: 'http://localhost' },
                history: { pushState: vi.fn() }
            };
        });

        it('should fetch and return language text', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockLangText)
            });

            const result = await getLanguageText('en');
            expect(result).toEqual(mockLangText);
            expect(global.fetch).toHaveBeenCalledWith('./data/languagetext-en.json');
        });

        it('should update URL with language parameter', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockLangText)
            });

            const result = await getLanguageText('es');
            expect(result).toEqual(mockLangText);
            expect(global.fetch).toHaveBeenCalledWith('./data/languagetext-es.json');
            expect(window.history.pushState).toHaveBeenCalled();
        });

        it('should fallback to English on error', async () => {
            global.fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockLangText)
                });

            const result = await getLanguageText('fr');
            expect(result).toEqual(mockLangText);
            expect(global.fetch).toHaveBeenCalledWith('./data/languagetext-en.json');
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    })

    describe('updateUIElements', () => {
        const mockLangText = {
            showexample: 'Test Example',
            tableshavescrollbars: 'Test Scrollbars',
            buttonclear: 'Clear',
            buttonclearresult: 'Clear Result',
            buttonparse: 'Parse',
            buttoncopyresult: 'Copy Result',
            langname: 'English'
        };

        it('should update all UI elements with language text', () => {
            updateUIElements(mockLangText);

            expect(document.getElementById('exampleText').innerHTML).toBe('Test Example');
            expect(document.getElementById('scrollbarOptionText').innerHTML).toBe('Test Scrollbars');
            expect(document.getElementById('clearButton').innerHTML).toBe('Clear');
            expect(document.getElementById('parseButton').innerHTML).toBe('Parse');
            expect(document.getElementById('copyResultButton').innerHTML).toBe('Copy Result');
            expect(document.getElementById('languageDropdown').textContent).toBe('English');
        });

        it('should handle missing language text properties', () => {
            const partialLangText = {
                showexample: 'Test Example'
            };

            updateUIElements(partialLangText);
            expect(document.getElementById('exampleText').innerHTML).toBe('Test Example');
            expect(document.getElementById('languageDropdown').textContent).toBe('Language');
        });

        it('should show clear result button when result is visible', () => {
            document.getElementById('result').style.display = 'block';
            updateUIElements(mockLangText);
            expect(document.getElementById('clearButton').innerHTML).toBe('Clear Result');
        });
    })

    describe('initializeLanguage', () => {
        const mockLangText = {
            showexample: 'Test Example',
            tableshavescrollbars: 'Test Scrollbars',
            buttonclear: 'Clear',
            buttonclearresult: 'Clear Result',
            buttonparse: 'Parse',
            buttoncopyresult: 'Copy Result',
            langname: 'English'
        };

        beforeEach(() => {
            global.fetch = vi.fn();
            global.window = {
                location: { href: 'http://localhost' },
                history: { pushState: vi.fn() }
            };
        });

        it('should initialize with default language (en)', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockLangText)
            });

            const result = await initializeLanguage();
            expect(result).toEqual(mockLangText);
            expect(document.getElementById('exampleText').innerHTML).toBe('Test Example');
        });

        it('should initialize with specified language', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockLangText)
            });

            const result = await initializeLanguage('es');
            expect(result).toEqual(mockLangText);
            expect(global.fetch).toHaveBeenCalledWith('./data/languagetext-es.json');
        });
    })
}) 