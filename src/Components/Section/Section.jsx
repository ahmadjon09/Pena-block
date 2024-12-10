import React from "react";

export const Section = ({ children, className }) => {
  return (
    <section className={"p-5 h-screen" + " " + className}>
      {children}
    </section>
  );
};
