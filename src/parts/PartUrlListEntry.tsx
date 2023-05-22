import React, {useRef} from 'react';
import {Link} from "react-router-dom";

interface Props {
    name: string,
    url: string
}

function PartUrlListEntry({name, url}: Props) {

  return (
	
        <tr className="grid grid-cols-[auto_max-content] md:table-row">
            <td className="col-start-1 row-start-1 col-span-2 row-span-1 py-2 px-0 border-b !rounded-bl-none border-neutral-content 
                md:table-cell md:border-0  md:px-4 font-semibold">{name}</td>
            <td className="col-start-1 row-start-2 col-span-1 row-span-1 py-2 px-0 
                md:px-4 md:table-cell">
                {/* <Link to="#" className="link link-hover link-primary">{url}</Link> */}
                {url}
                
            </td>
            
        </tr>

	);
}

export default PartUrlListEntry;