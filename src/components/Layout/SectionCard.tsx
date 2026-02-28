import { type ReactNode } from "react";
import styles from "./Layout.module.css";

interface Props {
  children: ReactNode;
  className?: string;
}

export function SectionCard({ children, className = "" }: Props) {
  return (
    <div className={`${styles.sectionCard} ${className}`}>{children}</div>
  );
}

interface SectionHeaderProps {
  number: number;
  title: string;
  id: string;
}

export function SectionHeader({ number, title, id }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader} id={id}>
      <div className={styles.sectionNumber}>Section {number}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

interface InsightBoxProps {
  children: ReactNode;
  label?: string;
}

export function InsightBox({ children, label = "Key Insight" }: InsightBoxProps) {
  return (
    <div className={styles.insightBox}>
      <div className={styles.insightLabel}>{label}</div>
      {children}
    </div>
  );
}
