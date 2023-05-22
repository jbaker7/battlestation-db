import React, {useContext, useState} from 'react';
import {getIdToken} from "firebase/auth";
import {useForm} from "react-hook-form";
import {AxiosError} from 'axios';
import {useQueryClient, useMutation} from '@tanstack/react-query';
import {postNewStore, updateStore, IStore} from './apiQueries';
import {authContext} from '../../useAuth';
import {ReactComponent as LoadingCircles } from '../../components/loading-circles.svg';

type FormInputs = {
  name: string,
  url: string
}

interface ModalProps {
  closeModal: Function
  initialValues: IStore | null
}


function AdminStoreForm({closeModal, initialValues}: ModalProps) {

  const authState = useContext(authContext);
  const queryClient = useQueryClient();

  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState("");

  const {register: newStoreRegister, handleSubmit: newStoreSubmit, formState: {errors: newStoreErrors}} = useForm<FormInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  });

  const {mutate: mutateUpdate, status: updateStatus, error: updateError} = 
  useMutation(updateStore, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores'])
      closeModal();
    },
    onError: error => {
      if (error instanceof AxiosError) {
        setSubmitError(error?.response?.data ? error.response.data : error.message);
      }
    }
  })

  const {mutate: mutateAdd, status: addStatus, error: addError} = useMutation(postNewStore, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores']);
      
      closeModal();
    },
    onError: error => {
      if (error instanceof AxiosError) {
        setSubmitError(error?.response?.data ? error.response.data : error.message);
      }
    }
  })

  function handleSubmit(data: FormInputs) {
    if(authState.user) {
      getIdToken(authState.user)
        .then(token => {
          if(initialValues) {
            mutateUpdate({id: initialValues.store_id, data: data, token: token});
          }
          else {
            mutateAdd({data: data, token: token});
          }
        })
        .catch(error => {
          console.log(error);
          setSubmitError("Authentication error.");
        })
    }
  }
  
  return (
    <div className="flex flex-col -mt-12">
      <h2 className="text-2xl pl-2 mb-2">{initialValues?.name ? `Update ${initialValues.name}` : "New Store"}</h2>
      <div className="flex-1 flex flex-col w-80 bg-base-200 p-5 rounded-xl shadow-xl border border-neutral-focus">
        <label htmlFor="name" className="label pt-0"><span className="label-text">Name:</span></label>
        <div className="relative flex items-center justify-center mb-4">
          <input {...newStoreRegister("name", {required: true, value: initialValues?.name})} id="name"
            className={`input input-bordered bg-base-100 w-full ${newStoreErrors.name && "input-error pr-9"}`} />
          {newStoreErrors.name && 
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
        <label htmlFor="url" className="label"><span className="label-text">URL:</span></label>
        <div className="relative flex items-center justify-center mb-4">
          <input {...newStoreRegister("url", {required: true, value: initialValues?.url})} id="url"
            className={`input input-bordered bg-base-100 w-full ${newStoreErrors.url && "input-error pr-9"}`} />
          {newStoreErrors.url && 
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
        {(addError || updateError) ?
          <div className="flex flex-row items-center px-4 py-2 border flex-1 border-error rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{submitError}</span>
          </div>
          :
          submitResult ?
          <div className="flex flex-row items-center px-4 py-2 border flex-1 border-success rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-success flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{submitResult}</span>
          </div>
          : null
        }
        <div className="flex gap-4 mt-4 items-center relative">
          <button disabled={updateStatus === "loading" || addStatus === "loading"} 
          onClick={() => closeModal()} className="btn btn-ghost hover:btn-error flex-1">Cancel</button>
          <button disabled={updateStatus === "loading" || addStatus === "loading"} 
          onClick={newStoreSubmit(handleSubmit)} className="btn btn-outline btn-success flex-1">
            {updateStatus === "loading" || addStatus === "loading" ? <LoadingCircles className="p-1" /> : "Save"} 
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminStoreForm;