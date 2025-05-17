import React from "react";
import { Select, MenuItem } from "@mui/material";
import { energyTypes } from "./constants";

const CategorySelector = ({ selectedCategory, onChange }) => (
  <div className="mb-6">
    <Select
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-64"
      sx={{
        "& .MuiSelect-select": {
          py: 1.5,
          borderRadius: "12px",
          backgroundColor: "background.paper",
          color: "text.primary",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    >
      {Object.entries(energyTypes).map(([key, { label, icon }]) => (
        <MenuItem key={key} value={key}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </div>
        </MenuItem>
      ))}
    </Select>
  </div>
);

export default CategorySelector;