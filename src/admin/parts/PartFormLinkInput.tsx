import React, {useState, useEffect } from 'react';
import {useQuery} from '@tanstack/react-query';
import {getAllStoreNames, IStore} from '../stores/apiQueries';

type PartLink = {
    store_id: number,
    store_name: string,
    url: string
  }

interface Props {
    initialValues?: PartLink[]
    onFormChange: (value: any) => void
    onFormBlur: () => void
    formError: any
}

function PartFormLinkInput({initialValues, onFormChange, onFormBlur, formError}: Props) {

    const [currentLinks, setCurrentLinks] = useState<PartLink[]>(initialValues ? initialValues : []);
    const [newStore, setNewStore] = useState<number>(0);
    const [newUrl, setNewUrl] = useState<string>("");
    const [addedLinks, setAddedLinks] = useState<PartLink[]>([]);
    const [deletedLinks, setDeletedLinks] = useState<PartLink[]>([]);

    const {data: storesData, error: storesError, isLoading: storesIsLoading} = useQuery<IStore[]>(['stores'], getAllStoreNames);
    

    useEffect(() => {
        onFormChange({addedLinks: addedLinks, deletedLinks: deletedLinks, currentLinks: currentLinks})
        onFormBlur();
      }, [addedLinks, deletedLinks])

    function addLink() {
        setAddedLinks([...addedLinks, {store_id: newStore, url: newUrl, store_name: getStoreName(newStore)}]);
        setCurrentLinks([...currentLinks, {store_id: newStore, url: newUrl, store_name: getStoreName(newStore)}]);
        setNewStore(0);
        setNewUrl("");
    }

    function removeLink(url: string, index: number) {
        let tempCurrentLinks = currentLinks.filter(link => link.url !== url);
        setCurrentLinks(tempCurrentLinks);

        let tempAddedLinks = addedLinks.filter(link => link.url !== url);
        setAddedLinks(tempAddedLinks);

        if(initialValues) {
            setDeletedLinks([...deletedLinks, currentLinks[index]])
        }
    }

    function handleStoreSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setNewStore(parseInt(e.target.value))
    }

    function handleUrlInput(e: React.ChangeEvent<HTMLInputElement>) {
        setNewUrl(e.target.value)
    }

    function getStoreName(id: number): string {
        let storeName: string = "";
        if (storesData) {
            let el = storesData.find(el => el.store_id === id);
            storeName = el ? el.name : "";
        }
        return storeName;
    }


    return (
        <div className="flex flex-col">
        <div className="label pt-4"><span className="label-text">Links:</span></div>
        <div className={`min-h-[10rem] bg-base-300 rounded-lg border ${formError ? "border-error" : "border-neutral-focus"}`}>
            
            <div className=" table table-fixed rounded-lg">
                <div className="table-row-group ">
                    <div className="table-row align-top">
                        <div className="table-cell pl-1.5 py-1.5 w-fit align-top whitespace-nowrap">
                            <select value={newStore} onChange={e => handleStoreSelect(e)} 
                            className="select select-bordered w-fit" >
                                <option value={0} disabled>Store:</option>
                                {storesData ? storesData.map((store, index) =>{
                                return <option value={store.store_id} key={`${store.store_id}${index}`}>{store.name}</option>})
                                    : storesIsLoading ? <option disabled>Loading...</option>
                                    : storesError ? <option disabled>Unable to stores.</option>
                                    : <option disabled></option>
                                }
                            </select>
                        </div>
                        <div className="table-cell pl-1.5 py-1.5 align-top  w-full ">
                            <input onChange={e => handleUrlInput(e)} id="name" value={newUrl} type="text" 
                            className="input input-bordered w-full" />
                        </div>
                        <div className="table-cell align-top px-1.5 w-min py-1.5">
                            <button onClick={addLink} className="btn btn-outline btn-success"
                            disabled={!newStore || !newUrl}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M5 12l5 5l10 -10" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {currentLinks.length > 0 && currentLinks.map((link, index) =>
                        <div className="table-row text-sm hover:bg-neutral-focus/25 transition-all duration-75" key={link.store_name + index}>
                            <div className="table-cell px-3 w-fit whitespace-nowrap align-middle">
                                <span className="">{link.store_name}</span>
                            </div>
                            <div className="table-cell px-3 align-middle">
                                <a href={link.url} className="link link-primary link-hover text-sm">{link.url}</a>
                            </div>
                            <div className="table-cell px-1 w-min text-center">
                                <button onClick={() => removeLink(link.url, index)} className="btn btn-ghost btn-sm hover:bg-opacity-0 hover:text-error hover:border-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
        </div> 
        </div>
    )

}
export default PartFormLinkInput;