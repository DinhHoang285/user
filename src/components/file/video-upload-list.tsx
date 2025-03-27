import { AiOutlineDelete, AiOutlineFileDone } from 'react-icons/ai';
import { IFile } from '@interfaces/file';
import { Progress } from 'antd';

interface IProps {
  remove: Function;
  files: IFile[];
}

export default function VideoUploadList({ remove, files }: IProps) {
  return (
    <div className="ant-upload-list ant-upload-list-picture" style={{ margin: 10 }}>
      {files && files.map((file) => (
        <div className="ant-upload-list-item ant-upload-list-item-uploading ant-upload-list-item-list-type-picture" key={file.uid}>
          <div className="ant-upload-list-item-info">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="ant-upload-list-item-thumbnail ant-upload-list-item-file">
                <AiOutlineFileDone style={{ color: 'green', fontSize: 35 }} />
              </span>
              <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                <span><b className="white-color">{file.name}</b></span>
                {' '}
                |
                <span style={{
                  color: 'gray'
                }}
                >
                  {(file.size / (1024 * 1024)).toFixed(2)}
                  {' '}
                  MB
                </span>
              </span>
              {file.percent !== 100
                && (
                  <span className="">
                    <a aria-hidden onClick={() => remove(file)}>
                      <AiOutlineDelete />
                    </a>
                  </span>
                )}
            </div>

            {file.percent && <Progress percent={Math.round(file.percent)} />}
          </div>
        </div>
      ))}
    </div>
  );
}
