import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="id">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>FoodOrdering</title> 
          <link rel="icon" href="/favicon.ico" /> 
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
