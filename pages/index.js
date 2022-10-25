import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import SearchInput from "../components/SearchInput/SearchInput";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import Withspinner from "../components/Spinner/Withspinner";
// import Paginate from "../components/Pagination/Paginate";
import Link from "next/link";

export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword)
  );

  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    //After the component is mounted set router event handlers
    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  let content = null;
  if (isLoading)
    content = (
      <div>
        <Withspinner />
      </div>
    );
  else {
    //Generating posts list
    content = <CountriesTable countries={filteredCountries} />;
  }

  return (
    <>
      <Layout>
        <div className={styles.inputContainer}>
          <div>
            <div className={styles.counts}>
              Found {countries.length} countries
            </div>
            <div className={styles.input}>
              <SearchInput
                placeholder="Filter by Name, Region or SubRegion"
                onChange={onInputChange}
              />
            </div>
          </div>
          <Link href={"/quiz"}>
            <button className={styles.quizBtn}>
              Click Here To Give GeoHunt Quiz
            </button>
          </Link>
        </div>
        {content}
      </Layout>
      {/* <Paginate data={countries} setData={updateDataFromPaginate} itemsPerPage={usersPerPage} /> */}
    </>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();
  return {
    props: {
      countries,
    },
  };
};
