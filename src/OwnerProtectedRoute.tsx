import React, {useContext} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Navigate, useLocation, useParams} from 'react-router-dom';
import {IBattlestation, getOneBattlestation} from './battlestations/apiQueries';
import UpdateBattlestation from './battlestations/UpdateBattlestation';
import BattlestationSkeleton from './battlestations/BattlestationSkeleton';
import {authContext} from './useAuth';

function UserProtectedRoute({children}: { children?: JSX.Element }) {
  
  const authState = useContext(authContext);
  let location = useLocation();
  const {stationId} = useParams();

  const {data: dataBattlestation, error: errorBattlestation, isLoading: isLoadingBattlestation} = 
    useQuery<IBattlestation>(['editBattlestation'], () => getOneBattlestation({id: stationId!, token: authState.initialToken}),
    {enabled: !!authState.initialToken});

  if ((isLoadingBattlestation && authState.initialToken) || authState.loading) {
    return <BattlestationSkeleton />
  }
  else {
    if (!authState.user) {
      return <Navigate to="/login" state={{from: location}} replace />;
    }
    else {
      if (errorBattlestation) {
        return  <div className="flex m-5 mb-auto items-center p-4 gap-2 rounded-lg border border-error font-light">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sorry, we were unable to load this battlestation. Please try again later.</span>
                </div>
      }
      else if (authState.user.uid === dataBattlestation?.user_id) {
        return <UpdateBattlestation 
          dataBattlestation={dataBattlestation}
          />;
      }
      else {
        return  <div className="flex m-5 mb-auto items-center p-4 gap-2 rounded-lg border border-error font-light">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sorry, you do not have access to edit this battlestation.</span>
                </div>
      }
    }
  }
}

export default UserProtectedRoute;