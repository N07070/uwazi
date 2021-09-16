import React from 'react';
import { shallow } from 'enzyme';
import { fromJS, fromJS as Immutable } from 'immutable';
import { Form } from 'react-redux-form';

import { FiltersForm, mapStateToProps } from 'app/Library/components/FiltersForm';
import FiltersFromProperties from '../FiltersFromProperties';

describe('FiltersForm', () => {
  let component;
  let props;

  const render = templateFilters => {
    props = {
      searchDocuments: jasmine.createSpy('searchDocuments'),
      fields: Immutable([
        { _id: '1', name: 'name' },
        { _id: '2', name: 'name', type: 'numeric' },
        { _id: '3', name: 'date', type: 'date' },
        { _id: '4', name: 'nested', type: 'nested' },
        {
          _id: '5',
          name: 'select',
          type: 'select',
          content: 'thesauri1',
          options: [
            { id: 'a', label: 'a', value: 'a', results: 1 },
            { id: 'b', label: 'b', value: 'b', results: 1 },
            {
              id: 'c',
              label: 'c',
              value: 'c',
              results: 1,
              values: [{ id: 'd', label: 'd', value: 'd', results: 1 }],
            },
          ],
        },
        {
          _id: '6',
          name: 'multiselect',
          type: 'multiselect',
          content: 'thesauri1',
          options: [
            { id: 'a', label: 'a', value: 'a', results: 1 },
            { id: 'b', label: 'b', value: 'b', results: 1 },
            {
              id: 'c',
              label: 'c',
              value: 'c',
              values: [{ id: 'd', label: 'd', value: 'd', results: 1 }],
              results: 1,
            },
          ],
        },
      ]),
      documentTypes: Immutable([]),
      templates: Immutable([]),
      aggregations: Immutable({
        all: {
          select: {
            count: 10,
            buckets: [
              { key: 'a', label: 'a', filtered: { doc_count: 1 } },
              { key: 'b', label: 'b', filtered: { doc_count: 1 } },
              {
                key: 'c',
                label: 'c',
                filtered: { doc_count: 1 },
                values: [{ key: 'd', label: 'd', filtered: { doc_count: 1 } }],
              },
            ],
          },
          multiselect: {
            count: 11,
            buckets: [
              { key: 'a', label: 'a', filtered: { doc_count: 1 } },
              { key: 'b', label: 'b', filtered: { doc_count: 1 } },
              {
                key: 'c',
                label: 'c',
                filtered: { doc_count: 1 },
                values: [{ key: 'd', label: 'd', filtered: { doc_count: 1 } }],
              },
            ],
          },
        },
      }),
      search: { searchTerm: 'Batman' },
      storeKey: 'library',
      settings: {
        collection: fromJS({
          filters: templateFilters,
        }),
      },
    };
    component = shallow(<FiltersForm {...props} />);
  };

  beforeEach(() => {
    render();
  });

  describe('form on submit', () => {
    it('should call searchDocuments, with the searchTerm', () => {
      component.find(Form).simulate('submit', { myfilter: true });
      expect(props.searchDocuments).toHaveBeenCalledWith({ search: { myfilter: true } }, 'library');
    });
  });

  describe('render()', () => {
    it('should render diferent type fileds', () => {
      const fields = component.find(FiltersFromProperties);
      expect(fields).toMatchSnapshot();
    });
  });

  describe('documentTypeList mode toggle', () => {
    describe('configured filters', () => {
      beforeEach(() => {
        render([{ id: 1, name: 'Judge' }]);
      });

      it('should mark FILTERS as the default option', () => {
        const documentTypesList = component.find('Connect(DocumentTypesList)');
        expect(documentTypesList.props().fromFilters).toBe(true);
      });

      it('should allows logged users to switch templates filter between ALL/FILTERS', () => {
        const documentTypesSwitcher = component.find('Switcher');
        documentTypesSwitcher.props().onChange(false);
        const documentTypesList = component.find('Connect(DocumentTypesList)');
        expect(documentTypesList.props().fromFilters).toBe(false);
      });
    });
    describe('not configured filters', () => {
      it('should not render template filter toggle', () => {
        render();
        const documentTypesSwitcher = component.find('Switcher');
        expect(documentTypesSwitcher.length).toBe(0);
        const documentTypesList = component.find('Connect(DocumentTypesList)');
        expect(documentTypesList.props().fromFilters).toBe(false);
      });
    });
  });

  describe('mapped state', () => {
    it('should contain the fields', () => {
      const store = {
        library: {
          ui: Immutable({ searchTerm: 'do a barrel roll' }),
          filters: Immutable({ properties: [{ name: 'author' }], documentTypes: { a: true } }),
        },
        form: {
          filters: 'filtersForm',
        },
        templates: Immutable([]),
        settings: { collection: Immutable({}) },
      };
      const state = mapStateToProps(store, { storeKey: 'library' });
      expect(state.fields.toJS()).toEqual([{ name: 'author' }]);
      expect(state.documentTypes.toJS()).toEqual({ a: true });
    });
  });
});
