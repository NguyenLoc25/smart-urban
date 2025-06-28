"use client";
import { useEffect, useState } from "react";

export default function ARVideo() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = document.querySelector("#videoTexture");
    const videoEntity = document.querySelector("#videoEntity");
    const arContent = document.querySelector("#arContent");
    const config = document.querySelector("#config");

    let animationInterval;
    let currentPointIndex = 0;
    let isAnimating = false;

    const getPointPositions = () => {
      const points = document.querySelectorAll(".point");
      return Array.from(points).map((p) => p.getAttribute("position"));
    };

    const updateLines = () => {
      const positions = getPointPositions();
      const lines = document.querySelectorAll(".connecting-line");
      lines.forEach((line, i) => {
        const next = (i + 1) % positions.length;
        line.setAttribute("line", {
          start: `${positions[i].x} ${positions[i].y} ${positions[i].z}`,
          end: `${positions[next].x} ${positions[next].y} ${positions[next].z}`,
          color: config.getAttribute("line-color"),
        });
      });
    };

    const moveToNextPoint = () => {
      const positions = getPointPositions();
      currentPointIndex = (currentPointIndex + 1) % positions.length;
      const next = positions[currentPointIndex];
      videoEntity.setAttribute("animation", {
        property: "position",
        to: `${next.x} ${next.y} ${next.z + 0.01}`,
        dur: parseInt(config.getAttribute("move-duration")),
        easing: "easeInOutQuad",
      });
    };

    const startAnimation = () => {
      if (isAnimating) return;
      isAnimating = true;
      const moveDur = parseInt(config.getAttribute("move-duration"));
      const pauseDur = parseInt(config.getAttribute("pause-duration"));
      const pos = getPointPositions();

      if (pos.length === 0) return;

      videoEntity.setAttribute("position", `${pos[0].x} ${pos[0].y} ${pos[0].z + 0.01}`);

      const animate = () => {
        for (let i = 1; i <= pos.length; i++) {
          setTimeout(() => {
            if (i < pos.length) moveToNextPoint();
            else {
              setTimeout(() => {
                currentPointIndex = 0;
                videoEntity.setAttribute("animation", {
                  property: "position",
                  to: `${pos[0].x} ${pos[0].y} ${pos[0].z + 0.01}`,
                  dur: moveDur,
                  easing: "easeInOutQuad",
                });
              }, pauseDur);
            }
          }, (moveDur + pauseDur) * (i - 1));
        }
      };

      animate();
      animationInterval = setInterval(animate, (moveDur + pauseDur) * pos.length);
    };

    const stopAnimation = () => {
      isAnimating = false;
      clearInterval(animationInterval);
      videoEntity.removeAttribute("animation");
    };

    const onMarkerFound = () => {
      video.play().catch((e) => {
        console.error("Video play error:", e);
        setError("Failed to play video");
      });
      arContent.setAttribute("visible", "true");
      startAnimation();
    };

    const onMarkerLost = () => {
      arContent.setAttribute("visible", "false");
      stopAnimation();
    };

    const handleSceneError = (e) => {
      console.error("AR Scene Error:", e);
      setError("Failed to initialize AR scene");
    };

    const marker = document.querySelector("a-marker-camera");
    if (marker) {
      marker.addEventListener("markerFound", onMarkerFound);
      marker.addEventListener("markerLost", onMarkerLost);
    }

    document.addEventListener("componentchanged", (e) => {
      if (e.detail.name === "position" && e.target.classList.contains("point")) {
        updateLines();
      }
    });

    return () => {
      if (marker) {
        marker.removeEventListener("markerFound", onMarkerFound);
        marker.removeEventListener("markerLost", onMarkerLost);
      }
      stopAnimation();
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      backgroundColor: 'black'
    }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          zIndex: 1001,
          textAlign: 'center'
        }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; cameraParametersUrl: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat"
        onLoaded={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Scene error:", e);
          setError("AR initialization failed");
        }}
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <a-assets>
          <video
            id="videoTexture"
            autoPlay
            loop
            muted
            crossOrigin="anonymous"
            playsInline
            src="https://res.cloudinary.com/dkkaz58hl/video/upload/v1751094058/Hydro_v2_viii4z.mp4"
          />
        </a-assets>

        <a-entity
          id="config"
          visible="false"
          video-width="0.7"
          video-height="0.4"
          video-depth="0.01"
          point-radius="0.05"
          point-color="#FF3E96"
          line-color="#118AFF"
          line-width="0.02"
          move-duration="1500"
          pause-duration="1000"
        />

        {isLoading && (
          <a-entity position="0 0 -1">
            <a-text value="Loading AR..." align="center" color="white" width="5"></a-text>
          </a-entity>
        )}

        <a-entity id="arContent" visible="false">
          <a-entity id="pointsContainer">
            {["-0.6 -0.2 0", "-0.3 0.1 0", "0 0.4 0", "0.3 0.1 0", "0.6 -0.2 0"].map((pos, i) => (
              <a-sphere
                key={i}
                class="point"
                position={pos}
                radius="0.05"
                color="#FF3E96"
                draggable=""
                super-hands="colliderEvent: raycaster-intersected; colliderEventProperty: els; colliderEndEvent: raycaster-intersected-cleared; colliderEndEventProperty: els"
              />
            ))}
          </a-entity>

          <a-entity id="linesContainer">
            <a-entity class="connecting-line" line="start: -0.6 -0.2 0; end: -0.3 0.1 0; color: #118AFF" />
            <a-entity class="connecting-line" line="start: -0.3 0.1 0; end: 0 0.4 0; color: #118AFF" />
            <a-entity class="connecting-line" line="start: 0 0.4 0; end: 0.3 0.1 0; color: #118AFF" />
            <a-entity class="connecting-line" line="start: 0.3 0.1 0; end: 0.6 -0.2 0; color: #118AFF" />
            <a-entity class="connecting-line" line="start: 0.6 -0.2 0; end: -0.6 -0.2 0; color: #118AFF" />
          </a-entity>

          <a-entity id="videoEntity" position="-0.6 -0.2 0.01">
            <a-box
              class="video-box"
              position="0 0 0"
              width="0.7"
              height="0.4"
              depth="0.01"
              rotation="-90 0 0"
              material="shader: flat; src: #videoTexture"
            />
          </a-entity>
        </a-entity>

        <a-marker-camera 
          type="pattern" 
          url="/energy/pattern-hydro.patt" 
          emitevents="true" 
          onError={() => setError("Marker pattern not found")}
        />
      </a-scene>
    </div>
  );
}