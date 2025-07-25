// src/app/garden/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GardenRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/garden/home');
  }, [router]);

  return null;
}
