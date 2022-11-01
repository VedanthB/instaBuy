import React from "react";
import Head from "next/head";
import { Container } from "@mui/material";
import { Header } from "./Header";

export const Layout = ({ title, description, children }) => {
  return (
    <div>
      <Head>
        <link
          rel="shortcut icon"
          href="https://res.cloudinary.com/supertramp69420/image/upload/v1654524914/instaBuy-logos_white_ltpfgm.png"
          type="image/x-icon"
        />

        {/* <!-- css component lib link --> */}
        <link
          rel="stylesheet"
          href="https://argon-css.netlify.app/components/index.css"
        />

        {/* <!-- font awesome --> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerpolicy="no-referrer"
        />

        <title>{title ? `${title} - instaBuy` : "instaBuy"}</title>

        {description && <meta name="description" content={description} />}
      </Head>

      <Header />

      <Container
        sx={{
          minHeight: "80vh",
          marginTop: "1rem",
        }}
      >
        {children}
      </Container>

      <footer
        style={{ bottom: 0 }}
        className="docs-footer text-white  mt-10 flex flex-col justify-center align-items-center w-full p-5 z-50 bg-rose-100"
      >
        <div className="text-grey-700">
          Made with
          <span className="text-rose-700 font-bold ml-1 mr-1">
            &lt;/&gt;{" "}
          </span>{" "}
          by
          <a
            href="https://github.com/VedanthB"
            style={{ padding: 0, textTransform: "none" }}
            className="ml-1 btn btn-link-rose"
          >
            vedanth
          </a>
        </div>
        <div className="flex mt-3 align-items-center justify-center">
          <a href="https://github.com/VedanthB">
            <i className="fab fa-github mr-2 text-rose-700" />
          </a>
          <a href="https://twitter.com/vedanth_X0X0">
            <i className="fab fa-twitter mr-2 text-rose-700" />
          </a>
          <a href="https://www.linkedin.com/in/vedanth-bora/">
            <i className="fab fa-linkedin mr-2 text-rose-700" />
          </a>
          <a href="https://dev.to/vedanthb">
            <i className="fab fa-dev text-rose-700" />
          </a>
        </div>
      </footer>
    </div>
  );
};
