# Import von Produkten Afterbuy → Gambio


*Note:* This document is available in German only.


## Zuordnung der Datenfelder


Stand: 2022-11-23

| Afterbuy                                       | Gambio                                   | Anmerkung                                                                                                                   |
|------------------------------------------------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Level                                          | Artikelstatus                            | konfigurationsabhängig                                                                                                      |
| Artikelnummer                                  | Artikel-Nr.                              | wenn Artikelnummer > 0 und Kriterium Artikelabgleich Artikelnummer (Shop) = Artikelnummer (Gambio)                          |
| Externe Artikelnummer                          | Artikel-Nr.                              | wenn externe Artikelnummer nicht leer und Kriterium Artikelabgleich Artikelnummer (Shop) = externe Artikelnummer (Afterbuy) |
| Produkt ID                                     | Artikel-Nr.                              | wenn Kriterium Artikelabgleich Artikelnummer (Shop) = ProductId (Afterbuy)                                                  |
| Name                                           | Artikelname                              |                                                                                                                             |
| SEO-Name                                       | URL Keywords                             |                                                                                                                             |
| Beschreibung                                   | Artikelbeschreibung                      | rudimentäre HTML-Konvertierung, wenn Beschreibung weder \<p>, \<br> noch \<div> enthält.                                    |
| Kurzbeschreibung                               | Kurzbeschreibung                         |                                                                                                                             |
| Produkt Keywords                               | Zusatzbegriffe für Suche                 |                                                                                                                             |
| Afterbuy-Shop-Bestand                          | Artikelanzahl                            |                                                                                                                             |
| Inhalt/Einheit                                 | VPE-Wert, VPE                            | aktiviert ggf. Anzeige VPE; VPE werden ggf. erzeugt                                                                         |
| Mindestbestellmenge                            | Mindestbestellmenge                      |                                                                                                                             |
| Produkt Zustand                                | Zustand (GoogleExportPflicht)            |                                                                                                                             |
| Marke/Hersteller                               | Marke                                    |                                                                                                                             |
| Altersgruppe                                   | Altersgruppe                             | Afterbuy unterscheidet mehr Altersgruppen; „Erwachsene“ werden auf „Erwachsene“ abgebildet, alle anderen auf „Kinder“       |
| Geschlecht                                     | Geschlecht                               |                                                                                                                             |
| Hersteller Standard Produkt ID Typ GTIN        | Barcode/EAN                              |                                                                                                                             |
| Hersteller Standard Produkt ID Typ EAN         | Barcode/EAN                              |                                                                                                                             |
| Hersteller Standard Produkt ID Typ ISBN        | ISBN (Internationale Standardbuchnummer) |                                                                                                                             |
| Herstellerteilenummer (MPN)                    | MPN (Manufacturer Part Number)           |                                                                                                                             |
| Verkaufspreis                                  | Artikelpreis                             | Wird bei Gambio netto gespeichert, daher Umrechnung mit Umsatzsteuersatz wie bei Afterbuy erfasst                           |
| Händler Verkaufspreis                          | Kundengruppenpreis                       | entsprechend konfigurierter Gruppe                                                                                          |
| Staffelpreise                                  | Staffelpreise                            | werden für Gast-, Standard- und Händlergruppe übernommen                                                                    |
| Umsatzsteuer                                   | Steuerklasse                             |                                                                                                                             |
| Gewicht                                        | Artikelgewicht (kg)                      |                                                                                                                             |
| Standardbild Groß                              | primäres Artikelbild                     |                                                                                                                             |
| Produktgalerie-Bilder                          | weitere Artikelbilder                    |                                                                                                                             | 
| Attribute                                      | Zusatzoptionen                           |                                                                                                                             |
| Produkt-Merkmale                               | Zusatzfelder                             |                                                                                                                             |
| SKU-Zuweisungen                                |                                          |                                                                                                                             |
| Zolltarifnummer                                |                                          |                                                                                                                             |
| Ursprungsland                                  |                                          |                                                                                                                             |
| Afterbuy-Shop Zusatzbeschreibung Felder        | Tabs (Artikelbeschreibung)               |                                                                                                                             |
| Kopfvorlage                                    |                                          |                                                                                                                             |
| Fußvorlage                                     |                                          |                                                                                                                             |
| Einkaufspreis                                  |                                          |                                                                                                                             |
| Mindestbestand                                 |                                          |                                                                                                                             |
| Anzahl der Pakete                              |                                          |                                                                                                                             |
| Versandgruppe (Liefer- u. Versandinfo)         |                                          |                                                                                                                             |
| Lieferanten                                    |                                          |                                                                                                                             |
| Lagerplatz/-ort                                |                                          |                                                                                                                             |
| Freifeld x                                     |                                          |                                                                                                                             |
| Memo                                           |                                          |                                                                                                                             |
| Energieeffizienzklasse                         |                                          |                                                                                                                             |
| Position                                       | Sortierreihenfolge                       |                                                                                                                             |
| Versandgruppe (Onlineshop)                     |                                          |                                                                                                                             |
| Lieferzeit                                     |                                          | Gambio-eigene Lieferzeitberechnung                                                                                          |
| Zugewiesene Kataloge                           | Kategorien                               | wenn Katalogabgleich aktiv                                                                                                  |
| Bewertungen                                    |                                          |                                                                                                                             |
| Afterbuy-Shop Startseite/Top-Seller            | Als Empfehlung anzeigen (Startseite)     |                                                                                                                             |
| Produktaktionen                                | Sonderangebote                           | siehe unten                                                                                                                 |
| Kategorie-Angebot aktivieren                   |                                          |                                                                                                                             | 
| Cross-Selling-Katalog                          |                                          |                                                                                                                             |
| Canonical-URL                                  |                                          |                                                                                                                             |
| Suchalias                                      |                                          |                                                                                                                             | 
| Suchmaschinen (Kelkoo, Google, Become, Idealo) |                                          |                                                                                                                             |
| Versandkosten                                  |                                          | (alphanum, 10-stellig; SearchEngineShipping)                                                                                | 
| GoogleProductCategory                          |                                          |                                                                                                                             |
| AdwordsGrouping                                |                                          |                                                                                                                             |
| Google Adwords Labels                          |                                          |                                                                                                                             |
| Google Shopping Verfallsdatum                  |                                          | wird von Afterbuy nicht übermittelt                                                                                         |
| Google Shopping Versandkosten                  |                                          |                                                                                                                             |
| Material                                       |                                          |                                                                                                                             |
| Muster                                         |                                          |                                                                                                                             |
| Farbe                                          |                                          |                                                                                                                             |
| Größe                                          |                                          |                                                                                                                             |
| Benutzedefiniertes Label x                     |                                          |                                                                                                                             |
| Autoteile                                      |                                          | nicht unterstützt                                                                                                           |
| Cross-Selling                                  |                                          |                                                                                                                             |
|                                                | Lieferstatus                             | Berechnung aus Artikelanzahl gem. Konfiguration                                                                             |
|                                                | Artikelhersteller                        |                                                                                                                             |
|                                                | Mengeneinheit                            |                                                                                                                             |
|                                                | Mögliche Mengenstaffelung                |                                                                                                                             | 
|                                                | Versandkosten                            | (Float) Artikelversandkoten f. gambioultra                                                                                  |
|                                                | „Woanders günstiger?“ anzeigen           |                                                                                                                             |
|                                                | Lagerbestand anzeigen                    |                                                                                                                             |
|                                                | Gewicht anzeigen                         |                                                                                                                             |
|                                                | In die Sitemap aufnehmen                 |                                                                                                                             |
|                                                | Veröffentlichungsdatum anzeigen          |                                                                                                                             |
|                                                | Erscheinungsdatum                        |                                                                                                                             | 
|                                                | Sortierreihenfolge (Startseite)          |                                                                                                                             |
|                                                | Priorität in der Sitemap                 |                                                                                                                             |
|                                                | Änderungsfrequenz in der Sitemap         |                                                                                                                             |
|                                                | Verfügbarkeit                            |                                                                                                                             |
|                                                | Vorlage für Artikeldetailseite           |                                                                                                                             | 
|                                                | Artikeltyp                               |                                                                                                                             | 
|                                                | Produkt Teaser Slider                    |                                                                                                                             |
|                                                | Artikelpreisstatus                       |                                                                                                                             |
|                                                | GX-Customizer Set                        |                                                                                                                             |
|                                                | Verfallsdatum                            |                                                                                                                             |
|                                                | Zustand (GoogleExportPflicht)            |                                                                                                                             |
|                                                | Ab 18                                    |                                                                                                                             |
|                                                | Kennzeichnung existiert                  |                                                                                                                             |
|                                                | Google Kategorie                         |                                                                                                                             |
|                                                | Tabs (Artikelbeschreibung)               |                                                                                                                             |
|                                                | Wesentliche Merkmale                     |                                                                                                                             | 
|                                                | Herstellerlink                           |                                                                                                                             | 
|                                                | URL-Rewrite                              |                                                                                                                             |
|                                                | Meta-Title                               |                                                                                                                             |
|                                                | Meta-Keywords                            |                                                                                                                             |
|                                                | Meta-Description                         |                                                                                                                             |


