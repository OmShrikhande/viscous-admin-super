import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = '#6366f1', subtitle }) => {
  const isPositive = trend === 'up';

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(148,163,184,0.08)',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient blob */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `${color}10`,
          filter: 'blur(20px)',
        }}
      />
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1.85rem', lineHeight: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 26 }} />
            </Box>
          )}
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositive ? '#10b981' : '#ef4444',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {trendValue}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
