import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { getChartData } from "../utils/analytics";
import { useEffect, useState } from "react";

export default function ChartsSection() {

    const [data, setData] = useState({
        revenueByDate: [],
        storeData: []
    });

    useEffect(() => {
        setData(getChartData());
    }, []);

    return (
        <div className="space-y-6">

            {/* 📈 Revenue Chart */}
            <div className="bg-gray-200 p-6 rounded-xl border">
                <h2 className="text-lg text-blue-500 font-semibold mb-4">📈 Revenue Trend</h2>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueByDate}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563eb"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}