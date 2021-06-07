import { ObjectId } from 'mongodb';
import db from 'api/utils/testing_db';
import { EntitySchema } from 'shared/types/entityType';
import { PropertySchema } from 'shared/types/commonTypes';

export function getIdMapper() {
  const map = new Map<string, ObjectId>();

  return function setAndGet(key: string) {
    if (!map.has(key)) map.set(key, db.id() as ObjectId);

    return map.get(key)!;
  };
}

export function getFixturesFactory() {
  const idMapper = getIdMapper();

  return Object.freeze({
    id: idMapper,

    entity: (id: string, props = {}): EntitySchema => ({
      _id: idMapper(id),
      sharedId: id,
      language: 'en',
      title: id,
      ...props,
    }),

    relationshipProp: (
      name: string,
      content: string,
      relation: string,
      props = {}
    ): PropertySchema => ({
      _id: idMapper(name),
      id: idMapper(name).toString(),
      label: name,
      name,
      type: 'relationship',
      relationType: idMapper(relation).toString(),
      content: idMapper(content).toString(),
      ...props,
    }),

    property: (
      name: string,
      type: PropertySchema['type'] = 'text',
      props = {}
    ): PropertySchema => ({ _id: idMapper(name), id: idMapper(name).toString(), label: name, name, type, ...props }),

    metadataValue: (value: string) => ({ value, label: value }),

    thesauri: (name: string, values: Array<string | [string, string]>) => ({
      name,
      _id: idMapper(name),
      values: values.map(value =>
        typeof value === 'string'
          ? { _id: idMapper(value), id: value, label: value }
          : { _id: idMapper(value[0]), id: value[0], label: value[1] }
      ),
    }),
  });
}