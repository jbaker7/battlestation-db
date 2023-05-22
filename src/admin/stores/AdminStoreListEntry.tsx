import React from 'react';
import {IStore} from './apiQueries';

interface Props {
    store: IStore
    clickFunction: Function
    deleteFunction: Function
};

function AdminStoreListEntry({store, clickFunction, deleteFunction}: Props) {

    return (
        <tr className="table-row hover group cursor-pointer" onClick={() => {clickFunction(store)}}>
            <td className="px-4 w-1/4 max-w-min font- text-base">
                {store.name}
            </td>
            <td className="px-4">
                <a href={store.url} className="link link-hover link-accent">{store.url}</a>
            </td>
            <td className="w-1 text-right px-4">{store.part_count}</td>
            <td className="w-1 text-right pr-4 ">
                <button onClick={(e) => {e.stopPropagation(); deleteFunction(store)}} title="Delete" className="p-1 rounded-lg text-neutral-content invisible hover:bg-neutral-focus/50 hover:text-error group-hover:visible">
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

export default AdminStoreListEntry;