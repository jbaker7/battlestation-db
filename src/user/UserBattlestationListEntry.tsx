import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useFloating, useListNavigation, useDismiss, autoPlacement, useInteractions, useClick} from '@floating-ui/react-dom-interactions';
import {IUserBattlestationSummary} from './apiQueries';

interface Props {
    battlestation: IUserBattlestationSummary
    deleteFunction: Function
    selectFunction: Function
    openPartListFunction: Function
}

function UserBattlestationListEntry({battlestation, deleteFunction, selectFunction, openPartListFunction}: Props) {
    const [open, setOpen] = useState(false);

    const {context, x, y, reference, floating, strategy} = useFloating({
        open,
        onOpenChange: setOpen,
        middleware: [autoPlacement({alignment: 'end', autoAlignment: true,})]
    });

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
        useListNavigation(context),
        useDismiss(context),
        useClick(context),
    ]);

    return (

        <tr className="hover group grid grid-cols-[max-content_auto_max-content_max-content] grid-rows-3 w-full md:table-row">
            <td className="pl-3 md:pr-3 md:w-1 flex items-center md:table-cell col-start-1 row-start-1 col-span-1 row-span-3 border-b border-base-content/10
            md:table-cell md:border-0">
                {battlestation.is_public === 0 ?
                <svg xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mx-auto opacity-75 inline" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <title>Visibility: Private</title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="3" y1="3" x2="21" y2="21" />
                    <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                    <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto opacity-75 text-primary inline" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <title>Visibility: Public</title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="2" />
                    <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                </svg>
                }
            </td>
            <td className="pl-3 md:pl-0 w-auto col-start-2 row-start-1 col-span-1 row-span-3 border-b border-base-content/10
            flex items-center md:table-cell md:border-0">
                <div className="flex items-center space-x-3">
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
                    <div>
                        <div className="font-bold">
                            <Link className="link link-hover" to={`/battlestations/${battlestation.battlestation_id}`}>{battlestation.name}</Link>
                        </div>
                    </div>
                </div>
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
            <td className="md:w-1 pr-5 text-right col-start-3 row-start-2 col-span-1 row-span-1">
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
            <td className="md:w-1 pr-5 text-right col-start-3 row-start-3 col-span-1 row-span-1 md:border-0 border-b border-base-content/10">
                <svg xmlns="http://www.w3.org/2000/svg" className={`md:hidden inline h-5 w-5 mr-1 my-auto`} viewBox="0 0 24 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="align-middle">{battlestation.favorites}</span>
            </td>
            <td className="md:w-1 flex md:table-cell col-start-4 row-start-1 col-span-1 row-span-3 md:border-0 border-b border-base-content/10">
                <div className="flex justify-center items-center">
                    <Link to={`/battlestations/${battlestation.battlestation_id}/edit`} className="btn btn-outline btn-primary btn-sm md:mr-4">Edit</Link>

                    <button ref={reference} {...getReferenceProps()}
                    className="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-3" viewBox="9 0 7 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                            <circle cx="12" cy="5" r="1" />
                        </svg>
                    </button>
                    {open && (<div
                    ref={floating}
                        style={{
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                            width: 'max-content',
                        }}
                        {...getFloatingProps()}
                    >
                        <ul 
                           className="p-1 border border-secondary/50 shadow bg-base-300 rounded-xl">
                            <li {...getItemProps()}>
                                <button className="flex flex-row w-full items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-neutral-focus"
                                onClick={(e) => {selectFunction(battlestation.battlestation_id); openPartListFunction(true)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <polyline points="7 8 3 12 7 16" />
                                        <polyline points="17 8 21 12 17 16" />
                                        <line x1="14" y1="4" x2="10" y2="20" />
                                    </svg>
                                    Copy Part List
                                </button>
                            </li>
                            <li {...getItemProps()}>
                                <button className="flex flex-row w-full items-center px-3 py-2 rounded-lg hover:bg-neutral-focus"
                                onClick={(e) => {e.stopPropagation(); deleteFunction(battlestation)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <line x1="4" y1="7" x2="20" y2="7" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
                                    Delete Battlestation
                                </button>
                            </li>
                        </ul>
                    </div>)}
                        
                </div>
            </td>
        </tr>
    )
}

export default UserBattlestationListEntry;