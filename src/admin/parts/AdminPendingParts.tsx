import React, {useContext, useState} from 'react';
import ReactModal from 'react-modal';
import {useQueryClient, useQuery, useMutation} from '@tanstack/react-query';
import {getIdToken} from "firebase/auth";
import {authContext} from '../../useAuth';
import '../admin.css';
import {getPendingParts, PendingPart, deletePendingPart, updatePendingPart} from './apiQueries';

import DeleteConfirmation from '../../components/DeleteConfirmation';
import AdminPartForm from './AdminPartForm';
import {ReactComponent as LoadingBars} from '../../components/loading-bars.svg';

function AdminPendingParts() {

  const authState = useContext(authContext);
  const queryClient = useQueryClient();

  const [formVisible, setFormVisible] = useState(false);
  const [partToEdit, setPartToEdit] = useState<PendingPart | null>(null);
  const [partToDelete, setPartToDelete] = useState<PendingPart | null>(null);

  const modalStyle: ReactModal.Styles =  {
    overlay: {
      backgroundColor: 'rgba(15, 15, 15, 0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: '500'
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  const {data: dataParts, error: errorParts, isLoading: isLoadingParts} = useQuery<PendingPart[]>(['pendingParts'], () => getPendingParts({token: authState.initialToken!}));

  const {mutate, status, reset} = useMutation(deletePendingPart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingParts'])
      handleDeleteClose();
      reset();
    },
    onError: () => {
    }
  })

  const {mutate: mutateStatus, status: mutateStatusStatus, reset: resetMutateStatus} = useMutation(updatePendingPart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingParts'])
      resetMutateStatus();
    },
    onError: () => {
    }
  })

  function closePartForm() {
    setPartToEdit(null);
    setFormVisible(false);
  }

  function handleDeleteClick(part: PendingPart) {
    if(authState.user) {
      getIdToken(authState.user)
        .then(token => {
          mutate({id: part.part_id, token: token})
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  function handleDeleteClose() {
    setPartToDelete(null);
    reset();
  }

  return (
    <div className="flex-1 flex flex-col">

      <div className="flex items-end ml-3 my-6">
        <h2 className="text-4xl">Pending Parts</h2>
      </div>

      <div className="flex flex-row">
        <div className="flex-1 flex flex-col gap-4">

          {(!isLoadingParts && !errorParts) && 
          <div className="ml-2 text-sm">Viewing {dataParts? dataParts.length : "unknown"} parts</div>}
        
          <table className="table table-compact table-zebra w-full">
            <thead className="">
              <tr>
                <th className="px-4 opacity-75">Name</th>
                <th className="pl-4 opacity-75">URL</th>
                <th className="pl-4 opacity-75">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingParts ? 
                (dataParts && dataParts instanceof Array) ? dataParts.map(part => 

                  <tr key={part.part_id} className="table-row hover group cursor-pointer" 
                  onClick={() => {setPartToEdit(part)}}
                  >
                    <td className="px-4"><span className="text-accent">{part.name}</span></td>
                    <td className="w-1 text-right pl-4">
                      <div className="flex flex-row align-center gap-1">
                        <span className="h-5">{part.url}</span>
                        <button 
                        onClick={(e) => {e.stopPropagation(); setPartToDelete(part)}} 
                        title="Copy" className="text-neutral-content/75 invisible group-hover:visible hover:text-accent">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <rect x="8" y="8" width="12" height="12" rx="2" />
                            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td className="w-1 text-center pl-3">
                      <span 
                      className={`border rounded-md text-xs uppercase px-1 py-0.5 ${part.status === "pending"? "border-error bg-error/25" : "border-primary bg-primary/25"}`}>
                        {part.status}
                      </span>
                    </td>

                    <td className="w-1 text-right pr-2 ">
                      <button 
                      onClick={(e) => {e.stopPropagation(); setPartToDelete(part)}} 
                      title="Delete" className="p-1 rounded-lg text-neutral-content invisible hover:bg-neutral-focus/50 hover:text-error group-hover:visible">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
                : errorParts ? <tr><td colSpan={4}>{errorParts as string}</td></tr>
                  : <tr><td colSpan={4}>No parts found.</td></tr>
              : <tr><td colSpan={4}><LoadingBars className="max-h-16 py-3 text-secondary mx-auto" /></td></tr>
              }
            </tbody>
          </table>
          
        </div>
      
      </div>

      <ReactModal 
      isOpen={formVisible || partToEdit !== null}
      appElement={document.getElementById('root') as HTMLElement}
      contentLabel="New/Update Store Form"
      onRequestClose={() => closePartForm()}
      className="flex"
      style={modalStyle}
      >
        <AdminPartForm
          closeModal={closePartForm} 
          initialValues={null}
          approvalId={partToEdit?.part_id}
          approveFunction={mutateStatus}
        />
      </ReactModal>

      <ReactModal 
        isOpen={partToDelete !== null}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="Delete Confirmation Popup"
        onRequestClose={() => handleDeleteClose()}
        className="flex"
        style={modalStyle}
      >
        <DeleteConfirmation 
          deleteFunction={() => handleDeleteClick(partToDelete!)}
          closeFunction={() => handleDeleteClose()}
          itemName={partToDelete?.name}
          status={status}
        />
      </ReactModal>
    </div>
  )
}

export default AdminPendingParts;