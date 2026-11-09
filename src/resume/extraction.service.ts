import {
  BadRequestException,
  Inject,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { buffer } from 'stream/consumers';

const PDF_MIME_TYPE = 'application/pdf';
const DOCX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

@Injectable()
export class ExtractionService {
  async extractFile(
    file: Pick<Express.Multer.File, 'buffer' | 'mimetype'>,
  ): Promise<string> {
    let text: string;

    if (file.mimetype === PDF_MIME_TYPE) {
      const parser = new PDFParse({ data: file.buffer });

      try {
        const result = await parser.getText();
        text = result.text;
      } catch (error) {
        throw new BadRequestException('Could not read pdf', { cause: error });
      } finally {
        await parser.destroy();
      }
    } else if (file.mimetype === DOCX_MIME_TYPE) {
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value;
      } catch (error) {
        throw new BadRequestException('Could not read this docx', {
          cause: error,
        });
      }
    } else {
      throw new UnsupportedMediaTypeException(
        'Only PDF and Docx files are allowed.',
      );
    }

    text = text
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!text)
      throw new BadRequestException(
        'No text found, scanned documents need OCR',
      );

    return text;
  }
}
