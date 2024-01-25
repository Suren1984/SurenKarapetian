import { useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Table, Col, Row } from "reactstrap";
import { MODULES } from "../../../constants/Enums";
import { MotionTronicDataContext } from "../../../pages/dashboard";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import DystoniaTable from "./DystoniaTable";
import PostureTable from "./PostureTable";
import GaitTable from "./GaitTable";
import FullbodyTable from "./FullbodyTable";

const DiagnosticsData = ({ handleModuleChange }) => {
  const motionTronicData = useContext(MotionTronicDataContext)
  const [module, setModule] = useState(MODULES.DYSTONIA)

  useEffect(() => {
    setModule(handleModuleChange())
  }, [handleModuleChange])


  return (
    <Card>
      <CardBody>
        {/*<CardTitle tag="h5">Diagnostics Data for module: {module}</CardTitle>*/}
        <Row>
          <Col lg="12">
            {module == MODULES.DYSTONIA &&
              <DystoniaTable />
            }

            {module == MODULES.POSTURE &&
              <PostureTable />
            }

            {module == MODULES.GAIT &&
              <GaitTable />
            }

            {module == MODULES.FULLBODY &&
              <FullbodyTable />
            }
          </Col>

        </Row>
      </CardBody>
    </Card>
  );
};

export default DiagnosticsData;
