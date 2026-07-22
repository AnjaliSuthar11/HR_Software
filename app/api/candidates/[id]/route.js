import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";


// GET SINGLE CANDIDATE
export async function GET(req, { params }) {
  try {

    const { id } = await params;

    await connectDB();

    const candidate = await Candidate.findById(id);


    if (!candidate) {
      return NextResponse.json(
        {
          success:false,
          message:"Candidate not found"
        },
        {
          status:404
        }
      );
    }


    return NextResponse.json({
      success:true,
      candidate
    });


  } catch(error){

    console.log(error);

    return NextResponse.json(
      {
        success:false,
        message:error.message
      },
      {
        status:500
      }
    );

  }
}




// UPDATE CANDIDATE
export async function PUT(req,{params}){

try{

const {id}=await params;

await connectDB();


const body=await req.json();


const candidate=await Candidate.findByIdAndUpdate(
id,
{
$set:{
...body
}
},
{
new:true
}
);



return NextResponse.json({
success:true,
candidate
});


}
catch(error){

return NextResponse.json(
{
success:false,
message:error.message
},
{
status:500
}
);

}

}