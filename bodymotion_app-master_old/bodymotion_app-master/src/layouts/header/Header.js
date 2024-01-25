import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../assets/images/logos/xtremelogowhite.svg";
import user1 from "../../assets/images/users/user.png";
import { useRouter } from 'next/router';
import { useContext } from "react";
import { UserContext } from '../../../pages/_app';
import Logo from "../logo/Logo";


const navigation = [
  {
    title: "Diagnostics",
    href: "/dashboard",
    icon: "bi bi-activity",
  },
  {
    title: "Patients Records",
    href: "/dashboard/patients-records",
    icon: "bi bi-archive",
  },
  {
    title: "Rehabilitation",
    href: "/dashboard/rehabilitation",
    icon: "bi bi-activity",
  },
];

const Header = ({ showMobmenu }) => {
  const router = useRouter();
  let location = router.pathname;
  const { param } = router.query;
  if (location.includes("patients-records"))
    location = param != undefined ? 'rehabilitation' : 'patients-records';

  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const userData = useContext(UserContext);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    document.cookie = `OursiteJWT=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    router.push("/login");
  }

  const handleChangePassword = () => {
    router.push("/dashboard/change-password");
  }

  return (
    <Navbar color="primary" style={{position: 'relative', display: 'flex'}}>
      <div className="hstack gap-2" style={{width: '40%'}}>
        <Link href={"/dashboard"} passHref={true}>
          <button type="button" className={
            location == "/dashboard" ? "btn btn-light" : "btn btn-outline-light"
            }><i className="bi bi-activity"></i>&nbsp;Diagnostics</button>
        </Link>
        <Link href={"/dashboard/patients-records"} passHref={true}>
          <button type="button" className={
            location == "patients-records" ? "btn btn-light" : "btn btn-outline-light"
            }><i className="bi bi-archive"></i>&nbsp;Patients Records</button>
        </Link>
        <Link href={"/dashboard/patients-records/rehabilitation"} passHref={true}>
          <button type="button" className={
            location == "rehabilitation" ? "btn btn-light" : "btn btn-outline-light"
            }><i className="bi bi-person"></i>&nbsp;Rehabilitation</button>
        </Link>
      </div>

      <Logo style={{ 

    }} />


      <Dropdown isOpen={dropdownOpen} toggle={toggle} style={{ flexDirection: 'row', width: '30%', textAlign: 'end' }}>
        <DropdownToggle color="primary">
          <div style={{ lineHeight: "0px" }}>
            <Image
              src={user1}
              alt="profile"
              width="30"
              height="30"
            />
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => handleChangePassword()}>Change password</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => { handleLogout() }}>Logout</DropdownItem>
        </DropdownMenu>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>{userData.name}</span>
      </Dropdown>

    </Navbar>
  );
};

export default Header;
