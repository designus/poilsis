import { exists, mkdir, readFile, writeFile, readdir, lstat } from 'fs';
import { promisify } from 'util';
import * as rimraf from 'rimraf';

export const checkIfDirectoryExists = promisify(exists);
export const createDirectory = promisify(mkdir);
export const removeDirectory = promisify(rimraf);
export const readFileFromDisk = promisify(readFile);
export const writeFileToDisk = promisify(writeFile);
export const getDirectoryStatus = promisify(lstat);
export const readDirectoryContent = promisify(readdir);
