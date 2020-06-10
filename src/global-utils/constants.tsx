import { Locale } from 'global-utils/typings';

export const SESSION_DURATION_MINUTES = 30;
export const REAUTHENTICATE_DURATION_SECONDS = 45;

export const LANGUAGES: Locale[] = ['en', 'lt', 'ru'];
export const DEFAULT_LANGUAGE: Locale = 'lt';
export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png'];
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const LARGE_IMAGE_WIDTH = 2000;
export const LARGE_IMAGE_HEIGHT = 1200;
export const SMALL_IMAGE_WIDTH = 200;
export const SMALL_IMAGE_HEIGHT = 160;

export const MAX_PHOTOS = 6;
export const MAX_PHOTO_SIZE_MEGABYTES = 3;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MEGABYTES * 1024 * 1024;
export const MIN_PHOTO_WIDTH = 1000;
export const MIN_PHOTO_HEIGHT = 800;

export const GLOBAL_CURRENCY = 'EUR';
