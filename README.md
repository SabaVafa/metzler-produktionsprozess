# Metzler – Produktionsprozess („So entsteht Ihr Produkt")

Standalone-Landingpage: **Designed in Germany** — der Weg eines Produkts von der Entwicklung
in Reutlingen bis vor die Haustür. Dient zwei Zielgruppen zugleich: neugierigen Besuchern
(Markenwert) und wartenden Kund:innen (Beruhigung über den Bestellstatus).

## Schnellstart

Rein statisch — kein Build nötig. Wegen relativer Asset-Pfade über einen lokalen Server öffnen:

```bash
python -m http.server 8080
# → http://localhost:8080/
```

## Bestellstatus-Deeplink (für die „Lieferung verzögert"-E-Mail)

Die Fertigungs-Status-Leiste kann den aktuellen Schritt markieren. Hängen Sie `?stage=N`
(1–6) an die URL — der Schritt erhält das Label **„Sie sind hier"**, vorherige gelten als erledigt:

```
index.html?stage=4   → Schritt 4 (Endmontage & Prüfung) ist „Sie sind hier"
```

## Struktur

| Datei | Zweck |
|------|------|
| `index.html` | Seite (Header, Inhalt, Footer) |
| `prod.css` | Seiten-spezifische Styles (nur Design-System-Tokens) |
| `prod.js` | Scroll-Reveals, Status-Tracker, FAQ-Akkordeon, Video |
| `styles-v2.css`, `style.css` | Metzler Design-System / Chrome (Header, Footer, Tokens) |
| `ICONS/`, `Logo/`, `Paymentshipping logos/`, `Trust badges/`, `images/` | Chrome-Assets |
| `video/` | Produktionsvideo hier ablegen (`Metzler-Werkstatt.mp4`) |

## Noch zu ergänzen

- **Bilder**: alle Platzhalter (`.ph`) durch echte Fotos ersetzen (Zielgrößen stehen im Platzhalter).
- **Video**: Datei unter `video/` ablegen.
- **Team**: Namen/Jahre der beiden Mitarbeiter:innen (aktuell `[Name]`/`[Jahr]`).

## Content-Hinweise (Briefing)

„Designed in Germany" (nicht „Made in Germany"). Kein pauschales „Edelstahl" (Briefkasten-Korpus =
pulverbeschichteter Stahl, Schilder = Edelstahl/V2A). Keine konkreten Lieferzeiten. Garantie nur mit
[Garantiebedingungen](https://edelstahl-tuerklingel.de/metzler-garantieerklaerung) verlinkt.
