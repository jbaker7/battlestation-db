import React from 'react';

interface Props {
    children: React.ReactNode
}


function FormErrorTag({children}: Props) {

    return (
        <div className="relative ml-3 mr-auto">
            <div className="absolute -ml-[11px] w-3 top-1/2 -translate-y-1/2 inline-block overflow-hidden"> 
                <div className="h-3 w-3 ml-2 origin-center -rotate-45 transform border border-error bg-error-bg"></div>
            </div>

            <div className="flex flex-col md:whitespace-nowrap text-base-content/90 rounded-md border border-error bg-error-bg text-sm px-2 py-1">
            {children}
            </div>
        </div>
    )
}

export default FormErrorTag;