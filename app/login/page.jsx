"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return <div className="text-center p-10">Redirecting to login...</div>;
}