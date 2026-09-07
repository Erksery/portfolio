import styles from "./index.module.scss";
import type { TechType } from "@/types/global.types";

type TechItemProps = TechType & {
  onMouseEnter?: (element: HTMLDivElement) => void;
  onMouseLeave?: () => void;
};

export const TechItem = ({
  title,
  icon,
  color,
  onMouseEnter,
  onMouseLeave,
}: TechItemProps) => {
  return (
    <div
      className={styles.tech_item}
      style={{ color }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event.currentTarget);
      }}
      onMouseLeave={onMouseLeave}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
};
