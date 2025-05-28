// Storage module for handling localStorage and other storage operations

/**
 * Gets a value from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The stored value or default value
 */
export function getStoredValue(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage: ${error.message}`);
        return defaultValue;
    }
}

/**
 * Sets a value in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} Success status
 */
export function setStoredValue(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage: ${error.message}`);
        return false;
    }
}

/**
 * Toggles a boolean value in localStorage
 * @param {string} key - The storage key
 * @returns {boolean} The new value
 */
export function toggleStoredBoolean(key) {
    const currentValue = getStoredValue(key) === 'true';
    const newValue = !currentValue;
    setStoredValue(key, newValue.toString());
    return newValue;
}

/**
 * Gets the table scrollbar preference
 * @returns {boolean} Whether table scrollbar is enabled
 */
export function getTableScrollbarPreference() {
    return getStoredValue('tableScrollbar') === 'true';
}

/**
 * Sets the table scrollbar preference
 * @param {boolean} enabled - Whether to enable table scrollbar
 */
export function setTableScrollbarPreference(enabled) {
    setStoredValue('tableScrollbar', enabled.toString());
}

/**
 * Gets the example text preference
 * @returns {boolean} Whether example text is enabled
 */
export function getExampleTextPreference() {
    return getStoredValue('exampleText') === 'true';
}

/**
 * Sets the example text preference
 * @param {boolean} enabled - Whether to enable example text
 */
export function setExampleTextPreference(enabled) {
    setStoredValue('exampleText', enabled.toString());
}

/**
 * Clears all stored preferences
 */
export function clearAllPreferences() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error(`Error clearing localStorage: ${error.message}`);
    }
}

/**
 * Gets all stored preferences
 * @returns {Object} Object containing all stored preferences
 */
export function getAllPreferences() {
    const preferences = {};
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            preferences[key] = localStorage.getItem(key);
        }
    } catch (error) {
        console.error(`Error reading all preferences: ${error.message}`);
    }
    return preferences;
} 