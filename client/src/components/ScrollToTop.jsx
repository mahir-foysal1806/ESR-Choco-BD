import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Block body on purpose: newer mobile browsers return a Promise from window.scrollTo(),
    // and returning it from an effect makes React throw ("destroy is not a function").
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
