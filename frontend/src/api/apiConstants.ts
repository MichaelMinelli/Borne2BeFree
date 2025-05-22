const protocol: string = window.location.protocol + '//';
const hostname: string = window.location.hostname;
const port: string = 30992;

function buildUrl(protocol: string, hostname: string, port?: string): string {
    const baseComponents = [ protocol, hostname ];
    if ( port ) {
        baseComponents.push(':' + port);
    }
    return baseComponents.join('');
}

const baseUrl: string = buildUrl(protocol, hostname, port);

export {
    baseUrl
};