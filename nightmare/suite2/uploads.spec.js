/*eslint max-nested-callbacks: ["error", 10], max-len: ["error", 500]*/
import { catchErrors } from 'api/utils/jasmineHelpers';
import selectors from '../helpers/selectors.js';
import createNightmare from '../helpers/nightmare';
import insertFixtures from '../helpers/insertFixtures';
import { loginAsAdminAndViewRestrictedEntities } from '../helpers/commonTests';

const nightmare = createNightmare();

const comicCharacter = '58ad7d240d44252fee4e61fd';

describe('Uploads (now restricted entities)', () => {
  beforeAll(async () => insertFixtures());
  afterAll(async () => nightmare.end());

  it('should log in as admin and go restricted entities', done => {
    loginAsAdminAndViewRestrictedEntities(nightmare, catchErrors, done);
  });

  describe('when filtering by type', () => {
    it('should show only filtered ones', done => {
      nightmare.library
        .editCard('Wolverine')
        .wait('#metadataForm > div:nth-child(2) > ul > li.wide > select')
        .select('#metadataForm > div:nth-child(2) > ul > li.wide > select', comicCharacter)
        .library.saveCard()
        .refresh()
        .library.selectFilter('Comic character')
        .library.countFiltersResults()
        .then(resutls => {
          expect(resutls).toBe(1);
          done();
        })
        .then(done);
    });
  });

  describe('when uploading a pdf', () => {
    it('should create the new document and assign default template', done => {
      const expectedTitle = 'Valid';

      nightmare
        .upload('#pdf-upload-button', `${__dirname}/test_files/valid.pdf`)
        .waitForCardToBeCreated(expectedTitle)
        .waitForCardTemplate(selectors.libraryView.firstDocument, 'Test entity')
        .getResultsAsJson()
        .then(results => {
          expect(results[0].title).toBe(expectedTitle);
          done();
        })
        .catch(catchErrors(done));
    });

    describe('when processing fails', () => {
      it('should create the document and show "Conversion failed"', done => {
        const expectedTitle = 'Invalid';

        nightmare
          .upload('#pdf-upload-button', `${__dirname}/test_files/invalid.pdf`)
          .waitForCardToBeCreated(expectedTitle)
          .waitForCardStatus(selectors.libraryView.firstDocument, 'Conversion failed')
          .getResultsAsJson()
          .then(results => {
            expect(results[0].title).toBe(expectedTitle);
            done();
          })
          .catch(catchErrors(done));
      });
    });
  });
});
