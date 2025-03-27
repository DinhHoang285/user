import { Button, Input, Modal } from 'antd';
import { useIntl } from 'react-intl';
import { ICodeState } from '../../auth/forms/login-form';

interface IProps {
  codeState: ICodeState,
  setCodeState: Function,
  onVerify: () => void,
  onResend: () => void
}
function VerifyOTPModel({
  codeState,
  setCodeState,
  onVerify,
  onResend
}: IProps) {
  const intl = useIntl();
  const {
    openModal, expiry, loading, email
  } = codeState;
  return (
    <Modal
      key="sms-otp"
      className="modal-verify-phone-login"
      width={500}
      centered
      maskClosable={false}
      title="Verify your Email"
      open={openModal}
      footer={null}
      onCancel={() => setCodeState((prev) => ({ ...prev, openModal: false }))}
    >
      <p>
        {intl.formatMessage({ id: 'enterTheAuthenticationCode', defaultMessage: 'Enter the authentication code below we sent to email address' })}
        {' '}
        {email}
      </p>
      <Input.OTP
        length={6}
        disabled={loading}
        onChange={(text) => setCodeState((prev) => ({ ...prev, code: text }))}
        style={{
          margin: '16px 0'
        }}
      />
      <div className="ft-modal">
        <p>
          {intl.formatMessage({ id: 'dontHaveACode', defaultMessage: 'Don\'t have an code?' })}
          {' '}
          &nbsp;
          {expiry < 60 ? (
            <span className="resend-code">
              {expiry < 60 && `${expiry}`}
              {' '}
              seconds
            </span>
          ) : (
            <span aria-hidden="true" onClick={onResend} className="resend-code" style={{ cursor: 'pointer' }}>
              {' '}
              {intl.formatMessage({ id: 'resendCode', defaultMessage: 'Resend code' })}
            </span>
          )}
        </p>
        <Button
          disabled={loading}
          onClick={onVerify}
          className="primary"
        >
          {intl.formatMessage({ id: 'verify', defaultMessage: 'VERIFY' })}
        </Button>
      </div>
    </Modal>
  );
}

export default VerifyOTPModel;
