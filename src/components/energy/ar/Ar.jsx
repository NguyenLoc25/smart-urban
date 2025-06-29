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
    startTime: null,
    speedMultiplier: 1.0
  });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1, 10); // Đặt camera thấp hơn và gần hơn
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.4, 0.1); // Tăng bloom để tạo cảm giác tốc độ
    composer.addPass(bloomPass);

    // Màu sắc neon sáng hơn
    const pinkColors = ['#ff00cc', '#ff66ff', '#cc00aa', '#ff3399', '#ff0099', '#ff99cc'].map(c => new THREE.Color(c));
    const blueColors = ['#00ccff', '#0066ff', '#00ffff', '#0099ff', '#00aaff', '#33ccff'].map(c => new THREE.Color(c));

    const beamGeometry = new THREE.PlaneGeometry(0.15, 60); // Beam dài hơn
    const pinkMaterials = pinkColors.map(color => new THREE.MeshBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.9, 
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    }));
    const blueMaterials = blueColors.map(color => new THREE.MeshBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.9, 
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    }));

    const pinkBeams = new THREE.Group();
    const blueBeams = new THREE.Group();
    scene.add(pinkBeams, blueBeams);

    const beams = [];
    const beamCount = 32; // Tăng số lượng beam
    const maxSpread = 20; // Mở rộng phạm vi

    for (let i = 0; i < beamCount; i++) {
      const isPink = i < beamCount / 2;
      const matGroup = isPink ? pinkMaterials : blueMaterials;
      const mat = matGroup[i % matGroup.length];
      const x = ((i / beamCount) * 2 - 1) * maxSpread;
      const mesh = new THREE.Mesh(beamGeometry, mat);
      mesh.position.set(x, -1, isPink ? -200 : 50); // Vị trí ban đầu xa hơn
      mesh.rotation.x = Math.PI / 2;

      // Tốc độ nhanh hơn và biến thiên nhiều hơn
      const speed = (isPink ? 1 : -1) * (1.5 + Math.random() * 1.5);

      (isPink ? pinkBeams : blueBeams).add(mesh);
      beams.push({
        beam: mesh,
        speed,
        originalZ: mesh.position.z,
        offset: Math.random() * 100 // Thêm offset để các beam không đồng bộ
      });
    }

    // Thêm các beam ngang để tạo cảm giác tốc độ
    const horizontalBeamGeometry = new THREE.PlaneGeometry(40, 0.1);
    const horizontalBeams = new THREE.Group();
    scene.add(horizontalBeams);
    
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(horizontalBeamGeometry, mat);
      mesh.position.set(0, -1, -50 - i * 30);
      mesh.rotation.y = Math.PI / 2;
      horizontalBeams.add(mesh);
      beams.push({
        beam: mesh,
        speed: 2.0,
        originalZ: mesh.position.z
      });
    }

    // Particles (tăng số lượng và giảm kích thước)
    const particleGeometry = new THREE.BufferGeometry();
    const count = 500; // Tăng số lượng particle
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 200 - 50;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04, // Giảm kích thước particle
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Thêm hiệu ứng mờ khi di chuyển (motion blur)
    let velocity = 0;
    let targetVelocity = 1.0;
    let acceleration = 0.2;

    const animate = (now = performance.now()) => {
      if (!animationState.current.running) return;

      if (!animationState.current.startTime) animationState.current.startTime = now / 1000;

      const delta = Math.min((now - (animationState.current.lastFrameTime || now)) / 1000, 0.05);
      animationState.current.lastFrameTime = now;
      const time = now / 1000 - animationState.current.startTime;

      animationState.current.frameId = requestAnimationFrame(animate);

      // Điều khiển tốc độ dần dần
      if (velocity < targetVelocity) {
        velocity = Math.min(velocity + acceleration * delta, targetVelocity);
      } else if (velocity > targetVelocity) {
        velocity = Math.max(velocity - acceleration * delta, targetVelocity);
      }

      // Di chuyển camera tạo cảm giác đang tiến về phía trước
      camera.position.z = 10 + Math.sin(time * 0.5) * 0.5;
      camera.position.y = 1 + Math.sin(time * 0.3) * 0.2;

      beams.forEach(b => {
        b.beam.position.z += b.speed * 100 * delta * velocity;
        // Reset position khi ra khỏi tầm nhìn
        if ((b.speed > 0 && b.beam.position.z > 50) || (b.speed < 0 && b.beam.position.z < -250)) {
          b.beam.position.z = b.originalZ;
        }
        // Hiệu ứng nhấp nháy
        const pulse = Math.sin(time * 5 + b.offset) * 0.2 + 0.8;
        b.beam.material.opacity = 0.8 * pulse * velocity;
      });

      // Xoay particles nhanh hơn
      particles.rotation.y += 0.003 * 60 * delta * velocity;
      
      // Tăng bloom khi tốc độ cao
      bloomPass.strength = 0.8 + Math.sin(time * 2) * 0.2;
      
      composer.render();
    };

    // Xử lý sự kiện chuột/điện thoại để tăng tốc
    const handleInteraction = () => {
      targetVelocity = 3.0; // Tốc độ cao khi tương tác
      setTimeout(() => {
        targetVelocity = 1.0; // Trở lại tốc độ bình thường sau 3s
      }, 3000);
    };

    mountRef.current.addEventListener('mousedown', handleInteraction);
    mountRef.current.addEventListener('touchstart', handleInteraction);

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
      mountRef.current?.removeEventListener('mousedown', handleInteraction);
      mountRef.current?.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationState.current.frameId);
      animationState.current.running = false;
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      beamGeometry.dispose();
      horizontalBeamGeometry.dispose();
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