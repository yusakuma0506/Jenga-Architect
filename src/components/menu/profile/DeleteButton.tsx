


export default function DeleteButton({id}:{id: string}){

    const deleteHandler =()=>{


    }

    return(
        <button className="text-red-900 text-left text-[9px] uppercase hover:text-red-700 transition-colors ml-3"
            onClick={deleteHandler}
        >
            Delete Account
        </button>
    )
}