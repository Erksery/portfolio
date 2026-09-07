import styles from "./index.module.scss";

export const DotText = ({ text }: { text: string }) => {
  return (
    <div className={styles.dot_text_wrapper}>
      <h1 className={styles.dot_text}>{text}</h1>
    </div>
  );
};
