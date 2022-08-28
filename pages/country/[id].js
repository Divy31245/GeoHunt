import { useState,useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";
import Image from 'next/image'
import Withspinner from "../../components/Spinner/Withspinner";
import Router from "next/router";
const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v2/alpha/${id}`);
  const country = await res.json();
  return country;
};

const Country = ({ country }) => {

  const getBorders = async () => {
    if(country.hasOwnProperty("borders")){
      const borders = await Promise.all(
        country.borders.map((border) => getCountry(border))
      );
      setBorder(borders);
    }
    
  };
  const [borders, setBorder] = useState([]);
  useEffect(() => {
    getBorders();
  }, []);

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
      <Withspinner />
    );
  else {
    //Generating posts list
    content = <div className={styles.container}>
    <div className={styles.container_left}>
      <div className={styles.overview_panel}>
        <img src={country.flag} alt={country.name} title={country.name} />
        <h1 className={styles.overview_name}>{country.name}</h1>
        <div className={styles.overview_region}>{country.region}</div>
        <div className={styles.overview_numbers}>
          <div className={styles.overview_population}>
            <div className={styles.overview_value}>
              {country.population}
            </div>
            <div className={styles.overview_label}>Population</div>
          </div>
          <div className={styles.overview_area}>
            <div className={styles.overview_value}>{country.area}</div>
            <div className={styles.overview_label}>Area</div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.container_right}>
      <div className={styles.details_panel}>
        <h4 className={styles.details_panel_heading}>Details</h4>
        <div className={styles.details_panel_row}>
          <div className={styles.details_panel_label}>Capital</div>
          <div className={styles.details_panel_value}>
            {country.capital}
          </div>
        </div>
        <div className={styles.details_panel_row}>
          <div className={styles.details_panel_label}>Language</div>
          <div className={styles.details_panel_value}>
            {country.languages.map(({ name }) => name).join(", ")}
          </div>
        </div>
        <div className={styles.details_panel_row}>
          <div className={styles.details_panel_label}>Currencies</div>
          <div className={styles.details_panel_value}>
            {country.currencies.map(({ name }) => name).join(", ")}
          </div>
        </div>
        
        <div className={styles.details_panel_row}>
          <div className={styles.details_panel_label}>Gini</div>
          <div className={styles.details_panel_value}>{country.gini}%</div>
        </div>
        <div className={styles.details_panel_row}>
          <div className={styles.details_panel_label}>Subregion</div>
          <div className={styles.details_panel_value}>
            {country.subregion}
          </div>
        </div>
        <div className={styles.details_panel_borders}>
          <div className={styles.details_panel_borders_label}>
            Neighbouring Countries
          </div>
          <div className={(typeof borders !== 'undefined' && borders.length > 0)?(styles.details_panel_borders_container):(styles.noborder)}>
            
            
            {(typeof borders !== 'undefined' && borders.length > 0) ? borders.map(({ flag, name }) => (
              <div key={name} className={styles.details_panel_country}>
                <img src={flag} alt={name}  />
                <div className={styles.details_panel_borders_name}>
                  {name}
                </div>
              </div>
            )): <div className={styles.border_desc}>This Country has no Neighbouring Countries because it&apos;s an island!! </div>}
          </div>
        </div>
      </div>
    </div>
  </div>;
  }

  return (
    <Layout title={country.name}>
      {content}
    </Layout>
  );
};

export default Country;

// export const getStaticPaths = async () => {
//   const res = await fetch("https://restcountries.com/v2/all");
//   const countries = await res.json();
//   const paths = countries.map((country) => ({
//     params: { id: country.alpha3Code },
//   }));
//   return {
//     paths,
//     fallback: false,
//   };
// };

export const getServerSideProps = async ({ params }) => {
  const country = await getCountry(params.id);
  return {
    props: { country },
  };
};
