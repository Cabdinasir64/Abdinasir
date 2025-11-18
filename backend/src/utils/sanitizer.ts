import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export const sanitizeInput = (input: string): string => {
    const trimmedInput = input.trim();
    return purify.sanitize(trimmedInput, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'], 
        FORBID_ATTR: ['onerror', 'onload', 'onmouseover', 'onclick', 'onfocus', 'formaction', 'srcdoc'], 
        ALLOW_DATA_ATTR: false, 
    });
};

export const isInputEmptyAfterSanitization = (originalInput: string): boolean => {
    const sanitizedInput = sanitizeInput(originalInput);
    return originalInput.trim().length > 0 && sanitizedInput.trim().length === 0;
};

export const isWhitespaceOnly = (input: string): boolean => {
    return input.trim().length === 0;
};