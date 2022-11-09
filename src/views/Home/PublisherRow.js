import React from "react"
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { Link } from "react-router-dom"
export default function PublisherRow(props) {

    const { id } = props

    return (
        <Link to={`/inbox/${id}`} className="p-4 flex items-center hover:bg-black hover:text-white">
            <div>
                <p className="font-medium">NeoNewsToday.com · {id}</p>
                <p className="text-xs">NSiV...DMPM</p>
            </div>
            <div className="ml-auto">
                <ChevronRightIcon className="w-6 h-6" />
            </div>
        </Link>
    )
}