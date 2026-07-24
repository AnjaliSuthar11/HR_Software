const interviews = [
    {
        name:"Aarav Sharma",
        role:"Frontend Developer",
        time:"10:00 AM",
        status:"Scheduled"
    },
    {
        name:"Meera Patel",
        role:"UI Designer",
        time:"2:00 PM",
        status:"Pending"
    }
];

export default function TodaysInterviews(){

    return(

        <div className="bg-white rounded-2xl p-6 shadow">

            <h2 className="font-semibold mb-5">
                Today's Interviews
            </h2>

            <div className="space-y-4">

                {
                    interviews.map((item,index)=>(

                        <div
                        key={index}
                        className="flex justify-between items-center border-b pb-4"
                        >

                            <div>

                                <h3 className="font-semibold">
                                    {item.name}
                                </h3>

                                <p className="text-gray-500 text-sm">
                                    {item.role}
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="font-medium">
                                    {item.time}
                                </p>

                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                                    {item.status}
                                </span>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>

    )

}