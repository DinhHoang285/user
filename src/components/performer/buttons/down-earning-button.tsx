import { Button } from 'antd';
import { AiOutlineDownload, AiOutlineLoading } from 'react-icons/ai';
import { useState } from 'react';
import { showError } from '@lib/message';
import { authService } from '@services/auth.service';
import { useIntl } from 'react-intl';
import styles from './down-earning.button.module.scss';
import { earningService } from '../../../services/earning.service';

function downloadCsv(url: string, filename: string) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const blob = new Blob([xhr.response], { type: 'text/csv' });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a') as HTMLAnchorElement;
      a.href = href;
      a.setAttribute('download', filename);
      a.click();
      URL.revokeObjectURL(href);
      resolve({ success: true });
    };

    xhr.onerror = (err) => {
      reject(err);
    };

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authService.getToken());
    xhr.responseType = 'blob';
    xhr.send();
  });
  return promise;
}

function DownloadEarningButton() {
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const handleExportCsvFile = async () => {
    try {
      setLoading(true);
      const url = earningService.performerExport();
      (await downloadCsv(url, 'export_your-earning.csv')) as any;
    } catch {
      showError(
        intl.formatMessage({
          id: 'errorOccuredTryAgain',
          defaultMessage: 'An error occurred, please try again!'
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="large"
      className={styles['download-button']}
      onClick={handleExportCsvFile}
      disabled={loading}
      type="primary"
      icon={loading ? <AiOutlineLoading /> : <AiOutlineDownload />}
    >
      <span className={styles['download-content']}>
        {intl.formatMessage({ id: 'export', defaultMessage: 'Export' })}
      </span>
    </Button>
  );
}

export default DownloadEarningButton;
