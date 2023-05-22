import React from 'react';
import {Outlet} from "react-router-dom";
import SidebarNavLink from '../components/SidebarNavLink';

function Profile() {
    return (
		<div className="flex flex-row flex-1">
            <div className="hidden md:flex flex-col justify-between border-base-300 bg-base-200">
                <ul className="my-1 px-1 w-56">
                    <SidebarNavLink destination={`../profile/settings`}>
                        <div className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary/75" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="12" cy="7" r="4" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                            Account
                        </div>
                    </SidebarNavLink>
                    <SidebarNavLink destination={`../profile/battlestations`}>
                        <div className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary/75" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <rect x="3" y="4" width="18" height="12" rx="1" />
                                <line x1="7" y1="20" x2="17" y2="20" />
                                <line x1="9" y1="16" x2="9" y2="20" />
                                <line x1="15" y1="16" x2="15" y2="20" />
                            </svg>
                            Battlestations
                        </div>
                    </SidebarNavLink>
                    <SidebarNavLink destination={`../profile/favorites`}>

                        <div className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary/75" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                            </svg>
                            Favorites
                        </div>
                    </SidebarNavLink>
                </ul>
            </div>
			<Outlet />
		</div>
	);
}

export default Profile;