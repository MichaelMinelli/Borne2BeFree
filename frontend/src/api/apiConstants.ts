const protocol: string = window.location.protocol + '//';
const hostname: string = window.location.hostname;
const port: string = window.location.port ? `:${ window.location.port }` : '';

function buildUrl(protocol: string, hostname: string): string {
    const baseComponents = [ protocol, import.meta.env.VITE_API_URL.replace('{{HOSTNAME}}', hostname + port) ];
    return baseComponents.join('');
}

function buildLibraryUrl(url: string): string {
    return `${ baseUrl }/${ url }?`;
}

const baseUrl: string = buildUrl(protocol, hostname);

export {
    baseUrl, buildLibraryUrl
};