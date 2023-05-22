import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from "react-hook-form";
import {useQueryClient, useMutation} from '@tanstack/react-query';
import ReactModal from 'react-modal';
import {authContext} from '../useAuth';
import {getIdToken} from "firebase/auth";
import {AxiosError} from 'axios';
import {postNewBattlestation} from './apiQueries';
import {modalStyle} from '../modalStyle';
import BattlestationForm from './BattlestationForm';
import LoadingModal from '../components/LoadingModal';
import usePageTitle from '../usePageTitle';

type FormInputs = {
    name: string
    instagram_url: string | null
    reddit_url: string | null
    is_public: string
    images: (File | string)[]
    parts: {part_id: number, name: string, type_id: number, type_name: string, image: string}[]
    description: string | null
  }

function NewBattlestation() {
  usePageTitle("Create | BattlestationDB");

  const authState = useContext(authContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {mutate: mutateNewBattlestation, isSuccess: isSuccessNewBattlestation, isError: isErrorNewBattlestation, reset} = useMutation(postNewBattlestation, {
    onSuccess: (result) => {
      queryClient.invalidateQueries(['battlestations']);
      navigate("/battlestations/"+result.newId, {replace: true});
    },
    onError: error => {
      if (error instanceof AxiosError) {
        console.log(error);
        setSubmitError(error?.response?.data ? error.response.data : error.message);
      }
    }
  })

  const battlestationForm = useForm<FormInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  function closeModal(status: boolean) {
    reset();
    setModalIsOpen(status)
  }

  function handleSubmit(data: FormInputs) {

    setModalIsOpen(true)
  
    const newFormData = new FormData();

    newFormData.append("name", data.name);
    data.instagram_url && newFormData.append("instagram_url", data.instagram_url);
    data.reddit_url && newFormData.append("reddit_url", data.reddit_url);
    data.description && newFormData.append("description", data.description);
    newFormData.append("is_public", data.is_public);
    let addedParts = data.parts.map(part => part.part_id)
    newFormData.append("added_parts", JSON.stringify(addedParts));

    data.images.forEach(image => {
        newFormData.append("images", image)
    })
      
    if(authState.user) {
      getIdToken(authState.user)
      .then(token => {
          mutateNewBattlestation({data: newFormData, token: token})
      })
      .catch(error => {
          console.log(error);
          setSubmitError("Authentication error.")
      })
    }
  }

  return (

    <div className="flex flex-col flex-1 m-5 gap-4">
      <BattlestationForm 
      form={battlestationForm}
      submitFunction={handleSubmit} />

      <ReactModal 
        isOpen={modalIsOpen}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="Loading Popup"
        className="flex"
        style={modalStyle}
      >
        <LoadingModal
          loadingText="Uploading Battlestation" 
          successfulText="Battlestation uploaded!"
          errorText="Unable to Upload Battlestation"
          errorDetails={submitError}
          isError={isErrorNewBattlestation}
          isSuccessful={isSuccessNewBattlestation}
          closeFunction={closeModal}
        />
      </ReactModal>

    </div>

	);
}

export default NewBattlestation;