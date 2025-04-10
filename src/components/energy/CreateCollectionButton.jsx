"use client";

import { useRouter } from "next/navigation";
import { Button, Box, useTheme } from "@mui/material";
import { Add as PlusIcon } from "@mui/icons-material";
import { alpha } from "@mui/system";

const CreateCollectionButton = () => {
  const router = useRouter();
  const theme = useTheme(); // Lấy thông tin theme

  const handleCreate = async () => {
    const response = await fetch("/api/collection/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: "New Collection" }),
    });

    if (response.ok) {
      router.push(`/energy/settings`);
    } else {
      console.error("Failed to create collection");
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Button
        variant="outlined"
        startIcon={<PlusIcon />}
        onClick={handleCreate}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "black",
          backgroundColor: alpha(
            theme.palette.background.default,
            0.5 // Độ trong suốt 50%
          ),
          border: `2px solid ${theme.palette.mode === "dark" ? "white" : "black"}`,
          "&:hover": {
            backgroundColor: alpha(
              theme.palette.background.default,
              0.7 // Hover ít trong suốt hơn
            ),
          },
        }}
      >
        Create New Collection
      </Button>
    </Box>
  );
};

export default CreateCollectionButton;
