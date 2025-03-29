/* eslint-disable react/button-has-type */
import style from './style.module.scss';

function LoginContainer() {
  return (
    <div className={style.container}>
      <h1>Login</h1>
      <p>Login with Facebook</p>
      <button>Login with Facebook</button>
      <p>or</p>
      <button>Login with Google</button>
      <p>or</p>
      <button>Login with Github</button>
      <p>or</p>
      <button>Login with Email</button>
      <p>or</p>
      <button>Login with Phone Number</button>
      <p>or</p>
      <button>Login with Apple ID</button>
      <p>or</p>
      <button>Login with Microsoft Account</button>
    </div>
  );
}

export default LoginContainer;
