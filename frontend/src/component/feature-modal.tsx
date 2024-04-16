import { useEffect, useState } from "react";
import { IconButton } from "./icon-button";
import { Send, X } from "lucide-react";
import { Table } from "./table/table";
import { TableRow } from "./table/table-row";
import { TableCell } from "./table/table-cell";

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

interface Comment {
    id: string
    feature_id: string
    body: string
    created_at: string
    updated_at: string
}

interface FeatureModalProps {
    feature: Feature
    onClose: () => void
}

export function FeatureModal({ onClose, feature }: FeatureModalProps) {

    const [comment, setComment] = useState("")
    const [comments, setComments] = useState<Comment[]>([])

    function handleCloseModal() {
        onClose()
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
        if (event.key === "Escape") {
            handleCloseModal();
        }
    }

    function handleSendComment() {        
        const url = new URL(`http://localhost:3000/api/features/${feature.id}/comments`)

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body: comment })
        })
        .then(response => {
            console.log(response)
            setComment("")
            handleCloseModal()
        })
    }

    useEffect(() => {
        const url = new URL(`http://localhost:3000/api/features/${feature.id}/comments`)

        fetch(url)
        .then(response => response.json())
        .then(data => 
            setComments(data)
        )
        
    }, [feature.id])

    return (
        <dialog
            onKeyDown={handleKeyDown}
            className="modal fixed w-6/12 mx-auto flex flex-col gap-5 bg-zinc-950 text-zinc-50 border border-zinc-800 rounded-lg shadow-lg z-50 backdrop-blur-md"
        >
            <div>
                <h2 className="text-2xl font-bold px-4 py-3">Comments for feature {feature.attributes.external_id}</h2>
                <IconButton
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2"
                >
                    <X />
                </IconButton>
            </div>
            
            <div className="flex flex-col pb-4 px-4 gap-5">
                <div className="max-h-52 overflow-auto">
                    <Table>
                        <tbody>
                            {comments.length === 0 ? (
                                <TableRow>
                                    <TableCell>No comments yet</TableCell>
                                </TableRow>
                            ) : 
                                comments.map(comment => (
                                    <TableRow key={comment.id}>
                                        <TableCell>{comment.body}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>

                <div className="flex flex-col h-25">
                    <textarea
                        name="comment"
                        rows={4}
                        cols={40}
                        value={comment}
                        placeholder="Write your comment here..."
                        onChange={(event) => setComment(event.target.value)}
                        className="flex-1 bg-transparent outline-none focus-ring-0"
                    />

                    <IconButton
                        onClick={handleSendComment}
                        disabled={comment.trim() === ""}
                    >
                        <div className="flex flex-row items-center justify-center gap-4">
                            <span>Send </span>
                            <Send />
                        </div>
                    </IconButton>
                </div>
            </div>
        </dialog>
    )
}