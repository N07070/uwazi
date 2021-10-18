import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-redux-form';

import { ClientFile, IStore } from 'app/istore';
import { Translate } from 'app/I18N';
import { Icon } from 'app/UI';
import { FormGroup } from 'app/Forms';

type SupportingFilesProps = {
  storeKey?: string;
};

const mapStateToProps = (state: IStore, ownProps: SupportingFilesProps) => {
  const { storeKey } = ownProps;
  const entity =
    storeKey === 'library' ? state.library.sidepanel.metadata : state.entityView.entity.toJS();

  return {
    entity,
  };
};

const connector = connect(mapStateToProps);

type mappedProps = ConnectedProps<typeof connector>;
type ComponentProps = SupportingFilesProps & mappedProps;

const getExtension = (filename: string) =>
  filename ? filename.substr(filename.lastIndexOf('.') + 1) : '';

const getFileIcon = (file: ClientFile) => {
  const acceptedThumbnailExtensions = ['png', 'gif', 'jpg', 'jpeg'];
  let thumbnail = null;

  if (file.filename && getExtension(file.filename) === 'pdf') {
    thumbnail = (
      <span no-translate>
        <Icon icon="file-pdf" /> pdf
      </span>
    );
  }

  if (file.url) {
    thumbnail = (
      <span>
        <Icon icon="link" />
      </span>
    );
  }

  if (
    file.filename &&
    acceptedThumbnailExtensions.indexOf(getExtension(file.filename.toLowerCase())) !== -1
  ) {
    thumbnail = <img src={`/api/files/${file.filename}`} alt={file.originalname} />;
  }
  return thumbnail;
};

const SupportingFiles = ({ entity }: ComponentProps) => {
  const { attachments = [] } = entity;

  return (
    <div>
      <h2>
        <Translate>Supporting files</Translate>
      </h2>

      <div className="attachments-list">
        {attachments.map((file: ClientFile, index: number) => (
          <div className="attachment" key={file._id}>
            <div className="attachment-thumbnail">{getFileIcon(file)}</div>
            <div className="attachment-name">
              <FormGroup>
                <Field model={`.attachments.${index}.originalname`}>
                  <input className="form-control" />
                </Field>
              </FormGroup>
            </div>
            <button type="button" className="btn btn-danger">
              <Icon icon="trash-alt" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const container = connector(SupportingFiles);
export { container as SupportingFiles };