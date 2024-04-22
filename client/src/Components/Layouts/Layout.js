import React from "react";
import Headers from "./Headers";
import Footers from "./Footer";

const Layouts = (props) => {
  // Extract title from props
  const { title } = props;

  // Dynamically set document title based on the prop
  React.useEffect(() => {
    document.title = title || "Default Title"; // Use prop title or fallback to a default title
  }, [title]);

  return (
    <div>
      <Headers />
      <main style={{ minHeight: "80vh" }}>{props.children}</main>
      <Footers />
    </div>
  );
};

export default Layouts;
