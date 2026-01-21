'use client';

import { useEffect, useRef } from 'react';

export default function EmailLink() {
  const emailLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (emailLinkRef.current) {
      const user = 'dalew75';
      const domain = 'gmail.com';
      emailLinkRef.current.href = `mailto:${user}@${domain}`;
      emailLinkRef.current.textContent = `${user}@${domain}`;
    }
  }, []);

  return <a href="#" id="email-link" ref={emailLinkRef}></a>;
}
