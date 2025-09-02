import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        {/* Google Maps API */}
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initMap() {
                // Google Maps is loaded
                window.googleMapsLoaded = true;
                if (window.onGoogleMapsLoad) {
                  window.onGoogleMapsLoad();
                }
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
