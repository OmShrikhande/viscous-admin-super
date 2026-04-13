import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Button } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action, actionIcon: ActionIcon, onAction }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext sx={{ fontSize: 16, color: '#475569' }} />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, i) => (
            <Link
              key={i}
              underline="hover"
              onClick={() => crumb.path && navigate(crumb.path)}
              sx={{
                color: i === breadcrumbs.length - 1 ? '#f1f5f9' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
                cursor: crumb.path ? 'pointer' : 'default',
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9', mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Button
            variant="contained"
            startIcon={ActionIcon && <ActionIcon />}
            onClick={onAction}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {action}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
