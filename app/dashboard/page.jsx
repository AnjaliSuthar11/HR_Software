import {
  Users,
  UserCheck,
  CalendarDays,
  BriefcaseBusiness,
  UserPlus,
} from "lucide-react";

import Link from "next/link";

import DashboardCard from "@/components/DashboardCard";
import RecruitmentChart from "@/components/RecruitmentChart";
import TodaysInterviews from "@/components/TodaysInterviews";
import HiringPipeline from "@/components/HiringPipeline";
import RecentCandidates from "@/components/RecentCandidates";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            Welcome Back
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Recruitment Dashboard
          </h1>

        </div>

        <Link
          href="/dashboard/candidates/add"
          className="bg-[#1E3A8A] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#1d4ed8]"
        >
          <UserPlus size={18}/>
          Add Candidate
        </Link>

      </div>

      {/* Top Cards */}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

        <DashboardCard
          title="Candidates"
          value="126"
          subTitle="+12 this month"
          icon={Users}
        />

        <DashboardCard
          title="Today's Interviews"
          value="18"
          subTitle="6 Pending"
          icon={CalendarDays}
        />

        <DashboardCard
          title="Employees"
          value="54"
          subTitle="24 Hired"
          icon={UserCheck}
        />

        <DashboardCard
          title="Open Positions"
          value="8"
          subTitle="Hiring"
          icon={BriefcaseBusiness}
        />

      </div>

      {/* Middle */}

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <RecruitmentChart/>

        </div>

        <HiringPipeline/>

      </div>

      {/* Bottom */}

      <div className="grid lg:grid-cols-2 gap-6">

        <TodaysInterviews/>

        <RecentCandidates/>

      </div>

    </div>
  );
}