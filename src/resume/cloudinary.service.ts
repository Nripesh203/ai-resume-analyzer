import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

@Injectable()
export class CloudinaryService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  }

  uploadResume(file: Express.Multer.File, userId: number) {
    return new Promise<{ publicId: string; bytes: number }>(
      (resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            type: 'authenticated',
            folder: `resume/${userId}`,
            public_id: randomUUID(),
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error('Cloudinary returned no upload result.'));
              return;
            }

            resolve({
              publicId: result.public_id,
              bytes: result.bytes,
            });
          },
        );

        upload.end(file.buffer);
      },
    );
  }

  async deleteResume(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary could not delete asset ${publicId}.`);
    }
  }
}
