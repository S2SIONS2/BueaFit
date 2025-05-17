import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomerSkeleton() {
    return (
        <ul className="rounded-lg bg-gray-100">
            <li className="w-full grid grid-cols-10 px-4 py-3 items-center text-sm hover:bg-gray-50 border border-gray-200 mt-2 rounded-lg cursor-pointer">
                <div>
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <div className="rounded-lg truncate text-ellipsis col-span-2"></div>
                <div className="rounded-lg truncate text-ellipsis col-span-2"></div>
                <div className="rounded-lg truncate text-ellipsis col-span-3"></div>
                <div className="rounded-lg truncate text-ellipsis col-span-2"></div>
            </li>
        </ul>
    )
}