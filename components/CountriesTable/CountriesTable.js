import { useState } from "react";
import Link from "next/link";
import {
  KeyboardArrowUpRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import styles from "./CountriesTable.module.css";

import Image from "next/image";


const orderBy = (countries, value, direction) => {
  
  if (direction === "asc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? 1 : -1));
  }
  if (direction === "desc") {
    return [...countries].sort((a, b) => (a[value] > b[value] ? -1 : 1));
  }
  return countries;
};

const SortArrow = ({ direction }) => {
  if (!direction) {
    return <></>;
  }
  if (direction === "desc") {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowDownRounded color="inherit" />
      </div>
    );
  }
  if (direction === "asc") {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowUpRounded color="inherit" />
      </div>
    );
  }
};

const CountriesTable = ({ countries }) => {
  // const [postsPerPage, setPostsPerPage] = useState(5);
  // const [currentPage, setcurrPage] = useState(1);
  // const endingIndex = currentPage * postsPerPage;
  // const startIndex = endingIndex - postsPerPage;
  const [value, setValue] = useState();
  const [pgNum,setPgnum] = useState(5);
  const handleClick = () =>{
    setPgnum(pgNum => pgNum + 10);
  }
  const [direction, setDirection] = useState("");
  const orderedCountries = orderBy(countries, value, direction);

  const switchDirection = () => {
    if (!direction) {
      setDirection("desc");
    } else if (direction === "desc") {
      setDirection("asc");
    } else {
      setDirection(null);
    }
  };
  const setValueAndDirection = (value) => {
    switchDirection();
    setValue(value);
  };

  return (
    <div>
      <div className={styles.heading}>
        <div className={styles.heading_flag}></div>
        <button
          className={styles.heading_name}
          onClick={() => setValueAndDirection("name")}
        >
          <div>Name</div>
          {value === "name" && <SortArrow direction={direction} />}
        </button>
        <button
          className={styles.heading_population}
          onClick={() => setValueAndDirection("population")}
        >
          <div>Population</div>
          {value === "population" && <SortArrow direction={direction} />}
        </button>
        <button
          className={styles.heading_area}
          onClick={() => setValueAndDirection("area")}
        >
          <div>
            Area (km<sup style={{ fontSize: "0.5rem" }}>2</sup>)
          </div>
          {value === "area" && <SortArrow direction={direction} />}
        </button>
        <button
          className={styles.heading_gini}
          onClick={() => setValueAndDirection("gini")}
        >
          <div>Gini</div>
          {value === "gini" && <SortArrow direction={direction} />}
        </button>
      </div>
      {orderedCountries.slice(0,pgNum).map((country) => (
        <Link href={`/country/${country.alpha3Code}`} key={country.name}>
          <div className={styles.row}>
            <div className={styles.flag}>
              <Image src={country.flag} alt={country.name} title={country.name} height={40} width={60} />
            </div>
            <div className={styles.name}>{country.name}</div>
            <div className={styles.population}>{country.population}</div>
            <div className={styles.area}>{country.area || 0}</div>
            <div className={styles.gini}>{country.gini || 0}%</div>
          </div>
        </Link>
      ))}
      <div className={styles.btn}>
        <button onClick={handleClick} className={styles.btnOne}>
          <span>Load More</span>
        </button>
      </div>
      

    </div>
  );
};

export default CountriesTable;
