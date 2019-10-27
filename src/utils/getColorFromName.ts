export function getColorFromName(name: string): string {
    let color = '';

    for (let i=0; i<name.length; i++) {
        color += name.charCodeAt(i).toString(16);
    }

    return `#${ color.slice(0, 6) }`;
}