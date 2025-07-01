import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import styled from 'styled-components';

const ARContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #000000 0%, #0a0a2a 100%);
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
`;

const EnterButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 32px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 100;
  text-transform: uppercase;
  letter-spacing: 2px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 
              0 0 40px rgba(100, 150, 255, 0.2);
  transition: all 0.3s ease;
  outline: none;
  user-select: none;
  animation: pulse 2s infinite;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #fff;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.6), 
                0 0 50px rgba(100, 150, 255, 0.3);
  }

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 14px 24px;
  }
`;

const ARVideo = () => {
  const mountRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const animationState = useRef({
    frameId: null,
    running: true,
    lastFrameTime: null,
    startTime: null,
    speedMultiplier: 1.0,
    interactionTime: 0
  });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000022, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height), 
      1.2, // strength
      0.6, // radius
      0.2  // threshold
    );
    composer.addPass(bloomPass);

    // Glitch effect (disabled by default)
    const glitchPass = new GlitchPass();
    glitchPass.enabled = false;
    composer.addPass(glitchPass);

    // Color palettes
    const pinkColors = ['#ff00cc', '#ff66ff', '#cc00aa', '#ff3399', '#ff0099', '#ff99cc']
      .map(c => new THREE.Color(c));
    const blueColors = ['#00ccff', '#0066ff', '#00ffff', '#0099ff', '#00aaff', '#33ccff']
      .map(c => new THREE.Color(c));
    const purpleColors = ['#aa00ff', '#cc33ff', '#9900cc', '#bb66ff', '#8800aa', '#dd99ff']
      .map(c => new THREE.Color(c));
    
    // Beam parameters
    const beamLength = 100;
    const beamWidth = 0.2;
    const baseSpeed = 2.0;

    // Create tapered beam geometry
    const createTaperedBeamGeometry = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array(12);
      
      // Tapered shape (wider at bottom)
      vertices[0] = -beamWidth/2; vertices[1] = 0; vertices[2] = 0;
      vertices[3] = beamWidth/2; vertices[4] = 0; vertices[5] = 0;
      vertices[6] = -beamWidth/4; vertices[7] = beamLength; vertices[8] = 0;
      vertices[9] = beamWidth/4; vertices[10] = beamLength; vertices[11] = 0;
      
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      
      const uvs = new Float32Array(8);
      uvs[0] = 0; uvs[1] = 0;
      uvs[2] = 1; uvs[3] = 0;
      uvs[4] = 0.25; uvs[5] = 1;
      uvs[6] = 0.75; uvs[7] = 1;
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      
      geometry.setIndex([0, 1, 2, 1, 3, 2]);
      
      return geometry;
    };

    const beamGeometry = createTaperedBeamGeometry();

    // Materials with gradient effect
    const createBeamMaterial = (color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 64);
      gradient.addColorStop(0, color.clone().offsetHSL(0, 0, 0.2).getStyle());
      gradient.addColorStop(0.5, color.getStyle());
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      
      return new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true, 
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
    };

    const pinkMaterials = pinkColors.map(createBeamMaterial);
    const blueMaterials = blueColors.map(createBeamMaterial);
    const purpleMaterials = purpleColors.map(createBeamMaterial);

    // Beam groups
    const pinkBeams = new THREE.Group();
    const blueBeams = new THREE.Group();
    const purpleBeams = new THREE.Group();
    scene.add(pinkBeams, blueBeams, purpleBeams);

    const beams = [];
    const beamCount = 36;
    const maxSpread = 25;

    // Create beams
    for (let i = 0; i < beamCount; i++) {
      const type = i % 3; // 0: pink, 1: blue, 2: purple
      let materials, group;
      
      if (type === 0) {
        materials = pinkMaterials;
        group = pinkBeams;
      } else if (type === 1) {
        materials = blueMaterials;
        group = blueBeams;
      } else {
        materials = purpleMaterials;
        group = purpleBeams;
      }
      
      const isLeader = Math.random() < 0.1; // 10% chance to be a leader
      const mat = materials[i % materials.length].clone();
      
      const x = ((i / beamCount) * 2 - 1) * maxSpread;
      const z = type === 0 ? -300 : (type === 1 ? 50 : -150);
      
      const mesh = new THREE.Mesh(beamGeometry, mat);
      mesh.position.set(x, -1, z);
      mesh.rotation.x = Math.PI / 2;
      
      // Add slight random rotation for more organic feel
      mesh.rotation.z = (Math.random() - 0.5) * 0.2;
      
      const speedMultiplier = isLeader ? 2.5 : 0.7 + Math.random() * 0.6;
      const speed = (type === 1 ? -1 : 1) * baseSpeed * speedMultiplier;
      
      if (isLeader) {
        mesh.scale.set(1.5, 1.5, 1.5);
        mat.opacity = 1.0;
      }
      
      group.add(mesh);
      beams.push({
        beam: mesh,
        speed,
        isLeader,
        originalZ: z,
        offset: Math.random() * 100,
        type
      });
    }

    // Horizontal beams with improved design
    const horizontalBeamGeometry = new THREE.PlaneGeometry(50, 0.2);
    const horizontalBeams = new THREE.Group();
    scene.add(horizontalBeams);
    
    for (let i = 0; i < 12; i++) {
      const color = new THREE.Color(
        i % 2 === 0 ? 0x4488ff : 0xff44aa
      ).offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
      
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const mesh = new THREE.Mesh(horizontalBeamGeometry, mat);
      mesh.position.set(0, -1, -60 - i * 25);
      mesh.rotation.y = Math.PI / 2;
      
      // Add slight wave effect
      mesh.userData = {
        originalY: -1,
        waveOffset: Math.random() * Math.PI * 2
      };
      
      horizontalBeams.add(mesh);
      beams.push({
        beam: mesh,
        speed: 2.0,
        originalZ: mesh.position.z,
        isHorizontal: true
      });
    }

    // Improved particle system
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a larger volume
      posArray[i] = (Math.random() - 0.5) * 200;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 500 - 100;
      
      // Color variation
      const color = new THREE.Color(
        Math.random() > 0.7 ? 
          0xffffff : 
          (Math.random() > 0.5 ? 0x44aaff : 0xff44aa)
      );
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
      
      // Size variation
      sizeArray[i / 3] = Math.random() * 0.1 + 0.05;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation control
    let velocity = 0;
    let targetVelocity = 1.0;
    let acceleration = 0.3;

    const animate = (now = performance.now()) => {
      if (!animationState.current.running) return;

      if (!animationState.current.startTime) {
        animationState.current.startTime = now / 1000;
      }

      const delta = Math.min((now - (animationState.current.lastFrameTime || now)) / 1000, 0.05);
      animationState.current.lastFrameTime = now;
      const time = now / 1000 - animationState.current.startTime;

      animationState.current.frameId = requestAnimationFrame(animate);

      // Smooth velocity changes
      if (velocity < targetVelocity) {
        velocity = Math.min(velocity + acceleration * delta, targetVelocity);
      } else if (velocity > targetVelocity) {
        velocity = Math.max(velocity - acceleration * delta, targetVelocity);
      }

      // Camera movement with more interesting path
      camera.position.z = 10 + Math.sin(time * 0.3) * 1.5;
      camera.position.y = 1 + Math.sin(time * 0.5) * 0.5;
      camera.rotation.z = Math.sin(time * 0.2) * 0.05;

      // Update beams
      beams.forEach(b => {
        if (!b.isHorizontal) {
          b.beam.position.z += b.speed * 100 * delta * velocity;
          
          // Reset position when out of bounds
          if ((b.speed > 0 && b.beam.position.z > 100) || 
              (b.speed < 0 && b.beam.position.z < -350)) {
            b.beam.position.z = b.originalZ;
          }
          
          // Pulsing effect
          const pulse = Math.sin(time * 3 + b.offset) * 0.3 + 0.7;
          b.beam.material.opacity = (b.isLeader ? 1.0 : 0.7) * pulse * velocity;
          
          // Leader beam special effects
          if (b.isLeader) {
            b.beam.rotation.z = Math.sin(time * 2 + b.offset) * 0.1;
            b.beam.material.color.offsetHSL(0, 0, Math.sin(time * 5) * 0.05);
          }
        } else {
          // Horizontal beam wave effect
          b.beam.position.y = b.beam.userData.originalY + Math.sin(time * 2 + b.beam.userData.waveOffset) * 0.3;
          b.beam.position.z += b.speed * 60 * delta * velocity;
          
          if (b.beam.position.z > 100) {
            b.beam.position.z = -200;
          }
        }
      });

      // Particle animation
      particles.rotation.y += 0.002 * 60 * delta * velocity;
      particles.rotation.x += 0.001 * 60 * delta * velocity;
      
      // Dynamic bloom intensity
      bloomPass.strength = 1.0 + Math.sin(time * 1.5) * 0.3;
      
      // Glitch effect during high velocity
      glitchPass.enabled = velocity > 2.5;
      glitchPass.goWild = velocity > 3.0;
      
      composer.render();
    };

    // Enhanced interaction handler
    const handleInteraction = () => {
      targetVelocity = 4.0;
      animationState.current.interactionTime = performance.now();
      
      // Briefly enable glitch effect
      glitchPass.enabled = true;
      setTimeout(() => {
        glitchPass.enabled = false;
      }, 500);
      
      // Gradually return to normal speed
      setTimeout(() => {
        targetVelocity = 1.0;
      }, 2000);
    };

    mountRef.current.addEventListener('mousedown', handleInteraction);
    mountRef.current.addEventListener('touchstart', handleInteraction);

    // Add mouse move effect
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      camera.position.x = x * 0.5;
      camera.position.y = 1 + y * 0.3;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    mountRef.current.appendChild(renderer.domElement);
    animate();
    setIsReady(true);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    document.addEventListener('visibilitychange', () => {
      animationState.current.running = !document.hidden;
      if (animationState.current.running) {
        animationState.current.lastFrameTime = performance.now();
        animate();
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeEventListener('mousedown', handleInteraction);
      mountRef.current?.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationState.current.frameId);
      animationState.current.running = false;
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Clean up all geometries and materials
      [beamGeometry, horizontalBeamGeometry, particlesGeometry].forEach(g => g.dispose());
      
      const allMaterials = [
        ...pinkMaterials, 
        ...blueMaterials, 
        ...purpleMaterials,
        particlesMaterial
      ];
      allMaterials.forEach(m => m.dispose());
      
      renderer.dispose();
    };
  }, []);

  return (
    <ARContainer>
      <div ref={mountRef} />
      {isReady && (
        <EnterButton onClick={() => window.open('https://my-webar.vercel.app/', '_blank')}>
          ENTER AR WORLD
        </EnterButton>
      )}
    </ARContainer>
  );
};

export default ARVideo;