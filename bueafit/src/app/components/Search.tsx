import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchComponent() {
    return (
        <label className="rounded-[20px] border border-gray-300 flex items-center justify-between min-w-[300px] pl-[10px] pr-[10px]">
            <input 
                type="text" 
                className="focus:outline-none focus-visible:outline-none appearance-none focus-visible:outline-0 outline-[0px] no-clear-button text-[14px] p-1"
                placeholder="고객명 혹은 연락처"
            />
            <button type="submit" className="cursor-pointer text-gray-700">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </label>
    )
}