"use client";
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.placeholder}></div>
                <Link href="/" className={styles.logoLink}>
                    <div className="rounded-full bg-black p-2">
                        <svg viewBox="0 0 64 64" width="24" height="24">
                            <path
                                d="M32 2 C20 20, 8 32, 32 62 C56 32, 44 20, 32 2 Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </Link>
                
                <Link href="/settings" className={styles.settingsButton}>
                    <div className="rounded-full bg-gray-200 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999">
                            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Z"/>
                        </svg>
                    </div>
                </Link>
            </div>
        </header>
    );
}