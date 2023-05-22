import React, {useContext, useState} from 'react';
import {getIdToken} from "firebase/auth";
import {useQueryClient, useMutation, useQuery} from '@tanstack/react-query';
import {useForm, Controller} from "react-hook-form";
import {AxiosError} from 'axios';
import '../../App.css';
import {getPartTypes, postNewPart, updatePart, IPart, IPartTypes} from './apiQueries';
import {authContext} from '../../useAuth';
import PartFormLinkInput from './PartFormLinkInput';
import PartFormImageInput from './PartFormImageInput';
import {ReactComponent as LoadingCircles } from '../../components/loading-circles.svg';

interface ModalProps {
  closeModal: Function
  initialValues: IPart | null
  approvalId?: number
  approveFunction?: Function
}

type PartLink = {
  store_id: number,
  store_name: string,
  url: string
}

type FormInputs = {
  name: string,
  manufacturer: string,
  manufacturer_url: string,
  type_id: number,
  image: {localImage?: File, imageUrl?: string, imageChanged: boolean},
  stores: {addedLinks: PartLink[], deletedLinks: PartLink[], currentLinks: PartLink[]}
}

function AdminPartForm({closeModal, initialValues, approvalId, approveFunction}: ModalProps) {
  
  const authState = useContext(authContext);
  const queryClient = useQueryClient();

  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState("");

  const {data: dataPartTypes, error: errorPartTypes, isLoading: isLoadingPartTypes} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes);
  
  
  const {register: registerNewPart, control: controlNewPart, handleSubmit: submitNewPart, formState: {errors: formErrorsNewPart}} = useForm<FormInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  });

  const {mutate: mutateNewPart, status: statusNewPart, error: errorNewPart} = useMutation(postNewPart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['parts']);
      closeModal();
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.log(error)
        setSubmitError(error?.response?.data ? error.response.data : error.message);
      }
    }
  })

  const {mutate: mutateUpdatePart, status: statusUpdatePart, error: errorUpdatePart} = 
    useMutation(updatePart, {
      onSuccess: () => {
        queryClient.invalidateQueries(['parts'])
        closeModal();
      },
      onError: error => {
        if (error instanceof AxiosError) {
          setSubmitError(error?.response?.data ? error.response.data : error.message);
        }
      }
  })

  function handleSubmit(data: FormInputs) {

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("type_id", data.type_id.toString());
    formData.append("manufacturer", data.manufacturer);
    formData.append("manufacturer_url", data.manufacturer_url);
    
    if(data.image.imageChanged) {
      if(data.image.localImage) {
        formData.append("image", data.image.localImage);
      }
      else if(data.image.imageUrl) {
        formData.append("image_url", data.image.imageUrl);
      }
    }

    if(authState.user) {
      getIdToken(authState.user)
        .then(token => {
          if(initialValues) {
            formData.append("added_stores", JSON.stringify(data.stores.addedLinks));
            formData.append("deleted_stores", JSON.stringify(data.stores.deletedLinks));
            mutateUpdatePart({id: initialValues.part_id, data: formData, token: token});
          }
          else {
            formData.append("added_stores", JSON.stringify(data.stores.addedLinks));
            mutateNewPart({data: formData, token: token});
            if (approveFunction) approveFunction({id: approvalId, status: "approved", token: token})
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
      <h2 className="text-2xl pl-2 mb-2">{initialValues?.name ? initialValues.name : "New Part"}</h2>
        
      <div className="flex-1 flex flex-col w-[75vw] max-h-[95vh] overflow-y-auto custom-scrollbars bg-base-200 p-5 rounded-xl shadow-xl border border-neutral-focus">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="label pt-0"><span className="label-text">Name:</span></label>
            <div className="relative flex items-center justify-center mb-4">
              <input {...registerNewPart("name", {required: true, value: initialValues?.name})} id="name" type="text" 
              className={`input input-bordered w-full ${formErrorsNewPart.name && "input-error pr-9"}`} />
              {formErrorsNewPart.name && 
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
          </div>

          <div>
            <label htmlFor="type" className="label pt-0"><span className="label-text">Type:</span></label>
            <select 
            {...registerNewPart("type_id", {required: true, min: 1,
              value: initialValues ? initialValues.type_id : 0})} 
            id="type" 
            className={`select select-bordered max-w-content ${formErrorsNewPart.type_id && "select-error"}`}>
              <option value={0} disabled>Select:</option>
              {dataPartTypes ? dataPartTypes.map((partType, index) =>{
                return <option value={partType.type_id} key={`${partType}${index}`}>{partType.type_name}</option>})
                : isLoadingPartTypes ? <option disabled>Loading...</option>
                : errorPartTypes ? <option disabled>Unable to load part categories.</option>
                : <option disabled></option>
              }
            </select>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="basis-1/3">
              <label htmlFor="name" className="label pt-0"><span className="label-text">Manufacturer:</span></label>
              <div className="relative flex items-center justify-center mb-4">
                <input {...registerNewPart("manufacturer", {required: true, value: initialValues?.manufacturer})} id="name" type="text" 
                className={`input input-bordered w-full ${formErrorsNewPart.name && "input-error pr-9"}`} />
                {formErrorsNewPart.name && 
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
            </div>
            <div className="flex-1">
              <label htmlFor="name" className="label pt-0"><span className="label-text">Manufacturer URL:</span></label>
              <div className="relative flex items-center justify-center mb-4">
                <input {...registerNewPart("manufacturer_url", {required: false, value: initialValues?.manufacturer_url})} id="name" type="text" 
                className={`input input-bordered w-full ${formErrorsNewPart.name && "input-error pr-9"}`} />
                {formErrorsNewPart.name && 
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
            </div>
          </div>

          <Controller
            control={controlNewPart}
            name="image"
            rules={{
              validate: {
                required: (imageValue) => {
                  if(!initialValues && !imageValue.localImage && !imageValue.imageUrl) 
                    {return "Required."} 
                  else 
                    {return true}
                }
              }
            }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <PartFormImageInput
                onFormChange={onChange} 
                formError={error}
                onFormBlur={onBlur}
                initialValues={initialValues?.image}
              />
            )}
          />

          <Controller
            control={controlNewPart}
            name="stores"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <PartFormLinkInput
                initialValues={initialValues?.stores}
                onFormChange={onChange} 
                formError={error}
                onFormBlur={onBlur}
              />
            )}
          />

          {(errorNewPart || errorUpdatePart) ?
            <div className="flex flex-row items-center mt-4 px-4 py-2 border border-error rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{typeof submitError === "string" ? submitError : "An unknown error occured."}</span>
            </div>
          :
          submitResult ?
            <div className="flex flex-row items-center mt-4 px-4 py-2 border border-success rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-success flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{typeof submitResult === "string" ? submitResult : "Success"}</span>
            </div>
          : null
        }

        <div className="flex mt-4 gap-4 items-center">
          <button disabled={statusNewPart === "loading" || statusUpdatePart === "loading"} 
          onClick={() => closeModal()} className="btn btn-ghost hover:btn-error flex-1">Cancel</button>
          <button disabled={statusNewPart === "loading" || statusUpdatePart === "loading"} 
          onClick={submitNewPart(handleSubmit)} className="btn btn-outline btn-success flex-1">
            {statusNewPart === "loading" || statusUpdatePart === "loading" ? <LoadingCircles className="p-1" /> : "Save"} 
          </button>
        </div>
      </div> 
    </div>
  )
}

export default AdminPartForm;