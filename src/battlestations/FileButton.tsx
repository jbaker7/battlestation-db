import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface Props {
    index: number
    fileName: string
    fileSize?: number
    removeFile: Function
}

function FileButton({index, fileName, fileSize, removeFile}: Props) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: fileName});
      
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    function formatSize(fileSize: number): string {
        if (fileSize === 0) {
          return "0.00 B";
        }
        else {
          let e = Math.floor(Math.log(fileSize) / Math.log(1024));
          return (fileSize / Math.pow(1024, e)).toFixed(2) +
            ' ' + ' kMGTP'.charAt(e) + 'B';
        }
    }
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} 
        className={`relative overflow-hidden flex flex-col justify-between text-sm h-[5.25rem] w-40 p-2  hover:bg-neutral-focus border ${fileSize && fileSize > 4194304 ? "border-error" : "border-primary/0 hover:border-primary"} rounded-lg
        group cursor-move transition-all bg-neutral`}
         draggable="true">
             {!fileSize && <img alt="battlestation image preview" src={process.env.REACT_APP_S3_BATTLESTATION_IMAGES + 
                            fileName.slice(0, fileName.lastIndexOf(".")) + 
                            "_thumb" + fileName.slice(fileName.lastIndexOf("."))}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />}
            <p className="truncate transition-all" title={fileName}>{fileName}</p>
            <div className="flex flex-row justify-between items-end z-20">
                <div className="flex flex-row items-center">
                <p className="text-sm text-base-content/75 font-base">{fileSize && formatSize(fileSize)}</p>
                {(fileSize && fileSize > 4194304) && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-error cursor-default" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <title>Maximum filesize is 4MB.</title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>}
                </div>
                
                <button 
                className={`cursor-pointer rounded-md ${fileSize ? "bg-neutral hover:bg-base-content/25" : "bg-base-content hover:bg-neutral-focus text-neutral hover:text-neutral-content outline outline-neutral-content hover:outline-primary" } `} 
                data-no-dnd="true" onClick={() => removeFile(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 p-1 stroke-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default FileButton;