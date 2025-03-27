import { showSuccess } from '@lib/message';

export const copyToClipboard = (str: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  } else {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  showSuccess('Copied to clipboard');
};
