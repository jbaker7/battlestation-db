import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {useMutation} from '@tanstack/react-query';
import {getIdToken} from "firebase/auth";
import {authContext} from '../useAuth';
import {submitNewPart} from './apiQueries';
import {AxiosError} from 'axios';
import FormErrorTag from '../components/FormErrorTag';
import {ReactComponent as LoadingCircle} from '../components/loading-circles.svg';

interface Props {
    closeFunction: Function
}

function PartSubmitForm({closeFunction}: Props) {

    const authState = useContext(authContext);
    const [submitError, setSubmitError] = useState("");

    const {mutate: mutateNewPart, isLoading: isLoadingNewPart, isSuccess: isSuccessNewPart, reset} = useMutation(submitNewPart, {
        onSuccess: (result) => {
        },
        onError: error => {
          if (error instanceof AxiosError) {
            setSubmitError(error?.response?.data ? error.response.data : error.message);
          }
        }
    })

    type FormInputs = {
        partName: string;
        partUrl: string;
    };

    const {register, handleSubmit, formState: {errors}} = useForm<FormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    function handleClose() {
        reset();
        closeFunction(false);
    }

    function handlePartSubmit(data: FormInputs) {

        const newFormData = new FormData();
    
        newFormData.append("partName", data.partName);
        newFormData.append("partUrl", data.partUrl);
          
        if(authState.user) {
            getIdToken(authState.user)
            .then(token => {
                mutateNewPart({data: newFormData, token: token});
            })
            .catch(error => {
                setSubmitError("Authentication error.");
            })
        }
    }

    return (
        <div className="flex gap-y-4 w-96 border border-base-content/10 rounded-lg flex-col p-4 bg-base-300">
            {!isSuccessNewPart ? 
                <>
                    <h3 className="text-2xl text-center">Submit New Part</h3>
                    <div className="form-control w-full">
                        <form onSubmit={handleSubmit(handlePartSubmit)}>
                            <label htmlFor="partName" className="label mt-2 pb-1">
                                <span className="label-text">Part Name</span>
                                {errors.partName && <FormErrorTag>{errors.partName.message}</FormErrorTag>}
                            </label>
                            <div className="relative flex items-center justify-center">
                                <input {...register("partName", {required: "Field is required."})} 
                                id="partName" type="text"
                                className={`input input-bordered bg-base-100 w-full ${errors.partName && "pr-9"}`} />
                                {errors.partName && 
                                    <div className="absolute right-0 mt-0 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <circle cx="12" cy="12" r="9" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                }
                            </div>
                            <label htmlFor="partUrl" className="label mt-2  pb-1">
                                <span className="label-text">Part URL</span>
                                {errors.partUrl && <FormErrorTag>{errors.partUrl.message}</FormErrorTag>}
                            </label>
                            <div className="relative flex items-center justify-center mb-4">
                                <input {...register("partUrl", {required: "Field is required."})} 
                                    id="partUrl" type="text" 
                                    className={`input input-bordered bg-base-100 w-full ${errors.partUrl && "pr-9"}`} />
                                {errors.partUrl && 
                                    <div className="absolute right-0 mt-0 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <circle cx="12" cy="12" r="9" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                }
                            </div>
                            <div className={`flex flex-row flex-1 text-sm items-center border border-error text-base-content/90 bg-error/10 rounded-lg 
                            transition-all duration-300 ${submitError ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden  "}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{submitError}</span>
                            </div>
                            <div className="mt-5">
                                <button type="submit" className={`btn btn-primary w-full ${isLoadingNewPart && "pointer-events-none"}`}>
                                    {isLoadingNewPart ? <LoadingCircle className="h-4/5" /> : "Submit Part"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            :
                <div className="flex flex-col w-full items-center gap-4">
                    <svg id="loading-hex" className="text-primary" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" width="100px" height="100px" viewBox="-16 -16 332 332" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="glow" x="-25%" y="-25%" height="150%" width="150%">
                                <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="8" in="SourceGraphic"></feGaussianBlur>
                            </filter>
                        </defs>
                        <polygon fill="none" points="300,150 225,280 75,280 0,150 75,20 225,20" ></polygon>
                        <path  fill="none" d="M 92.659 149.999 L 130.886 188.226 L 207.34 111.774"></path>
                        <g style={{filter: "url('#glow')"}} filter="url(#glow);">
                            <polygon fill="none" points="300 150 225 280 75 280 0 150 75 20 225 20" ></polygon>
                            <path fill="none" d="M 92.659 149.999 L 130.886 188.226 L 207.34 111.774"></path>
                        </g>
                    </svg>
                    <span className="text-2xl text-center">Thank You!</span>
                    <span className="text-base-content/75 text-center">We appreciate your help in improving BattlestationDB.</span>
                    <span className="text-base-content/75 text-center">Your part is pending approval and should be added soon.</span>
                    <button onClick={() => handleClose()} className="btn btn-primary w-full">Close</button>
                </div>
            }
        </div>
    )
}

export default PartSubmitForm;