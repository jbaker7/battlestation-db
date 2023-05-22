import React from 'react';
import {IPart} from './apiQueries';

interface Props {
    part: IPart
    clickFunction: Function
    deleteFunction: Function
};

function AdminPartListEntry({part, clickFunction, deleteFunction}: Props) {

  return (
	
        <tr className="table-row hover group cursor-pointer" onClick={() => {clickFunction(part)}}>
            <td className="px-4">
                <span className="text-accent">{part.name}</span>
                <br />
                {
                    part.stores.map(store =>
                        <span className="badge badge-sm" key={store.store_name}>{store.store_name}</span>
                    )
                }
                
            </td>
            <td className="w-1 text-right pl-4">{part.battlestation_count}</td>

            <td className="w-1 text-right pr-4 ">

                <button title="Edit" className="p-1 mr-1 rounded-lg text-neutral-content invisible hover:bg-neutral-focus/50 hover:text-secondary group-hover:visible"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                        <line x1="16" y1="5" x2="19" y2="8" />
                    </svg>
                </button>

                <button onClick={(e) => {e.stopPropagation(); deleteFunction(part)}} title="Delete" className="p-1 rounded-lg text-neutral-content invisible hover:bg-neutral-focus/50 hover:text-error group-hover:visible">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </td>
        </tr>

	);
}

export default AdminPartListEntry;