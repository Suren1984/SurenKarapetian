import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import Image from "next/image";
import dystoniaImage from '../../assets/images/dystonia.png'
import postureImage from '../../assets/images/posture.png'
import gaitImage from '../../assets/images/gait.png'
import fullBodyImage from '../../assets/images/fullbody.png'
import { useState } from 'react';
import { MODULES } from '../../../constants/Enums';

const ModuleCard = ({ selected, handleModuleChange }) => {
  const [module, setModule] = useState(MODULES.FULLBODY);

  const handleModuleClick = (module) => {
    setModule(module);
    handleModuleChange(module);
  }

  const modules = [
/*     {
      "title": "Dystonia",
      "slug": "dystonia",
      "img": dystoniaImage
    }, */
    {
      "title": "Full Body",
      "slug": "fullbody",
      "img": fullBodyImage
    },
    {
      "title": "Posture",
      "slug": "posture",
      "img": postureImage
    },
    {
      "title": "Gait",
      "slug": "gait",
      "img": gaitImage
    },

  ];

  return (
    <Card className='module-cards'>
      <CardBody className="modules"  style={{ flexDirection: 'row', display: 'inline-flex', padding: 0 }}>
        {modules.map((mod) => (
          <div onClick={() => handleModuleClick(mod.slug)}
          key={mod.title} className={module === mod.slug ? "module_tab_selected" : "module_tab"}>
            <Image src={mod.img} width="30" height="30" alt="logo" objectFit='contain' style={{ alignSelf: 'center' }}></Image>
            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>{mod.title}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default ModuleCard;
