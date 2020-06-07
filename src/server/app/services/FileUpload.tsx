import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import Jimp from 'jimp';
import { Service } from 'typedi';
import { formatValue } from 'global-utils/methods';
import { getInfoFromFileName, getFileStatistics, removeDirectory } from 'server-utils';
import {
  MIN_PHOTO_WIDTH,
  MIN_PHOTO_HEIGHT,
  MAX_PHOTO_SIZE_BYTES,
  IMAGE_MIME_TYPES,
  IMAGE_EXTENSIONS,
  LARGE_IMAGE_WIDTH,
  LARGE_IMAGE_HEIGHT,
  SMALL_IMAGE_WIDTH,
  SMALL_IMAGE_HEIGHT,
  ImageSize
} from 'global-utils';

interface IUploadedFile {
  file: Jimp;
  width: number;
  height: number;
  size: number;
  type: string;
  path: string;
  fileName: string;
}

@Service()
export class FileUploadService {

  getFileName = (name: string, extension: string) => `${name}.${extension}`;

  getResizedFileName = (name: string, size: ImageSize, extension: string) => this.getFileName(`${name}_${size}`, extension);

  getFilePath = (directory: string, fileName: string) => `${directory}/${fileName}`;

  async streamFilesToTempDirectory(files: FileUpload[], tempDirectory: string) {
    return Promise.all<string>(files.map(file => {
      return new Promise((resolve, reject) => {
        const { name, extension } = getInfoFromFileName(file.filename);
        const fileName = this.getFileName(formatValue(name), extension);
        return file.createReadStream()
          .pipe(createWriteStream(this.getFilePath(tempDirectory, fileName)))
          .on('error', reject)
          .on('finish', () => resolve(fileName));
      });
    }));
  }

  async getTempFiles(files: FileUpload[], tempDirectory: string): Promise<IUploadedFile[]> {
    const fileNames = await this.streamFilesToTempDirectory(files, tempDirectory);

    return Promise.all(fileNames.map(async (fileName) => {
      const path = this.getFilePath(tempDirectory, fileName);
      const file = await Jimp.read(path);
      const { size } = await getFileStatistics(path);

      return {
        file,
        size,
        path,
        fileName,
        width: file.getWidth(),
        height: file.getHeight(),
        type: file.getMIME()
      };
    }));
  }

  getValidationErrors(files: IUploadedFile[]) {
    return files.map(file => {
      const { size, type, width, height } = file;

      if (!IMAGE_MIME_TYPES.includes(type)) {
        return `Please upload a valid image: ${IMAGE_EXTENSIONS.join(',')}`;
      }

      if (size > MAX_PHOTO_SIZE_BYTES) {
        return `File size ${size} is too big`;
      }

      if (width < height && height < MIN_PHOTO_HEIGHT) {
        return `Provided image height (${height}px) should be >= ${MIN_PHOTO_HEIGHT}px`;
      }

      if (width >= height && width < MIN_PHOTO_WIDTH) {
        return `Provided image width (${width}px) should be >= ${MIN_PHOTO_WIDTH}px`;
      }

      return '';
    }).filter(Boolean);
  }

  async resizeHorizontalImage(
    smallImage: Jimp,
    largeImage: Jimp,
    smallImagePath: string,
    largeImagePath: string,
    width: number
  ) {

    await smallImage
      .cover(SMALL_IMAGE_WIDTH, SMALL_IMAGE_HEIGHT)
      .quality(80)
      .write(smallImagePath);

    if (width > LARGE_IMAGE_WIDTH) {
      await largeImage
        .scaleToFit(LARGE_IMAGE_WIDTH, LARGE_IMAGE_HEIGHT)
        .quality(80)
        .write(largeImagePath);
    } else {
      await largeImage
        .quality(80)
        .write(largeImagePath);
    }
  }

  async resizeVerticalImage(
    smallImage: Jimp,
    largeImage: Jimp,
    smallImagePath: string,
    largeImagePath: string,
    height: number
  ) {

    await smallImage
      .scaleToFit(SMALL_IMAGE_WIDTH, SMALL_IMAGE_HEIGHT)
      .quality(80)
      .write(smallImagePath);

    if (height > LARGE_IMAGE_HEIGHT) {
      await largeImage
        .scaleToFit(LARGE_IMAGE_WIDTH, LARGE_IMAGE_HEIGHT)
        .quality(80)
        .write(largeImagePath);
    } else {
      await largeImage
        .quality(80)
        .write(largeImagePath);
    }
  }

  resizeFile(uploadedFile: IUploadedFile, tempDirectory: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const { width, height, path, fileName, file } = uploadedFile;
        const { name, extension } = getInfoFromFileName(fileName);
        const largeFile = file;
        const smallFile = await Jimp.read(path);
        const smallImagePath = this.getFilePath(tempDirectory, this.getResizedFileName(name, ImageSize.Small, extension));
        const largeImagePath = this.getFilePath(tempDirectory, this.getResizedFileName(name, ImageSize.Large, extension));

        if (height > width) {
          await this.resizeVerticalImage(smallFile, largeFile, smallImagePath, largeImagePath, height);
        } else {
          await this.resizeHorizontalImage(smallFile, largeFile, smallImagePath, largeImagePath, width);
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  resizeFiles(files: IUploadedFile[], tempDirectory: string) {
    return Promise.all(files.map(file => this.resizeFile(file, tempDirectory)));
  }

  async uploadFiles(files: FileUpload[], tempDirectory: string, finalDirectory: string) {
    const tempFiles = await this.getTempFiles(files, tempDirectory);
    const validationErrors = await this.getValidationErrors(tempFiles);

    if (validationErrors.length) {
      await removeDirectory(tempDirectory);
      throw new Error(validationErrors.join('.'));
    }

    await this.resizeFiles(tempFiles, tempDirectory);

  }
}
