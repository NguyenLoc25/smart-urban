import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import styled from 'styled-components';

const ARContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
`;

const EnterButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 14px 28px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 28px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  outline: none;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 12px 22px;
  }
`;

const ARVideo = () => {
  const mountRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const animationState = useRef({
    frameId: null,
    running: true,
    lastFrameTime: null,
    startTime: null
  });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2)); // Limit for mobile performance

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.6, 0.2, 0.05);
    composer.addPass(bloomPass);

    const pinkColors = ['#ff00cc', '#ff66ff', '#cc00aa', '#ff3399', '#ff0099', '#ff99cc'].map(c => new THREE.Color(c));
    const blueColors = ['#00ccff', '#0066ff', '#00ffff', '#0099ff', '#00aaff', '#33ccff'].map(c => new THREE.Color(c));

    const beamGeometry = new THREE.PlaneGeometry(0.2, 40);
    const pinkMaterials = pinkColors.map(color => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    const blueMaterials = blueColors.map(color => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));

    const pinkBeams = new THREE.Group();
    const blueBeams = new THREE.Group();
    scene.add(pinkBeams, blueBeams);

    const beams = [];
    const beamCount = 16;
    const maxSpread = 14;
    const planeY = -2;

    for (let i = 0; i < beamCount; i++) {
      const isPink = i < beamCount / 2;
      const matGroup = isPink ? pinkMaterials : blueMaterials;
      const mat = matGroup[i % matGroup.length];
      const x = ((i / beamCount) * 2 - 1) * maxSpread;
      const mesh = new THREE.Mesh(beamGeometry, mat);
      mesh.position.set(x, planeY, isPink ? -100 : 20);
      mesh.rotation.x = Math.PI / 2;

      const speed = (isPink ? 1 : -1) * (0.6 + Math.random() * 0.6);

      (isPink ? pinkBeams : blueBeams).add(mesh);
      beams.push({
        beam: mesh,
        speed,
        originalZ: mesh.position.z
      });
    }

    // Particles (reduced for mobile)
    const particleGeometry = new THREE.BufferGeometry();
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 10 + 2;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const animate = (now = performance.now()) => {
      if (!animationState.current.running) return;

      if (!animationState.current.startTime) animationState.current.startTime = now / 1000;

      const delta = Math.min((now - (animationState.current.lastFrameTime || now)) / 1000, 0.05);
      animationState.current.lastFrameTime = now;
      const time = now / 1000 - animationState.current.startTime;

      animationState.current.frameId = requestAnimationFrame(animate);

      beams.forEach(b => {
        b.beam.position.z += b.speed * 100 * delta;
        if ((b.speed > 0 && b.beam.position.z > 30) || (b.speed < 0 && b.beam.position.z < -80)) {
          b.beam.position.z = b.originalZ;
        }
        const pulse = Math.sin(time * 3 + b.beam.position.x) * 0.1 + 0.9;
        b.beam.material.opacity = 0.7 * pulse;
      });

      particles.rotation.y += 0.0015 * 60 * delta;
      composer.render();
    };

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
      cancelAnimationFrame(animationState.current.frameId);
      animationState.current.running = false;
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      beamGeometry.dispose();
      pinkMaterials.forEach(m => m.dispose());
      blueMaterials.forEach(m => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
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
