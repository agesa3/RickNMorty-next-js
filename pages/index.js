import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current == defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();
      updateResults(data.results);
      updatePage({
        current,
        ...nextData.info,
      });
      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }
      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }
    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

  const { currentTarget = {} } = e;
  const fields = Array.from(currentTarget?.elements);
  const fieldQuery = fields.find(field => field.name === 'query');

  const value = fieldQuery.value || '';
  const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick N Morty</title>
        <meta name="description" content="Rick and Morty Characters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Rick and Morty Charcater List</h1>

        <p className={styles.description}>Characters</p>
        <form className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" />
          <button>Search</button>
        </form>

        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className="card ">
                <a>
                  <img src={image} alt={`image`} />
                  <h3>{name}</h3>
                </a>
              </li>
            );
          })}
        </ul>
        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Agesa Collins{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
