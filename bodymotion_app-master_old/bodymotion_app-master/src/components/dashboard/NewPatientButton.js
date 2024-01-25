import { Card, CardBody } from 'reactstrap';
import Image from "next/image";
import userImage from '../../assets/images/invite.png'

const NewPatientButton = (props) => {

  
  return (
    <Card style={{ width: '105px', alignContent: 'end', float: 'right', borderColor: '#00656e5d', borderWidth: 1 }} onClick={() => props.handleModal(true)}>
      <CardBody className="modules"  style={{ flexDirection: 'row', display: 'inline-flex', padding: 0 }}>
          <div className={"module_tab"}>
            <Image src={userImage} width="20" height="20" alt="logo" objectFit='contain' style={{ alignSelf: 'center' }}></Image>
            <span style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>New Patient</span>
          </div>
      </CardBody>
    </Card>
  );
};

export default NewPatientButton;
