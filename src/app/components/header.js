"use client";
import { useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/public/logos/2.png"
                        alt="Diabetes Management Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </Link>
                
                <button className={styles.settingsButton}>
                    <span className="material-symbols-outlined">
                        settings
                    </span>
                </button>
            </div>
        </header>
    );
}