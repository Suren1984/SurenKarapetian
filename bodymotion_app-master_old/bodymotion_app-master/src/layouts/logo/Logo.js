import LogoDark from "../../assets/images/logos/xtremelogo.svg";
import Image from "next/image";
import LogoBodyMotion from "../../assets/images/logos/bodymotion.png";
import Link from "next/link";

const Logo = () => {
  return (
      <>
        <Image src={LogoBodyMotion}  width={200}
    height={30} alt="logo" />
      </>
  );
};

export default Logo;
