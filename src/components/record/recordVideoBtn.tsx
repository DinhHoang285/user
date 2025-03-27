import RecordModal from './recordModal';

interface IProps {
  lableBtn: any,
  isRecord: boolean,
  setIsRecord: Function,
  isSale: boolean,
  setSale: Function,
  price: number,
  setPrice: Function,
  onFileRecorded: Function,
  onSendMsg: Function,
}
function RecordVideoBtn(props: IProps) {
  const {
    lableBtn, isRecord, setIsRecord, isSale, setSale, price, setPrice, onFileRecorded, onSendMsg
  } = props;
  return (
    <>
      <RecordModal
        isSale={isSale}
        setSale={setSale}
        price={price}
        setPrice={setPrice}
        open={isRecord}
        setOpen={setIsRecord}
        setFile={onFileRecorded}
        onSendMsg={onSendMsg}
      />
      {lableBtn}
    </>
  );
}

export default RecordVideoBtn;
