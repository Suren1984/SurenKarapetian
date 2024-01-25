import { Card, CardBody } from 'reactstrap';
import Image from "next/image";
import userImage from '../../assets/images/refresh.png'

const RefreshMotionButton = (props) => {

  
  return (
    <Card style={{ width: '100px', alignContent: 'end', float: 'right', marginRight: 10, borderColor: '#00656e5d', borderWidth: 1 }} onClick={() => props.handleRefresh()}>
      <CardBody className="modules"  style={{ flexDirection: 'row', display: 'inline-flex', padding: 0 }}>
          <div className={"module_tab"}>
            <Image src={userImage} width="20" height="20" alt="logo" objectFit='contain' style={{ alignSelf: 'center' }}></Image>
            <span style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Refresh</span>
          </div>
      </CardBody>
    </Card>
  );
};

export default RefreshMotionButton;
