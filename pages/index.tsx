import type { GetServerSideProps, NextPage } from "next";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { parseCookies } from "nookies";
import { withSSRGuest } from "../utils/withSSRGuest";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={(event) => handleSubmit(event)}
        className={styles.content}
      >
        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <button>Entrar</button>
      </form>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    };
  }
);
