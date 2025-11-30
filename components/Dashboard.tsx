import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { AppState, ExecutionLog } from '../types';

interface DashboardProps {
  appState: AppState;
  logs: ExecutionLog[];
  themeColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({ appState, logs, themeColor }) => {
  // Aggregate logs for chart
  const successCount = logs.filter(l => l.type === 'success').length;
  const errorCount = logs.filter(l => l.type === 'error').length;
  const infoCount = logs.filter(l => l.type === 'info').length;

  const data = [
    { name: 'Success', value: successCount },
    { name: 'Error', value: errorCount },
    { name: 'Info', value: infoCount },
  ];

  // XP Progress Mock Data
  const xpData = [
    { step: 1, xp: Math.max(0, appState.experience - 50) },
    { step: 2, xp: Math.max(0, appState.experience - 20) },
    { step: 3, xp: appState.experience },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-theme-text">Execution Metrics</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="var(--text-color)" />
              <YAxis stroke="var(--text-color)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--accent)', color: 'var(--text-color)' }}
              />
              <Bar dataKey="value" fill={themeColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-theme-text">Experience Growth</h3>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="step" hide />
              <YAxis stroke="var(--text-color)" />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--accent)', color: 'var(--text-color)' }}
              />
              <Line type="monotone" dataKey="xp" stroke="var(--accent)" strokeWidth={3} dot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;