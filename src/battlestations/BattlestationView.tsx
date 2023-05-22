import React, {useContext} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {getOneBattlestation, IBattlestation} from './apiQueries';
import {formatDate} from './dateFormatter';
import ImageGallery from './ImageGallery';
import PartListEntry from './PartListEntry';
import BattlestationSkeleton from './BattlestationSkeleton';
import BattlestationError from './BattlestationError';
import FavoriteButton from './FavoriteButton';
import {ReactComponent as GalleryPlaceholder} from '../components/image-folder.svg';
import {authContext} from '../useAuth';
import SEOTags from "../components/SEOTags";
import '../App.css';

function BattlestationView() {

    const {stationId} = useParams();
    const authState = useContext(authContext);

    const {data: dataBattlestation, error: errorBattlestation, isLoading: isLoadingBattlestation} = 
    useQuery<IBattlestation>(['battlestation', {id: stationId, token: authState.initialToken}], () => getOneBattlestation({id: stationId!, token: authState.initialToken}),
        {enabled: !authState.loading});

    return (
        <>
            {isLoadingBattlestation ?
            <BattlestationSkeleton /> :
            errorBattlestation ?
            <BattlestationError /> :
            <div className="flex flex-col flex-1">

                <SEOTags
                    title={`${dataBattlestation ? dataBattlestation.name : undefined}`}
                    description={`BattlestationDB - Explore the most beautiful and inspiring setups for gaming, work-from-home, and productivity.`}
                    url={`https://www.battlestationdb.com/battlestations/${stationId}`}
                />

                <div className="flex flex-col md:flex-row gap-4 justify-between content-center m-5">
                    <div className="">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-4xl font-semibold mr-">
                                {dataBattlestation && dataBattlestation.name}
                            </h2>
                            
                            {dataBattlestation?.instagram_url &&
                                <a className="link text-primary hover:text-primary-focus" href={`https://${dataBattlestation?.instagram_url}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 " viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <title>View user on Instagram</title>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <rect x="4" y="4" width="16" height="16" rx="4" />
                                        <circle cx="12" cy="12" r="3" />
                                        <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
                                    </svg>
                                </a>
                            }
                            
                            {dataBattlestation?.reddit_url &&
                                <a className="link text-primary hover:text-primary-focus"  href={`https://${dataBattlestation?.reddit_url}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 " viewBox="-1 -1 25 26" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <title>Go to Reddit post</title>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z" />
                                        <path d="M12 8l1 -5l6 1" />
                                        <circle cx="19" cy="4" r="1" />
                                        <circle cx="9" cy="13" r=".5" fill="currentColor" />
                                        <circle cx="15" cy="13" r=".5" fill="currentColor" />
                                        <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
                                    </svg>
                                </a>
                            }
                        </div>
                        
                        <p className="">
                            <span className="opacity-75 font-thin">By: </span><span className="opacity-75 font-thin">{dataBattlestation?.username}</span>
                        </p>
                        
                        {dataBattlestation &&
                            <p className="opacity-75 font-thin" 
                            title={new Date(dataBattlestation.created_date + "-07:00").toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}>
                                {`Uploaded: ${formatDate(dataBattlestation.created_date)}`}
                            </p>
                        }

                        <FavoriteButton
                            id={stationId!}
                            isFavorited={dataBattlestation!.is_favorited}
                            favoriteCount={dataBattlestation!.favorites}
                        />
                    </div>

                    {(authState.user && (dataBattlestation?.user_id === authState.user.uid)) &&
                    <div className="self-start">
                        <Link to="./edit" className="btn btn-sm btn-outline btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary/75" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1="16" y1="5" x2="19" y2="8" />
                            </svg>
                            Edit Battlestation
                        </Link>
                    </div>}
                </div>

                <div className="flex flex-row items-center px-5 py-2 bg-base-300">
                    {dataBattlestation?.images ? 
                        <ImageGallery
                            gallery={dataBattlestation!.images}
                            battlestationName={dataBattlestation!.name}
                        />
                    :
                        <div className="flex-1 flex flex-col items-center p-5 opacity-75 ">
                            <GalleryPlaceholder className="h-48" />
                            <p className="text-xl text-center">This battlestation doesn't have any photos yet.</p>
                        </div>
                    }
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-20 m-5">
                    
                    <div className="flex-1 w-full">
                        <h3 className="text-3xl font-semibold">Part List</h3>
                        <table className="table table-normal md:mt-5 w-full">
                            <thead className="sr-only">
                                <tr>
                                    <th>Category</th>
                                    <th>Name</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataBattlestation && Object.keys(dataBattlestation.parts).length > 0 ?
                                    Object.entries(dataBattlestation.parts).map(([part_id, part], index) =>
                                        <PartListEntry
                                            key={index + part.name}
                                            id={part.part_id}
                                            type={part.type_name}
                                            name={part.name}
                                        />
                                    )
                                :
                                    <tr className="grid grid-cols-[auto_max-content] md:table-row">
                                        <td colSpan={3}
                                            className="col-start-1 row-start-1 col-span-2 row-span-1 pb-1 px-0 !rounded-bl-none 
                                            md:table-cell md:w-1 md:py-0">
                                                This battlestation has no parts listed.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-3xl font-semibold">Description</h3>
                        <p className="mt-5">
                            {dataBattlestation?.description ? 
                            dataBattlestation.description : 
                            "This battlestation has no description provided."}
                        </p>
                    </div>
                </div>
            </div>
            } 
        </>
	);
}

export default BattlestationView;