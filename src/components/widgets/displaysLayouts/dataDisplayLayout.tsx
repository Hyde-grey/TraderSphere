import styles from "./dataDisplay.module.css";

type DataDisplayLayoutProps = {
  header?: string;
  data: string;
};

const DataDisplayLayout = ({ header, data }: DataDisplayLayoutProps) => {
  return (
    <div className={styles.displayContainer}>
      <div className={styles.display}>
        <h3>{header}</h3>
        <h3>{data}</h3>
      </div>
    </div>
  );
};

export default DataDisplayLayout;
