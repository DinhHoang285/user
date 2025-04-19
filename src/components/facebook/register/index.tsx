/* eslint-disable react/button-has-type */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import style from './style.module.scss';

export default function RegisterContainer() {
  return (
    <div className={style.registerContainer}>
      <div className={style.registermain}>
        <div className={style.registerLogo}>
          <h1 className={style.logo}>facebook</h1>
        </div>
        <div className={style.registerFormContainer}>
          <div className={style.formContainerHeader}>
            <h2 className={style.textFormContainerHeader}>Tạo tài khoản mới</h2>
            <div className={style.textFormContainerHeader}>Nhanh chóng và dễ dàng.</div>
          </div>
          <hr />
          <div className={style.formContainerContext}>
            <div className={style.ContainerContextNameInput}>
              <input type="text" placeholder="Họ" />
              <input type="text" placeholder="Tên" />
            </div>
            <div>
              <label>Ngày sinh</label>
              <FontAwesomeIcon icon={faCircleQuestion} className={style.iconQuestion} />
            </div>
            <div className={style.selectRowDayBorn}>
              <select defaultValue="">
                <option value="" disabled hidden>Ngày</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select defaultValue="">
                <option value="" disabled hidden>Tháng</option>
                {[
                  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
                  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
                  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
                ].map((month, i) => (
                  <option key={i} value={month}>{month}</option>
                ))}
              </select>

              <select defaultValue="">
                <option value="" disabled hidden>Năm</option>
                {Array.from({ length: 80 }, (_, i) => (
                  <option key={i} value={2025 - i}>{2025 - i}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Giới tính</label>
              <FontAwesomeIcon icon={faCircleQuestion} className={style.iconQuestion} />
            </div>
            <div className={style.radioRowSex}>
              <label>
                <input type="radio" name="gender" />
                Nam
              </label>
              <label>
                <input type="radio" name="gender" />
                Nữ
              </label>
              <label>
                <input type="radio" name="gender" />
                Tuỳ chỉnh
              </label>
            </div>
            <div className={style.inputInfo}>
              <input type="text" placeholder="Số di động hoặc email" />
            </div>
            <div className={style.inputInfo}>
              <input type="text" placeholder="Mật khẩu mới" />
            </div>
            <button className={style.registerBtn}>Đăng ký</button>
            <div className={style.nextLoginLink}>
              <a href="#">Bạn đã có tài khoản ư?</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// export default RegisterContainer;
