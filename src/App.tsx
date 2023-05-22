import React from 'react';
import {Routes, Route} from "react-router-dom";
import {AuthProvider} from './useAuth';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';

import {HelmetProvider} from 'react-helmet-async';

import Navigation from './Navigation';
import Home from './Home';
import GeneralProtectedRoute from './GeneralProtectedRoute';

import Login from './user/Login';
import PasswordReset from './user/PasswordReset';
import Register from './user/Register';

import AdminProtectedRoute from './AdminProtectedRoute';
import AdminHome from './admin/AdminHome';
import AdminParts from './admin/parts/AdminParts';
import AdminPendingParts from './admin/parts/AdminPendingParts';
import AdminStores from './admin/stores/AdminStores';
import AdminBattlestations from './admin/battlestations/AdminBattlestations';

import Battlestations from './battlestations/Battlestations';
import BattlestationView from './battlestations/BattlestationView';
import NewBattlestation from './battlestations/NewBattlestation';

import Parts from './parts/Parts';
import PartView from './parts/PartView';

import ProfileProtectedRoute from './ProfileProtectedRoute';
import UserBattlestations from './user/UserBattlestations';
import Favorites from './user/Favorites';
import OwnerProtectedRoute from './OwnerProtectedRoute';

import ProfileSettings from './user/ProfileSettings';

function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: (1000 * 60 * 60),
      },
    },
  });

  return (

    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider
          adapter={ReactRouter6Adapter}
          options={{
            removeDefaultsFromUrl: true
          }}
        >
          <HelmetProvider>
            <Routes>
              <Route path="/admin" element={<AdminProtectedRoute />}>
                <Route index element={<AdminHome />} />
                <Route path="/admin/parts" element={<AdminParts />} />
                <Route path="/admin/pending_parts" element={<AdminPendingParts />} />
                <Route path="/admin/parts/:partType" element={<AdminParts />} />
                <Route path="/admin/stores" element={<AdminStores />} />
                <Route path="/admin/battlestations" element={<AdminBattlestations />} />
              </Route>

              <Route path="/" element={<Navigation />}>
                <Route index element={<Home />} />
                <Route path="battlestations" element={<Battlestations />} />
                <Route path="battlestations/:stationId" element={<BattlestationView />} />
                <Route path="battlestations/:stationId/edit" element={<OwnerProtectedRoute />} />
                <Route path="battlestations/new" element={
                  <GeneralProtectedRoute>
                    <NewBattlestation />
                  </GeneralProtectedRoute>
                } />
                
                <Route path="parts" element={<Parts />} />
                <Route path="parts/:partType" element={<Parts />} />
                <Route path="parts/view/:partId" element={<PartView />} />

                <Route path="/profile" element={<ProfileProtectedRoute />}>
                  <Route index element={<ProfileSettings />} />
                  <Route path="settings" element={<ProfileSettings />} />
                  <Route path="battlestations" element={<UserBattlestations />} />
                  <Route path="favorites" element={<Favorites />} />
                </Route>

                <Route path="login" element={<Login />} /> 
                <Route path="login/password-reset" element={<PasswordReset />} />
                <Route path="register" element={<Register />} />
              </Route>
            </Routes>
          </HelmetProvider>
        </QueryParamProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
