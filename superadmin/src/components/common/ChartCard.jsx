import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { MoreVert, Download } from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: '#1e293b',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: '10px',
        p: 1.5,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      {payload.map((entry, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
          <Typography variant="caption" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const ChartCard = ({ title, subtitle, type = 'line', data, dataKeys, colors = COLORS, height = 300, showGrid = true }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />}
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: colors[i % colors.length] }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />}
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  fill={`${colors[i % colors.length]}20`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />}
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[6, 6, 0, 0]} barSize={30} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color || colors[i % colors.length]} stroke="none" />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {title}
          </Typography>
        }
        subheader={subtitle && (
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {subtitle}
          </Typography>
        )}
        sx={{ pb: 0, '& .MuiCardHeader-action': { mt: 0 } }}
      />
      <CardContent sx={{ pt: 2 }}>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
