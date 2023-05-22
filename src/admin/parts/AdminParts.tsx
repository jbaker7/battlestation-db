import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ReactModal from 'react-modal';
import {useQueryClient, useQuery, useMutation} from '@tanstack/react-query';
import {getIdToken} from "firebase/auth";
import {authContext} from '../../useAuth';
import '../admin.css';
import AdminPartListEntry from './AdminPartListEntry';
import {getPartTypes, getAllParts, deletePart, IPart, IPartTypes, QueryParams} from './apiQueries';

import DeleteConfirmation from '../../components/DeleteConfirmation';

import AdminPartForm from './AdminPartForm';
import {ReactComponent as LoadingBars} from '../../components/loading-bars.svg';

function AdminParts() {

  let {partType} = useParams();
  const authState = useContext(authContext);
  const queryClient = useQueryClient();

  const [formVisible, setFormVisible] = useState(false);
  const [partToEdit, setPartToEdit] = useState<IPart | null>(null);
  const [partToDelete, setPartToDelete] = useState<IPart | null>(null);

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

  const {data, error, isLoading} = useQuery<IPartTypes[]>(['partTypes'], getPartTypes, {staleTime: (1000 * 60 * 60 * 24)});

  const [queryParams, setQueryParams] = 
  useState<QueryParams>({pageNumber: 1, resultsPerPage: 10, sortBy: "name", direction: "asc", partType: partType});

  //const {data: allPartsData, error: allPartsError, isLoading: allPartsLoading} = useQuery<IPart[]>(['parts', queryParams], () => getAllParts(queryParams));
  //const {data: partCount, error: errorPartCount, isLoading: isLoadingPartCount} = useQuery<{total: string}>(['parts', 'partCount'], () => getPartCount());

  const {data: dataParts, error: errorParts, isLoading: isLoadingParts} = useQuery<{total: number, parts: IPart[]}>(['parts', queryParams], () => getAllParts(queryParams));
    

  const {mutate, status, reset} = useMutation(deletePart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['parts'])
      handleDeleteClose();
      reset();
    },
    onError: () => {
    }
  })

  useEffect(() => {
    setQueryParams({...queryParams, partType: partType})
}, [partType])

  useEffect(() => {
    let tempPageArray: number[] = [];
    if(dataParts) {
      for (let i = 1; i <= Math.ceil(dataParts.total / queryParams.resultsPerPage); i++) 
      {
        tempPageArray.push(i);
      }
    }
    else {
      tempPageArray = [1];
    }
    setPageArray([...tempPageArray])
  }, [dataParts?.total])

  // useEffect(() => {
    
  //     let partTypeId: number | null = null;
  //     if (data) {
  //       let el = data.find(el => el.type_path === partType);
  //       partTypeId = el ? el.type_id : null;
  //     }
     
  //     setQueryParams({...queryParams, partTypeId: partTypeId})
    
  // }, [partType])

  function closePartForm() {
    setPartToEdit(null);
    setFormVisible(false);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let value = e.target.value;
    
    if(e.target.id === "resultsPerPageSelect") {
      setQueryParams({...queryParams, resultsPerPage: parseInt(value)})
    }
    if(e.target.id === "pageNumberSelect") {
      setQueryParams({...queryParams, pageNumber: parseInt(value)})
    }
  }

  function handleSearchInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === "Enter" && e.target.value.length > 0) {
      setQueryParams({...queryParams, searchTerm: e.target.value})
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

  function handleDeleteClick(part: IPart) {
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

  function getPartName(): string {
    let partTypeName: string = "";
    if (data) {
      let el = data.find(el => el.type_path === partType);
      partTypeName = el ? el.type_name : "";
    }
    return partTypeName;
  }

  function handleButtonPageChange(direction: string) {
    if(direction === "prev") {
      if(queryParams.pageNumber > 1) {
        setQueryParams({...queryParams, pageNumber: queryParams.pageNumber - 1})
      }
    }
    if(direction === "next") {
      if(queryParams.pageNumber < pageArray.length) {
        setQueryParams({...queryParams, pageNumber: queryParams.pageNumber + 1})
      }
    }
  }


    return (
      <div className="flex-1 flex flex-col">
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div className="stat-title">Total Likes</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">Page Views</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <img src="https://placeimg.com/128/128/people" />
                </div>
              </div>
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Tasks done</div>
            <div className="stat-desc text-secondary">31 tasks remaining</div>
          </div>
        </div>

        <div className="flex items-end ml-3 my-6">
          <h2 className="text-4xl ">Parts</h2>
          <span className="text-4xl mx-2 font-thin text-secondary">/</span>
          <span className="text-xl font-light capitalize">{partType ? getPartName() : "All"}</span>
        </div>

        <div className="flex flex-row">
          <div className="block border-base-300 bg-base-200 mr-6 rounded-lg">
              
              <ul className="my-1 px-1 w-max">
                 
                  {data ? data.map((partType, index) =>{
                    return <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                    after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0" key={`${partType}${index}`}>
                      <Link className="block py-3 px-7" to={`/admin/parts/${partType.type_path}`}>{partType.type_name}</Link></li>})
                    : isLoading ? <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                    after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0">Loading...</li>
                    : error ? <li className="hover:bg-neutral-content/5 transition-all rounded-md after:border-neutral-content/10 
                    after:block after:w-[80%] after:my-0 after:mx-auto after:border-b last:after:border-0">Unable to load part categories.</li>
                    : <li></li>
                    }
              </ul>
          
          </div>
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
              value={queryParams.resultsPerPage} className="select select-bordered max-w-xs hover:bg-secondary-focus hover:text-secondary-content">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            </div>
            </div>

            {(!isLoadingParts && !errorParts) && 
            <div className="ml-2 text-sm">Viewing {dataParts? dataParts.total : "unknown"} parts</div>}
          
            <table className="table table-compact table-zebra w-full">
              <thead className="">
                <tr>
                  <th className="px-4 opacity-75">
                    <span onClick={() => handleSort("name")} className="cursor-pointer">
                      Name
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      className={`inline h-5 w-5 mr-1 text-primary ${queryParams.sortBy !== "name" ? "invisible" : queryParams.direction === "asc" ? "" : "rotate-180"}`}
                      viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </th>
                  <th className="pl-4 opacity-75">
                    <span onClick={() => handleSort("battlestation_count")} className="cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      className={`inline h-5 w-5 mr-1 text-primary ${queryParams.sortBy !== "battlestation_count" ? "invisible" : queryParams.direction === "asc" ? "" : "rotate-180"}`}
                      viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      Battlestations
                    </span>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingParts ? 
                  (dataParts && dataParts.parts instanceof Array) ? dataParts.parts.map(part => 
                    <AdminPartListEntry
                      key={part.part_id}
                      part={part}
                      clickFunction={setPartToEdit}
                      deleteFunction={setPartToDelete}
                    />
                  )
                  : errorParts ? <tr><td colSpan={4}>{errorParts as string}</td></tr>
                    : <tr><td colSpan={3}>No parts found.</td></tr>
                : <tr><td colSpan={3}><LoadingBars className="max-h-16 py-3 text-secondary mx-auto" /></td></tr>
                }
              </tbody>
            </table>
            <div className="flex items-stretch self-center">
            <button className="btn rounded-r-none"
            onClick={() => handleButtonPageChange("prev")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="11 7 6 12 11 17" />
                <polyline points="17 7 12 12 17 17" />
              </svg>
            </button>

            <div className="relative group">
              <select id="pageNumberSelect" onChange={e => handleSelectChange(e)} value={queryParams.pageNumber}
              className="h-full bg-neutral hover:bg-secondary-focus hover:text-secondary-content text-neutral-content border-x border-neutral-focus pl-4 pr-8 outline-none appearance-none">
                {
                  pageArray.map(page =>
                    <option value={page} key={page}>{page}</option>
                  )
                }
              </select>
              <label className="absolute top-1/2 -translate-y-1/2 right-3.5 group-hover:text-secondary-content text-neutral-content  pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 20" stroke-width="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </label>
            </div>

            <button className="btn rounded-l-none"
            onClick={() => handleButtonPageChange("next")}>
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
        isOpen={formVisible || partToEdit !== null}
        appElement={document.getElementById('root') as HTMLElement}
        contentLabel="New/Update Store Form"
        onRequestClose={() => closePartForm()}
        className="flex"
        style={modalStyle}
      >
        <AdminPartForm
          closeModal={closePartForm} 
          initialValues={partToEdit}
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

export default AdminParts;