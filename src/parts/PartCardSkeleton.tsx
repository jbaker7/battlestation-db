import React from 'react';
import Skeleton from '../components/Skeleton';

interface Props {
    count?: number
}

function PartCardSkeleton({count = 1}: Props) {
    let skeletons = [];
    let length = count;
    
    for(let i = 0; i < length; i++) {
        skeletons.push(i);
    }

    return (
        <>
            {skeletons.map((skeleton, index) => 
                <div key={index} className="flex flex-col bg-base-100 rounded-lg transition-all
                lg:w-[calc(25%-1.2rem)] md:w-[calc(33%-1.2rem)] sm:w-[calc(33%-1.2rem)] w-[calc(50%-1.2rem)] overflow-hidden">
                
                    <Skeleton className="object-contain aspect-[4/3] h-44 mx-auto" />

                    <div className="flex flex-col flex-1 p-1">
                        <Skeleton className="text-lg  mb-2" />
                        <Skeleton className="text-lg  mb-2" />
                        <Skeleton className="text-base" width="12" />
                    </div>
                </div>
            )}
        </>
	);
}

export default PartCardSkeleton;