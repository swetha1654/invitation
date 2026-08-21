import { COUPLE, FOOTER } from "../data/config";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-names">
        {COUPLE.bride.name} &amp; {COUPLE.groom.name}
      </p>
      <p className="footer-blessing">{FOOTER.blessing}</p>
    </footer>
  );
}
