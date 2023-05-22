import React, {useEffect, useState} from 'react';
import {useCombobox} from 'downshift';
import {useQuery} from '@tanstack/react-query';
import {useFloating, autoUpdate, offset, autoPlacement} from '@floating-ui/react-dom-interactions';
import '../App.css';
import {getAutocomplete, IPartAutoComplete} from '../parts/apiQueries';
import {ReactComponent as LoadingBars} from '../components/loading-bars.svg';

interface Props {
  partTypeId: number
  currentPart?: IPartAutoComplete
  setCurrentPart: Function
  handleEnterButton: Function
}

function PartSelect({partTypeId = 0, currentPart, setCurrentPart, handleEnterButton}: Props) {

  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState<IPartAutoComplete[]>([]);

  const {x, y, reference, floating, strategy} = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      autoPlacement({allowedPlacements: ['top', 'bottom']})
    ]
  });

  const {data: dataAutocomplete, error: errorAutocomplete, isLoading: isLoadingAutocomplete, fetchStatus: statusAutocomplete} = useQuery<IPartAutoComplete[]>(['partAutocomplete', partTypeId], () => getAutocomplete(partTypeId), {
    enabled: inputText.length >= 2,
    onSuccess: (data) => setItems(data.filter(getPartsFilter(inputText)))
  });

  function getPartsFilter(inputValue: string | undefined) {
    return function booksFilter(part: any) {
      return (
        !inputValue ||
        part.name.toLowerCase().includes(inputValue)
      )
    }
  }

  function clearPartInput(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    selectItem(null as any);
    setCurrentPart(null);
  }

  useEffect(() => {
    if (!currentPart) {
      selectItem(null as any);
    }
  }, [currentPart])
     

        
  const {
    isOpen,
    getToggleButtonProps,
    openMenu,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    selectItem
  } = useCombobox({
    onInputValueChange({inputValue}) {
      if (inputValue) {
        setInputText(inputValue)
      }
      if (dataAutocomplete) {
        setItems(dataAutocomplete.filter(getPartsFilter(inputValue)))
      }
    },
    items,
    itemToString(item) {
      return item ? item.name : ''
    },
    onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
      if(newSelectedItem) {
        setCurrentPart(newSelectedItem);
      }
    },
  })

  return (
    <div className="relative flex flex-col w-full" ref={reference}>
      <div
      className="relative flex items-center justify-center" {...getComboboxProps()}>
        <input className="input input-bordered w-full pl-2 pr-14" 
          {...getInputProps({
            onFocus: () => {
              if (inputText.length > 2 || dataAutocomplete) openMenu();
            },
            onKeyDown: (e) => {handleEnterButton(e); if (e.key === "Enter") {selectItem(null as any)}}
          })} 
        />
        <button className="absolute right-0 mt-0 mr-8 text-base-content/50 hover:text-base-content cursor-pointer" tabIndex={-1} aria-label="clear selection"
        onClick={(e) => clearPartInput(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
        aria-label="toggle menu"
        className="absolute right-0 mt-0 mr-2 text-base-content/50 hover:text-base-content cursor-pointer"
        {...getToggleButtonProps()} >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen && "rotate-180"}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
        
      <ul {...getMenuProps({ref: floating})}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      className="absolute w-full z-50 bg-white shadow-md max-h-80 overflow-auto rounded-md custom-scrollbars" >
        {isOpen && (dataAutocomplete ?
          items.map((item, index) => (
            <li className={`${highlightedIndex === index && 'bg-secondary-focus text-secondary-content'}
            ${selectedItem === item && 'bg-accent text-accent-content'}
            py-2 px-3 flex flex-col text-base-200 rounded-md`}
            key={`${item.name}${index}`}
            {...getItemProps({item, index})} >
              <span className="text-sm ">{item.name}</span>
            </li>
          ))
        : (isLoadingAutocomplete && statusAutocomplete !== "idle") ?
          <li className={` py-2 px-3 flex flex-col items-center text-neutral rounded-md`}><LoadingBars className="h-5 w-5" /></li>
        : errorAutocomplete ?
          <li className={`border border-error m-0.5 py-2 px-3 flex flex-col text-base-200 rounded-md`}>Error loading parts</li>
        : null
        )}
      </ul>
    </div>
  )
}

export default PartSelect;