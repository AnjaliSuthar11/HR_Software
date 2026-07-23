"use client";

import {useEffect,useState} from "react";
import axios from "axios";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  Eye,
  UserPlus
} from "lucide-react";

export default function CandidatesPage(){


const [candidates,setCandidates]=useState([]);



useEffect(()=>{

loadCandidates();

},[]);




const loadCandidates=async()=>{

try{

const {data}=await axios.get(
"/api/candidates"
);


if(data.success){

setCandidates(data.candidates);

}


}catch(error){

console.log(error);

}

};



return(
<div className="p-8">


<div className="flex justify-between items-center mb-8">


<h1 className="text-3xl font-bold">
Candidates
</h1>



<Link
href="/dashboard/candidates/add"
className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
>

<UserPlus size={20}/>

Add Candidate

</Link>


</div>





<div className="space-y-4">



{
candidates.map((candidate)=>(


<div

key={candidate._id}

className="bg-white shadow-md rounded-xl p-5 flex md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition flex-col "

>



{/* Candidate Info */}

<div className="flex items-center gap-5 min-w-[300px]">


<div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">

{
candidate.fullName?.charAt(0)
}

</div>



<div>


<h2 className="text-lg font-bold">
{candidate.fullName}
</h2>


<p className="text-gray-600 text-sm">
{candidate.email}
</p>


<p className="text-gray-600 text-sm">
{candidate.mobile}
</p>


</div>



</div>





{/* wraping rto right side */}
<div className="flex  gap-2 ">


{/* Status */}


<div className="flex items-center gap-3">

  {/* Status Badge */}

  <span
    className={`px-4 py-2 rounded-xl text-white text-sm font-semibold
    ${
      candidate.finalStatus === "Selected"
        ? "bg-green-600"
        : candidate.finalStatus === "Rejected"
        ? "bg-red-600"
        : candidate.finalStatus === "On Hold"
        ? "bg-yellow-500"
        : candidate.finalStatus === "Joined"
        ? "bg-blue-600"
        : candidate.round2?.communication
        ? "bg-purple-600"
        : candidate.round1?.communication
        ? "bg-orange-500"
        : ""
    }`}
  >
  {
candidate.finalStatus &&
candidate.finalStatus !== "New"
  ? candidate.finalStatus
  : candidate.round2?.communication
  ? "Round 2 Completed"
  : candidate.round1?.communication
  ? "Round 1 Completed"
  : ""
}
      
  </span>

  {/* Action Button */}

  {!candidate.round1?.communication && (
    <Link
      href={`/dashboard/candidates/${candidate._id}`}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Start Round 1
    </Link>
  )}

  {candidate.round1?.communication &&
    !candidate.round2?.communication && (
      <Link
        href={`/dashboard/candidates/${candidate._id}`}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
      >
        Start Round 2
      </Link>
    )}

  {candidate.round2?.communication &&
    !candidate.finalStatus && (
      <Link
        href={`/dashboard/candidates/${candidate._id}`}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
      >
        Final Decision
      </Link>
    )}


</div>








{/* Actions */}


<div className="flex items-center gap-3">


<a

href={`tel:${candidate.mobile}`}

className="p-3 rounded-full bg-green-100 text-green-700 hover:bg-green-200"

title="Call"

>

<Phone size={20}/>

</a>





<a

href={`https://wa.me/91${candidate.mobile}`}

target="_blank"

className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200"

title="WhatsApp"

>

<MessageCircle size={20}/>

</a>






<a

href={`mailto:${candidate.email}`}

className="p-3 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"

title="Email"

>

<Mail size={20}/>

</a>






<Link

href={`/dashboard/candidates/${candidate._id}`}

className="p-3 rounded-full bg-gray-900 text-white hover:bg-black"

title="View"

>

<Eye size={20}/>

</Link>



</div>


</div>


</div>


))


}



</div>



</div>

)


}