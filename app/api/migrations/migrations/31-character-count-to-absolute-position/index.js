/* eslint-disable no-await-in-loop */
import { PdfCharacterCountToAbsolute } from 'api/migrations/pdf_character_count_to_absolute/PdfCharacterCountToAbsolute';
import testingDB from 'api/utils/testing_db';
import path from 'path';
import { config } from 'api/config';

export default {
  delta: 31,

  name: 'character-count-to-absolute-position',

  description: 'Convert the character count of pdf references to absolute position',

  async up(db) {
    process.stdout.write(`${this.name}...\r\n`);
    const cursor = db.collection('connections').find();
    const characterCountToAbsoluteConversion = new PdfCharacterCountToAbsolute();

    while (await cursor.hasNext()) {
      const connection = await cursor.next();
      if (connection.file && connection.range) {
        const files = await testingDB.mongodb
          .collection('files')
          .find({ _id: connection.file })
          .toArray();

        const filename = path.join(config.defaultTenant.uploadedDocuments, files[0].filename);
        const pageEndingCharacterCount = Object.values(files[0].pdfInfo).map(x => x.chars);
        await characterCountToAbsoluteConversion.loadPdf(filename, pageEndingCharacterCount);

        const absolutePositionReference = characterCountToAbsoluteConversion.convert(
          connection.range.text,
          connection.range.start,
          connection.range.end
        );

        const textSelectionRectangles = absolutePositionReference.selectionRectangles.map(x => ({
          left: x.left,
          top: x.top,
          width: x.width,
          height: x.height,
          pageNumber: x.pageNumber,
        }));

        const textSelection = {
          text: absolutePositionReference.text,
          selectionRectangles: textSelectionRectangles,
        };

        absolutePositionReference.selectionRectangles = absolutePositionReference.selectionRectangles.map();
        await db
          .collection('connections')
          .updateOne({ _id: connection._id }, { $set: { reference: textSelection } });
      }
    }

    process.stdout.write('\r\n');
  },
};
