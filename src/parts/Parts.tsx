import React, {useEffect, useState, useLayoutEffect} from 'react';
import {NavLink, useParams, useNavigate} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import {getPartTypes, getAllParts, IPart, IPartTypes} from './apiQueries';
import PartCard from './PartCard';
import PartCardSkeleton from './PartCardSkeleton';
import {useQueryParams, StringParam, NumberParam, withDefault} from 'use-query-params';

import SEOTags from "../components/SEOTags";

function Parts() {

    let {partType} = useParams();
    let navigate = useNavigate();
    const [tempSearchTerm, setTempSearchTerm] = useState("");

    const [query, setQuery] = useQueryParams({
        pageNumber: withDefault(NumberParam, 1),
        resultsPerPage: withDefault(NumberParam, 12),
        sortBy: withDefault(StringParam, "name"),
        direction: withDefault(StringParam, "asc"),
        searchTerm: withDefault(StringParam, undefined)
    });

    const [totalPages, setTotalPages] = useState<number>(1);
    const {data: dataPartTypes, error: errorPartTypes, isLoading: isLoadingPartTypes} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes, {staleTime: (1000 * 60 * 60 * 24)});
    const {data: dataParts, error: errorParts, isLoading: isLoadingParts} = useQuery<{total: number, parts: IPart[]}>(['parts', {...query, partType: partType}], () => getAllParts({...query, partType: partType}));
    
    useEffect(() => {
        if (dataParts) {
            setTotalPages(Math.ceil(dataParts.total / query.resultsPerPage));
        }
    }, [dataParts, query.resultsPerPage])

    useLayoutEffect(() => {
        document.getElementById('logo')?.scrollIntoView({ behavior: 'smooth' });
    }, [query.pageNumber])

    useEffect(() => {
        // If user tries to navigate to invalid category, reroute them back to the main page.
        if (dataPartTypes && partType) {
            if(!dataPartTypes.some(partTypeEl => partTypeEl.type_path === partType)) {
                navigate("../parts", {replace: true});
            }
        }
    }, [partType, dataPartTypes])

    function handleButtonPageChange(direction: string) {
        if(direction === "prev") {
            if(query.pageNumber && query.pageNumber > 1) {
                setQuery({...query, pageNumber: query.pageNumber - 1})
            }
        }
        if(direction === "next") {
            if(query.pageNumber && query.pageNumber < totalPages) {
                setQuery({...query, pageNumber: query.pageNumber + 1})
            }
        }
    }

    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let value = e.target.value;
        
        if(e.target.id === "sortSelect") {
            setQuery({...query, sortBy: value})
        }
        if(e.target.id === "resultsPerPageSelect") {
            setQuery({...query, pageNumber: 1, resultsPerPage: parseInt(value)})
        }
    }

    function handleSortDirectionChange(e: React.MouseEvent<HTMLButtonElement>) {
        if (query.direction === "asc") {
            setQuery({...query, direction: "desc"})
        }
        else {
            setQuery({...query, direction: "asc"})
        }
    }

    function handleSearchInput(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			setQuery({...query, searchTerm: tempSearchTerm})
		}
	}

    function getPartName(): string {
        let partTypeName: string = "";
        if (dataPartTypes) {
            let el = dataPartTypes.find(el => el.type_path === partType);
            partTypeName = el ? el.type_name : "";
        }
        return partTypeName;
    }

    function getPages() {

        let tempPageArray: {page: number, status: string}[] = [];
        let current = query.pageNumber;

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

        <div className="flex flex-col flex-1">

            <SEOTags
                title={`Browse ${partType ? getPartName() : "Parts"}`}
                description={`BattlestationDB - Find the best ${partType ? getPartName() === "Other" ? "parts" : getPartName() : "parts"} to create the ultimate setup for gaming, work-from-home or productivity.`}
                url={`https://www.battlestationdb.com/parts`}
            />

			<div className="flex flex-col gap-4 md:flex-row justify-between md:items-end p-5 border-b border-neutral-content/25">
				<h2 className="text-4xl font-semibold" id="page-header">{partType ? getPartName() : "All"}</h2>
				<div className="relative sm:w-72">
                    <input className="flex-1 input input-bordered bg-base-300 text-base placeholder:text-base-content w-full sm:max-w-xs" type="text" placeholder={`Search ${partType ? getPartName() : "All Parts"}`} 
                    onChange={(e) => setTempSearchTerm(e.currentTarget.value)}
					onKeyPress={handleSearchInput} />
                    <button type="submit" className="absolute right-0 top-0 mt-4 mr-4"
                    onClick={() => setQuery({...query, searchTerm: tempSearchTerm})} >
                        <svg className="text-base-content h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966"  xmlSpace="preserve"
                            width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
			</div>

            <div className="flex flex-row flex-1">
                <div className="hidden md:block border-base-300 bg-base-200">
                    <ul className="my-1 px-1 w-56">
                        <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                        after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0" >
                            <NavLink
                            className={({isActive}) => isActive ? "block py-3 px-7 outline outline-primary/25 rounded-md font-semibold bg-neutral-content/5" : "block py-3 px-7 rounded-md"}
                             to={`../parts/`}>All</NavLink>
                        </li>
                        {dataPartTypes ? dataPartTypes.map((partType, index) =>{
                            return <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                            after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0" key={`${partType}${index}`}>
                            <NavLink
                            className={({isActive}) => isActive ? "block py-3 px-7 outline outline-primary/25 rounded-md font-semibold bg-neutral-content/10" : "block py-3 px-7 rounded-md"}
                             to={`../parts/${partType.type_path}`}>{partType.type_name}</NavLink></li>})
                            : isLoadingPartTypes ? <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                            after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0">Loading...</li>
                            : errorPartTypes ? <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                            after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0">Unable to load part categories.</li>
                            : <li></li>
                        }
                    </ul>
                </div>

                <div className="flex flex-col flex-1 p-5 mr-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
                        <p className="text-lg font-light pl-2 mr-auto mb-3 sm:mb-0">
                            {`${dataParts ? `Browsing ${dataParts.total} Parts` : ``}`}
                        </p>
                        
                        <div className="flex justify-between sm:justify-end">
                            <div className="flex flex-col sm:flex-row">
                                
                                <label className="label mr-2 ml-0">
                                    <span className="label-text min-w-max">Sort By:</span>
                                </label>
                                <div className="flex">
                                <select onChange={e => handleSelectChange(e)} id="sortSelect" value={query.sortBy} 
                                className="flex-1 select select-bordered bg-base-300 text-base font-normal  rounded-r-none">
                                    <option value="name">Name</option>
                                    <option value="battlestation_count">Most Popular</option>
                                </select>
                                <button onClick={(e) => handleSortDirectionChange(e)}
                                className="border border-base-content/25 border-l-0 rounded-l-none bg-base-300 rounded-lg py-2 px-3 hover:bg-neutral/50 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${query.direction !== "asc" && 'rotate-180'}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <line x1="4" y1="6" x2="11" y2="6" />
                                        <line x1="4" y1="12" x2="11" y2="12" />
                                        <line x1="4" y1="18" x2="13" y2="18" />
                                        <polyline points="15 9 18 6 21 9" />
                                        <line x1="18" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <label className="label ml-4 sm:mr-2">
                                    <span className="label-text min-w-max">Per Page:</span>
                                </label>
                                <select onChange={e => handleSelectChange(e)} id="resultsPerPageSelect" value={query.resultsPerPage} 
                                className="flex-1 select select-bordered max-w-fit bg-base-300 text-base font-normal">
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={48}>48</option>
                                    <option value={96}>96</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap gap-6">
                        <>
                            {isLoadingParts ? <PartCardSkeleton count={4} /> : 
                                (dataParts && dataParts.parts.length > 0) ? dataParts.parts.map(part => 
                                    <PartCard 
                                        key={part.part_id}
                                        name={part.name}
                                        id={part.part_id}
                                        image={part.image}
                                        battlestationCount={part.battlestation_count}
                                    />
                                )
                            :
                                dataParts && 
                                <div className="flex w-full mx-auto items-center p-4 gap-2 rounded-lg border border-secondary font-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-secondary flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Sorry, no parts found that match your search.</span>
                                </div>
                            }
                            {errorParts &&
                                <div className="flex w-full mx-auto items-center p-4 gap-2 rounded-lg border border-error font-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Sorry, we were unable to load any parts. Please try again later.</span>
                                </div>
                            }
                        </>
                    </div>

                    {(dataParts && dataParts.parts.length > 0) &&
                        <div className="btn-group gap-[2px] mt-6 self-center">
                            <button className="btn text-base-content"
                            onClick={() => handleButtonPageChange("prev")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <polyline points="15 6 9 12 15 18" />
                                </svg>
                            </button>
                            {getPages().map((page, index) => {
                                
                                if(page.page === 0) {
                                    return <button  key={`${page.page}${index}`}
                                    className={`btn text-base-content btn-disabled`}>...</button>
                                }
                                else {
                                    return <button key={`${page.page}${index}`} onClick={() => setQuery({...query, pageNumber: page.page})} 
                                    className={`btn text-base-content ${page.status === "active" && `btn-active`}`}>{page.page}</button>
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
                    }
                </div>
            </div>
        </div>
	);
}

export default Parts;