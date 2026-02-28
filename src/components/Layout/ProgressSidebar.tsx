import styles from "./Layout.module.css";

interface Section {
  readonly id: string;
  readonly title: string;
  readonly number: number;
}

interface Props {
  sections: readonly Section[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function ProgressSidebar({ sections, activeSection, onNavigate }: Props) {
  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <nav className={styles.sidebar} aria-label="Section navigation">
      {sections.map((section, i) => (
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
