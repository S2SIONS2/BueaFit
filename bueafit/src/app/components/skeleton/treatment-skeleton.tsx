import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TreatmentSkeleton() {
    return (
        <article className="cursor-pointer p-3 shadow rounded-md mb-4 border border-gray-300 bg-gray-50">
            <h3 className="list-none font-bold text-base flex items-center justify-end">                
                <span>
                    <FontAwesomeIcon icon={faBars} />
                </span>
            </h3>

            <div className="mt-3 space-y-2">
                <div className="border border-gray-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"></div>
            </div>
        </article>
    )
}