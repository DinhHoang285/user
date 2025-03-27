import { Col, Row, Spin } from 'antd';
import { useIntl } from 'react-intl';
import CardVideoTrending from './card-video-trending';

interface IProps {
  listTrending: any,
  searching: boolean
}
function RowVideo({ listTrending, searching }: IProps) {
  const intl = useIntl();
  if (searching) return <div className="text-center"><Spin /></div>;
  return (
    <>
      <Row>
        {listTrending && listTrending.length > 0
          && listTrending.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <CardVideoTrending video={item} />
            </Col>
          ))}
      </Row>
      {!searching && !listTrending.length && (
        <p style={{ textAlign: 'center' }}>
          {' '}
          <p style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'noTrendingWasFound', defaultMessage: 'No trending {type} was found' }, { type: intl.formatMessage({ id: 'video', defaultMessage: 'video' }) })}</p>
        </p>
      )}
    </>
  );
}

export default RowVideo;
