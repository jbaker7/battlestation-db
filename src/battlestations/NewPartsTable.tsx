import React, {useState} from 'react';
import PartSelect from "./PartSelect";
import {getPartTypes, IPartTypes, IPartAutoComplete} from '../parts/apiQueries';
import {useQuery} from '@tanstack/react-query';


interface NewPartsTableProps {
    parts: IPartAutoComplete[]
    onFormChange: (value: any) => void
    onFormBlur: () => void
    formError: any
}

function NewPartsTable({parts = [], onFormChange, onFormBlur, formError}: NewPartsTableProps) {

    const [currentPart, setCurrentPart] = useState<IPartAutoComplete>();
    const [currentPartType, setCurrentPartType] = useState(0);

    let tempParts = parts;

    const {data: dataPartTypes, error: errorPartTypes, isLoading: isLoadingPartTypes} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes, {staleTime: (1000 * 60 * 60 * 24)});

    function getPartTypeName(partTypeId: number): string {
        let partTypeName: string = "";
        if (dataPartTypes) {
            let el = dataPartTypes.find(el => el.type_id === partTypeId);
            partTypeName = el ? el.type_name : "";
        }
        return partTypeName;
    }

    function removePart(index: number) {

        tempParts.splice(index, 1);
        onFormChange(tempParts);
        // let tempCurrentLinks = currentLinks.filter(link => link.url !== url);
        // setCurrentLinks(tempCurrentLinks);


        // setAddedParts(current => {
        //     // 👇️ remove salary key from object
        //     const copy = {...current};

        //     // 👇️ remove salary key from object
        //     delete copy[partId];
      
        //     return copy;
        //   });

        //let tempAddedParts = addedParts.filter(part => part.part_id !== partId);
        //delete addedParts
        //let tempAddedParts = {addedParts[partId], ...addedParts} = 
        //setAddedParts(tempAddedParts);

        // if(initialValues) {
        //     setDeletedLinks([...deletedLinks, currentLinks[index]])
        // }
    }

    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let value = e.target.value;
        
        if(e.target.id === "current-part-type") {
            setCurrentPartType(parseInt(value));
        }
    }

    function handlePartAdd(e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) {

        if (currentPart) {
            if (e.nativeEvent instanceof MouseEvent || (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === "Enter")) {
                e.preventDefault();

                tempParts.push(currentPart!);
                tempParts[tempParts.length-1].type_name = getPartTypeName(tempParts[tempParts.length-1].type_id)
                setCurrentPart(undefined);
                onFormChange(tempParts);
            }
        }
    }

    return (
        <>
            <div className="table w-full border-spacing-y-2">
                <div className="table-header-group sr-only">
                    <div className="table-row">
                        <div className="table-cell">Category</div>
                        <div className="table-cell">Name</div>
                        <div className="table-cell">Price</div>
                    </div>
                </div>

                <div className="table-row-group ">
                    <div className="table-row mb-3">
                        <div className={`table-cell pl-2 py-2 w-fit whitespace-nowrap align-middle border border-dashed  border-r-0 rounded-l-lg
                        ${formError ? "border-error" : "border-base-content/50"}`}>
                            <select id="current-part-type" onChange={e => handleSelectChange(e)} value={currentPartType} className="select select-bordered  min-w-min">
                                <option value={0}>Any</option>
                                {dataPartTypes ? dataPartTypes.map((partType, index) =>{
                                    return <option value={partType.type_id} key={`${partType}${index}`}>{partType.type_name}</option>})
                                : isLoadingPartTypes ? <option disabled>Loading...</option>
                                : errorPartTypes ? <option disabled>Unable to load part categories.</option>
                                : <option disabled></option>
                                }
                            </select>
                        </div>
                        <div className={`table-cell p-2 w-full align-middle border-0 border-y border-dashed
                        ${formError ? "border-error" : "border-base-content/50"}`}>

                            <PartSelect 
                                partTypeId={currentPartType} 
                                currentPart={currentPart} 
                                setCurrentPart={setCurrentPart}
                                handleEnterButton={handlePartAdd} />
                    
                        </div>
                        <div className={`table-cell pr-2 py-2 w-min align-middle border-0 border-y border-r border-dashed rounded-r-lg
                        ${formError ? "border-error" : "border-base-content/50"}`}>
                            <button className="btn btn-outline btn-primary"
                            onClick={(e) => handlePartAdd(e)}
                            disabled={currentPart ? false : true}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                
                    {parts && parts.map((part, index) => 
                        <div className="table-row" key={`${index}${part.part_id}`}>
                            <div className="table-cell pl-2 py-2 w-fit sm:whitespace-nowrap align-middle border border-base-content/50 border-r-0 rounded-l-lg">
                                {getPartTypeName(part.type_id)}
                            </div>
                            <div className="table-cell p-2 w-full align-middle border-0 border-y  border-base-content/50">
                                <a href={`/parts/view/${part.part_id}`} className="link link-primary link-hover text-base">
                                    {part.name}
                                </a>
                            </div>
                            <div className="table-cell pr-2 py-2 w-min align-middle border-0 border-y border-r  border-base-content/50 rounded-r-lg ">
                                <button className="btn btn-ghost hover:bg-opacity-0 hover:text-error hover:border-error"
                                onClick={() => removePart(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div> 
            {formError && 
                <div className="flex items-center gap-4 border border-error/50 px-6 py-3 rounded-lg ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Please select at least one part for your battlestation.</span>
                </div>
            }
        </>
    )
}

export default NewPartsTable;