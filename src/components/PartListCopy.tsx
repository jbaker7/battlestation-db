import React, {useEffect, useRef, useState} from 'react';

interface Props {
    battlestationId: number | null | undefined,
    parts: {part_id: number, name: string, type_id: number, type_name: string, image: string}[],
    closeFunction: Function
}

function PartListCopy({parts, battlestationId, closeFunction}: Props) {

    const [activeTab, setActiveTab] = useState("reddit");
    const [currentMarkdown, setCurrentMarkdown] = useState("");

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    function changeTab(newTab: string) {
        setActiveTab(newTab);
    }

    function generateMarkdown() {

        let tempMarkdown = "|Parts|\n|-|\n";

        parts.forEach(part => {
            tempMarkdown = tempMarkdown + `|${part.name}|\n`
        })

        if (battlestationId) {
            tempMarkdown = 
                tempMarkdown + `|[^View ^on ^BattlestationDB](https://www.battlestationdb.com/battlestations/${battlestationId})|`
        }
        else {
            tempMarkdown = tempMarkdown + "|[^View ^on ^BattlestationDB](https://www.battlestationdb.com)|"
        }
        
        setCurrentMarkdown(tempMarkdown);
    }

    function generateCsv() {

        let tempCsv = "";

        parts.forEach(part => {
            tempCsv = tempCsv + `${part.name}, \n`
        })
        
        if (battlestationId) {
            tempCsv = 
            tempCsv + `https://www.battlestationdb.com/battlestations/${battlestationId}`
        }
        else {
            tempCsv = tempCsv + "https://www.battlestationdb.com"
        }
        
        setCurrentMarkdown(tempCsv);
    }

    function copyToClipboard() {
        if (textAreaRef.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
        }
    }

    useEffect(() => {
        if (parts) {
            if (activeTab === "reddit") {
                generateMarkdown();
            }
            if (activeTab === "csv") {
                generateCsv();
            }
        }
    }, [parts, activeTab])

    return (
        <div className="flex gap-y-4 w-96 border border-base-content/10 rounded-lg flex-col p-4 bg-base-300">
            <div className="flex flex-row justify-between items-center">
                <span className="text-lg font-semibold mx-3">Copy Part List</span>
                <button className="btn btn-sm btn-ghost"
                onClick={() => closeFunction(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="flex gap-1 border border-base-content/10 p-1 rounded-lg">
                <button className={`flex-1 rounded-md text-center text-sm py-1 px-2 transition-all ${activeTab === "reddit" ? "bg-primary text-primary-content" : "text-base-content"} `}
                onClick={() => changeTab("reddit")}>
                    Reddit Markdown
                    </button> 
                <button className={`flex-1 rounded-md text-center text-sm py-1 px-2 transition-all ${activeTab === "csv" ? "bg-primary text-primary-content" : "text-base-content"} `}
                onClick={() => changeTab("csv")}>
                    CSV
                </button>
            </div>

            <textarea ref={textAreaRef} className="textarea textarea-bordered font-mono leading-tight h-56 bg-base-100 resize-none"
            value={currentMarkdown}>
            </textarea>

            <button onClick={copyToClipboard} className="btn btn-outline btn-sm btn-primary">Copy</button>

        </div>
    )
}

export default PartListCopy;