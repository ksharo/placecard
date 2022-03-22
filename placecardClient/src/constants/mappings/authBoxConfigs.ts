import { googleProvider } from "../../utils/firebase/authProviders";
import type { AuthProvider } from "firebase/auth";

export interface AuthBoxConfig {
    providerName: string,
    authProvider: AuthProvider
};

const PROVIDERS = Object.freeze({
    GOOGLE: "Google" 
});

const authBoxConfigs = Object.freeze({
    [PROVIDERS.GOOGLE]: {
        providerName: PROVIDERS.GOOGLE,
        authProvider: googleProvider()
    }
});

export {
    PROVIDERS,
    authBoxConfigs
};