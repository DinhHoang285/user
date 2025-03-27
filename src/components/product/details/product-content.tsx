import React from 'react';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { IFeed } from '@interfaces/feed';
import styles from './product-content.module.scss';

interface IProps {
  product: IFeed;
}
function ProductContent({ product }: IProps) {
  const intl = useIntl();

  return (
    <div className={styles['product-wrapper']}>
      <div className={styles['product-thumb']}>
        <img src={product.files[0].url || '/empty_product.svg'} alt="product" />
      </div>
      <div className={styles['product-main']}>
        <div className={styles['product-info']}>
          <h3>{product.name}</h3>
          <p>
            €
            {' '}
            {product.price}
          </p>
        </div>
        <Link href={`/post/${product.slug}`} className={styles['product-but']}>
          {intl.formatMessage({ id: 'buyNow', defaultMessage: 'Buy Now' })}
        </Link>
      </div>
    </div>
  );
}

export default ProductContent;
