import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { faGlobeEurope } from "@fortawesome/free-solid-svg-icons";
import { Brightness6Rounded } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Layout.module.css";

const Layout = ({ children, title = "Geography Hunt" }) => {
  const [theme, setTheme] = useState("light");
  const setThemeState = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };
  const switchTheme = () => {
    if (theme === "light") {
      setThemeState("dark");
    } else {
      setThemeState("light");
    }
  };

  useEffect(() => {
    setThemeState(localStorage.getItem("theme"));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Link href="/">
          <div className={styles.header}>
            <FontAwesomeIcon className={styles.logo} icon={faGlobeEurope} />
            <div className={styles.headerTitle}>Geography Hunt</div>
          </div>
        </Link>
        {/* <button className={styles.theme_switcher} onClick={switchTheme}>
          <Brightness6Rounded />
        </button> */}
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Divy31245 @ github.com</footer>
    </div>
  );
};

export default Layout;