## Mehrsprachigkeit


Zusätzliche Sprachen werden bei Afterbuy nur für einen Teil der Daten unterstützt.
Berücksichtigt werden die Felder „Name“, „Kurzbeschreibung“ und „Beschreibung“.
Des Weiteren ist zu beachten, dass Afterbuy bei der Mehrsprachigkeit nicht klar
nach *Sprachen* unterscheidet, sondern teilweise nach *Ländern*, so gibt es
beispielsweise für Deutsch auch die Varianten „Deutsch AT“ und „Deutsch CH“; diese
werden beim Import nicht berücksichtigt. Für die englische Übersetzung wird
„Englisch“ verwendet, oder, wenn „Englisch“ fehlt, ersatzweise „Englisch US“.
Die Implementierung des Imports geht davon aus, dass die Standardsprache des
Gambio-Shops Deutsch ist.


## Varianten


Der Import unterstützt die Übertragung von „Variationssets“ als
Varianten. Jedes Produkt im Set erzeugt hierbei eine Variantenkombination, wobei
die Optionen und deren Werte automatisch nach Bedarf angelegt werden. Aus den
Variantenprodukten bei Afterbuy werden außerdem Bilder, VPE, Preise, GTIN, ASIN
und Lagerbestand für die Variantenkombinationen übernommen.
Bei Bestehen einer Produktaktion für das Set-Produkt werden die Preise ggf.
entsprechend angepasst (siehe unten).

