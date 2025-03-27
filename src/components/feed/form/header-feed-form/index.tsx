import { AiOutlineProduct } from 'react-icons/ai';
import { PiFilmReelLight } from 'react-icons/pi';
import style from './header-feed-form.module.scss';

function HeaderFeedForm({
  formData, setFormData, isEdit
}: any) {
  return (
    <div className={style.container}>
      <div className={style['box-button-type']}>
        <button
          type="button"
          className={`${['text', 'photo', 'video', 'text'].includes(formData.type) ? style.active : ''} ${style.button} ${isEdit ? style.disable : null}`}
          onClick={() => {
            if (!isEdit) {
              setFormData({ ...formData, type: 'text' });
            }
          }}
        >
          <i>Tt</i>
          Feed Post
        </button>
        <button
          type="button"
          className={`${['reel'].includes(formData.type) ? style.active : ''} ${style.button} ${isEdit ? style.disable : null}`}
          onClick={() => {
            if (!isEdit) {
              setFormData({ ...formData, type: 'reel' });
            }
          }}
        >
          <i><PiFilmReelLight /></i>
          Greets
        </button>
        <button
          type="button"
          className={`${['product'].includes(formData.type) ? style.active : ''} ${style.button} ${isEdit ? style.disable : null}`}
          onClick={() => {
            if (!isEdit) {
              setFormData({ ...formData, type: 'product', productType: 'physical' });
            }
          }}
        >
          <i><AiOutlineProduct /></i>
          Product
        </button>
      </div>
    </div>
  );
}

export default HeaderFeedForm;
