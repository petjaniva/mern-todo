import React from "react";
import Login from "../components/Login"
import Signup from "../components/Signup";

const Landing = () => {
  const [isSignup, setIsSignup] = React.useState<boolean>(false);
  return(
    <div className="flex w-full h-screen">
    <div className="w-1/2 max-w-xs mx-auto relative">
      <div className="absolute inset-0 m-auto" style={{height: '300px'}}>
        <div>{(isSignup && <Signup renderLogin={() => setIsSignup(false)} /> )|| <Login renderSignup={() => setIsSignup(true)}
        />}</div>
      </div>
    </div>
    <div className="w-1/2 bg-green-400 text-center text-xl">
      Moi ruurik!
    </div>
    </div>
  );
}

export default Landing;