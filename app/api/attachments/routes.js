import Joi from 'joi';
import mongoose from 'mongoose';
import createError from 'api/utils/Error';
import sanitize from 'sanitize-filename';

import entities from 'api/entities';
import fs from 'fs';
import path from 'path';
import { attachmentsPath } from 'api/files/filesystem';
import { uploadMiddleware } from 'api/files/uploadMiddleware';

import attachments from './attachments';
import { validation } from '../utils';
import needsAuthorization from '../auth/authMiddleware';

const assignAttachment = (entity, addedFile) => {
  const conformedEntity = { _id: entity._id, attachments: entity.attachments || [] };
  conformedEntity.attachments.push(addedFile);
  return conformedEntity;
};

const processAttachment = (entity, attachment) => {
  const addedFile = {
    ...attachment,
    _id: mongoose.Types.ObjectId(),
    timestamp: Date.now(),
  };
  return Promise.all([addedFile, entities.saveMultiple([assignAttachment(entity, addedFile)])]);
};

export const processAttachmentAllLanguages = (entity, attachment) =>
  processAttachment(entity, attachment)
    .then(([addedFile]) =>
      Promise.all([
        addedFile,
        entities.get({ sharedId: entity.sharedId, _id: { $ne: entity._id } }),
      ])
    )
    .then(([addedFile, siblings]) => {
      const { _id, ...genericAddedFile } = addedFile;

      const additionalLanguageUpdates = [];

      siblings.forEach(sibling => {
        additionalLanguageUpdates.push(
          entities.saveMultiple([assignAttachment(sibling, genericAddedFile)])
        );
      });

      return Promise.all([addedFile].concat(additionalLanguageUpdates));
    });

export default app => {
  app.get('/api/attachment/:file', (req, res) => {
    const filePath = `${path.resolve(attachmentsPath(path.basename(req.params.file)))}`;
    fs.stat(filePath, err => {
      if (err) {
        return res.redirect('/public/no-preview.png');
      }
      return res.sendFile(filePath);
    });
  });

  app.get(
    '/api/attachments/download',

    validation.validateRequest(
      Joi.object({
        _id: Joi.objectId().required(),
        file: Joi.string().required(),
      }).required(),
      'query'
    ),

    (req, res, next) => {
      entities
        .getById(req.query._id)
        .then(response => {
          if (!response) {
            throw createError('entitiy does not exist', 404);
          }
          const file = response.attachments.find(a => a.filename === req.query.file);
          if (!file) {
            throw createError('file not found', 404);
          }
          const newName =
            path.basename(file.originalname, path.extname(file.originalname)) +
            path.extname(file.filename);
          res.download(attachmentsPath(file.filename), sanitize(newName));
        })
        .catch(next);
    }
  );

  app.post(
    '/api/attachments/upload',
    needsAuthorization(['admin', 'editor']),
    uploadMiddleware(attachmentsPath),
    validation.validateRequest(
      Joi.object()
        .keys({
          entityId: Joi.string().required(),
          allLanguages: Joi.boolean(),
        })
        .required()
    ),
    (req, res, next) =>
      entities
        .getById(req.body.entityId)
        .then(entity =>
          req.body.allLanguages === 'true'
            ? processAttachmentAllLanguages(entity, req.file)
            : processAttachment(entity, req.file)
        )
        .then(([addedFile]) => {
          res.json(addedFile);
        })
        .catch(next)
  );

  app.post(
    '/api/attachments/rename',

    needsAuthorization(['admin', 'editor']),

    validation.validateRequest(
      Joi.object({
        _id: Joi.objectId().required(),
        entityId: Joi.string().required(),
        originalname: Joi.string().required(),
        language: Joi.string(),
      }).required()
    ),

    (req, res, next) => {
      let renamedAttachment;
      return entities
        .getById(req.body.entityId)
        .then(entity => {
          const entityWithRenamedAttachment = {
            ...entity,
            attachments: (entity.attachments || []).map(attachment => {
              if (attachment._id.toString() === req.body._id) {
                renamedAttachment = { ...attachment, originalname: req.body.originalname };
                return renamedAttachment;
              }

              return attachment;
            }),
          };
          return entities.saveMultiple([entityWithRenamedAttachment]);
        })
        .then(() => {
          res.json(renamedAttachment);
        })
        .catch(next);
    }
  );

  app.delete(
    '/api/attachments/delete',

    needsAuthorization(['admin', 'editor']),

    validation.validateRequest(
      Joi.object({
        attachmentId: Joi.string().required(),
      }).required(),
      'query'
    ),

    async (req, res, next) => {
      try {
        const response = await attachments.delete(req.query.attachmentId);
        res.json(response);
      } catch (e) {
        next(e);
      }
    }
  );
};
