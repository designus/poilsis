export const mapMimeTypesToTypes = (mimeTypes: string[]) => mimeTypes.map(mimeType => mimeType.split('/')[1]).join(',');
