'use client';

import {
  IFeed
} from 'src/interfaces';

import { useIntl } from 'react-intl';

type Props = {
  product: IFeed;
};

function ProductViewer({
  product
}: Props) {
  const intl = useIntl();

  return (
    <div className="prod-card">
      <img
        alt="product-img"
        src={product.files[0].url || '/empty_product.svg'}
      />
      {product.stock && product.productType === 'physical' ? (
        <span className="prod-stock">
          {product.stock}
          {' '}
          {intl.formatMessage({
            id: 'inStock',
            defaultMessage: 'in stock'
          })}
        </span>
      ) : null}
      {!product.stock && product.productType === 'physical' && (
        <span className="prod-stock">
          {intl.formatMessage({
            id: 'outOfStock',
            defaultMessage: 'Out of stock!'
          })}
        </span>
      )}
      {product.productType === 'digital' && (
        <span className="prod-digital">
          {intl.formatMessage({
            id: 'digital',
            defaultMessage: 'Digital'
          })}
        </span>
      )}
    </div>
  );
}

export default ProductViewer;
