import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navData } from "./navData";
import "../scss/navbar.scss";
const Navbar = () => {
  let [nav, setNav] = useState(navData); // js environ
  // <p> isodiso  </p>
  return (
    <div className="navBar">
      {/* jsx environ  */}
      {nav.map((each, i) => {
        return (
          <div key={i} className={each.class}>
            {" "}
            <Link to={each.href}>{each.text} </Link>{" "}
          </div>
        );
      })}
    </div>
  );
  // js environ
};

export default Navbar;
