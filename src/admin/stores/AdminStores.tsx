import React, {useState, useEffect, useContext} from 'react';
import {useQueryClient, useMutation, useQuery} from '@tanstack/react-query';
import ReactModal from 'react-modal';
import {getIdToken} from "firebase/auth";
import {authContext} from '../../useAuth';

import {getAllStores, getStoreCount, deleteStore, IStore, QueryParams} from './apiQueries';

import AdminStoreListEntry from './AdminStoreListEntry';
import AdminStoreForm from './AdminStoreForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import {ReactComponent as LoadingBars} from '../../components/loading-bars.svg';


function AdminStores() {

  const [formVisible, setFormVisible] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<IStore | null>(null);
  const [storeToEdit, setStoreToEdit] = useState<IStore | null>(null);
  const [pageArray, setPageArray] = useState<number[]>([]);

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

  const queryClient = useQueryClient();
  const authState = useContext(authContext);

  const [queryParams, setQueryParams] = 
    useState<QueryParams>({pageNumber: 1, resultsPerPage: 10, sortBy: "name", direction: "asc"});

  const {data: dataStores, error: errorStores, isLoading: isLoadingStores} = useQuery<IStore[]>(['stores', queryParams], () => getAllStores(queryParams));
  const {data: storeCount, error: errorStoreCount, isLoading: isLoadingStoreCount} = useQuery<{total: string}>(['storeCount', queryParams], getStoreCount);

  useEffect(() => {
    let tempPageArray: number[] = [];
    if(storeCount) {
      for (let i = 1; i <= Math.ceil(parseInt(storeCount.total) / queryParams.resultsPerPage); i++) 
      {
        tempPageArray.push(i);
      }
    }
    else {
      tempPageArray = [1];
    }
    setPageArray([...tempPageArray])
  }, [storeCount])

  const {mutate, status, reset} = useMutation(deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores'])
      handleDeleteClose();
    },
  })

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let value = e.target.value;
    
    if(e.target.id === "resultsPerPageSelect") {
      setQueryParams({...queryParams, resultsPerPage: parseInt(value)})
    }
    if(e.target.id === "pageNumberSelect") {
      setQueryParams({...queryParams, pageNumber: parseInt(value)})
    }
  }

  function handleSort(column: string) {
    let newDirection: "asc" | "desc";
    if(queryParams.sortBy === column) {
      if (queryParams.direction === "asc") {
        newDirection = "desc";
      }
      else {newDirection = "asc"}
    } 
    else {
      newDirection = "asc";
    }
    setQueryParams({...queryParams, sortBy: column, direction: newDirection})
  }

  function handleSearchInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === "Enter" && e.target.value.length > 0) {
      setQueryParams({...queryParams, searchTerm: e.target.value})
    }
  }

  function closeStoreForm() {
    setStoreToEdit(null);
    setFormVisible(false);
  }

  function handleDeleteClick(store: IStore) {
    if(authState.user) {
      getIdToken(authState.user)
        .then(token => {
          mutate({id: store.store_id, token: token})
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  function handleDeleteClose() {
    setStoreToDelete(null);
    reset();
  }

  return (
    <div className="flex-1 flex flex-col">

      <div className="flex items-end ml-3 mt-1 mb-7">
        <h2 className="text-4xl ">Stores</h2>
      </div>

      <div className="flex flex-row">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-6">
            <button onClick={() => setFormVisible(true)} className="btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="3 3 18 18" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New
            </button>
            <input onKeyDown={e => handleSearchInput(e)} type="text" placeholder="Search" className="input input-bordered w-full max-w-xs mr-auto" />
            <div className="flex gap-2">
              <label className="label">
                <span className="label-text">Results per page:</span>
            
              </label>
              <select id="resultsPerPageSelect" onChange={e => handleSelectChange(e)}
              value={queryParams.resultsPerPage} className="select select-bordered max-w-xs">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            </div>
            
          </div>

          {(!isLoadingStoreCount && !errorStoreCount) && 
          <div className="ml-2 text-sm">Viewing {dataStores ? dataStores.length : "unknown"} of {storeCount? storeCount.total : "unknown"} stores.</div>}
          
          <table className="table table-compact table-zebra w-full">
            <thead className="">
              <tr className="">
                <th className="px-4 opacity-75" onClick={() => handleSort("name")}>Name
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`inline h-5 w-5 mr-1 text-primary ${queryParams.sortBy !== "name" ? "invisible" : queryParams.direction === "asc" ? "" : "rotate-180"}`}
                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
                </th>
                <th className="px-4 opacity-75" onClick={() => handleSort("url")}>URL
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`inline h-5 w-5 mr-1 text-primary ${queryParams.sortBy !== "url" ? "invisible" : queryParams.direction === "asc" ? "" : "rotate-180"}`}
                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <polyline points="6 9 12 15 18 9" />
                  </svg>
                </th>
                <th className="px-4 opacity-75" onClick={() => handleSort("part_count")}>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`inline h-5 w-5 mr-1 text-primary ${queryParams.sortBy !== "part_count" ? "invisible" : queryParams.direction === "asc" ? "" : "rotate-180"}`}
                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <polyline points="6 9 12 15 18 9" />
                  </svg>
                  Parts
                </th>
                <th className="px-4 opacity-75"></th>
              </tr>
            </thead>

            <tbody>
              {!isLoadingStores ? 
                (dataStores && dataStores instanceof Array) ? dataStores.map(store => 
                  <AdminStoreListEntry
                    store={store}
                    key={store.store_id}
                    clickFunction={setStoreToEdit}
                    deleteFunction={setStoreToDelete}
                  />
                )
                : errorStores ? <tr><td colSpan={4}>{errorStores as string}</td></tr>
                  : <tr><td colSpan={4}>No stores found.</td></tr>
              : <tr><td colSpan={4}><LoadingBars className="max-h-16 py-3 text-secondary mx-auto" /></td></tr>
              }
            </tbody>
          </table>

          <div className="flex items-stretch self-center">
            <button className="btn rounded-r-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="11 7 6 12 11 17" />
                <polyline points="17 7 12 12 17 17" />
              </svg>
            </button>

            <div className="relative">
              <select id="pageNumberSelect" onChange={e => handleSelectChange(e)} value={queryParams.pageNumber}
              className="h-full bg-neutral text-neutral-content border-x border-neutral-content pl-4 pr-8 focus:outline-primary rounded-sm focus:outline-offset-0 outline-none appearance-none">
                {
                  pageArray.map(page =>
                    <option value={page} key={page}>{page}</option>
                  )
                }
              </select>
              <label className="absolute top-1/2 -translate-y-1/2 right-3.5 text-neutral-content pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 20" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </label>
            </div>

            <button className="btn rounded-l-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="7 7 12 12 7 17" />
                <polyline points="13 7 18 12 13 17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ReactModal 
        isOpen={formVisible || storeToEdit !== null}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="New/Update Store Form"
        onRequestClose={() => closeStoreForm()}
        className="flex"
        style={modalStyle}
      >
        <AdminStoreForm
          closeModal={closeStoreForm} 
          initialValues={storeToEdit}
        />
      </ReactModal>

      <ReactModal 
        isOpen={storeToDelete !== null}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="Delete Confirmation Popup"
        onRequestClose={() => handleDeleteClose()}
        className="flex"
        style={modalStyle}
      >
        <DeleteConfirmation 
          deleteFunction={() => handleDeleteClick(storeToDelete!)}
          closeFunction={() => handleDeleteClose()}
          itemName={storeToDelete?.name}
          status={status}
        />
      </ReactModal>
    </div>
  )
}

export default AdminStores;