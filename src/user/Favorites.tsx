import React, {useContext} from 'react';

import {getIdToken} from "firebase/auth";

import {authContext} from '../useAuth';
import {useQuery} from '@tanstack/react-query';

import {IBattlestationSummary} from '../battlestations/apiQueries';
import FavoriteListEntry from './FavoriteListEntry';
import {getFavorites} from './apiQueries';
import usePageTitle from '../usePageTitle';

function Favorites() {
    usePageTitle("My Favorites | BattlestationDB");
    
    const authState = useContext(authContext);

    const {data: dataUserFavorites, error: errorUserFavorites, isLoading: isLoadingUserFavorites} = 
        useQuery<{total: number, battlestations: IBattlestationSummary[]}>(['userFavorites'], async () => getFavorites(authState.user!.uid, await getIdToken(authState.user!)));

    return (
        <div className="flex flex-col items-center flex-1">
			<div className="flex flex-col w-full p-5">
                <h2 className="text-4xl mb-4 font-semibold self-center">My Favorites</h2>

                <div className="overflow-x-auto w-full">
                    <table className="table table-zebra table-compact w-full">
                        <thead className="sr-only md:not-sr-only">
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th className="pr-5">Creator</th>
                                <th className="pr-5 text-right">Images</th>
                                <th className="pr-5 text-right">Parts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>{isLoadingUserFavorites ? <tr><td colSpan={6}>LOADING...</td></tr> : 
                                dataUserFavorites && dataUserFavorites.battlestations.map(battlestation => 
                                    <FavoriteListEntry 
                                        key={battlestation.battlestation_id}
                                        battlestation={battlestation}
                                    />
                                )}
                                {errorUserFavorites &&
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex p-4 gap-2 rounded-lg border border-error font-light">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Sorry, we were unable to load any battlestations. Please try again later.</span>
                                        </div>
                                    </td>
                                </tr>
                            }</> 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Favorites;