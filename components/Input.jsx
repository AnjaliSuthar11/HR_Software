export default function Input({
    label,
    ...props
}){

    return(

        <div>

            <label className="font-medium">
                {label}
            </label>

            <input
                {...props}
                className="w-full border rounded-lg mt-2 p-3"
            />

        </div>

    )

}