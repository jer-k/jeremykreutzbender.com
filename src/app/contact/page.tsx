import Image from "next/image";
import styles from "../page.module.css";

export default function Contact() {
  return (
    <main className={styles.main}>
      <p>
        My social links are located in the footer below or feel free to reach
        out at{" "}
        <a href="mailto: jeremy.kretzbender@gmail.com">
          jeremy.kreutzbender@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
