import { SearchQuery } from 'shared/types/SearchQueryType';
import { RequestBody } from '@elastic/elasticsearch/lib/Transport';
import { cleanUp, extractSearchParams, snippetsHighlight } from './queryHelpers';
import { permissionsFilters } from './permissionsFilters';

export const buildQuery = async (query: SearchQuery, language: string): Promise<RequestBody> => {
  const { searchString, fullTextSearchString, searchMethod } = await extractSearchParams(query);
  return {
    _source: {
      includes: ['title', 'template', 'sharedId', 'language', 'documents._id'],
    },
    query: {
      bool: {
        filter: [
          query.filter?.sharedId && {
            terms: {
              'sharedId.raw': [query.filter.sharedId],
            },
          },
          {
            term: { language },
          },
          ...permissionsFilters(query),
        ].filter(cleanUp),
        must: [
          fullTextSearchString && {
            has_child: {
              type: 'fullText',
              score_mode: 'max',
              inner_hits: {
                _source: false,
                ...snippetsHighlight(query),
              },
              query: {
                [searchMethod]: {
                  query: fullTextSearchString,
                  fields: ['fullText_*'],
                },
              },
            },
          },
          searchString && {
            [searchMethod]: {
              query: searchString,
            },
          },
        ].filter(cleanUp),
      },
    },
    from: 0,
    size: query.page?.limit || 30,
  };
};
