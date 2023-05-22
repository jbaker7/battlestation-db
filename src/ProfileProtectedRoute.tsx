import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {authContext} from './useAuth';
import Profile from './user/Profile';

function ProfileProtectedRoute() {
  
  const authState = useContext(authContext);
  let location = useLocation();
  
  if (!authState.user) {
    if (authState.loading === false) {
      return <Navigate to="/login" state={{from: location}} replace />;
    }
    else {
      return  <div className="flex flex-1 items-center justify-center">
                <svg id="loading-hex" 
                className={`hex-animation text-primary`}
                stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" width="100px" height="100px" viewBox="-16 -16 332 332" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow" x="-25%" y="-25%" height="150%" width="150%">
                      <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="8" in="SourceGraphic"></feGaussianBlur>
                    </filter>
                  </defs>
                  <polygon fill="none" points="300,150 225,280 75,280 0,150 75,20 225,20" ></polygon>
                  <g style={{filter: "url('#glow')"}} filter="url(#glow);">
                    <polygon fill="none" points="300 150 225 280 75 280 0 150 75 20 225 20" ></polygon>
                  </g>
                </svg>
              </div>
    }
  }

  return <Profile />;
}

export default ProfileProtectedRoute;