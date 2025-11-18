import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { isValidObjectId } from 'mongoose';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export const sanitizeInput = (input: string): string => {
    const trimmedInput = input.trim();
    return purify.sanitize(trimmedInput, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
        FORBID_ATTR: ['onerror', 'onload', 'onmouseover', 'onclick', 'onfocus', 'formaction', 'srcdoc', 'style', 'href'],
        ALLOW_DATA_ATTR: false,
        ALLOWED_ATTR: ['class', 'id', 'title', 'alt', 'src', 'width', 'height']
    });
};

export const isInputEmptyAfterSanitization = (originalInput: string): boolean => {
    const sanitizedInput = sanitizeInput(originalInput);
    return originalInput.trim().length > 0 && sanitizedInput.trim().length === 0;
};

export const isWhitespaceOnly = (input: string): boolean => {
    return input.trim().length === 0;
};

export const validateObjectId = (id: string): boolean => {
    return isValidObjectId(id);
};

export const validateProjectCategory = (category: string): boolean => {
    const validCategories = ['PROJECT', 'PORTFOLIO', 'WEB_DESIGN', 'MOBILE_APP', 'UI_UX', 'MACHINE_LEARNING', 'OTHER'];
    return validCategories.includes(category);
};

export const validateTechStack = (tech: string[]): boolean => {
    if (!Array.isArray(tech)) return false;
    if (tech.length === 0) return false;

    return tech.every(item =>
        typeof item === 'string' &&
        !isWhitespaceOnly(item) &&
        item.length <= 50
    );
};

export const validateImages = (images: string[]): boolean => {
    if (!Array.isArray(images)) return false;
    return images.every(img => typeof img === 'string' && img.startsWith('http'));
};

export const validateDateRange = (startDate?: string, endDate?: string): boolean => {
    if (!startDate && !endDate) return true;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && isNaN(start.getTime())) return false;
    if (end && isNaN(end.getTime())) return false;

    if (start && end && start > end) return false;

    return true;
};

export const validateURL = (url?: string): boolean => {
    if (!url) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};