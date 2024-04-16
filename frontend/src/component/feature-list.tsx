import { Search, ClipboardPlus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Shell, ExternalLink } from "lucide-react"
import { IconButton } from "./icon-button"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect, useState } from "react"
import { Table } from "./table/table"
import { TableCell } from "./table/table-cell"
import { TableHeader } from "./table/table-header"
import { TableRow } from "./table/table-row"
import { FeatureModal } from "./feature-modal"

dayjs.extend(relativeTime)

interface Feature {
    id: string
    type: string
    attributes: {
        external_id : string
        magnitude : number
        place : string
        time : string
        tsunami : boolean
        mag_type : string
        title : string
        coordinates : {
            longitude : number
            latitude : number
        }
    }
    links: {
        external_url: string
    }
}

export function FeatureList() {

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [perPage, setPerPage] = useState(1000)
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [totalFeatures, setTotalFeatures] = useState(0)
    const [features, setFeatures] = useState<Feature[]>([])

    const [showModal, setShowModal] = useState(false)
    const [selectedFeature, setSelectedFeature] = useState<Feature>({} as Feature)

    useEffect(() => {
        handleFetchFeatures()
    }, [page])

    async function handleFetchFeatures() {
        const url = new URL("http://localhost:3000/api/features")
        url.searchParams.append("page", page.toString())
        url.searchParams.append("perPage", perPage.toString())

        if (search) {
            url.searchParams.append("mag_type", search)
        }

        setIsLoading(true)
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setFeatures(data.data as Feature[])
            setPerPage(data.pagination.per_page)
            setTotalFeatures(data.pagination.total)
            setTotalPages(Math.ceil(data.pagination.total / data.pagination.per_page))

            setIsLoading(false)
        })
    }

    function handleSearch() {
        setPage(1)
        handleFetchFeatures()
    }

    function handleOpenModal(feature: Feature) {
        setShowModal(true)
        setSelectedFeature(feature)
    }

    function handleCloseModal() {
        setShowModal(false)
        setSelectedFeature({} as Feature)
    }

    function goToFirstPage() {
        setPage(1)
    }

    function goToPreviousPage() {
        setPage(page - 1)
    }

    function goToNextPage() {
        setPage(page + 1)
    }

    function goToLastPage() {
        setPage(totalPages)
    }

    if (isLoading) {
        return (
            <div className="flex flex-row items-center justify-center gap-2">
                <Shell/> Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Features</h1>
                <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
                    <input 
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="flex-1 bg-transparent outline-none focus-ring-0"
                        placeholder="Filter by magnitude type"
                    />
                    <IconButton 
                        transparent
                        onClick={handleSearch}
                    >
                        <Search className="size-4" />
                    </IconButton>
                </div>
            </div>

            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader>Id</TableHeader>
                        <TableHeader>Title</TableHeader>
                        <TableHeader>Place</TableHeader>
                        <TableHeader>Time</TableHeader>
                        <TableHeader style={{ width: 64 }} >Magnitude</TableHeader>
                        <TableHeader>Mag Type</TableHeader>
                        <TableHeader style={{ width: 64 }} >Tsunami</TableHeader>
                        <TableHeader>Coordinates</TableHeader>
                        <TableHeader></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature) => {
                        return (
                            <TableRow key={feature.id}>
                                <TableCell>{feature.attributes.external_id}</TableCell>
                                <TableCell>{feature.attributes.title}</TableCell>
                                <TableCell>{feature.attributes.place}</TableCell>
                                <TableCell>{dayjs().to(feature.attributes.time)}</TableCell>
                                <TableCell style={{ width: 64 }}>{feature.attributes.magnitude}</TableCell>
                                <TableCell>{feature.attributes.mag_type}</TableCell>
                                <TableCell style={{ width: 64 }}>
                                    {feature.attributes.tsunami ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span>Lat: {feature.attributes.coordinates.latitude}</span>
                                        <span>Lon: {feature.attributes.coordinates.longitude}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row gap-1">
                                        <a href={feature.links.external_url} target="_blank">
                                            <IconButton transparent>
                                                <ExternalLink className="size-4" />
                                            </IconButton>
                                        </a>

                                        <IconButton 
                                            onClick={() => handleOpenModal(feature)}
                                            transparent
                                        >
                                            <ClipboardPlus className="size-4" />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-3 px-4 text-sm text-zinc-300" colSpan={3}>
                            Showing {perPage} of {totalFeatures} items
                        </td>
                        <td className="py-3 px-4 text-sm text-zinc-300 text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>Page {page} of {totalPages}</span>
                            
                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </Table>

            {showModal &&
                <FeatureModal
                    onClose={handleCloseModal}
                    feature={selectedFeature}
                />
            }
        </div>
    )
}