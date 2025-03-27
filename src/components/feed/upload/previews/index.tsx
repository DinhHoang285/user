/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { IFile } from '@interfaces/file';
import styles from './index.module.scss';
import { bytesToMB } from '../lable';

interface IProps {
  list: IFile[],
  onRemoveFile: any
}
function PreviewList({ list, onRemoveFile }: IProps) {
  return (
    <div className={styles['preview-file-list']}>
      {list.map((file) => (
        <div className={styles['preview-file-item']}>
          <div className={styles['preview-file-image']}>
            <p
              className={styles['preview-file-delete']}
              onClick={() => onRemoveFile(file)}
            >
              <AiOutlineDelete />
            </p>
            <img className={styles['preview-file-preview']} src={file?.url} alt={file?.name} />
          </div>
          <div className={styles['preview-file-info']}>
            <p className={styles['preview-file-name']}>
              {file?.name}
            </p>
            <p className={styles['preview-file-size']}>
              {`${bytesToMB(file?.size)} MB`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

PreviewList.propTypes = {};

export default PreviewList;
