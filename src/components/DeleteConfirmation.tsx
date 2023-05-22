import React from 'react';
import {ReactComponent as LoadingCircles} from './loading-circles.svg';

interface ConfirmationProps {
    closeFunction: Function
    deleteFunction: Function
    itemName?: string
    status: string
}

function DeleteConfirmation({closeFunction, deleteFunction, itemName, status}: ConfirmationProps) {

    return (
        <div className="flex flex-col bg-base-200 items-center p-6 rounded-xl shadow-xl border border-neutral-focus">
            
            {status === "loading" ?
                <LoadingCircles className="h-20 w-20 text-error" />
                :
                status === "success" ?
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-success" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 12l2 2l4 -4" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-error" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
            }
            
            <p className="font-bold text-3xl mt-2 mb-6">{status === "success" ? "Deleted!" : "Confirm"}</p>
                
            {status === "success" ? 
                <div className="whitespace-pre-line text-lg">
                    {`${itemName} has been deleted.`}
                </div> 
                :
                <div className="whitespace-pre-line text-lg">
                    <p>{`Are you sure you want to delete ${itemName}?`}</p>
                    <p className="mt-1 text-center text-base uppercase font-semibold text-error/75">This can not be undone.</p>
                </div>
                }

            {status === "error" && 
                <div className="flex flex-row items-center px-4 py-2 border flex-1 border-error rounded-lg shadow-lg mt-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{`Unable to delete ${itemName}. Please try again later.`}</span>
                </div>
            }
            
            {status === "success" ?
                <div className="flex gap-4 mt-6">
                    <button
                    onClick={() => closeFunction()} 
                    className="btn btn-outline btn-success flex-1 duration-75">
                        Close
                    </button>
                </div>
                :
                <div className="flex gap-4 mt-6">
                    <button disabled={status === "loading"}
                    onClick={() => closeFunction()} 
                    className="btn btn-ghost hover:btn-success flex-1 duration-75">
                        Cancel
                    </button>
                    <button disabled={status === "loading"} 
                    onClick={() => deleteFunction()} 
                    className="btn btn-outline btn-error flex-1 duration-75">
                        Delete
                    </button>
                </div>
            }
        </div>
    )
}

export default DeleteConfirmation;