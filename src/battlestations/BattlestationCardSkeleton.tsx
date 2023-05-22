import React from 'react';
import Skeleton from '../components/Skeleton';

interface Props {
    count?: number
}

function BattlestationCardSkeleton({count = 1}: Props) {
    let skeletons = [];
    let length = count;
    
    for(let i = 0; i < length; i++) {
        skeletons.push(i);
    }

    return (
        <>
            {skeletons.map((skeleton, index) => 
                <div key={index} className="flex flex-col bg-base-100 rounded-lg transition-all
                lg:w-[calc(25%-1.25rem)] md:w-[calc(33%-1rem)] sm:w-[calc(50%-0.75rem)] w-[calc(100%)] overflow-hidden">
                
                    <Skeleton className="object-contain aspect-[4/3]" />

                    <div className="flex flex-col flex-1 p-2">
                        <Skeleton className="text-lg  mb-2" />
                    </div>
                </div>
            )}
        </>
	);
}

export default BattlestationCardSkeleton;