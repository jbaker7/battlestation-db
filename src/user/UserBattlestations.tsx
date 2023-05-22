import React, {useContext, useState} from 'react';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import {getIdToken} from "firebase/auth";
import ReactModal from 'react-modal';
import {getAllUserBattlestations, IUserBattlestationSummary} from './apiQueries';
import {deleteBattlestation} from '../battlestations/apiQueries';
import {authContext} from '../useAuth';
import usePageTitle from '../usePageTitle';
import UserBattlestationListEntry from './UserBattlestationListEntry';
import DeleteConfirmation from '../components/DeleteConfirmation';
import {modalStyle} from '../modalStyle';
import PartListQueryModal from './partListQueryModal';

function UserBattlestations() {
  usePageTitle("My Battlestations | BattlestationDB");

  const authState = useContext(authContext);
  const queryClient = useQueryClient();
  
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [currentBattlestation, setCurrentBattlestation] = useState<number | null | undefined>();

  const [battlestationToDelete, setBattlestationToDelete] = useState<IUserBattlestationSummary | null>(null);
  
  const {data: dataUserBattlestations, error: errorUserBattlestations, isLoading: isLoadingUserBattlestations} = 
    useQuery<{total: number, battlestations: IUserBattlestationSummary[]}>(['userBattlestations'], async () => getAllUserBattlestations(authState.user!.uid, await getIdToken(authState.user!)));
  
  const {mutate, status, reset} = useMutation(deleteBattlestation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userBattlestations'])
      handleDeleteClose();
      reset();
    }
  })

  function handleDeleteClick(battlestation: IUserBattlestationSummary) {
    if(authState.user) {
      getIdToken(authState.user)
        .then(token => {
          mutate({id: battlestation.battlestation_id, token: token})
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
        
  function handleDeleteClose() {
    setBattlestationToDelete(null);
    reset();
  }

  return (
		<div className="flex flex-col items-center flex-1">
			<div className="flex flex-col w-full p-5">

        <h2 className="text-4xl mb-4 font-semibold self-center">My Battlestations</h2>
        <div className="overflow-x-auto w-full">
          <table className="table table-zebra table-compact w-full flex-1">
            <thead className="sr-only md:not-sr-only">
              <tr>
                <th></th>
                <th>Name</th>
                <th className="pr-5 text-right">Images</th>
                <th className="pr-5 text-right">Parts</th>
                <th className="pr-5 text-right">Favorites</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <>{isLoadingUserBattlestations ? <tr><td colSpan={6}>LOADING...</td></tr> : 
                (dataUserBattlestations && dataUserBattlestations.battlestations.length > 0) ? dataUserBattlestations.battlestations.map(battlestation => 
                  <UserBattlestationListEntry 
                    key={battlestation.battlestation_id}
                    battlestation={battlestation}
                    selectFunction={setCurrentBattlestation}
                    deleteFunction={setBattlestationToDelete}
                    openPartListFunction={setCopyModalIsOpen}
                  />
                ) : 
                dataUserBattlestations && <tr><td colSpan={6}>
                    <div className="flex items-center p-4 gap-2 rounded-lg border border-secondary font-light">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-secondary flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>You haven't uploaded any battlestations yet. Get started <a href="../battlestations/new" className="link link-hover link-secondary">here</a>.</span>
                    </div>
                  </td></tr>
                }
                {errorUserBattlestations &&
                  <tr><td colSpan={6}>
                    <div className="flex items-center p-4 gap-2 rounded-lg border border-error font-light">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Sorry, we were unable to load any battlestations. Please try again later.</span>
                    </div>
                  </td></tr>
                }
              </> 
            </tbody>
          </table>
        </div>
			</div>


      <ReactModal 
        isOpen={battlestationToDelete !== null}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="Delete Confirmation Popup"
        onRequestClose={() => handleDeleteClose()}
        className="flex"
        style={modalStyle}
      >
        <DeleteConfirmation 
          deleteFunction={() => handleDeleteClick(battlestationToDelete!)}
          closeFunction={() => handleDeleteClose()}
          itemName={battlestationToDelete?.name}
          status={status}
        />
      </ReactModal>

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
        <PartListQueryModal battlestationId={currentBattlestation} closeFunction={setCopyModalIsOpen}  />
      </ReactModal>

		</div>
	);
}

export default UserBattlestations;