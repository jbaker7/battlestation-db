import React from 'react';
import {Link} from "react-router-dom";
import {timeAgo} from './dateFormatter';

interface Props {
    id: number
    name: string
    username: string
    createdDate: string
    partCount: number
    imageCount: number
    thumbnail: string
    favorites: number
}

function BattlestationCard({id, name, username, createdDate, partCount, imageCount, thumbnail, favorites}: Props) {

    return (
        
        <Link to={`./${id}`} className="group grid grid-cols-1 grid-rows-1 aspect-[4/3] rounded-lg overflow-hidden lg:w-[calc(25%-1.25rem)] md:w-[calc(33%-1rem)] sm:w-[calc(50%-0.75rem)] w-[calc(100%)] bg-base-100 drop-shadow-lg">
            <div className="row-start-1 col-start-1 row-end-1 col-end-3 flex justify-center items-center">
                <img className="object-cover object-center h-full w-full" 
                    src={process.env.REACT_APP_S3_BATTLESTATION_IMAGES + 
                        thumbnail.slice(0, thumbnail.lastIndexOf(".")) + 
                        "_thumb" + thumbnail.slice(thumbnail.lastIndexOf("."))}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src="/images/file-not-found.svg";
                        e.currentTarget.className="h-16 w-16";
                        e.currentTarget.onerror = null;
                    }}
                    alt={`${name} thumbnail`}
                />
            </div>

            <div className="grid grid-rows-[min-content_auto_min-content] row-start-1 col-start-1 overflow-hidden">
                <div className="row-start-1 col-start-1 px-2 py-1 transition-all duration-300 bg-base-300/75 backdrop-blur-md opacity-100 md:opacity-0  group-hover:opacity-100 ">
                    <div className="text-md">{name}</div>
                    <div className="font-light text-md">by: {username}</div>
                </div>
                
                <div className="flex flex-row justify-evenly row-start-3 col-start-1 py-2 px-0 transition-all duration-300 bg-base-300/75 backdrop-blur-md opacity-100 md:opacity-0  group-hover:opacity-100">
                    <div className="flex flex-row items-center" title={`${imageCount} ${imageCount === 1 ? 'picture' : 'pictures'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0.5" viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
                        </svg>
                        <span className="font-light text-sm">{imageCount}</span>
                    </div>

                    <div className="flex flex-row items-center" title={`${partCount} ${partCount === 1 ? 'part' : 'parts'} listed`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0.5" viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M10 15h-6a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h6" />
                            <rect x="13" y="4" width="8" height="16" rx="1" />
                            <line x1="7" y1="19" x2="10" y2="19" />
                            <line x1="17" y1="8" x2="17" y2="8.01" />
                            <circle cx="17" cy="16" r="1" />
                            <line x1="9" y1="15" x2="9" y2="19" />
                        </svg>
                        <span className="font-light text-sm">{partCount}</span>
                    </div>

                    <div className="flex flex-row items-center" title={`${favorites} ${favorites === 1 ? 'favorite' : 'favorites'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0.5" viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-light text-sm">{favorites}</span>
                    </div>

                    <div className="font-light text-sm">{timeAgo(createdDate)}</div>
                </div>
            </div>
        </Link>
	);
}

export default BattlestationCard;