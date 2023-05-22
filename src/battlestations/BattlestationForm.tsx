import React, {useState} from 'react';
import {IBattlestation} from './apiQueries';
import {IPartAutoComplete} from '../parts/apiQueries';
import {formatDate} from './dateFormatter';
import {UseFormReturn, Controller} from "react-hook-form";
import ImageDropZone from "./ImageDropZone";
import NewPartsTable from "./NewPartsTable";
import ReactModal from 'react-modal';
import PartListCopy from '../components/PartListCopy';
import PartSubmitForm from './PartSubmitForm';
import {modalStyle} from '../modalStyle';

type UpdateInputs = {
    name: string
    instagram_url: string | null
    reddit_url: string | null
    is_public: string
    images: (File | string)[]
    parts: IPartAutoComplete[]
    description: string | null
}

type NewInputs = {
    name: string
    instagram_url: string | null
    reddit_url: string | null
    is_public: string
    images: (File | string)[]
    parts: {part_id: number, name: string, type_id: number, type_name: string, image: string}[]
    description: string | null
  }

  interface Props {
    submitFunction: any,
    deleteFunction?: Function
    dataBattlestation?: IBattlestation
    form: UseFormReturn<NewInputs | UpdateInputs>
  }

function BattlestationForm({form, dataBattlestation, submitFunction, deleteFunction}: Props) {

    const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
    const [partSubmitIsOpen, setPartSubmitIsOpen] = useState(false);

    const {register: registerStations, getValues, control, handleSubmit: handleStations, formState: {errors: errorsStations, dirtyFields}} = form;

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row justify-between content-center  px-0">
                <div className="basis-7/12">
                    <div className="relative flex items-center justify-center mb-2 w-full">
                        <input {...registerStations("name", {required: true})}
                        id="name" type="text" placeholder="Battlestation Name" 
                        className={`input input-lg text-4xl input-bordered bg-base-200 w-full  ${errorsStations.name && "input-error pr-9"}`} />
                        {errorsStations.name && 
                            <div className="absolute right-0 mt-0 mr-2 cursor-pointer tooltip tooltip-error" data-tip="Field is required.">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="12" cy="12" r="9" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                        }
                    </div>
                    <div className="relative flex items-center mb-2 w-full lg:w-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2 h-5 w-5 opacity-50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <rect x="4" y="4" width="16" height="16" rx="4" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
                        </svg>
                        <input {...registerStations("instagram_url")}
                        id="name" type="text" placeholder="Instagram Link" 
                        className={`input input-sm input-bordered bg-base-200 w-full pl-8 ${errorsStations.instagram_url && "input-error pr-9"}`} />
                        {errorsStations.instagram_url && 
                            <div className="absolute right-0 mt-0 mr-2 cursor-pointer tooltip tooltip-error" data-tip="Field is required.">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="12" cy="12" r="9" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                        }
                    </div>
                        <div className="relative flex items-center w-full lg:w-1/2 mb-2 ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2 h-5 w-5 opacity-50" viewBox="-1 -1 25 26" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z" />
                            <path d="M12 8l1 -5l6 1" />
                            <circle cx="19" cy="4" r="1" />
                            <circle cx="9" cy="13" r=".5" fill="currentColor" />
                            <circle cx="15" cy="13" r=".5" fill="currentColor" />
                            <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
                        </svg>
                        <input {...registerStations("reddit_url")}
                        id="name" type="text" placeholder="Reddit Link" 
                        className={`input input-sm input-bordered bg-base-200 w-full pl-8 ${errorsStations.reddit_url && "input-error pr-9"}`} />
                        {errorsStations.reddit_url && 
                            <div className="absolute right-0 mt-0 mr-2 cursor-pointer tooltip tooltip-error" data-tip="Field is required.">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="12" cy="12" r="9" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                        }
                    </div>
                    {dataBattlestation && <p className="ml-2 leading-tight opacity-50">Created on: {formatDate(dataBattlestation.created_date)}</p>}
                </div>
                <div className="flex basis-1/5 flex-row mb-5 md:mb-0 md:flex-col gap-2">
                    <button className="btn md:btn-sm btn-primary basis-2/5 md:basis-auto"
                    disabled={Object.keys(dirtyFields).length === 0}
                    onClick={handleStations(submitFunction)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-75" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                            <circle cx="12" cy="14" r="2" />
                            <polyline points="14 4 14 8 8 8 8 4" />
                        </svg>
                        Save
                    </button>
                    <label className=" basis-2/5 md:basis-auto  flex justify-center items-center uppercase cursor-pointer  transition-all text-sm font-medium  w-full relative h-12 md:h-8">
                        <input type="checkbox" className="sr-only peer" {...registerStations("is_public")}/>
                        <div className="absolute inset-0 border border-neutral-content/25 transition-all duration-700 peer-checked:border-primary rounded-lg"></div>
                        <span className="absolute right-4 lg:right-auto flex items-center transition-all duration-700 opacity-75 peer-checked:opacity-0 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-75 inline" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <line x1="3" y1="3" x2="21" y2="21" />
                                <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                                <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                            </svg>
                            Private
                        </span>
                        <span className="absolute left-4 lg:left-auto flex items-center transition-all duration-700 opacity-0 text-primary peer-checked:opacity-100 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-75 inline" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="12" cy="12" r="2" />
                                <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                            </svg>
                            Public
                        </span>
                        <div className="absolute transition-all duration-700 inset-y-px left-0 my-[1px] mx-[2px] border border-neutral-content/25 bg-neutral-focus rounded-[calc(0.5rem-2px)] w-12 md:w-8
                        md:peer-checked:left-[calc(100%-2rem-4px)] peer-checked:left-[calc(100%-3rem-4px)] hover:bg-neutral peer-checked:hover:bg-primary-focus peer-checked:border-primary-focus peer-checked:bg-primary"></div>
                    </label>
                    {deleteFunction && <button className="btn md:btn-sm btn-ghost hover:bg-error basis-1/5 md:basis-auto flex gap-2"
                    onClick={() => deleteFunction(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-75" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                        <span>Delete</span>
                    </button>}
                </div>
            </div>

            <div className="flex flex-row items-center">
                <Controller
                    control={control}
                    name="images"
                    rules={{ required: true, minLength: 1, 
                        validate: (val: (File | string)[]) => {
                            if(!val.some(file => ((file instanceof File) && (file.size > 4194304)))) {
                                return true;
                            }
                            else {
                                return "Maximum file size is 4MB.";
                            }
                        }     
                    }}
                    render={({
                        field: {onChange, onBlur, value},
                        fieldState: { error}}) => (
                            <ImageDropZone
                                currentFiles={value}
                                onFormChange={onChange} 
                                formError={error}
                                onFormBlur={onBlur}
                            />
                        )}
                />
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-5 lg:gap-8">
                <div className="flex-1 basis-7/12 ">
                    <div className="flex flex-row gap-4">
                        <h3 className="text-2xl">Part List</h3>
                        <button className="btn btn-primary btn-outline btn-sm"
                        onClick={() => setCopyModalIsOpen(true)}>Copy List</button>
                    </div>

                    <Controller
                        control={control}
                        name="parts"
                        rules={{required: true, minLength: 1}}
                        render={({
                            field: {onChange, onBlur, value},
                            fieldState: {error}}) => (
                                <NewPartsTable
                                    parts={value}
                                    onFormChange={onChange} 
                                    formError={error}
                                    onFormBlur={onBlur}
                                />
                        )}
                    />
                    
                    <div className="m-2 font-light">Couldn't find a part? It's easy to <button onClick={() => setPartSubmitIsOpen(true)} className="link link-primary">get it added</button>.</div>

                </div>

                <div className="flex-1 basis-5/12">
                    <label htmlFor="description" className="">
                        <h3 className="text-2xl mb-4">Description</h3>
                    </label>
                    <textarea 
                        {...registerStations("description")} 
                        id="description" className="textarea textarea-bordered resize-none h-44 bg-base-200 w-full"
                    />
                </div>

            </div>

            <ReactModal 
                isOpen={copyModalIsOpen}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={() => setCopyModalIsOpen(false)}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Copy Parts List Popup"
                className="flex"
                style={modalStyle}
            >
                <PartListCopy 
                    parts={getValues("parts")} 
                    battlestationId={dataBattlestation?.battlestation_id} 
                    closeFunction={setCopyModalIsOpen}
                />
            </ReactModal>

            <ReactModal 
                isOpen={partSubmitIsOpen}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={() => setPartSubmitIsOpen(false)}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Submit New Part Popup"
                className="flex"
                style={modalStyle}
            >
                <PartSubmitForm 
                    closeFunction={setPartSubmitIsOpen}
                />
            </ReactModal>
        </>
	);
}

export default BattlestationForm;