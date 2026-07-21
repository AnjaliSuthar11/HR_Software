import DashboardCard from "@/components/DashboardCard";
import RecruitmentChart from "@/components/RecruitmentChart";
import TodaysInterviews from "@/components/TodaysInterviews";

import {
Users,
CalendarDays,
UserCheck,
Clock3,
BriefcaseBusiness,
ClipboardList
} from "lucide-react";

export default function Dashboard(){

    return(

<div>

<h1 className="text-3xl font-bold mb-8">
Dashboard
</h1>

<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

<DashboardCard
title="Candidates"
value="7"
icon={Users}
color="bg-blue-500"
/>

<DashboardCard
title="Interviews"
value="2"
icon={CalendarDays}
color="bg-purple-500"
/>

<DashboardCard
title="Employees"
value="5"
icon={UserCheck}
color="bg-green-500"
/>

<DashboardCard
title="Present Today"
value="3"
icon={Clock3}
color="bg-orange-500"
/>

<DashboardCard
title="Pending Followups"
value="3"
icon={ClipboardList}
color="bg-red-500"
/>

<DashboardCard
title="Open Positions"
value="6"
icon={BriefcaseBusiness}
color="bg-indigo-500"
/>

</div>

<div className="grid lg:grid-cols-3 gap-6 mt-8">

<div className="lg:col-span-2">

<RecruitmentChart/>

</div>

<TodaysInterviews/>

</div>

</div>

)

}