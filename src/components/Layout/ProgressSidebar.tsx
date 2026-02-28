import { SECTIONS } from "../../utils/constants";
import styles from "./Layout.module.css";

interface Props {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function ProgressSidebar({ activeSection, onNavigate }: Props) {
  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <nav className={styles.sidebar} aria-label="Section navigation">
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          className={`${styles.dot} ${
            section.id === activeSection ? styles.dotActive : ""
          } ${i < activeIndex ? styles.dotCompleted : ""}`}
          onClick={() => onNavigate(section.id)}
          title={`${section.number}. ${section.title}`}
          aria-label={`Go to section ${section.number}: ${section.title}`}
        />
      ))}
    </nav>
  );
}
