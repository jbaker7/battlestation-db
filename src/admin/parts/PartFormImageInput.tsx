import React, {useEffect, useState} from 'react';

interface Props {
    initialValues?: string
    onFormChange: (value: any) => void
    onFormBlur: () => void
    formError: any
}

function PartFormImageInput({initialValues, onFormChange, onFormBlur, formError}: Props) {

    const [localImage, setLocalImage] = useState<File>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageIsLocal, setImageIsLocal] = useState(false);

    useEffect(() => {
        onFormChange({localImage: localImage, imageUrl: imageUrl, imageChanged: true})
        onFormBlur();
    }, [localImage, imageUrl])

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files?.length > 0) {
            setLocalImage(e.target.files[0])
        }
    }

    function handleUrlInput(e: React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === "Enter" && e.target.value.length > 0) {
          setImageUrl(e.target.value)
        }
    }

    return (
        <div className="flex flex-row-reverse shrink-0 gap-4 overflow-x-hidden ">
            <div className="flex flex-col flex-1 justify-between">
                <label className="label pt-0"><span className="label-text">Image:</span></label>
                <div className="flex relative text-md bg-base-300 rounded-lg border border-base-content/25 text-base-content/75 p-1">
                    <div className={`absolute z-10 w-[calc(50%-0.25rem)] inset-1 rounded-md bg-secondary ${imageIsLocal && `translate-x-full`} transition-all duration-300`}></div>
                    <a className={`block z-20 flex-1 text-sm text-center py-1 ${!imageIsLocal && `text-secondary-content`} transition-all duration-300`} 
                        onClick={() => setImageIsLocal(false)}>Import</a> 
                    <a className={`block z-20 flex-1 text-sm text-center py-1 ${imageIsLocal && `text-secondary-content`} transition-all duration-300`} 
                        onClick={() => setImageIsLocal(true)}>Local</a>
                </div>


                <div className={`relative  flex items-center justify-center mt-auto ${imageIsLocal && `hidden`}`}>
                    <input 
                    id="image_url" className={`input input-bordered w-full ${formError && "input-error pr-9"}`}
                    type="text" placeholder="Enter image URL" onKeyDown={e => handleUrlInput(e)}
                    onBlur={e => setImageUrl(e.target.value)} />
                    {formError && 
                        <div className="absolute right-4 mt-0 cursor-pointer tooltip tooltip-error text-error" data-tip="Field is required.">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="12" cy="12" r="9" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                    }
                </div> 

                <div className={`mt-auto text-base-content/75 w-full text-sm border border-neutral-focus/0 rounded-lg p-3 h-12
                ${!imageIsLocal && `hidden`}`}>
                    {localImage ? localImage.name : ""}
                </div>
            </div>
            <div className="max-w-fit">
            
                <div className={`flex-1 flex flex-col justify-center items-center ${!imageIsLocal && `hidden`}`}>
                    <label htmlFor="localImage" className={`flex justify-center items-center
                    h-40 bg-white p-1 rounded-md text-sm font-light border 
                    ${formError ? `border-error` : `border-neutral-focus`} cursor-pointer overflow-hidden `}>
                        {localImage ? 
                            <img src={URL.createObjectURL(localImage)} 
                                className=" object-contain aspect-[4/3] h-full" />
                            : "Click to select image."}
                        <input type="file"
                        accept="image/jpeg,image/png,image/gif"
                        multiple={false}
                        onChange={(e) => handleFileSelect(e)} id="localImage" 
                        className="block hidden file:btn file:btn-primary file:hover:bg-primary-focus"/>
                    </label>
                </div>
                
                <div className={`${imageIsLocal && `hidden`} flex flex-col items-center`}>
                    <div className={`flex justify-center items-center
                    h-40 bg-white p-1 rounded-md text-sm font-light border 
                    ${formError ? `border-error` : `border-neutral-focus`} overflow-hidden`}>
                        <img src={imageUrl ? imageUrl : initialValues ? process.env.REACT_APP_S3_PART_IMAGES + initialValues : undefined} 
                            className=" object-contain aspect-[4/3] h-full" 
                        />
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default PartFormImageInput;