import { GoogleCredentialResponse } from './types';

export const extractClientId = (
    credentialResponse: GoogleCredentialResponse,
): string | undefined => {
    const clientId =
        credentialResponse?.clientId ?? credentialResponse?.client_id;
    return clientId;
};
