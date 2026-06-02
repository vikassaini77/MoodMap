import React from 'react';
import { renderToString } from 'react-dom/server';
import Login from './src/components/Login';

try {
  const html = renderToString(
    React.createElement(Login, {
      onLogin: () => {},
      onCreateAccount: () => {},
      onBack: () => {}
    })
  );
  console.log("Render successful! Output length:", html.length);
} catch (e) {
  console.error("Render failed:", e);
}
