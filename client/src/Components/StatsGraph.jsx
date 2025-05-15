import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StatGraph = ({ player }) => {
  const data = [
    { label: "Age", value: player.age ?? 0 },
    { label: "Market Value (€M)", value: player.marketValue / 1_000_000 },
  ];

  return (
    <div className="stat-graph" style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#6c63ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatGraph;