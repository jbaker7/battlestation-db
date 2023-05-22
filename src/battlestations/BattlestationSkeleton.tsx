import React from 'react';
import Skeleton from '../components/Skeleton';

function BattlestationSkeleton() {

    return (
           
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-start gap-2 my-5 px-5">
                <Skeleton className="text-6xl" />
                <Skeleton className="text-md" width="44"/>
                <Skeleton className="text-md" width="44"/>
            </div>

            <div className="flex flex-row justify-center items-center gap-4 px-5 pb-2 ">
                <Skeleton count={3} className="aspect-[4/3]" width="1/4" />
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-20 m-5">
                
                <div className="flex flex-col flex-1 w-full">
                    <Skeleton className="text-4xl mb-5" />
                    
                    <div className="flex flex-row gap-2 mb-2">
                        <Skeleton count={1} className="text-lg" width="44" />
                        <Skeleton count={1} className="text-lg"  />
                    </div>

                    <div className="flex flex-row gap-2 mb-2">
                        <Skeleton count={1} className="text-lg" width="44" />
                        <Skeleton count={1} className="text-lg"  />
                    </div>

                    <div className="flex flex-row gap-2 mb-2">
                        <Skeleton count={1} className="text-lg" width="44" />
                        <Skeleton count={1} className="text-lg"  />
                    </div>

                </div>

                <div className="flex flex-col flex-1">
                    <Skeleton className="text-4xl mb-5" />
                    <Skeleton className="text-lg mb-2 w-4/5" width="full"/>
                    <Skeleton className="text-lg mb-2 w-2/4" width="2/4"/>
                    <Skeleton className="text-lg mb-2 w-3/4" width="3/4"/>
                </div>
            </div>
        </div>
	);
}

export default BattlestationSkeleton;