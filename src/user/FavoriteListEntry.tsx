import React from 'react';
import {Link} from "react-router-dom";
import {IBattlestationSummary} from '../battlestations/apiQueries';

// interface Props {
//     id: number
//     name: string
//     thumbnail: string
//     imageCount: number
//     partCount: number
//     isPublic: number
//     favorites: number
//     deleteFunction: Function
// }

interface Props {
    battlestation: IBattlestationSummary
}

function FavoriteListEntry({battlestation}: Props) {

    return (

        <tr className="hover group grid grid-cols-[max-content_auto_max-content] grid-rows-1 w-full md:table-row">
            
            <td className="px-3 flex items-center md:w-1 col-start-1 row-start-1 col-span-1 row-span-2 border-b border-base-content/10
            md:table-cell md:border-0">
                <div className="rounded-lg overflow-hidden w-12 h-12">
                    <img className="object-cover object-center h-full w-full" 
                        src={process.env.REACT_APP_S3_BATTLESTATION_IMAGES + 
                            battlestation.thumbnail.slice(0, battlestation.thumbnail.lastIndexOf(".")) + 
                            "_thumb" + battlestation.thumbnail.slice(battlestation.thumbnail.lastIndexOf("."))}
                        onError={(e) => {
                            e.currentTarget.src="../images/file-not-found.svg";
                            e.currentTarget.className="h-12 w-12";
                        }}
                        alt={`${battlestation.name} thumbnail`} 
                    />
                </div>
            </td>
            <td className="px-3 col-start-2 row-start-1 col-span-1 row-span-1 md:table-cell">
                <Link className="link link-hover text-lg md:text-base font-bold" to={`/battlestations/${battlestation.battlestation_id}`}>
                    {battlestation.name}
                </Link> 
            </td>
            <td className="px-3 md:w-1 col-start-2 row-start-2 col-span-1 row-span-1 border-b border-base-content/10
            md:table-cell text-base-content/75 md:text-base-content md:border-0">
                {battlestation.username}
            </td>
            <td className="md:w-1 pr-5 text-right col-start-3 row-start-1 col-span-1 row-span-1">
                <svg xmlns="http://www.w3.org/2000/svg" className={`md:hidden inline h-5 w-5 mr-1 my-auto`} viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="15" y1="8" x2="15.01" y2="8" />
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
                    <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
                </svg>
                <span className="align-middle">{battlestation.image_count}</span>
            </td>
            <td className="md:w-1 pr-5 text-right col-start-3 row-start-2 col-span-1 row-span-1 border-b border-base-content/10
            md:border-0">
                <svg xmlns="http://www.w3.org/2000/svg" className={`md:hidden inline h-5 w-5 mr-1 my-auto`} viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 15h-6a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h6" />
                    <rect x="13" y="4" width="8" height="16" rx="1" />
                    <line x1="7" y1="19" x2="10" y2="19" />
                    <line x1="17" y1="8" x2="17" y2="8.01" />
                    <circle cx="17" cy="16" r="1" />
                    <line x1="9" y1="15" x2="9" y2="19" />
                </svg>
                <span className="align-middle">{battlestation.part_count}</span>
            </td>
            
        </tr>
    )
}

export default FavoriteListEntry;