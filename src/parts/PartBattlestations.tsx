import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {IBattlestationSummary} from '../battlestations/apiQueries';
import {getAllBattlestationsByParts} from './apiQueries';
import {useQuery} from '@tanstack/react-query';
import BattlestationCard from '../battlestations/BattlestationCard';

interface Props {
    part_id: string
}

function PartBattlestations({part_id}: Props) {

    const [queryParams, setQueryParams] = useState({pageNumber: 1, partId: part_id});
    const [totalPages, setTotalPages] = useState<number>(1);

	const {data: dataBattlestations, error: errorBattlestations, isLoading: isLoadingBattlestations} = 
		useQuery<{total: number, battlestations: IBattlestationSummary[]}>(['battlestations', queryParams], () => getAllBattlestationsByParts(queryParams));
	

	useEffect(() => {
		if (dataBattlestations) {
			setTotalPages(Math.ceil(dataBattlestations.total / 10));
		}
    }, [dataBattlestations])

    function handleButtonPageChange(direction: string) {
        if(direction === "prev") {
            if(queryParams.pageNumber > 1) {
                setQueryParams({...queryParams, pageNumber: queryParams.pageNumber - 1})
            }
        }
        if(direction === "next") {
            if(queryParams.pageNumber < totalPages) {
                setQueryParams({...queryParams, pageNumber: queryParams.pageNumber + 1})
            }
        }
	}
	
	function getPages() {

        let tempPageArray: {page: number, status: string}[] = [];
        let current = queryParams.pageNumber;

        if (totalPages > 10) {
            if (current < 5) {
                for (let i = 1; i <= 5; i++) 
                    {
                        let status = i === current ? "active" : "";
                        tempPageArray.push({page: i, status: status});
                    }
                tempPageArray.push({page: 0, status: "disabled"})
                tempPageArray.push({page: totalPages, status: ""})
            }

            else if (current >= 5 && current <= totalPages - 5) {
                tempPageArray.push({page: 1, status: ""});
                tempPageArray.push({page: 0, status: "disabled"})
                for (let i = current - 2; i <= current + 2; i++) 
                    {
                        let status = i === current ? "active" : "";
                        tempPageArray.push({page: i, status: status});
                    }
                tempPageArray.push({page: 0, status: "disabled"})
                tempPageArray.push({page: totalPages, status: ""});
            }

            else if (current > totalPages - 5) {
                tempPageArray.push({page: 1, status: ""});
                tempPageArray.push({page: 0, status: "disabled"})
                for (let i = current - 2; i <= totalPages; i++) 
                    {
                        let status = i === current ? "active" : "";
                        tempPageArray.push({page: i, status: status});
                    }
            }
        }
        else {
            for (let i = 1; i <= totalPages; i++) 
                {
                    let status = i === current ? "active" : "";
                    tempPageArray.push({page: i, status: status});
                }
        }

        return tempPageArray;
    }

    return (
        
        <div className="mt-8">

            {(!isLoadingBattlestations && !errorBattlestations && dataBattlestations) ? 
                <>
                    {dataBattlestations.total === 0 ?
                        <h2 className="text-2xl my-4 font-light">Be the first to <Link className="link link-primary link-hover" to="../battlestations/new">use this in a battlestation</Link>.</h2>
                        :<h2 className="text-2xl my-4 font-light">Used In These Battlestations</h2>
                    }
                    <div className="flex flex-row flex-wrap justify-start gap-5 pl-5 py-0">
                        {dataBattlestations.battlestations.map(battlestation => 
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

                    {totalPages > 1 ?
                        <div className="btn-group gap-[2px] mt-6 self-center">
                            <button className="btn text-base-content"
                            onClick={() => handleButtonPageChange("prev")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <polyline points="15 6 9 12 15 18" />
                                </svg>
                            </button>
                            {getPages().map((page, index) => {
                                if(page.page !== 0) {
                                    return <button key={`${page.page}${index}`} onClick={() => setQueryParams({...queryParams, pageNumber: page.page})} 
                                    className={`btn text-base-content ${page.status === "active" && `btn-active`}`}>{page.page}</button>
                                }
                                else {
                                    return <button  key={`${page.page}${index}`}
                                    className={`btn text-base-content btn-disabled`}>...</button>
                                }
                            })}
                            <button className="btn text-base-content"
                            onClick={() => handleButtonPageChange("next")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <polyline points="9 6 15 12 9 18" />
                                </svg>
                            </button>
                        </div>
                    : null}
                </>
            : null}
        </div>
    )
}

export default PartBattlestations;