"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Legend, Pie, Cell,} from "recharts";

type ChartType = "bar" | "line" | "pie"; 

interface ChartsProps {
  title: string;
  data: Array<{ name: string } & { [key: string]: number | string }>;
  dataKey: string;
  type: ChartType
}

export default function Charts({ title, data, dataKey, type }: ChartsProps) {
    const COLORS = ["#959dd6", "#c0d695", "#ffc658", "#ff8042", "#d69595", "aa95d6", "f1eba1"];
    const xAxisKey = data?.[0]?.name ? "name" : "staff_name";

        
    return (
        <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="h-70 bg-gray-100 rounded p-3">
                {type === "bar" && (
                    data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={xAxisKey} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey={dataKey} fill="#d69595" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            데이터가 없습니다.
                        </div>
                    )
                )}

                {type === "line" && (
                    data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={xAxisKey} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey={dataKey} stroke="#f1eba1" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            데이터가 없습니다.
                        </div>
                    )
                )}
                {type === "pie" && (
                    data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip />
                                <Legend />
                                <Pie
                                    data={data}
                                    dataKey={dataKey}
                                    nameKey={xAxisKey}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) :  (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            데이터가 없습니다.
                        </div>
                    )
                )}

            </div>
        </div>
    );
}