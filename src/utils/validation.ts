/**
 * LernDeutsch AI - Validation Utilities
 * Shared validation logic for auth screens and forms.
 */

/**
 * Check if an email address is valid.
 */
export const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email.trim());
};

/**
 * Check if a password meets minimum requirements.
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Get detailed password validation errors.
 * Returns an array of error messages (empty if password is valid).
 */
export const getPasswordErrors = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push("Must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Must include an uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Must include a number");
    }

    return errors;
};

/**
 * Get a password strength score (0-3).
 * 0 = weak, 1 = fair, 2 = good, 3 = strong
 */
export const getPasswordStrength = (
    password: string,
): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: "", color: "#666" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8 && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

    const labels: Record<number, { label: string; color: string }> = {
        0: { label: "Weak", color: "#EF4444" },
        1: { label: "Fair", color: "#F59E0B" },
        2: { label: "Good", color: "#3B82F6" },
        3: { label: "Strong", color: "#10B981" },
    };

    return { score, ...labels[score] };
};
