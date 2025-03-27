'use client';

import { Tooltip } from 'antd';
import Link from 'next/link';
import { IProduct } from 'src/interfaces';
import { useIntl } from 'react-intl';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './product-card.module.scss';

interface IProps {
  product: IProduct;
}

function ProductCard({ product }: IProps) {
  const intl = useIntl();
  return (
    <Link
      href={`/product/${product.slug || product._id}`}
    >
      <div className={style['prd-card']}>
        <ImageWithFallback
          options={{
            unoptimized: true,
            size: 300,
            height: 300,
            className: style.thumbnail
          }}
          alt="thumb"
          src={product?.image || '/empty_product.svg'}
          fallbackSrc="/empty_product.svg"
        />
        <div className={style['label-wrapper']}>
          {product.price > 0 && (
            <span className={style['label-wrapper-price']}>
              €
              {(product?.price || 0).toFixed(2)}
            </span>
          )}
          {!product.stock && product.type === 'physical' && (
            <div className={style['label-wrapper-digital']}>
              {intl.formatMessage({
                id: 'outOfStock',
                defaultMessage: 'Out of stock!'
              })}

            </div>
          )}
          {product.stock > 0 && product.type === 'physical' && (
            <div className={style['label-wrapper-digital']}>
              {Math.round(product.stock)}
              {' '}
              {intl.formatMessage({
                id: 'inStock',
                defaultMessage: 'in stock'
              })}
            </div>
          )}
          {product.type === 'digital' && (
            <span className={style['label-wrapper-digital']}>
              {intl.formatMessage({
                id: 'digital',
                defaultMessage: 'Digital'
              })}

            </span>
          )}
        </div>
        <Tooltip title={product.name}>
          <div className={style['prd-info']}>
            {product.name}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}

export default ProductCard;
