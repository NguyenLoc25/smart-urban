"use client";

import { useRouter } from "next/navigation";
import { Button, Box, useTheme } from "@mui/material";
import { Add as PlusIcon } from "@mui/icons-material";
import { alpha } from "@mui/system";

const CreateCollectionButton = () => {
  const router = useRouter();
  const theme = useTheme(); // Lấy thông tin theme

  const handleCreate = async () => {
    router.push(`/energy/settings`);
  };

  return (
    <Box 
      display="flex" 
      justifyContent="flex-end" 
      mb={2}
      sx={{
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          right: 0,
          bottom: -8,
          width: '100%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main}, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease'
        },
        '&:hover::before': {
          opacity: 0.7
        }
      }}
    >
      <Button
        variant="outlined"
        startIcon={<PlusIcon sx={{ transition: 'transform 0.2s ease' }} />}
        onClick={handleCreate}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : theme.palette.text.primary,
          backgroundColor: alpha(
            theme.palette.background.paper,
            0.7
          ),
          border: `1px solid ${alpha(
            theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
            0.3
          )}`,
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          px: 3,
          py: 1.5,
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.05)}`,
          transition: 'all 0.3s ease',
          "&:hover": {
            backgroundColor: alpha(
              theme.palette.background.paper,
              0.9
            ),
            borderColor: alpha(
              theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
              0.7
            ),
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
            '& .MuiButton-startIcon': {
              transform: 'translateX(-2px)'
            }
          },
          "&:active": {
            transform: 'scale(0.98)'
          }
        }}
      >
        Create New Collection
      </Button>
    </Box>
  );
};

export default CreateCollectionButton;
