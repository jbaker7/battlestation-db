import React, {useRef, useState} from 'react';
import type {PointerEvent} from "react";
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import FileButton from './FileButton';

interface DropZoneProps {
  currentFiles: (File | string)[]
  onFormChange: (value: any) => void
  onFormBlur: () => void
  formError: any
}

const ImageDropZone = ({currentFiles = [], onFormChange, onFormBlur, formError}: React.PropsWithRef<DropZoneProps>) => {

  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  class SmartPointerSensor extends PointerSensor {
    static activators = [
      {
        eventName: 'onPointerDown' as const,
        handler: ({ nativeEvent: event }: PointerEvent) => {
          return shouldHandleEvent(event.target as HTMLElement)
        }
      }
    ]
  }

  function shouldHandleEvent(element: HTMLElement | null) {
    let cur = element

    while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
        return false
      }
      cur = cur.parentElement
    }

    return true
  }

  const sensors = useSensors(
    useSensor(SmartPointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function removeFile(index: number) {
    currentFiles.splice(index, 1);
    onFormChange(currentFiles);
  }

  function handleDragIn(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }
    
  function handleDragOut(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragActive(false);
  }
    
  function handleDrag(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    var dt = event.dataTransfer;
  //if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.includes('Files'))) {
  if (dt.files.length > 0) {
    if (!isDragActive) {
      setIsDragActive(true);
    }
  }
    
  }
    
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      
      const filesToUpload: File[] = [];
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        if(currentFiles.filter(file => (file instanceof File) && event.dataTransfer.files[i].name === file.name).length === 0) {
          filesToUpload.push(event.dataTransfer.files[i])
        }
      }

      if(filesToUpload.length > 0) {
        currentFiles = [...currentFiles, ...filesToUpload];
        onFormChange(currentFiles);
      }

      event.dataTransfer.clearData();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {

    if (event.target.files && event.target.files.length > 0) {
      
      const filesToUpload: File[] = [];
      for (let i = 0; i < event.target.files.length; i++) {
        filesToUpload.push(event.target.files[i]);
      }

      if(filesToUpload.length > 0) {
        currentFiles = [...currentFiles, ...filesToUpload];
        onFormChange(currentFiles);
      }

      event.target.value = "";
    }
  }

  function handleReorderEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (active.id !== over!.id) {
      
        const oldIndex = currentFiles.findIndex((object: File | string) => {
          let name = typeof object === "string" ? object : object.name;
          return name === active.id
        })

        const newIndex = currentFiles.findIndex((object: File | string) => {
          let name = typeof object === "string" ? object : object.name;
          return name === over!.id
        })
        currentFiles = arrayMove(currentFiles, oldIndex, newIndex);
        onFormChange(currentFiles);
    }
  }

  return (

    <div className="grid w-full group relative"
      onDragEnter={(e) => {handleDragIn(e)}} 
      onDragLeave={(e) => {handleDragOut(e)}} 
      onDragOver={(e) => {handleDrag(e)}} 
      onDrop={(e) => {handleDrop(e)}} 
    >
                
      <label htmlFor="files" className={`bg-base-300 row-start-1 col-start-1 flex flex-col z-40 justify-center items-center w-full h-48 bg-base-200 rounded-lg input input-bordered  cursor-pointer group-hover:bg-base-300
      ${isDragActive ? "border-success bg-success/10" : formError ? "border-error border-dashed" : "border-dashed"} transition-all`}
      >
        <div className={`flex flex-col justify-center items-center pt-5 pb-6
        ${isDragActive? "opacity-100 " : "opacity-75"} transition-all`}>
          <svg aria-hidden="true" className={`mb-3 w-10 h-10 ${currentFiles.length > 0 ? "opacity-10" : "opacity-60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className={`mb-2 text-sm ${currentFiles.length > 0 && "opacity-10"}`}><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className={`text-xs ${currentFiles.length > 0 && "opacity-10"}`}>Only PNG, JPG or GIF</p>
        </div>
        <input 
          ref={fileInputRef}
          id="files" 
          onChange={e => handleInputChange(e)}
          type="file" className="hidden" 
          accept="image/jpeg"
          multiple={true}
        />
      </label>

      {(currentFiles.length > 0) && 
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleReorderEnd}
        >
          <SortableContext 
            items={currentFiles.map(file => typeof file === "string" ? file : file.name)}
            strategy={verticalListSortingStrategy}
          >
            <div className="row-start-1 col-start-1 m-2 border-primary flex flex-row gap-2 z-50 overflow-y-auto overflow-x-hidden cursor-pointer justify-start content-start flex-wrap h-44 rounded-lg"
            onClick={(e) => {if(e.target === e.currentTarget) {fileInputRef.current?.click()}}} >
              {currentFiles.map((file, index) => 
                <FileButton 
                index={index}
                  fileName={file instanceof File ? file.name : file} 
                  fileSize={file instanceof File ? file.size : undefined} 
                  key={`${index}${file}`}
                  removeFile={removeFile} 
                />
              )}
            </div>
          </SortableContext>
        </DndContext>
      }
      {formError && 
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-5 cursor-pointer z-[900] tooltip tooltip-error" data-tip={formError.message}>
          <svg xmlns="http://www.w3.org/2000/svg" className="text-error z-[900]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      }
    </div>
  )
}

export default ImageDropZone;