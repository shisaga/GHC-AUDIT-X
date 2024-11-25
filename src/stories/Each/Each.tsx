import React, { Children, ReactNode } from "react";

interface EachProps {
  /*
   Label id
   */
  render: (item: any, index: number) => React.ReactNode;
  /*
   */
  of: any[];
}

/**
 * Primary UI component for user interaction
 */
export const Each = ({ render, of }: EachProps) => {
  return <>{Children.toArray(of.map((item, index) => render(item, index)))}</>;
};
