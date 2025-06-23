const protocol: string = window.location.protocol + '//';
const hostname: string = window.location.hostname;

function buildUrl(protocol: string, hostname: string): string {
    const baseComponents = [ protocol, import.meta.env.VITE_API_URL.replace('{{HOSTNAME}}', hostname) ];
    return baseComponents.join('');
}

function buildLibraryUrl(url: string): string {
    return `${ baseUrl }/${ url }?`;
}

const baseUrl: string = buildUrl(protocol, hostname);

export {
    baseUrl, buildLibraryUrl
};