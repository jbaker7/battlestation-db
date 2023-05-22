import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getIdToken} from "firebase/auth";
import {useQueryClient, useMutation, } from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {updateBattlestation, deleteBattlestation as deleteBattlestationQuery, IBattlestation} from './apiQueries';
import {IPartAutoComplete} from '../parts/apiQueries';
import {authContext} from '../useAuth';
import {useForm} from "react-hook-form";
import DeleteConfirmation from '../components/DeleteConfirmation';
import LoadingModal from '../components/LoadingModal';
import ReactModal from 'react-modal';
import usePageTitle from '../usePageTitle';
import {modalStyle} from '../modalStyle';
import BattlestationForm from './BattlestationForm';

type FormInputs = {
    name: string
    instagram_url: string | null
    reddit_url: string | null
    is_public: string
    images: (File | string)[]
    parts: IPartAutoComplete[]
    description: string | null
}

interface Props {
    dataBattlestation: IBattlestation
}

function UpdateBattlestation({dataBattlestation}: Props) {
    usePageTitle("Edit | BattlestationDB");

    const authState = useContext(authContext);
    const queryClient = useQueryClient();
    const {stationId} = useParams();
    const navigate = useNavigate();

    const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {mutate: mutateBattlestation, 
        isError: isErrorUpdateBattlestation,
        isSuccess: isSuccessUpdateBattlestation} = useMutation(updateBattlestation, {
        onSuccess: () => {
            queryClient.refetchQueries(['editBattlestations']);
        },
        onError: error => {
            if (error instanceof AxiosError) {
                console.log(error);
                setSubmitError(error?.response?.data ? error.response.data : error.message);
            }
        }
    })

    const {mutate: deleteBattlestation, 
        status: statusDeleteBattlestation} = useMutation(deleteBattlestationQuery, {
        onSuccess: () => {
            queryClient.invalidateQueries(['editBattlestations']);
            navigate("/battlestations", {replace: true});
        },
        onError: error => {
            if (error instanceof AxiosError) {
                console.log(error);
                setSubmitError(error?.response?.data ? error.response.data : error.message);
            }
        }
    })

    const updateForm = useForm<FormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    useEffect(() => {
        updateForm.reset(dataBattlestation);
    }, [dataBattlestation])

    function handleSubmit(data: FormInputs) {

        const {formState: {dirtyFields}} = updateForm;

        setUpdateModalIsOpen(true);

        let addedImageFiles = data.images.filter(image => image instanceof File);

        let addedImagesOrder = addedImageFiles.map((image) => 
            {return data.images.indexOf(image)}
        );

        let removedImages = getRemovedImages(dataBattlestation.images, data.images);
        let changedImages = getChangedImages(dataBattlestation.images, data.images, removedImages);

        let addedParts = getAddedParts(dataBattlestation.parts, data.parts);
        let removedParts = getRemovedParts(dataBattlestation.parts, data.parts);
    
        const newFormData = new FormData();

        dirtyFields.name && newFormData.append("name", data.name);
        dirtyFields.instagram_url && newFormData.append("instagram_url", data.instagram_url ? data.instagram_url : "");
        dirtyFields.reddit_url && newFormData.append("reddit_url", data.reddit_url ? data.reddit_url : "");
        dirtyFields.description && newFormData.append("description", data.description ? data.description : "");
        dirtyFields.is_public && newFormData.append("is_public", data.is_public);
        
        (dirtyFields.parts && addedParts.length > 0) && newFormData.append("added_parts", JSON.stringify(addedParts));
        (dirtyFields.parts && removedParts.length > 0) && newFormData.append("removed_parts", JSON.stringify(removedParts));
        
        (dirtyFields.images && removedImages.length > 0) && newFormData.append("removed_images", JSON.stringify(removedImages));
        (dirtyFields.images && changedImages.length > 0) && newFormData.append("changed_images", JSON.stringify(changedImages));

        if (dirtyFields.images && addedImageFiles.length > 0) {
            addedImageFiles.forEach(image => {
                newFormData.append("added_images", image)
            })
            newFormData.append("added_images_order", JSON.stringify(addedImagesOrder));
        }
        
        if(authState.user) {
            getIdToken(authState.user)
            .then(token => {
                mutateBattlestation({id: stationId!, data: newFormData, token: token})
            })
            .catch(error => {
                console.log(error);
                setSubmitError("Authentication error.");
            })
        }
    }

    function handleDelete() {
        if(authState.user) {
            getIdToken(authState.user)
                .then(token => {
                    deleteBattlestation({id: dataBattlestation.battlestation_id, token: token})
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    function getRemovedImages(data: (File | string)[], newImages: (File | string)[]) {
        let removedImages = data.filter(existingImage =>
            !newImages.filter(image => !(image instanceof File)).some(newImage => 
                existingImage === newImage
            ));
        return removedImages;
    }
    function getChangedImages(data: (File | string)[], newImages: (File | string)[], removedImages: (File | string)[]) {
        
        let changedImagesArr = data.filter((image, index) => 
            !(image instanceof File) && (image !== newImages[index])
        )
        .filter(image => 
            !removedImages.some(removedImage => 
                image === removedImage
            ));

        let changeImages = changedImagesArr.map((image) => 
            {return {image: image, display_order: newImages.indexOf(image)}}
        );

        return changeImages;
    }
    function getAddedParts(data: IPartAutoComplete[], newParts: IPartAutoComplete[]) {
        let addedParts = newParts.filter(newPart =>
            !data.some(existingPart => 
                existingPart.part_id === newPart.part_id
            )).map(part => part.part_id);
        return addedParts;
    }
    function getRemovedParts(data: IPartAutoComplete[], newParts: IPartAutoComplete[]) {
        let removedParts = data.filter(existingPart =>
            !newParts.some(newPart => 
                existingPart.part_id === newPart.part_id
            )).map(part => part.part_id);
            
        return removedParts;
    }

    return (

        <div className="flex flex-col flex-1 m-5 gap-4">

            <BattlestationForm
                dataBattlestation={dataBattlestation}
                submitFunction={handleSubmit}
                deleteFunction={setDeleteModalIsOpen}
                form={updateForm} />
        
            <ReactModal 
                isOpen={updateModalIsOpen}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Loading Popup"
                className="flex"
                style={modalStyle}
            >
                <LoadingModal
                    loadingText="Updating Battlestation" 
                    successfulText="Battlestation updated!"
                    errorText="Unable to Update Battlestation"
                    errorDetails={submitError}
                    isError={isErrorUpdateBattlestation}
                    isSuccessful={isSuccessUpdateBattlestation}
                    closeFunction={setUpdateModalIsOpen}
                />
            </ReactModal>

            <ReactModal 
                isOpen={deleteModalIsOpen}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Page Leavie Confirmation Popup"
                onRequestClose={() => setDeleteModalIsOpen(false)}
                className="flex"
                style={modalStyle}
            >
                <DeleteConfirmation 
                    deleteFunction={handleDelete}
                    closeFunction={setDeleteModalIsOpen}
                    itemName={dataBattlestation?.name}
                    status={statusDeleteBattlestation}
                />
            </ReactModal>

        </div>
	);
}

export default UpdateBattlestation;