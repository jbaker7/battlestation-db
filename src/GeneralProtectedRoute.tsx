import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {authContext} from './useAuth';
import BattlestationSkeleton from './battlestations/BattlestationSkeleton';

function GeneralProtectedRoute({ children }: { children: JSX.Element }) {
  
  const authState = useContext(authContext);
  let location = useLocation();
  
    if (!authState.user) {
      if (authState.loading === false) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      else {
        return <BattlestationSkeleton />
      }
      
    }
  
    return children;
  }

export default GeneralProtectedRoute;