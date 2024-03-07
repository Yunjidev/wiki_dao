import CTAButton from "../Buttons/CTA-Button/CTAButton";
import "./Nav.scss";

export default function Nav() {
  return (
    <nav>
      <div className="nav__wrapper">
        <a href="/" className="nav__link">
          <img
            src={`${import.meta.env.CDN_URL}/images/assets/icons/dao.png`}
            alt="Logo de la guilde ChronoDAO, représente un dragon stylisé bleu dans un cercle rappelant de manière très simplifiée une pocketwatch du jeu Bigtime"
            className="nav__logo"
          />
          <h3 className="nav__title">ChronoDAO Wiki</h3>
        </a>
        <CTAButton text={"Rejoignez nous"} link={"https://discord.gg/chronodao"} />
      </div>
    </nav>
  );
}
