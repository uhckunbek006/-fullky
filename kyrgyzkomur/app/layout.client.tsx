"use client";

import QueryProviders from "@/src/providers/QueryProviders";
import { FC, ReactNode } from "react";

interface ILayoutClient {
  children: ReactNode;
}
const LayoutClient: FC<ILayoutClient> = ({ children }) => {
  return <QueryProviders>{children}</QueryProviders>;
};

export default LayoutClient;
