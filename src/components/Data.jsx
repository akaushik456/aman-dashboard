import React, { useEffect } from "react";
import Teacher from "./Teacher";

const dataUse = () => {

  useEffect(() => {
    fetch()
  })

  const show = ('aman')

  return(
     <div>
      <h1>kaushik {11 + 5}</h1>
      <hr />
      <Teacher show={show}/>

     </div>

  );   
};

export default dataUse;