Eine Übernahme von Afterbuy-Variationsprodukten (Produkte in einem Set) als
einzelne, vollständige Produkte im Gambio-Shop ist nicht vorgesehen.


## Produktsets

Produktsets werden als einzelne Produkte importiert, d. h. es werden sowohl die
im Set enthaltenen Produkte als auch das zusammenfassende Set-Produkt jeweils als
eigenständige Produkte in den Shop übernommen. Beim Set-Produkt wird ein separater
Tab in der Artikelbeschreibung generiert, der die enthaltenen Produkte auflistet.


## andere Sets

Sets in Sets und Produkte, die gleichzeitig Produkt- und Variationssets zugeordnet
sind, werden nicht unterstützt.


## Attribute → Zusatzoptionen


Attribute vom Typ „Dropdown“ werden als Zusatzoptionen in den Gambio-Shop
übernommen.


## Produktaktionen → Sonderangebote


Produktaktionen aus Afterbuy-Profi-Shops werden als Sonderangebote in den
Gambio-Shop importiert. Hierbei ist zu beachten, dass Produktaktionen auf
Variantenartikeln nicht automatisch enden, sondern die Preise der Varianten
erst korrigiert werden, wenn der Basisartikel als geändert gilt und folglich
beim Abgleich aktualisiert wird.
