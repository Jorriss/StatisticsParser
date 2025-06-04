import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    clearResultElement,
    clearResult,
    toggleCheckmark,
    includeExample,
    initializeScrollToTop,
    initializeClipboard,
    toggleResultControls,
    initializeUI
} from '../ui.js';
import ClipboardJS from 'clipboard';

// Mock ClipboardJS
vi.mock('clipboard', () => ({
    default: vi.fn().mockImplementation(() => ({
        on: vi.fn()
    }))
}));

// Mock storage module
vi.mock('../storage.js', () => ({
    getTableScrollbarPreference: vi.fn().mockReturnValue(true),
    toggleStoredBoolean: vi.fn().mockReturnValue(true)
}));

// Mock parser module
vi.mock('../parser.js', () => ({
    parseText: vi.fn().mockReturnValue({
        data: [{ rowtype: 1 }]
    })
}));

// Make parseText available globally
global.parseText = vi.fn().mockReturnValue({
    data: [{ rowtype: 1 }]
});

describe('UI Module', () => {
    let mockElements;

    beforeEach(() => {
        // Create a simpler mock structure
        mockElements = {
            result: {
                firstChild: null,
                children: [],
                removeChild: function(child) {
                    const index = this.children.indexOf(child);
                    if (index > -1) {
                        this.children.splice(index, 1);
                    }
                    this.firstChild = this.children[0] || null;
                }
            },
            resultControls: {
                style: { display: 'none' }
            },
            clearButton: {
                innerHTML: ''
            },
            statiotext: {
                value: ''
            },
            scrollToTop: {
                classList: {
                    add: vi.fn(),
                    remove: vi.fn()
                },
                addEventListener: vi.fn()
            },
            exampleOptionCheck: {
                parentElement: {
                    onclick: null
                }
            },
            scrollbarOptionCheck: {
                style: { display: 'none' },
                parentElement: {
                    onclick: null
                }
            },
            parseButton: {
                onclick: null
            }
        };

        // Setup document mock
        global.document = {
            getElementById: vi.fn((id) => mockElements[id])
        };

        // Setup window mock
        global.window = {
            addEventListener: vi.fn(),
            pageYOffset: 0,
            scrollTo: vi.fn()
        };

        // Reset parseText mock before each test
        vi.fn().mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        // Clean up mocks
        Object.values(mockElements).forEach(element => {
            if (element.classList) {
                element.classList.add.mockClear();
                element.classList.remove.mockClear();
            }
        });
    });

    describe('clearResultElement', () => {
        it('should clear result element and update UI', () => {
            const resultElement = mockElements.result;
            const child = { some: 'child' };
            resultElement.firstChild = child;
            resultElement.children = [child];

            clearResultElement(resultElement, {
                buttonclear: 'Clear'
            });

            expect(resultElement.children.length).toBe(0);
            expect(resultElement.firstChild).toBeNull();
            expect(mockElements.resultControls.style.display).toBe('none');
            expect(mockElements.clearButton.innerHTML).toBe('Clear');
        });
    });

    describe('clearResult', () => {
        it('should clear result element when it has children', () => {
            const resultElement = mockElements.result;
            const child = { some: 'child' };
            resultElement.children = [child];
            resultElement.firstChild = child;

            clearResult({});

            expect(resultElement.children.length).toBe(0);
            expect(resultElement.firstChild).toBeNull();
        });

        it('should clear textarea when result has no children', () => {
            mockElements.result.children = [];
            mockElements.result.firstChild = null;
            clearResult({});
            expect(mockElements.statiotext.value).toBe('');
        });
    });

    describe('toggleCheckmark', () => {
        it('should toggle checkmark visibility', () => {
            const checkmarkSpan = {
                style: { display: 'none' }
            };

            toggleCheckmark(checkmarkSpan, 'testKey');

            expect(checkmarkSpan.style.display).toBe('');
        });
    });

    describe('includeExample', () => {
        it('should include example text when value is true', () => {
            includeExample(true, {
                sampleoutput: 'Sample output text'
            });
            expect(mockElements.statiotext.value).toBe('Sample output text');
        });

        it('should clear textarea when value is false', () => {
            includeExample(false, {
                sampleoutput: 'Sample output text'
            });
            expect(mockElements.statiotext.value).toBe('');
        });
    });

    describe('initializeScrollToTop', () => {
        it('should initialize scroll to top functionality', () => {
            initializeScrollToTop();

            expect(global.window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
            expect(global.document.getElementById('scrollToTop').addEventListener)
                .toHaveBeenCalledWith('click', expect.any(Function));
        });

        it('should show button when scrolled down', () => {
            initializeScrollToTop();
            const scrollHandler = global.window.addEventListener.mock.calls[0][1];
            
            global.window.pageYOffset = 200;
            scrollHandler();

            expect(mockElements.scrollToTop.classList.add)
                .toHaveBeenCalledWith('visible');
        });

        it('should hide button when scrolled to top', () => {
            initializeScrollToTop();
            const scrollHandler = global.window.addEventListener.mock.calls[0][1];
            
            global.window.pageYOffset = 0;
            scrollHandler();

            expect(mockElements.scrollToTop.classList.remove)
                .toHaveBeenCalledWith('visible');
        });
    });

    describe('initializeClipboard', () => {
        let clipboardInstance;
        let successHandler;
        let errorHandler;

        beforeEach(() => {
            // Enable fake timers
            vi.useFakeTimers();
            
            // Mock ClipboardJS instance
            clipboardInstance = {
                on: vi.fn((event, handler) => {
                    if (event === 'success') successHandler = handler;
                    if (event === 'error') errorHandler = handler;
                })
            };
            ClipboardJS.mockReturnValue(clipboardInstance);
        });

        afterEach(() => {
            // Restore real timers
            vi.useRealTimers();
        });

        it('should initialize clipboard functionality', () => {
            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            expect(ClipboardJS).toHaveBeenCalledWith('#copyResultButton');
            expect(clipboardInstance.on).toHaveBeenCalledWith('success', expect.any(Function));
            expect(clipboardInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        it('should handle successful copy', () => {
            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            const mockEvent = {
                trigger: {
                    innerHTML: 'Original Text'
                },
                clearSelection: vi.fn()
            };

            // Trigger success handler
            successHandler(mockEvent);

            // Verify button text was updated
            expect(mockEvent.trigger.innerHTML).toBe('Copied!');

            // Fast-forward timers
            vi.advanceTimersByTime(2000);

            // Verify button text was restored
            expect(mockEvent.trigger.innerHTML).toBe('Original Text');
            expect(mockEvent.clearSelection).toHaveBeenCalled();
        });

        it('should handle copy error', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            const mockEvent = {
                action: 'copy'
            };

            // Trigger error handler
            errorHandler(mockEvent);

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text: ', 'copy');
            
            consoleSpy.mockRestore();
        });
    });

    describe('toggleResultControls', () => {
        it('should show controls when hasData is true', () => {
            toggleResultControls(true);
            expect(mockElements.resultControls.style.display).toBe('block');
        });

        it('should hide controls when hasData is false', () => {
            toggleResultControls(false);
            expect(mockElements.resultControls.style.display).toBe('none');
        });
    });

    describe('initializeUI', () => {
        it('should initialize all UI components', () => {
            initializeUI({
                buttonclear: 'Clear',
                buttonclearresult: 'Clear Result',
                buttoncopyresultmessage: 'Copied!',
                sampleoutput: 'Sample output text'
            });

            expect(ClipboardJS).toHaveBeenCalled();
            expect(global.window.addEventListener).toHaveBeenCalled();
            expect(mockElements.scrollbarOptionCheck.style.display).toBe('');
        });
    });

    describe('Button Handlers', () => {
        let mockLang;

        beforeEach(() => {
            mockLang = {
                buttonclear: 'Clear',
                buttonclearresult: 'Clear Result',
                sampleoutput: 'Sample output text'
            };

            // Initialize UI to set up button handlers
            initializeUI(mockLang);
        });

        describe('Parse Button Handler', () => {
            it('should clear result and parse text when clicked', async () => {
                const parseButton = mockElements.parseButton;
                const resultElement = mockElements.result;
                
                // Add some initial content
                resultElement.children = [{ some: 'child' }];
                resultElement.firstChild = resultElement.children[0];

                // Trigger click handler
                parseButton.onclick();

                // Verify result was cleared
                expect(resultElement.children.length).toBe(0);
                expect(resultElement.firstChild).toBeNull();

                // Verify clear button text was updated
                expect(mockElements.clearButton.innerHTML).toBe(mockLang.buttonclearresult);

                // Verify result controls were shown
                expect(mockElements.resultControls.style.display).toBe('block');

                // Verify parseText was called
                expect(global.parseText).toHaveBeenCalled();
            });
        });

        describe('Clear Button Handler', () => {
            it('should clear result element when it has children', () => {
                const clearButton = mockElements.clearButton;
                const resultElement = mockElements.result;
                
                // Add some initial content
                resultElement.children = [{ some: 'child' }];
                resultElement.firstChild = resultElement.children[0];

                // Trigger click handler
                clearButton.onclick();

                // Verify result was cleared
                expect(resultElement.children.length).toBe(0);
                expect(resultElement.firstChild).toBeNull();
            });

            it('should clear textarea when result has no children', () => {
                const clearButton = mockElements.clearButton;
                const resultElement = mockElements.result;
                
                // Set initial state
                resultElement.children = [];
                resultElement.firstChild = null;
                mockElements.statiotext.value = 'Some text';

                // Trigger click handler
                clearButton.onclick();

                // Verify textarea was cleared
                expect(mockElements.statiotext.value).toBe('');
            });
        });

        describe('Example Option Handler', () => {
            it('should include example text when clicked', () => {
                const exampleOption = mockElements.exampleOptionCheck.parentElement;
                
                // Trigger click handler
                exampleOption.onclick({ preventDefault: vi.fn() });

                // Verify example text was included
                expect(mockElements.statiotext.value).toBe(mockLang.sampleoutput);
            });
        });

        describe('Scrollbar Option Handler', () => {
            it('should toggle checkmark when clicked', () => {
                const scrollbarOption = mockElements.scrollbarOptionCheck.parentElement;
                const checkmarkSpan = mockElements.scrollbarOptionCheck;
                
                // Set initial state
                checkmarkSpan.style.display = 'none';

                // Trigger click handler
                scrollbarOption.onclick({ preventDefault: vi.fn() });

                // Verify checkmark was toggled
                expect(checkmarkSpan.style.display).toBe('');
            });
        });
    });
}); 