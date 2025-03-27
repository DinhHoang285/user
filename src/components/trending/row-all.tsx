import { Col, Row, Spin } from 'antd';
import { useIntl } from 'react-intl';
import CardFeedTrending from './card-feed-trending';
import CardVideoTrending from './card-video-trending';
import CardPhotoTrending from './card-photo-trending';
import CardProductTrending from './card-product-trending';

interface IProps {
  listTrending: any,
  searching: boolean
}
function RowAll({ listTrending, searching }: IProps) {
  const intl = useIntl();
  if (searching) return <div className="text-center"><Spin /></div>;
  return (
    <>
      <Row>
        {listTrending && listTrending.length > 0
          && listTrending.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              {item.trendingSource === 'feed' && <CardFeedTrending feed={item} />}
              {item.trendingSource === 'video' && <CardVideoTrending video={item} />}
              {item.trendingSource === 'gallery' && <CardPhotoTrending gallery={item} />}
              {item.trendingSource === 'product' && <CardProductTrending product={item} />}
            </Col>
          ))}
      </Row>
      {!searching && !listTrending.length && (
        <p style={{ textAlign: 'center' }}>
          {intl.formatMessage({ id: 'noTrendingWasFound', defaultMessage: 'No trending was found' })}
        </p>
      )}
    </>
  );
}

export default RowAll;
