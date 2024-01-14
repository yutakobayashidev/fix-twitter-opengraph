export function mergeUrls(baseUrl: string, ogpUrl: string): string {
    const parsedOgpUrl = new URL(ogpUrl, baseUrl);

    if (parsedOgpUrl.href === ogpUrl) {
        return ogpUrl;
    }

    return parsedOgpUrl.href;
}