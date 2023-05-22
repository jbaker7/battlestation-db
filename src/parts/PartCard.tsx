import React, {useState} from 'react';
import {Link} from "react-router-dom";

interface Props {
    name: string
    id: number
    image: string
    battlestationCount: number
}

function PartCard({name, id, image, battlestationCount}: Props) {

    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        
        <div className="flex flex-col bg-base-100 border border-base-content/10 rounded-lg hover:shadow-xl  hover:border-primary-focus transition-all
        lg:w-[calc(25%-1.2rem)] md:w-[calc(33%-1rem)] sm:w-[calc(33%-1rem)] w-[calc(50%-1rem)] overflow-hidden">
            
            <Link className="flex bg-white p-1 aspect-[4/3]" to={`../parts/view/${id}`}>
                <img src={process.env.REACT_APP_S3_PART_IMAGES + 
                            image.slice(0, image.lastIndexOf(".")) + 
                            "_thumb" + image.slice(image.lastIndexOf("."))} title={name}
                onLoad={() => setImageLoaded(true)}
                className={`object-contain aspect-[4/3] h-44 rounded-t-lg ${imageLoaded ? "" : "hidden"}`} alt={name} />
                
                 {!imageLoaded && <svg xmlns="http://www.w3.org/2000/svg" className="aspect-[4/3] w-full text-base-content" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="15" y1="8" x2="15.01" y2="8" />
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
                    <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
                </svg>}
            </Link>
            <div className="flex flex-col flex-1 p-2">
                <Link to={`../parts/view/${id}`} title={name} className="text-lg mb-2 hover:text-primary line-clamp-2 transition-all">
                    {name}
                </Link>
                    
                <div className="flex flex-row justify-between items-center py-0 mt-auto">
                    <div className="flex flex-row items-center" title={`Used in ${battlestationCount} ${battlestationCount === 1 ? "Battlestation" : "Battlestations"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 22" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-base self-end">{battlestationCount}</span>
                    </div>
                </div>
            </div>
        </div>
	);
}

export default PartCard;