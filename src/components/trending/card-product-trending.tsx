import { Image } from 'antd';
import Link from 'next/link';
import { IProduct } from 'src/interfaces';
import { useIntl } from 'react-intl';
import style from './trending.module.scss';

interface IProps {
  product: IProduct;
}

function CardProductTrending({ product }: IProps) {
  const intl = useIntl();
  const image = product?.image || '/no-image.jpg';
  return (
    <div className={style['product-trending-grid-card']} key={product._id}>
      <Link
        href={`/product/${product.slug || product._id}`}
      >
        <div className={style['card-trending-thumb']}>
          {/* eslint-disable-next-line no-nested-ternary */}
          <div
            className={style['trending-card-bg']}
            style={{ backgroundImage: `url(${image})` }}
          />
          {product.price > 0 && (
            <div className={style['trending-bagde']}>
              <p className={style['trending-category-bg']}>
                €
                {' '}
                {(product.price || 0).toFixed(2)}
              </p>
            </div>
          )}
          {!product.stock && product.type === 'physical' && (
            <div className={style['product-bagde-red']}>
              <p className={style['product-bg-red']}>{intl.formatMessage({ id: 'outOfStock', defaultMessage: 'Out of stock!' })}</p>
            </div>
          )}
          {product.stock > 0 && product.type === 'physical' && (
            <div className={style['product-bagde-red']}>
              <p className={style['product-bg-red']}>
                {product.stock}
                {' '}
                {intl.formatMessage({ id: 'stock', defaultMessage: 'stock' })}
              </p>
            </div>
          )}
          <div className={style['card-bottom']}>
            <div className={style['stats-profile']}>
              <Image
                preview={false}
                alt="main-avt"
                src={product.performer?.avatar || '/no-avatar.jpg'}
                fallback="/no-avatar.jpg"
              />
              <h5>{(product.performer && product.performer?.username) || 'n/a'}</h5>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardProductTrending;
