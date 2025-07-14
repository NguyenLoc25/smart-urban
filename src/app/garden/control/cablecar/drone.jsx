// src/app/garden/control/cablecar/drone.jsx

"use client";

import React from "react";
import "./styles.css";

export default function DroneAnimation({ isOn }) {
  return (
    <div className="drone-container">
      <div className="drone-body">
        <img
          src="/garden/canhquat.png"
          className={`propeller top-left ${isOn ? "spin" : ""}`}
          alt="Cánh quạt"
        />
        <img
          src="/garden/canhquat.png"
          className={`propeller top-right ${isOn ? "spin" : ""}`}
          alt="Cánh quạt"
        />
        <img
          src="/garden/canhquat.png"
          className={`propeller bottom-left ${isOn ? "spin" : ""}`}
          alt="Cánh quạt"
        />
        <img
          src="/garden/canhquat.png"
          className={`propeller bottom-right ${isOn ? "spin" : ""}`}
          alt="Cánh quạt"
        />

        <div className="drone-center"></div>
      </div>
    </div>
  );
}
