import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useDebounce } from '../../hooks/useCommon';

const DataTable = ({
  columns,
  data,
  title,
  searchable = true,
  searchPlaceholder = 'Search...',
  filters = [],
  onRefresh,
  actions,
  emptyMessage = 'No data available',
  defaultSortBy = '',
  defaultSortOrder = 'asc',
  rowsPerPageOptions = [5, 10, 25],
  onRowClick,
  stickyHeader = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[1] || 10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [activeFilters, setActiveFilters] = useState({});

  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPage(0);
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          if (col.searchable === false) return false;
          const value = row[col.id];
          return value != null && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((row) => String(row[key]).toLowerCase() === String(value).toLowerCase());
      }
    });

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy] ?? '';
        const bVal = b[sortBy] ?? '';
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [data, debouncedSearch, activeFilters, sortBy, sortOrder, columns]);

  const paginatedData = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mr: 'auto' }}>
            {title}
          </Typography>
        )}

        {searchable && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 220,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(148,163,184,0.06)',
                borderRadius: '10px',
                fontSize: '0.85rem',
              },
            }}
          />
        )}

        {filters.map((filter) => (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 130 }}>
            <Select
              value={activeFilters[filter.key] || 'all'}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              sx={{
                background: 'rgba(148,163,184,0.06)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                '& .MuiSelect-select': { py: 1 },
              }}
            >
              <MenuItem value="all">{filter.label}</MenuItem>
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {onRefresh && (
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} sx={{ color: '#94a3b8' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Active filter chips */}
        {Object.entries(activeFilters).filter(([, v]) => v && v !== 'all').length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {Object.entries(activeFilters)
              .filter(([, v]) => v && v !== 'all')
              .map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  size="small"
                  onDelete={() => handleFilterChange(key, 'all')}
                  sx={{ fontSize: '0.7rem', height: 24 }}
                />
              ))}
          </Box>
        )}
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: stickyHeader ? 600 : 'auto' }}>
        <Table stickyHeader={stickyHeader} size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    width: col.width,
                    minWidth: col.minWidth,
                    background: '#1e293b',
                    ...(stickyHeader && { position: 'sticky', top: 0, zIndex: 1 }),
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        '&.MuiTableSortLabel-root': { color: '#94a3b8' },
                        '&.Mui-active': { color: '#818cf8' },
                        '& .MuiTableSortLabel-icon': { color: '#818cf8 !important' },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && <TableCell align="right" sx={{ background: '#1e293b' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': { background: 'rgba(148,163,184,0.04)' },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || 'left'} sx={{ py: 1.5 }}>
                      {col.render ? col.render(row[col.id], row) : (
                        <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                          {row[col.id] ?? '—'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={processedData.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={{
          borderTop: '1px solid rgba(148,163,184,0.06)',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.8rem',
            color: '#94a3b8',
          },
        }}
      />
    </Paper>
  );
};

export default DataTable;
