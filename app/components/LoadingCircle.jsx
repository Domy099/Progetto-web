"use client";
import { Box, CircularProgress, } from '@mui/material';
import theme from '@/public/theme';
export default function LoadingCircle() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress sx={{ color: theme.palette.coloriCustom.light }} />
        </Box>
    );
}