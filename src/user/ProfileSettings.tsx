import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import usePageTitle from '../usePageTitle';
import {useForm} from "react-hook-form";
import {getIdToken} from "firebase/auth";
import {AxiosError} from 'axios';
import {authContext} from '../useAuth';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {IUser, getUserProfile, updateUser, deleteUser} from './apiQueries';
import {ReactComponent as LoadingCircle} from '../components/loading-circles.svg';
import FormErrorTag from '../components/FormErrorTag';
import SettingsSkeleton from './SettingsSkeleton';
import DeleteConfirmation from '../components/DeleteConfirmation';
import {modalStyle} from '../modalStyle';
import ReactModal from 'react-modal';

function ProfileSettings() {
    usePageTitle("Profile Settings | BattlestationDB");
    const authState = useContext(authContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [submitError, setSubmitError] = useState("");
    const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false);

    type FormInputs = {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    const {register, handleSubmit, watch, reset, formState: {errors, dirtyFields, isDirty}} = useForm<FormInputs>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });

    const {data: dataUserProfile, isError: isErrorUserProfile, isLoading: isLoadingUserProfile} = 
        useQuery<IUser>({queryKey: ['userProfile'], queryFn: async () => getUserProfile(authState.user?.uid!, await getIdToken(authState.user!))});
    
    useEffect(() => {
        if(dataUserProfile) {
            reset({
                username: dataUserProfile.username, 
                email: dataUserProfile.email,
                password: "",
                confirmPassword: "",
            })
        }
    }, [dataUserProfile, reset])

    const {mutate: mutateUserProfile, 
        isLoading: isUpdatingUserProfile, 
        isError: isErrorUpdateUserProfile,
        isSuccess: isSuccessUpdateUserProfile} = useMutation(updateUser, {
        onSuccess: () => {
            queryClient.refetchQueries({queryKey: ['userProfile']});
        },
        onError: error => {
            console.log(error)
            if (error instanceof AxiosError) {
                setSubmitError(error?.response?.data ? error.response.data : error.message);
            }
        }
    });

    const {mutate: deleteUserProfile, 
        status: statusDeleteUserProfile} = useMutation(deleteUser, {
        onSuccess: () => {
            authState.firebaseAuth.signOut();
            navigate("/", {replace: true});
        },
        onError: error => {
            console.log(error);
            if (error instanceof AxiosError) {
                setSubmitError(error?.response?.data ? error.response.data : error.message);
            }
        }
    })

    function handleUpdate(data: FormInputs) {
        interface anyIndex {[key: string]: string};
        let changedData: anyIndex = {};

        Object.entries(dirtyFields).forEach(([key, value]) => {
            changedData[key] = data[key as keyof FormInputs];
        })

        let jsonData = JSON.stringify(changedData);

        if(authState.user) {
            getIdToken(authState.user)
            .then(token => {
                mutateUserProfile({id: authState.user!.uid, data: jsonData, token: token})
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
                deleteUserProfile({id: authState.user!.uid, token: token})
            })
            .catch(error => {
                console.log(error);
                setSubmitError("Authentication error.");
            })
        }
    }

    return (
		<div className="relative flex flex-row flex-1">
			<div className="flex flex-col mx-auto w-full md:w-2/3 xl:w-1/3 p-5">

                <h2 className="text-4xl pb-6 font-semibold self-center">Settings</h2>
                {isLoadingUserProfile ? 
                <SettingsSkeleton /> :
                <div className="form-control flex-1">
                    <div className={`flex flex-row flex-1 text-sm items-center border border-error text-base-content/90 bg-error/10 rounded-lg 
                    transition-all duration-300 ${isErrorUserProfile ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden  "}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Current profile could not be loaded.</span>
                    </div>
                    <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col flex-1">
                        <label htmlFor="username" className="label mt-2 flex flex-row">
                            <span className="label-text">Username</span>
                            {errors.username && <FormErrorTag>{errors.username.message}</FormErrorTag>}
                        </label>
                        <div className="relative flex items-center justify-center">
                            <input {...register("username", 
                            {minLength: {value: 6, message: "Must be at least 6 characters."}, 
                            maxLength: {value: 64, message: "Must be less than 64 characters."}})} 
                                id="username" type="text" 
                                className={`input input-bordered bg-base-200 w-full ${errors.username && "pr-9"}`} />
                            {errors.username && 
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

                        <label htmlFor="email" className="label mt-2">
                            <span className="label-text">Email Address</span>
                            {errors.email && <FormErrorTag>{errors.email.message}</FormErrorTag>}
                        </label>
                        <div className="relative flex items-center justify-center">
                            <input {...register("email")} 
                                id="email" type="email" 
                                className={`input input-bordered bg-base-200 w-full ${errors.email && "pr-9"}`} />
                            {errors.email ? 
                                <div className="absolute right-0 mt-0 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <circle cx="12" cy="12" r="9" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                            : dirtyFields.email && 
                                <div className="absolute right-0 mt-0 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-warning" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <circle cx="12" cy="12" r="9" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                            }
                        </div>
                        <div className={`flex flex-row flex-1 text-sm items-center border border-warning text-base-content/90 bg-warning/10 rounded-lg 
                        transition-all duration-300 ${dirtyFields.email ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden  "}`}>
                            <span>Changing your email address will cause you to be logged out.</span>
                        </div>
                        
                        <label htmlFor="password" className="label mt-2">
                            <span className="label-text">Password</span>
                            {errors.password && <FormErrorTag>{errors.password.message}</FormErrorTag>}
                        </label>
                        <div className="relative flex items-center justify-center">
                            <input {...register("password", {minLength: {value: 6, message: "Must be at least 6 characters."}})} 
                                id="password" type="password" 
                                className={`input input-bordered bg-base-200 w-full ${errors.password && "pr-9"}`} />
                            {errors.password && 
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

                        <label htmlFor="confirm-password" className="label mt-2">
                            <span className="label-text">Confirm Password</span>
                            {errors.confirmPassword && <FormErrorTag>{errors.confirmPassword.message}</FormErrorTag>}
                        </label>
                        <div className="relative flex items-center justify-center">
                            <input {...register("confirmPassword", {minLength: {value: 6, message: "Must be at least 6 characters."},
                                validate: (val: string) => {
                                    if (watch('password') !== val) {
                                        return "Passwords do not match.";
                                    }
                                }    
                            })} 
                                id="confirm-password" type="password" 
                                className={`input input-bordered bg-base-200 w-full ${errors.confirmPassword && "pr-9"}`} />
                            {errors.confirmPassword && 
                            <div className="absolute right-0 mt-0 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="12" cy="12" r="9" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>}
                        </div>

                        <div className={`flex flex-row flex-1 text-sm items-center border border-error text-base-content/90 bg-error/10 rounded-lg 
                        transition-all duration-300 ${isErrorUpdateUserProfile ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{submitError}</span>
                        </div>

                        <div className={`flex flex-row flex-1 text-sm items-center border border-success text-base-content/90 bg-success/10 rounded-lg 
                        transition-all duration-300 ${(isSuccessUpdateUserProfile && !isDirty) ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-success flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Profile Saved</span>
                        </div>

                        <div className="flex flex-row gap-4 mt-6 mb-6">
                            <button type="submit" disabled={!isDirty || isUpdatingUserProfile} className={`btn btn-primary btn-outline flex-1`}>
                                {isUpdatingUserProfile ? <LoadingCircle className="h-4/5 text-primary" /> : "Save"}
                            </button>
                        </div>

                        <button type="button" className="btn btn-ghost hover:btn-error mt-auto w-full text-base-content/75"
                        onClick={() => setDeleteConfirmationIsOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                            Delete account
                        </button>
                    </form>
                </div>}
			</div>

            <ReactModal 
                isOpen={deleteConfirmationIsOpen}
                appElement={document.getElementById('root') as HTMLElement}
                contentLabel="Delete Confirmation Popup"
                onRequestClose={() => setDeleteConfirmationIsOpen(false)}
                className="flex justify-center items-center w-4/5"
                style={modalStyle}
            >
                <DeleteConfirmation 
                    deleteFunction={handleDelete}
                    closeFunction={() => setDeleteConfirmationIsOpen(false)}
                    itemName={"your account"}
                    status={statusDeleteUserProfile}
                />
            </ReactModal>

		</div>
	);
}

export default ProfileSettings;