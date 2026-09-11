import LayoutSite from "@/src/components/layout/LayoutSite";
import React, { FC, ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}
const layout: FC<ILayoutProps> = ({ children }) => {
  return <LayoutSite>{children}</LayoutSite>;
};

export default layout;
