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
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
        
    return (
        <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="h-70 bg-gray-100 rounded p-3">
                {type === "bar" && (
                    data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey={dataKey} fill="#82ca9d" />
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
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
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
                                    nameKey="name"
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