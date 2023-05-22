import React, {useContext} from 'react';
import {authContext} from './useAuth';
import AdminNav from './admin/AdminNav'

function AdminProtectedRoute() {
  
  const authState = useContext(authContext);
  
  if (!authState.userRoles.isAdmin) {
    if (authState.loading === false) {
      return  <div className="flex m-5 mb-auto items-center p-4 gap-2 rounded-lg border border-error font-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You must be an administrator to access this.</span>
              </div>
    }
    else {
      return  <div className="flex flex-1 h-screen items-center justify-center">
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
  
  return <AdminNav />;
}

export default AdminProtectedRoute;