import React from 'react';

interface Props {
    count?: number
    width?: string
    height?: string
    className?: string
}

function Skeleton({count = 1, width = "full", className = "", height = "full"}: Props) {

    var skeletons = [];
    var length = count;
    
    for(let i = 0; i < length; i++) {
        skeletons.push(i);
    }

    return (
        <>
            {skeletons.map((skeleton, index) => 
                <div key={skeleton} className={`${className} skeleton select-none h-${height} w-${width} rounded-md`}>
                    &nbsp;
                </div>
            )}
        </>
    )
}

export default Skeleton;