import { Application } from 'express';
import request from 'supertest';
import db, { DBFixture, testingDB } from 'api/utils/testing_db';

import { setUpApp } from 'api/utils/testingRoutes';

import { getFixturesFactory } from 'api/utils/fixturesFactory';
import { testingEnvironment } from 'api/utils/testingEnvironment';
import { searchRoutes } from '../routes';

const load = async (data: DBFixture, index?: string) =>
  testingEnvironment.setUp(
    {
      ...data,
      settings: [{ _id: db.id(), languages: [{ key: 'en', default: true }, { key: 'es' }] }],
      translations: [
        { locale: 'en', contexts: [] },
        { locale: 'es', contexts: [] },
      ],
    },
    index
  );

// FORMAT
// const query3 = {
//   filter: {
//     title: '',
//     'metadata.text': '',
//     'metadata.multiSelect': { values: [], operator: 'and' },
//     'metadata.numeric': 42,
//     'metadata.numeric': {from: 15, to: 25},
//   },
// };

describe('Metadata filters', () => {
  const factory = getFixturesFactory();
  const app: Application = setUpApp(searchRoutes);

  afterAll(async () => testingDB.disconnect());

  it('should filter by the one metadata property', async () => {
    await load(
      {
        templates: [
          factory.template('templateA', [factory.property('selectPropertyName', 'select')]),
        ],
        entities: [
          factory.entity('Entity 1', 'templateA', {
            selectPropertyName: [factory.metadataValue('thesaurusId1')],
          }),
          factory.entity('Entity 2', 'templateA', {
            selectPropertyName: [factory.metadataValue('thesaurusId2')],
          }),
        ],
      },
      'search.v2.metadata_filters'
    );

    const query = {
      filter: {
        'metadata.selectPropertyName': 'thesaurusId1',
      },
    };

    const { body } = await request(app)
      .get('/api/v2/entities')
      .query(query)
      .expect(200);
    expect(body.data).toMatchObject([{ title: 'Entity 1' }]);
  });

  it('should filter by the other metadata property', async () => {
    await load(
      {
        templates: [
          factory.template('templateA', [factory.property('multiselect', 'multiselect')]),
        ],
        entities: [
          factory.entity('Entity 1', 'templateA', {
            multiselect: [factory.metadataValue('thesaurusId1')],
          }),
          factory.entity('Entity 2', 'templateA', {
            multiselect: [factory.metadataValue('thesaurusId2')],
          }),
        ],
      },
      'search.v2.metadata_filters'
    );

    const query = {
      filter: {
        'metadata.multiselect': 'thesaurusId2',
      },
    };

    const { body } = await request(app)
      .get('/api/v2/entities')
      .query(query)
      .expect(200);
    expect(body.data).toMatchObject([{ title: 'Entity 2' }]);
  });

  describe('Numeric range filter', () => {
    beforeAll(async () => {
      await load(
        {
          templates: [
            factory.template('templateA', [
              factory.property('multiselect', 'multiselect'),
              factory.property('numericPropertyName', 'numeric'),
            ]),
          ],
          entities: [
            factory.entity('Entity 1', 'templateA', {
              multiselect: [factory.metadataValue('thesaurusId1')],
              numericPropertyName: [factory.metadataValue(42)],
            }),
            factory.entity('Entity 2', 'templateA', {
              multiselect: [factory.metadataValue('thesaurusId2')],
              numericPropertyName: [factory.metadataValue(13)],
            }),
            factory.entity('Entity 3', 'templateA', {
              numericPropertyName: [factory.metadataValue(5)],
            }),
          ],
        },
        'search.v2.metadata_filters'
      );
    });

    it.each([
      { filterValue: 42, expected: [{ title: 'Entity 1' }] },
      { filterValue: { from: 10, to: 25 }, expected: [{ title: 'Entity 2' }] },
      { filterValue: { to: 25 }, expected: [{ title: 'Entity 2' }, { title: 'Entity 3' }] },
      { filterValue: { from: 25 }, expected: [{ title: 'Entity 1' }] },
    ])('should filter by numeric properties -> %o', async ({ filterValue, expected }) => {
      const query = {
        filter: {
          'metadata.numericPropertyName': filterValue,
        },
      };

      const { body } = await request(app)
        .get('/api/v2/entities')
        .query(query)
        .expect(200);

      expect(body.data).toMatchObject(expected);
    });
  });
  it('', () => {
    throw new Error('Add support for dates');
  });
});
