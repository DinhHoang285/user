/* eslint-disable react/button-has-type */
import React from 'react';
import style from './style.module.scss';

export default function LoginContainer() {
  return (

    <div className={style.loginContainer}>
      <div className={style.main}>
        <div className={style.left}>
          <h1 className={style.logo}>facebook</h1>
          <p className={style.desc}>
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </p>
        </div>
        <div className={style.right}>
          <div className={style.formContainer}>
            <input type="text" placeholder="Email hoặc số điện thoại" />
            <input type="password" placeholder="Mật khẩu" />
            <button className={style.loginBtn}>Đăng nhập</button>
            <a href="#" className={style.forgotLink}>Quên mật khẩu</a>
            <hr />
            <button className={style.registerBtn}>Tạo tài khoản mới</button>
          </div>
        </div>
      </div>

    </div>
  );
}

//  export default LoginContainer;
