import React from 'react';
import BattlestationCard from './BattlestationCard';
import {useQuery} from '@tanstack/react-query';
import {getFeaturedBattlestations, IBattlestationSummary} from './apiQueries';

function FeaturedBattlestations() {

    const {data: dataFeaturedBattlestations} = 
		useQuery<IBattlestationSummary[]>(['featuredBattlestations'], () => getFeaturedBattlestations());
    
    return (
        <>
            {(dataFeaturedBattlestations && dataFeaturedBattlestations.length > 0) &&
                <div className="flex flex-col p-5 gap-5 items-center bg-base-200">
                    <h3 className="text-3xl font-semibold">Featured Battlestations</h3>
                    <div className="flex flex-row flex-wrap justify-between gap-5">
                        {dataFeaturedBattlestations && dataFeaturedBattlestations.map(battlestation =>
                            <BattlestationCard 
                                key={battlestation.battlestation_id}
                                name={battlestation.name}
                                username={battlestation.username}
                                id={battlestation.battlestation_id}
                                createdDate={battlestation.created_date}
                                imageCount={battlestation.image_count}
                                partCount={battlestation.part_count}
                                thumbnail={battlestation.thumbnail}
                                favorites={battlestation.favorites}
                            />
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default FeaturedBattlestations;