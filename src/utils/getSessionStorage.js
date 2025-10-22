export const getSessionStorage = () => {
    const storage = globalThis?.sessionStorage;
    if (!storage) return "No session storage found";
    return sessionStorage;
} 

