"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip
} from "recharts";

const data = [
    { stage: "Applied", value: 50 },
    { stage: "Screen", value: 40 },
    { stage: "HR", value: 25 },
    { stage: "Tech", value: 18 },
    { stage: "Final", value: 10 },
    { stage: "Selected", value: 7 },
];

export default function RecruitmentChart() {

    return (

        <div className="bg-white rounded-2xl p-6 shadow border">

            <h2 className="font-semibold mb-6">
                Recruitment Funnel
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart data={data}>

                    <XAxis dataKey="stage" />

                    <Tooltip />

                    <Bar
                        dataKey="value"
                        radius={[6,6,0,0]}
                        fill="#2563eb"
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}