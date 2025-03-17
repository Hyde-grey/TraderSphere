import styles from "../widgets.module.css";

export const priceFormatter = (value: string) => {
  return (
    <span>
      $
      {parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}
    </span>
  );
};

export const priceChangeFormatter = (number: string) => {
  const value = parseFloat(number);
  const isPositive = value >= 0;

  return (
    <span className={isPositive ? styles.positive : styles.negative}>
      {value > 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
};

export const volumeFormatter = (value: string) => {
  const volume = parseFloat(value);

  return <span>{volume.toLocaleString("en-US")}</span>;
};
