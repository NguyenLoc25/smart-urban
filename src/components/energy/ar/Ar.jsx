  import React, { useEffect, useRef, useState } from 'react';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
      const sunRef = useRef(null);
      const galaxyRef = useRef(null);

    useEffect(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 1, 10);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.4, 0.1);
      composer.addPass(bloomPass);

      // Tải mô hình mặt trời
      const loader = new GLTFLoader();
      loader.load(
        '/energy/sun.glb',
        (gltf) => {
          const sun = gltf.scene;
          sunRef.current = sun;
          sun.scale.set(1.67, 1.67, 1.67);
          sun.position.set(30, 0, -400);
          scene.add(sun);
          
          const sunLight = new THREE.PointLight(0xffaa33, 2, 100);
          sun.add(sunLight);
          
          const sunGlow = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
              color: 0xffaa33,
              transparent: true,
              opacity: 0.3,
              blending: THREE.AdditiveBlending
            })
          );
          sun.add(sunGlow);
        },
        undefined,
        (error) => {
          console.error('Error loading sun model:', error);
        }
      );
  
      // Load galaxy model (placed on the left side)
      loader.load(
        '/energy/mars.glb',
        (gltf) => {
          const galaxy = gltf.scene;
          galaxyRef.current = galaxy;
          galaxy.scale.set(10, 10, 10);
          galaxy.position.set(-40, 0, 0); // Positioned on the left
          galaxy.rotation.y = Math.PI; // Rotate to face inward
          scene.add(galaxy);
          
          const galaxyLight = new THREE.PointLight(0xff3300, 1.5, 100);
          galaxy.add(galaxyLight);
        },
        undefined,
        (error) => {
          console.error('Error loading galaxy model:', error);
        }
      );
  

      const pinkColors = ['#ff00cc', '#ff66ff', '#cc00aa', '#ff3399', '#ff0099', '#ff99cc'].map(c => new THREE.Color(c));
      const blueColors = ['#00ccff', '#0066ff', '#00ffff', '#0099ff', '#00aaff', '#33ccff'].map(c => new THREE.Color(c));
      
      const beamLength = 80;
      const beamWidth = 0.15;
      const baseSpeed = 2.0;

      const beamGeometry = new THREE.PlaneGeometry(beamWidth, beamLength);

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
      const beamCount = 32;
      const maxSpread = 20;

      // Randomly select 1 leader for pink beams and 1 for blue beams
      const pinkLeaderIndex = Math.floor(Math.random() * (beamCount / 2));
      const blueLeaderIndex = Math.floor(Math.random() * (beamCount / 2)) + (beamCount / 2);

      for (let i = 0; i < beamCount; i++) {
        const isPink = i < beamCount / 2;
        const isLeader = i === pinkLeaderIndex || i === blueLeaderIndex;
        
        const matGroup = isPink ? pinkMaterials : blueMaterials;
        const mat = matGroup[i % matGroup.length];
        const x = ((i / beamCount) * 2 - 1) * maxSpread;
        
        const mesh = new THREE.Mesh(beamGeometry, mat);
        mesh.position.set(x, -1, isPink ? -250 : 50);
        mesh.rotation.x = Math.PI / 2;
      
        const speedMultiplier = isLeader ? 2.25 : 0.8 + Math.random() * 0.4;
        const speed = (isPink ? 1 : -1) * baseSpeed * speedMultiplier;
      
        if (isLeader) {
          mesh.scale.set(1.3, 1.3, 1.3);
          mat.color.setHSL(isPink ? 0.9 : 0.6, 1, 0.7);
          mat.opacity = 1.0;
        }
      
        (isPink ? pinkBeams : blueBeams).add(mesh);
        beams.push({
          beam: mesh,
          speed,
          isLeader,
          originalZ: mesh.position.z,
          offset: Math.random() * 100
        });
      }

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

      const particleGeometry = new THREE.BufferGeometry();
      const count = 500;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 200 - 50;
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

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
    
      // Update velocity
      if (velocity < targetVelocity) {
        velocity = Math.min(velocity + acceleration * delta, targetVelocity);
      } else if (velocity > targetVelocity) {
        velocity = Math.max(velocity - acceleration * delta, targetVelocity);
      }
    
      // Sun animation
      if (sunRef.current) {
        sunRef.current.rotation.y += 0.005 * 60 * delta * velocity;
        
        const sunMoveSpeed = 150 * velocity;
        const sunNearBoundary = 10;
        const sunFarBoundary = -400;
        
        sunRef.current.position.z += sunMoveSpeed * delta;
        
        if (sunRef.current.position.z > sunNearBoundary) {
          sunRef.current.position.z = sunFarBoundary;
          sunRef.current.position.x = 30;
          sunRef.current.position.y = 0;
        }
      }

      // Galaxy animation (different movement pattern)
      if (galaxyRef.current) {
        galaxyRef.current.rotation.y += 0.002 * 60 * delta * velocity;
        
        const galaxyMoveSpeed = 80 * velocity;
        const galaxyNearBoundary = 20;
        const galaxyFarBoundary = -300;
        
        galaxyRef.current.position.z += galaxyMoveSpeed * delta;
        
        if (galaxyRef.current.position.z > galaxyNearBoundary) {
          galaxyRef.current.position.z = galaxyFarBoundary;
          galaxyRef.current.position.x = -40; // Maintain left position
          galaxyRef.current.position.y = 0;
        }
      }
      

        camera.position.z = 10 + Math.sin(time * 0.5) * 0.5;
        camera.position.y = 1 + Math.sin(time * 0.3) * 0.2;

        beams.forEach(b => {
          b.beam.position.z += b.speed * 100 * delta * velocity;
          if ((b.speed > 0 && b.beam.position.z > 50) || (b.speed < 0 && b.beam.position.z < -250)) {
            b.beam.position.z = b.originalZ;
          }
          const pulse = Math.sin(time * 5 + b.offset) * 0.2 + 0.8;
          b.beam.material.opacity = 0.8 * pulse * velocity;
        });

        particles.rotation.y += 0.003 * 60 * delta * velocity;
        
        bloomPass.strength = 0.8 + Math.sin(time * 2) * 0.2;
        
        composer.render();
      };

      const handleInteraction = () => {
        targetVelocity = 3.0;
        setTimeout(() => {
          targetVelocity = 1.0;
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
