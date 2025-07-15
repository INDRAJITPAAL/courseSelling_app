export function zodFlatError(formatted) {
    const flatErrors = {};

    for (const key in formatted) {
        if (key === "_errors") continue;

        const errorEntry = formatted[key];
        if (Array.isArray(errorEntry?._errors) && errorEntry._errors.length > 0) {
            flatErrors[key] = errorEntry._errors[0]; // Only first error shown
        } else {
            flatErrors[key] = "Invalid value";
        }
    }

    return flatErrors;
}
