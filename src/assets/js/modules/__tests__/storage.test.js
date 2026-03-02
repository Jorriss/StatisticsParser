import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    getStoredValue,
    setStoredValue,
    toggleStoredBoolean,
    getTableScrollbarPreference,
    setTableScrollbarPreference,
    getExampleTextPreference,
    setExampleTextPreference,
    clearAllPreferences,
    getAllPreferences
} from '../storage.js';

describe('Storage Module', () => {
    let mockLocalStorage;

    beforeEach(() => {
        // Create a mock localStorage
        mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0
        };

        // Replace the global localStorage with our mock
        global.localStorage = mockLocalStorage;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getStoredValue', () => {
        it('should return stored value when key exists', () => {
            mockLocalStorage.getItem.mockReturnValue('test-value');
            expect(getStoredValue('test-key')).toBe('test-value');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
        });

        it('should return default value when key does not exist', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            expect(getStoredValue('test-key', 'default')).toBe('default');
        });

        it('should handle localStorage errors', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(getStoredValue('test-key', 'default')).toBe('default');
        });
    });

    describe('setStoredValue', () => {
        it('should successfully store a value', () => {
            expect(setStoredValue('test-key', 'test-value')).toBe(true);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
        });

        it('should handle localStorage errors', () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(setStoredValue('test-key', 'test-value')).toBe(false);
        });
    });

    describe('toggleStoredBoolean', () => {
        it('should toggle from false to true', () => {
            mockLocalStorage.getItem.mockReturnValue('false');
            expect(toggleStoredBoolean('test-key')).toBe(true);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'true');
        });

        it('should toggle from true to false', () => {
            mockLocalStorage.getItem.mockReturnValue('true');
            expect(toggleStoredBoolean('test-key')).toBe(false);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'false');
        });
    });

    describe('Table Scrollbar Preferences', () => {
        it('should get table scrollbar preference', () => {
            mockLocalStorage.getItem.mockReturnValue('true');
            expect(getTableScrollbarPreference()).toBe(true);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tableScrollbar');
        });

        it('should set table scrollbar preference', () => {
            setTableScrollbarPreference(true);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tableScrollbar', 'true');
        });
    });

    describe('Example Text Preferences', () => {
        it('should get example text preference', () => {
            mockLocalStorage.getItem.mockReturnValue('true');
            expect(getExampleTextPreference()).toBe(true);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('exampleText');
        });

        it('should set example text preference', () => {
            setExampleTextPreference(true);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('exampleText', 'true');
        });
    });

    describe('clearAllPreferences', () => {
        it('should clear all stored preferences', () => {
            clearAllPreferences();
            expect(mockLocalStorage.clear).toHaveBeenCalled();
        });

        it('should handle errors when clearing preferences', () => {
            mockLocalStorage.clear.mockImplementation(() => {
                throw new Error('Storage error');
            });
            // Should not throw error
            clearAllPreferences();
        });
    });

    describe('getAllPreferences', () => {
        it('should return all stored preferences', () => {
            mockLocalStorage.length = 2;
            mockLocalStorage.key
                .mockReturnValueOnce('key1')
                .mockReturnValueOnce('key2');
            mockLocalStorage.getItem
                .mockReturnValueOnce('value1')
                .mockReturnValueOnce('value2');

            const result = getAllPreferences();
            expect(result).toEqual({
                key1: 'value1',
                key2: 'value2'
            });
        });

        it('should handle errors when getting all preferences', () => {
            mockLocalStorage.length = 1;
            mockLocalStorage.key.mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(getAllPreferences()).toEqual({});
        });
    });
}); 