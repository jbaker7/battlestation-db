import React from 'react';

interface Props {
    loadingText: string
    successfulText: string
    errorText: string
    errorDetails: string
    isError: boolean
    isSuccessful: boolean
    closeFunction: Function
}

function LoadingModal({loadingText, successfulText, errorText, errorDetails, isError, isSuccessful, closeFunction}: Props) {


    return (
        <div className="flex flex-col items-center border border-base-100 py-5 px-8 gap-5 rounded-xl bg-base-300">

            <svg id="loading-hex" 
            className={`${(!isError && !isSuccessful) && "hex-animation"} ${isError ? "text-error" : "text-primary"}`}
            stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" width="100px" height="100px" viewBox="-16 -16 332 332" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="glow" x="-25%" y="-25%" height="150%" width="150%">
                        <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="8" in="SourceGraphic"></feGaussianBlur>
                    </filter>
                </defs>
                <polygon fill="none" points="300,150 225,280 75,280 0,150 75,20 225,20" ></polygon>
                <path className={`${isSuccessful ? "visible" : "hidden"}`} fill="none" d="M 92.659 149.999 L 130.886 188.226 L 207.34 111.774"></path>
                <path className={`${isError ? "visible" : "hidden"}`} fill="none" d="M 151.167 148.303 L 150.915 90.824"></path>
                <ellipse className={`${isError ? "visible" : "hidden"}`} fill="currentColor" cx="150" cy="205.856" rx="2" ry="2"></ellipse>
                <g style={{filter: "url('#glow')"}} filter="url(#glow);">
                    <polygon fill="none" points="300 150 225 280 75 280 0 150 75 20 225 20" ></polygon>
                    <path className={`${isSuccessful ? "visible" : "hidden"}`} fill="none" d="M 92.659 149.999 L 130.886 188.226 L 207.34 111.774"></path>
                    <path className={`${isError ? "visible" : "hidden"}`} fill="none" d="M 150.126 148.177 L 149.874 90.698"></path>
                    <ellipse className={`${isError ? "visible" : "hidden"}`} fill="currentColor" cx="150" cy="205.983" rx="3" ry="3"></ellipse>
                </g>
            </svg>

            <div className="text-2xl text-base-content">
                {isError ? errorText :
                    isSuccessful ? successfulText :
                        loadingText}
            </div>
            
            {isError && <div className="px-4 py-2 border border-error rounded-lg">
                {errorDetails}
            </div>}

            <button className={`btn  ${isError ? "btn-error" : isSuccessful ? "btn-primary" : "hidden"}`}
            onClick={() => closeFunction(false)}>
                Close
            </button>

        </div>
    
    )
}

export default LoadingModal;