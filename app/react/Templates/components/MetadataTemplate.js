import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DropTarget} from 'react-dnd';

import {updateProperty, addProperty} from '~/Templates/actions/templateActions';
import MetadataProperty from '~/Templates/components/MetadataProperty';
import FormName from '~/Templates/components/FormName';

export class MetadataTemplate extends Component {
  render() {
    const {connectDropTarget, isOver} = this.props;

    return connectDropTarget(
      <div>

        <h1>
          <FormName />
        </h1>

        <div className="template-properties">
          {(() => {
            if (this.props.properties.length === 0) {
              return <div className={'no-properties' + (isOver ? ' isOver' : '')}>Drag properties here to start</div>;
            }
          })()}
          {this.props.properties.map((config, index) => {
            return <MetadataProperty {...config} key={config.id} index={index}/>;
          })}
        </div>
      </div>
    );
  }
}

MetadataTemplate.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  properties: PropTypes.array,
  isOver: PropTypes.bool
};

const target = {
  canDrop() {
    return true;
  },

  drop(props, monitor) {
    let item = monitor.getItem();

    let property = props.properties[item.index];

    if (property && property.inserting) {
      property.inserting = null;
      props.updateProperty(property, item.index);
      return;
    }

    props.addProperty({label: item.label, type: item.type}, props.properties.length);
    return {name: 'container'};
  }
};

let dropTarget = DropTarget('METADATA_OPTION', target, (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver()
}))(MetadataTemplate);

export {dropTarget};

const mapStateToProps = (state) => {
  return {properties: state.template.data.toJS().properties};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateProperty, addProperty}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(dropTarget);
