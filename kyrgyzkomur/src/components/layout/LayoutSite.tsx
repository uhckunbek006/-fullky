import { FC, ReactNode } from "react";
import Footer from "./footer/Footer";
import "./LayoutSite.scss";
import HeaderTop from "./header/HeaderTop";
interface ILayoutSite {
  children: ReactNode;
}
const LayoutSite: FC<ILayoutSite> = ({ children }) => {
  return (
    <div id="LayoutSite">
      <HeaderTop />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutSite;
