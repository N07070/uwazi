import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { wrapDispatch } from 'app/Multireducer';
import { NeedAuthorization } from 'app/Auth';
import { I18NLink, I18NMenu, t } from 'app/I18N';
import { processFilters, encodeSearch } from 'app/Library/actions/libraryActions';
import { showSemanticSearch } from 'app/SemanticSearch/actions/actions';
import { FeatureToggleSemanticSearch } from 'app/SemanticSearch/components/FeatureToggleSemanticSearch';
import { Icon } from 'UI';
import { libraryViewInfo } from 'app/App/libraryViewInfo';
import { DropdownMenu } from './DropdownMenu';

export class Menu extends Component {
  libraryUrl() {
    const { location, librarySearch, libraryFilters, defaultLibraryView } = this.props;
    const { searchTerm } = location.query;
    const params = processFilters(librarySearch, libraryFilters.toJS());
    params.searchTerm = searchTerm;

    return `/${libraryViewInfo[defaultLibraryView].url}/${encodeSearch(params)}`;
  }

  render() {
    const { links, defaultLibraryView } = this.props;
    const user = this.props.user.toJS();

    const navLinks = links.map((link, index) => {
      const type = link.get('type') || 'link';

      if (type === 'link') {
        const url = link.get('url') || '/';
        if (url.startsWith('http')) {
          return (
            <li key={link.get('_id')} className="menuNav-item">
              <a href={url} className="btn menuNav-btn" target="_blank" rel="noreferrer">
                {t('Menu', link.get('title'))}
              </a>
            </li>
          );
        }
        return (
          <li key={link.get('_id')} className="menuNav-item">
            <I18NLink to={url} className="btn menuNav-btn">
              {t('Menu', link.get('title'))}
            </I18NLink>
          </li>
        );
      }

      return <DropdownMenu link={link} position={index} key={index} />;
    });

    return (
      <ul onClick={this.props.onClick} className={this.props.className}>
        <li className="menuItems">
          <ul className="menuNav-list">{navLinks}</ul>
        </li>
        <li className="menuActions mobile-menuActions">
          <ul className="menuNav-list">
            <FeatureToggleSemanticSearch>
              <li className="menuNav-item semantic-search">
                <button
                  type="button"
                  onClick={this.props.showSemanticSearch}
                  className="menuNav-btn btn btn-default"
                  aria-label={t('System', 'Semantic search', null, false)}
                >
                  <Icon icon="flask" />
                  <span className="tab-link-tooltip">{t('System', 'Semantic search')}</span>
                </button>
              </li>
            </FeatureToggleSemanticSearch>
            <li className="menuNav-item">
              <I18NLink
                to={this.libraryUrl()}
                className="menuNav-btn btn btn-default public-documents"
                aria-label={t('System', 'Library', null, false)}
              >
                <Icon icon={libraryViewInfo[defaultLibraryView].icon} />
                <span className="tab-link-tooltip">{t('System', 'Library')}</span>
              </I18NLink>
            </li>
            <NeedAuthorization roles={['admin', 'editor', 'collaborator']}>
              <li className="menuNav-item">
                <I18NLink
                  to="/settings/account"
                  className="menuNav-btn btn btn-default settings-section"
                  aria-label={t('System', 'Account settings', null, false)}
                >
                  <Icon icon="cog" />
                  <span className="tab-link-tooltip">{t('System', 'Account settings')}</span>
                </I18NLink>
              </li>
            </NeedAuthorization>
            {(() => {
              if (!user._id) {
                return (
                  <li className="menuNav-item">
                    <I18NLink
                      to="/login"
                      className="menuNav-btn btn btn-default"
                      aria-label={t('System', 'Sign in', null, false)}
                    >
                      <Icon icon="power-off" />
                      <span className="tab-link-tooltip">{t('System', 'Sign in')}</span>
                    </I18NLink>
                  </li>
                );
              }

              return null;
            })()}
          </ul>
          <I18NMenu />
        </li>
      </ul>
    );
  }
}

Menu.defaultProps = {
  showSemanticSearch: () => {},
  defaultLibraryView: 'cards',
};

Menu.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  librarySearch: PropTypes.object,
  libraryFilters: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  showSemanticSearch: PropTypes.func,
  links: PropTypes.object,
  defaultLibraryView: PropTypes.string,
};

export function mapStateToProps({ user, settings, library, uploads }) {
  return {
    user,
    librarySearch: library.search,
    libraryFilters: library.filters,
    uploadsSearch: uploads.search,
    uploadsFilters: uploads.filters,
    uploadsSelectedSorting: uploads.selectedSorting,
    links: settings.collection.get('links'),
    defaultLibraryView: settings.collection.get('defaultLibraryView'),
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showSemanticSearch,
    },
    wrapDispatch(dispatch, 'library')
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
