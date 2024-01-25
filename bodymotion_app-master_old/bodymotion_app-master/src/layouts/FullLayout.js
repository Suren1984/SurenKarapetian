import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import { useRouter } from 'next/router';

const FullLayout = ({ children, userData }) => {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <div className="d-md-block d-lg-flex">
 
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}

          {router.pathname.includes("dashboard") &&
          <Header userData={userData} showMobmenu={() => showMobilemenu()} />
      }

          {/********Middle Content**********/}
          <Container className="p-4" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main >
  );
};

export default FullLayout;
