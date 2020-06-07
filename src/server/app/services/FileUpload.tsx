import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import Jimp from 'jimp';
import { Service } from 'typedi';
import { formatValue } from 'global-utils/methods';
import { getInfoFromFileName, getFileStatistics, removeDirectory } from 'server-utils';
import { MIN_PHOTO_WIDTH, MIN_PHOTO_HEIGHT, MAX_PHOTO_SIZE_BYTES, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS } from 'global-utils';

interface IUploadedFile {
  file: Jimp;
  width: number;
  height: number;
  size: number;
  type: string;
}

@Service()
export class FileUploadService {
  async streamFilesToTempDirectory(files: FileUpload[], directory: string) {
    return Promise.all<string>(files.map(file => {
      return new Promise((resolve, reject) => {
        const { name, extension } = getInfoFromFileName(file.filename);
        const fileName = formatValue(name);
        const path = `${directory}/${fileName}.${extension}`;
        return file.createReadStream()
          .pipe(createWriteStream(path))
          .on('error', reject)
          .on('finish', () => resolve(path));
      });
    }));
  }

  async getTempFiles(files: FileUpload[], directory: string): Promise<IUploadedFile[]> {
    const paths = await this.streamFilesToTempDirectory(files, directory);

    return Promise.all(paths.map(async (path) => {
      const file = await Jimp.read(path);
      const { size } = await getFileStatistics(path);

      return {
        file,
        size,
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

  async uploadFiles(files: FileUpload[], tempDirectory: string, finalDirectory: string) {
    const tempFiles = await this.getTempFiles(files, tempDirectory);
    const validationErrors = await this.getValidationErrors(tempFiles);

    if (validationErrors.length) {
      await removeDirectory(tempDirectory);
      throw new Error(validationErrors.join('.'));
    }

  }
}
