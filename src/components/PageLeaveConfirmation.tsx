import React from 'react';
import {ReactComponent as LoadingCircles} from './loading-circles.svg';

interface ConfirmationProps {
    link: string
    closeFunction: Function
    continueFunction: Function
}

function PageLeaveConfirmation({link, closeFunction, continueFunction}: ConfirmationProps) {

    return (
        <div className="flex flex-col bg-base-200 items-center p-6 rounded-xl shadow-xl border border-neutral-focus">
            
            
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-error" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentCOlor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
            
            
            <p className="font-bold text-3xl mt-2 mb-6">Heads Up</p>
                
            <p className=" text-lg">
                You have unsaved changes. Are you sure you want to leave?
            </p>       
            
           
                <div className="flex gap-4 mt-6">
                    <button
                    onClick={() => closeFunction()} 
                    className="btn btn-outline btn-success flex-1 duration-75">
                        Cancel
                    </button>
                    <button
                    onClick={() => continueFunction()} 
                    className="btn btn-ghost hover:btn-success flex-1 duration-75">
                        Leave
                    </button>
                    
                    <a
                    href={link}
                    className="btn btn-outline btn-error flex-1 duration-75">
                        Open in New Tab
                    </a>
                </div>
            
        </div>
    )
}

export default PageLeaveConfirmation;