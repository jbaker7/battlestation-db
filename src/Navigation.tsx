import React, {useContext} from 'react';
import {Outlet, Link} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import {ReactComponent as LogoText} from './logo-text.svg'
import {ReactComponent as Logo} from './logo.svg'
import {getPartTypes, IPartTypes} from './parts/apiQueries';
import {authContext} from './useAuth';

function Navigation() {

  const authState = useContext(authContext);
  const {data, error, isLoading} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes, {staleTime: (1000 * 60 * 60 * 24)});

  function logOut() {
    authState.firebaseAuth.signOut()
      .then(() => {
        console.log("Logged Out.")
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (

    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div> 
          <div className="sm:flex-1 lg:flex-none px-2 mr-2 " id="logo">
            <Link to="/" className="flex hover:text-primary normal-case text-xl transition-all items-center">
              <Logo className="h-8 w-4 mr-2 inline text-primary" title="BattlestationDB" />
              <LogoText className="h-5 text-base-content hover:text-primary transition-all duration-300" title="BattlestationDB" />
            </Link>
          </div>
          
          <div className="flex-1 hidden lg:block">
            <div className="flex justify-center uppercase text-sm">
              <ul className="menu menu-horizontal p-1 rounded-box">
                <li><Link className="" to="/battlestations">View Battlestations</Link></li>
                <li tabIndex={0}>
                  <Link className=" gap-0" to="/parts">
                    Browse Parts<svg className="fill-base-content/50 ml-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                  </Link>
                  <ul className="p-2 bg-base-300 z-50  border border-base-content/10 shadow-lg rounded-box">

                    {data ? data.map((partType, index) =>{
                    return <li key={`${partType}${index}`}><Link to={`parts/${partType.type_path}`}>{partType.type_name}</Link></li>})
                    : isLoading ? <li className="w-44">Loading...</li>
                    : error ? <li className="px-2 py-1">Unable to load part categories</li>
                    : <li></li>
                    }

                  </ul>
                </li>
                <li>
                  <Link className="bg-primary text-primary-content gap-0 hover:bg-primary-focus" to="/battlestations/new">
                    <svg xmlns="http://www.w3.org/2000/svg" className=" h-5 w-5 mr-1" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Build
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {authState.user ? 
          <div className="ml-auto dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 !flex justify-center items-center rounded-full text-base-content/75 bg-base-content/10 border"
              title={authState.user.displayName!}>
                <div className="text-xl" title={authState.user.displayName!}>{authState.user.displayName!.charAt(0)}</div>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow-lg menu menu-compact border border-secondary/50 dropdown-content bg-base-200 rounded-xl w-52">

              {authState.userRoles.isAdmin ? <li><Link className="bg-base-content/10" to="/admin">Admin</Link></li> : null}
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <Link to="/profile/battlestations">
                  My Battlestations
                </Link>
                </li>
                <li>
                <Link to="/profile/favorites">
                  Favorites
                </Link>
              </li>
              <li><button onClick={logOut}>Logout</button></li>
            </ul>
          </div>
          :
          <div className="ml-auto">
            <Link to="/login" className="btn btn-outline btn-primary mr-1">Login</Link>
            <Link to="/register" className="btn btn-ghost mr-1">Register</Link>
          </div>
          }
        </div>

        <Outlet />

        <footer className="bg-base-300 text-base-content px-6 py-8">
          <div className="container flex flex-row items-center justify-between  mx-auto">
            <Link to="/" className="flex-0 sm:basis-1/4 md:basis-1/3">
              <Logo className="h-12 w-6 inline text-base-content/75" title="BattlestationDB" />
            </Link>

            <div className="flex flex-col md:flex-row flex-1 sm:basis-3/4 md:basis-2/3 gap-2 md:gap-0 justify-between">
              <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 lg:mt-0">
                <Link to="/" className="text-sm hover:text-primary transition-colors duration-300">
                    Home
                </Link>
                <Link to="../battlestations" className="text-sm hover:text-primary transition-colors duration-300">
                    Battlestations
                </Link>
                <Link to="../parts" className="text-sm hover:text-primary transition-colors duration-300">
                    Parts
                </Link>
                <Link to="privacy_policy.html" target="_blank" className="text-sm hover:text-primary transition-colors duration-300">
                    Privacy
                </Link>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Link to="https://www.instagram.com/battlestationdb/">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
                  </svg>
                </Link>
                <p className="text-sm text-base-content">&copy; Copyright 2023 BattlestationDB</p>
              </div>
            </div>
          </div>
        </footer>
      </div> 

      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 gap-1">
          <li><Link className="border border-primary rounded-lg" to="/battlestations/new">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>New Build
          </Link></li>
          <li className="border-b border-base-content/25">
            <Link to="/battlestations" className="mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 22" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>Browse Battlestations
            </Link>
          </li>
          {data ? data.map((partType, index) =>{
          return <li key={`${partType}${index}`}><Link to={`parts/${partType.type_path}`}>{partType.type_name}</Link></li>})
          : isLoading ? <li className="w-44">Loading...</li>
          : error ? <li>Unable to load part categories.</li>
          : <li></li>
          }
        </ul>
      </div>
    </div> 
  );
}

export default Navigation;
