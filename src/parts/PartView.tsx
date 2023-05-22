import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import {getPartTypes, getOnePart, IPartTypes, IPart} from './apiQueries';
import Skeleton from '../components/Skeleton';
import PartBattlestations from './PartBattlestations';
import PartError from './PartError';
import SEOTags from "../components/SEOTags";

function PartView() {

    let {partId} = useParams();

    const {data: dataPartTypes} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes, {staleTime: (1000 * 60 * 60 * 24)});
    const {data: dataPart, isError: isErrorPart, isLoading: isLoadingPart} = useQuery<IPart>(['part', partId], () => getOnePart(partId!));
    
    const [partTypeName, setPartTypeName] = useState<string | null>(null)
    const [partTypePath, setPartTypePath] = useState<string | null>(null)
    const [partImageLoaded, setPartImageLoaded] = useState(false)

    useEffect(() => {
        let tempPartTypeName: string | null = null;
        let tempPartTypePath: string | null = null;
        if (dataPart && dataPartTypes) {
          let el = dataPartTypes.find(el => el.type_id === dataPart?.type_id);
          tempPartTypeName = el ? el.type_name : null;
          tempPartTypePath = el ? el.type_path : null;
        }
       
        setPartTypeName(tempPartTypeName);
        setPartTypePath(tempPartTypePath);
    }, [dataPart, dataPartTypes])

    return (
        <div className="flex flex-col flex-1 gap-4 p-5">

            <SEOTags
                title={dataPart ? dataPart.name : undefined}
                description={`BattlestationDB - Explore amazing setups${dataPart ? " that use " + dataPart.name : ""}.`}
                url={`https://www.battlestationdb.com/parts/view/${partId}`}
            />

            <div className="text-sm breadcrumbs">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/parts">Parts</Link></li>
                    <li><Link to={`/parts/${partTypePath}`}>{partTypeName}</Link></li>
                </ul>
            </div>
            {isErrorPart ?  
            <PartError /> :
            <>
            <div className="flex flex-col-reverse sm:flex-row gap-8">
                <div className={`flex justify-center align-center w-[80%] sm:w-44 sm:h-44 mx-auto sm:mx-none border border-base-300 aspect-square ${isLoadingPart ? "bg-base-200" : "bg-white"} leading-none rounded-lg`}>
                    {isLoadingPart ? <Skeleton className="aspect-square" /> :
                    <>
                        {dataPart && <img className="object-contain p-1 aspect-square rounded-md" 
                            style={partImageLoaded ? {} : {display: 'none'}}
                            onLoad={() => setPartImageLoaded(true)}
                            src={process.env.REACT_APP_S3_PART_IMAGES + dataPart?.image} 
                            alt={dataPart?.name}
                        />}
                        
                        {!partImageLoaded && 
                            <svg xmlns="http://www.w3.org/2000/svg" className="aspect-[4/3] w-full text-base-content" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <line x1="15" y1="8" x2="15.01" y2="8" />
                                <rect x="4" y="4" width="16" height="16" rx="3" />
                                <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
                                <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
                            </svg>
                        }
                    </>
                    }
                </div>
                <div className="flex flex-1 flex-col">
                    <h2 className="text-2xl font-medium">
                        {isLoadingPart ? <Skeleton /> : dataPart?.name}
                    </h2>
          
                        <div className="flex items-center font-light my-2">
                        {isLoadingPart ? <Skeleton width="40" /> : 
                            <div className="flex flex-row">
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 mr-1 text-base-content/90" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <rect x="3" y="4" width="18" height="12" rx="1" />
                                    <line x1="7" y1="20" x2="17" y2="20" />
                                    <line x1="9" y1="16" x2="9" y2="20" />
                                    <line x1="15" y1="16" x2="15" y2="20" />
                                </svg>
                                <span className="text-base-content/75 leading-tight">
                                    {`${dataPart?.battlestation_count} ${dataPart?.battlestation_count === 1 ? "Battlestation" : "Battlestations"}`}
                                </span>
                            </div>
                        }
                    </div>  
                       
                    
                    <h2 className="text-lg mt-auto py-1">
                    {isLoadingPart ? <Skeleton width="24" /> : "Where to Buy"}</h2>
                
                    <div className="flex gap-4 py-1">
                    {isLoadingPart ? <Skeleton width="20" /> : (dataPart?.manufacturer_url &&
                        <a className="flex items-center w-max gap-1 py-1 px-3 text-primary bg-neutral-focus hover:bg-neutral rounded-lg" 
                        href={dataPart.manufacturer_url}>
                            {dataPart.manufacturer}
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#666666" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                                <line x1="10" y1="14" x2="20" y2="4" />
                                <polyline points="15 4 20 4 20 9" />
                            </svg>
                        </a>)}
                        {isLoadingPart ? <Skeleton count={2} width="20" /> : (dataPart?.stores?.map(store => 
                            <a className="flex items-center w-max gap-1 py-1 px-3 text-primary bg-neutral-focus hover:bg-neutral rounded-lg" 
                            href={store.url}
                            key={store.store_id}>
                                {store.store_name}
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#666666" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                                    <line x1="10" y1="14" x2="20" y2="4" />
                                    <polyline points="15 4 20 4 20 9" />
                                </svg>
                            </a>
                        ))}            
                    </div>
                
                </div>
           
            </div>
              
            <PartBattlestations part_id={partId!} />
            </>
        }  
                
        </div>
    )
}

export default PartView;