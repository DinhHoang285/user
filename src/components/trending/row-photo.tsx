import { Col, Row, Spin } from 'antd';
import { useIntl } from 'react-intl';
import CardPhotoTrending from './card-photo-trending';

interface IProps {
  listTrending: any,
  searching: boolean
}
function RowPhoto({ listTrending, searching }: IProps) {
  const intl = useIntl();
  if (searching) return <div className="text-center"><Spin /></div>;
  return (
    <>
      <Row>
        {listTrending && listTrending.length > 0
          && listTrending.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <CardPhotoTrending gallery={item} />
            </Col>
          ))}
      </Row>
      {!searching && !listTrending.length && (
        <p style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'noTrendingWasFound', defaultMessage: 'No trending {type} was found' }, { type: intl.formatMessage({ id: 'gallery', defaultMessage: 'gallery' }) })}</p>
      )}
    </>
  );
}

export default RowPhoto;
