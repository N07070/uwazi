/** @format */

/* eslint-disable max-len */
import db from 'api/utils/testing_db';

const batmanFinishesId = db.id();
const syncPropertiesEntityId = db.id();
const templateId = db.id();
const templateChangingNames = db.id();
const referenceId = db.id();
const templateWithEntityAsThesauri = db.id();
const templateWithEntityAsThesauri2 = db.id();
const templateWithOnlySelect = db.id();
const templateWithOnlyMultiselect = db.id();

const dictionary = db.id();
const c1 = db.id();
const c2 = db.id();

const hub1 = db.id();
const hub2 = db.id();
const hub3 = db.id();
const hub4 = db.id();
const hub5 = db.id();

const docId1 = db.id();
const docId2 = db.id();
const unpublishedDocId = db.id('123456789012345678901234');
const relationType1 = db.id();
const relationType2 = db.id();
const relationType3 = db.id();

export default {
  entities: [
    {
      _id: batmanFinishesId,
      sharedId: 'shared',
      type: 'entity',
      template: templateId,
      language: 'en',
      title: 'Batman finishes',
      published: true,
      fullText: {
        1: 'page[[1]] 1[[1]]',
        2: 'page[[2]] 2[[2]]',
        3: '',
      },
      metadata: {
        property1: [{ value: 'value1' }],
        friends: [{ icon: null, label: 'shared2title', type: 'entity', value: 'shared2' }],
      },
      file: {
        filename: '8202c463d6158af8065022d9b5014cc1.pdf',
      },
    },
    {
      _id: docId1,
      sharedId: 'shared',
      type: 'entity',
      language: 'es',
      title: 'Penguin almost done',
      creationDate: 1,
      published: true,
      file: { filename: '8202c463d6158af8065022d9b5014ccb.pdf' },
      attachments: [{ filename: '8202c463d6158af8065022d9b5014ccc.pdf' }],
      fullText: { 1: 'text' },
    },
    {
      _id: docId2,
      sharedId: 'shared',
      type: 'entity',
      language: 'pt',
      title: 'Penguin almost done',
      creationDate: 1,
      published: true,
      metadata: { text: [{ value: 'test' }] },
      file: { filename: '8202c463d6158af8065022d9b5014cc1.pdf' },
    },
    {
      _id: unpublishedDocId,
      sharedId: 'other',
      type: 'entity',
      template: templateId,
      language: 'en',
      title: 'Unpublished entity',
      published: false,
      metadata: { property1: [{ value: 'value1' }] },
    },
    //select/multiselect/date sync
    {
      _id: syncPropertiesEntityId,
      template: templateId,
      sharedId: 'shared1',
      type: 'entity',
      language: 'en',
      title: 'EN',
      published: true,
      metadata: { property1: [{ value: 'text' }] },
      file: { filename: 'nonexistent.pdf' },
    },
    {
      _id: db.id(),
      template: templateId,
      sharedId: 'shared1',
      type: 'entity',
      language: 'es',
      title: 'ES',
      creationDate: 1,
      published: true,
      metadata: { property1: [{ value: 'text' }] },
      file: { filename: 'nonexistent.pdf' },
      fullText: { 1: 'text' },
    },
    {
      _id: db.id(),
      template: templateId,
      sharedId: 'shared1',
      type: 'entity',
      language: 'pt',
      title: 'PT',
      creationDate: 1,
      published: true,
      metadata: { property1: [{ value: 'text' }] },
      file: { filename: 'nonexistent.pdf' },
    },
    //docs to change metadata property names
    {
      _id: db.id(),
      template: templateChangingNames,
      sharedId: 'shared10',
      type: 'entity',
      language: 'pt',
      title: 'PT',
      creationDate: 1,
      published: true,
      metadata: {
        property1: [{ value: 'value1' }],
        property2: [{ value: 'value2' }],
        property3: [{ value: 'value3' }],
      },
      file: { filename: '123.pdf' },
    },
    {
      _id: db.id(),
      template: templateChangingNames,
      sharedId: 'shared10',
      type: 'entity',
      language: 'pt',
      title: 'PT',
      creationDate: 1,
      published: true,
      metadata: {
        property1: [{ value: 'value1' }],
        property2: [{ value: 'value2' }],
        property3: [{ value: 'value3' }],
      },
      file: { filename: '123.pdf' },
    },
    //docs using entity as thesauri
    {
      title: 'title',
      _id: db.id(),
      template: templateWithEntityAsThesauri,
      sharedId: 'multiselect',
      type: 'entity',
      language: 'en',
      metadata: { multiselect: [{ value: 'shared' }, { value: 'value1' }] },
      file: { filename: '123.pdf' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: templateWithEntityAsThesauri2,
      sharedId: 'multiselect',
      type: 'entity',
      language: 'es',
      metadata: { multiselect2: [{ value: 'shared' }, { value: 'value2' }] },
      file: { filename: '123.pdf' },
      fullText: { 1: 'text' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: templateWithEntityAsThesauri,
      sharedId: 'select',
      type: 'entity',
      language: 'en',
      metadata: { select: [{ value: 'shared' }] },
      file: { filename: '123.pdf' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: templateWithEntityAsThesauri2,
      sharedId: 'select',
      type: 'entity',
      language: 'es',
      metadata: { select2: [{ value: 'shared' }] },
      file: { filename: '123.pdf' },
      fullText: { 1: 'text' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: db.id(),
      sharedId: 'otherTemplateWithMultiselect',
      type: 'entity',
      language: 'es',
      metadata: { select2: [{ value: 'value' }] },
      file: { filename: '123.pdf' },
      fullText: { 1: 'text' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: templateWithOnlySelect,
      sharedId: 'otherTemplateWithSelect',
      type: 'entity',
      language: 'es',
      metadata: { select: [{ value: 'shared10' }] },
      file: { filename: '123.pdf' },
      fullText: { 1: 'text' },
    },
    {
      title: 'title',
      _id: db.id(),
      template: templateWithOnlyMultiselect,
      sharedId: 'otherTemplateWithMultiselect',
      type: 'entity',
      language: 'es',
      metadata: { multiselect: [{ value: 'value1' }, { value: 'multiselect' }] },
      file: { filename: '123.pdf' },
    },
    { sharedId: 'shared2', language: 'en', title: 'shared2title', metadata: {} },
    { sharedId: 'source2', language: 'en' },
    {
      title: 'entity one',
      sharedId: 'id1',
      language: 'es',
    },
    {
      title: 'entity two',
      sharedId: 'id2',
      language: 'es',
    },
    {
      title: 'entity three',
      sharedId: 'id3',
      language: 'es',
    },
  ],
  settings: [
    { _id: db.id(), languages: [{ key: 'es', default: true }, { key: 'pt' }, { key: 'en' }] },
  ],
  templates: [
    {
      _id: templateId,
      name: 'template_test',
      properties: [
        { type: 'text', name: 'text' },
        { type: 'select', name: 'select', content: dictionary },
        { type: 'multiselect', name: 'multiselect', content: dictionary },
        { type: 'date', name: 'date' },
        { type: 'multidate', name: 'multidate' },
        { type: 'multidaterange', name: 'multidaterange' },
        { type: 'daterange', name: 'daterange' },
        { type: 'relationship', name: 'friends', relationType: relationType1 },
        { type: 'numeric', name: 'numeric' },
      ],
    },
    {
      _id: templateWithOnlyMultiselect,
      name: 'templateWithOnlyMultiSelectSelect',
      properties: [
        {
          type: 'multiselect',
          name: 'multiselect',
          content: templateWithEntityAsThesauri.toString(),
        },
      ],
    },
    {
      _id: templateWithOnlySelect,
      name: 'templateWithOnlySelect',
      properties: [{ type: 'select', name: 'select', content: templateChangingNames.toString() }],
    },
    {
      _id: templateWithEntityAsThesauri,
      name: 'template_with_thesauri_as_template',
      properties: [
        { type: 'select', name: 'select', content: templateId.toString() },
        { type: 'multiselect', name: 'multiselect', content: templateId.toString() },
      ],
    },
    {
      _id: templateWithEntityAsThesauri2,
      name: 'template_with_thesauri_as_template',
      properties: [
        { type: 'select', name: 'select2', content: templateId.toString() },
        { type: 'multiselect', name: 'multiselect2', content: templateId.toString() },
      ],
    },
    {
      _id: templateChangingNames,
      name: 'template_changing_names',
      default: true,
      properties: [
        { id: '1', type: 'text', name: 'property1' },
        { id: '2', type: 'text', name: 'property2' },
        { id: '3', type: 'text', name: 'property3' },
      ],
    },
  ],
  connections: [
    { _id: referenceId, entity: 'shared', template: null, hub: hub1, entityData: {} },
    { entity: 'shared2', template: relationType1, hub: hub1, entityData: {} },
    { entity: 'shared', template: null, hub: hub2, entityData: {} },
    { entity: 'source2', template: relationType2, hub: hub2, entityData: {} },
    { entity: 'another', template: relationType3, hub: hub3, entityData: {} },
    { entity: 'document', template: relationType3, hub: hub3, entityData: {} },
    { entity: 'shared', template: relationType2, hub: hub4, entityData: {} },
    { entity: 'shared1', template: relationType2, hub: hub4, entityData: {} },
    { entity: 'shared1', template: relationType2, hub: hub5, entityData: {} },
    { entity: 'shared', template: relationType2, hub: hub5, entityData: {} },
  ],
  dictionaries: [
    {
      _id: dictionary,
      name: 'Countries',
      values: [
        { _id: db.id(), id: 'country_one', label: 'Country1' },
        { _id: db.id(), id: 'country_two', label: 'Country2' },
      ],
    },
  ],
  translations: [
    {
      locale: 'en',
      contexts: [
        {
          id: dictionary,
          values: [{ key: 'Country1', value: 'Country1' }, { key: 'Country2', value: 'Country2' }],
        },
      ],
    },
    {
      locale: 'es',
      contexts: [
        {
          id: dictionary,
          values: [{ key: 'Country1', value: 'Pais1' }, { key: 'Country2', value: 'Pais2' }],
        },
      ],
    },
    {
      locale: 'pt',
      contexts: [
        {
          id: dictionary,
          values: [{ key: 'Country1', value: 'Pais1_pt' }, { key: 'Country2', value: 'Pais2_pt' }],
        },
      ],
    },
  ],
};

export {
  batmanFinishesId,
  syncPropertiesEntityId,
  templateId,
  templateChangingNames,
  templateWithEntityAsThesauri,
  docId1,
  docId2,
  c1,
  c2,
  unpublishedDocId,
};
