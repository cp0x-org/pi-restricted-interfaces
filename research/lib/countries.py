"""Country and region tokens, and a deterministic extractor of country names from free text.

Tokens are the ones the catalog uses: ISO 3166-1 alpha-2 codes, or sub-national regions as "CC-Name".
The extractor matches English names and common aliases (longest first, so "South Sudan" wins over "Sudan" and
"Democratic Republic of the Congo" over "Congo"), with letter boundaries on both sides. Short upper-case
abbreviations (US, UK, DRC, DPRK, ...) match case-sensitively; names match case-insensitively.
"""
import re

ISO2 = {
    "AD": "Andorra", "AE": "United Arab Emirates", "AF": "Afghanistan", "AG": "Antigua and Barbuda", "AI": "Anguilla",
    "AL": "Albania", "AM": "Armenia", "AO": "Angola", "AQ": "Antarctica", "AR": "Argentina", "AS": "American Samoa",
    "AT": "Austria", "AU": "Australia", "AW": "Aruba", "AX": "Aland Islands", "AZ": "Azerbaijan",
    "BA": "Bosnia and Herzegovina", "BB": "Barbados", "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso",
    "BG": "Bulgaria", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BL": "Saint Barthelemy", "BM": "Bermuda",
    "BN": "Brunei", "BO": "Bolivia", "BQ": "Caribbean Netherlands", "BR": "Brazil", "BS": "Bahamas", "BT": "Bhutan",
    "BV": "Bouvet Island", "BW": "Botswana", "BY": "Belarus", "BZ": "Belize", "CA": "Canada",
    "CC": "Cocos (Keeling) Islands", "CD": "Democratic Republic of the Congo", "CF": "Central African Republic",
    "CG": "Republic of the Congo", "CH": "Switzerland", "CI": "Cote d'Ivoire", "CK": "Cook Islands", "CL": "Chile",
    "CM": "Cameroon", "CN": "China", "CO": "Colombia", "CR": "Costa Rica", "CU": "Cuba", "CV": "Cabo Verde",
    "CW": "Curacao", "CX": "Christmas Island", "CY": "Cyprus", "CZ": "Czechia", "DE": "Germany", "DJ": "Djibouti",
    "DK": "Denmark", "DM": "Dominica", "DO": "Dominican Republic", "DZ": "Algeria", "EC": "Ecuador", "EE": "Estonia",
    "EG": "Egypt", "EH": "Western Sahara", "ER": "Eritrea", "ES": "Spain", "ET": "Ethiopia", "FI": "Finland",
    "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "FR": "France", "GA": "Gabon",
    "GB": "United Kingdom", "GD": "Grenada", "GE": "Georgia", "GF": "French Guiana", "GG": "Guernsey", "GH": "Ghana",
    "GI": "Gibraltar", "GL": "Greenland", "GM": "Gambia", "GN": "Guinea", "GP": "Guadeloupe", "GQ": "Equatorial Guinea",
    "GR": "Greece", "GS": "South Georgia and the South Sandwich Islands", "GT": "Guatemala", "GU": "Guam",
    "GW": "Guinea-Bissau", "GY": "Guyana", "HK": "Hong Kong", "HM": "Heard Island and McDonald Islands",
    "HN": "Honduras", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "ID": "Indonesia", "IE": "Ireland",
    "IL": "Israel", "IM": "Isle of Man", "IN": "India", "IO": "British Indian Ocean Territory", "IQ": "Iraq",
    "IR": "Iran", "IS": "Iceland", "IT": "Italy", "JE": "Jersey", "JM": "Jamaica", "JO": "Jordan", "JP": "Japan",
    "KE": "Kenya", "KG": "Kyrgyzstan", "KH": "Cambodia", "KI": "Kiribati", "KM": "Comoros", "KN": "Saint Kitts and Nevis",
    "KP": "North Korea", "KR": "South Korea", "KW": "Kuwait", "KY": "Cayman Islands", "KZ": "Kazakhstan", "LA": "Laos",
    "LB": "Lebanon", "LC": "Saint Lucia", "LI": "Liechtenstein", "LK": "Sri Lanka", "LR": "Liberia", "LS": "Lesotho",
    "LT": "Lithuania", "LU": "Luxembourg", "LV": "Latvia", "LY": "Libya", "MA": "Morocco", "MC": "Monaco",
    "MD": "Moldova", "ME": "Montenegro", "MF": "Saint Martin", "MG": "Madagascar", "MH": "Marshall Islands",
    "MK": "North Macedonia", "ML": "Mali", "MM": "Myanmar", "MN": "Mongolia", "MO": "Macao",
    "MP": "Northern Mariana Islands", "MQ": "Martinique", "MR": "Mauritania", "MS": "Montserrat", "MT": "Malta",
    "MU": "Mauritius", "MV": "Maldives", "MW": "Malawi", "MX": "Mexico", "MY": "Malaysia", "MZ": "Mozambique",
    "NA": "Namibia", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NI": "Nicaragua",
    "NL": "Netherlands", "NO": "Norway", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "NZ": "New Zealand", "OM": "Oman",
    "PA": "Panama", "PE": "Peru", "PF": "French Polynesia", "PG": "Papua New Guinea", "PH": "Philippines",
    "PK": "Pakistan", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "PN": "Pitcairn", "PR": "Puerto Rico",
    "PS": "Palestine", "PT": "Portugal", "PW": "Palau", "PY": "Paraguay", "QA": "Qatar", "RE": "Reunion",
    "RO": "Romania", "RS": "Serbia", "RU": "Russia", "RW": "Rwanda", "SA": "Saudi Arabia", "SB": "Solomon Islands",
    "SC": "Seychelles", "SD": "Sudan", "SE": "Sweden", "SG": "Singapore", "SH": "Saint Helena", "SI": "Slovenia",
    "SJ": "Svalbard and Jan Mayen", "SK": "Slovakia", "SL": "Sierra Leone", "SM": "San Marino", "SN": "Senegal",
    "SO": "Somalia", "SR": "Suriname", "SS": "South Sudan", "ST": "Sao Tome and Principe", "SV": "El Salvador",
    "SX": "Sint Maarten", "SY": "Syria", "SZ": "Eswatini", "TC": "Turks and Caicos Islands", "TD": "Chad",
    "TF": "French Southern Territories", "TG": "Togo", "TH": "Thailand", "TJ": "Tajikistan", "TK": "Tokelau",
    "TL": "Timor-Leste", "TM": "Turkmenistan", "TN": "Tunisia", "TO": "Tonga", "TR": "Turkey",
    "TT": "Trinidad and Tobago", "TV": "Tuvalu", "TW": "Taiwan", "TZ": "Tanzania", "UA": "Ukraine", "UG": "Uganda",
    "UM": "United States Minor Outlying Islands", "US": "United States", "UY": "Uruguay", "UZ": "Uzbekistan",
    "VA": "Holy See", "VC": "Saint Vincent and the Grenadines", "VE": "Venezuela", "VG": "British Virgin Islands",
    "VI": "U.S. Virgin Islands", "VN": "Vietnam", "VU": "Vanuatu", "WF": "Wallis and Futuna", "WS": "Samoa",
    "YE": "Yemen", "YT": "Mayotte", "ZA": "South Africa", "ZM": "Zambia", "ZW": "Zimbabwe",
}
assert len(ISO2) == 249, len(ISO2)

# Same list and names as REGIONS in monitor/scripts/build.py.
REGIONS = {
    "UA-Crimea": "Crimea and Sevastopol", "UA-DPR": "Donetsk region (DPR)", "UA-LPR": "Luhansk region (LPR)",
    "UA-Kherson": "Kherson region", "UA-Zaporizhzhia": "Zaporizhzhia region", "US-NY": "New York", "CA-ON": "Ontario",
    "CA-BC": "British Columbia", "CA-AB": "Alberta", "CA-QC": "Quebec", "GE-Abkhazia": "Abkhazia",
    "GE-SouthOssetia": "South Ossetia", "CY-North": "Northern Cyprus",
}

EU = ("AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT",
      "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE")
EEA = EU + ("IS", "LI", "NO")
GROUPS = {"EU": EU, "EEA": EEA}

# Extra spellings. A None token consumes the text without producing a country ("New Jersey" is not Jersey).
ALIASES = {
    "AE": ["UAE", "U.A.E."], "AX": ["Åland Islands"], "BA": ["Bosnia", "Bosnia & Herzegovina", "Bosnia-Herzegovina"],
    "BL": ["Saint Barthélemy", "St. Barthelemy"], "BN": ["Brunei Darussalam"], "BO": ["Plurinational State of Bolivia"],
    "BQ": ["Bonaire, Sint Eustatius and Saba", "Bonaire"],
    "CD": ["Democratic Republic of Congo", "Democratic Republic of the Congo (DRC)", "DR Congo", "D.R. Congo", "DRC",
           "Congo (Kinshasa)", "Congo-Kinshasa", "Congo, Democratic Republic of the", "Congo, the Democratic Republic of the",
           "Congo, Dem. Rep.", "Democratic Republic Of Congo"],
    "CG": ["Congo", "Congo (Brazzaville)", "Congo-Brazzaville", "Republic of Congo", "Congo, Republic of the", "Congo, Rep."],
    "CI": ["Côte d'Ivoire", "Cote D'Ivoire", "Côte D'Ivoire", "Ivory Coast", "Cote dIvoire"],
    "CV": ["Cape Verde"], "CW": ["Curaçao"], "CZ": ["Czech Republic"], "FK": ["Falkland Islands (Malvinas)"],
    "FM": ["Federated States of Micronesia"], "GB": ["UK", "U.K.", "Great Britain", "Britain", "Northern Ireland",
                                                      "United Kingdom of Great Britain and Northern Ireland"],
    "IR": ["Islamic Republic of Iran", "Iran (Islamic Republic of)"],
    "KP": ["DPRK", "D.P.R.K.", "Democratic People's Republic of Korea", "Democratic Republic of Korea",
           "Korea, North", "Korea (North)", "North Korea (DPRK)", "Korea, Democratic People's Republic of",
           "Korea (Democratic People's Republic of)"],
    "KR": ["Republic of Korea", "Korea, South", "Korea (South)", "Korea, Republic of"],
    "LA": ["Lao PDR", "Lao People's Democratic Republic"], "MD": ["Republic of Moldova"], "MK": ["Macedonia"],
    "MM": ["Burma"], "MO": ["Macau"], "PS": ["Palestinian Territories", "State of Palestine", "Palestinian Territory"],
    "RE": ["Réunion"], "RU": ["Russian Federation"], "ST": ["São Tomé and Príncipe"], "SY": ["Syrian Arab Republic"],
    "SZ": ["Swaziland"], "TL": ["East Timor"], "TR": ["Türkiye", "Turkiye"], "TW": ["Taiwan, Province of China"],
    "TZ": ["United Republic of Tanzania"], "US": ["US", "U.S.", "USA", "U.S.A.", "United States of America"],
    "VA": ["Vatican", "Vatican City"], "VE": ["Bolivarian Republic of Venezuela"], "VN": ["Viet Nam"],
    "VI": ["US Virgin Islands", "United States Virgin Islands", "Virgin Islands (U.S.)"],
    "VG": ["Virgin Islands (British)"], "UM": ["US Minor Outlying Islands"], "KN": ["St. Kitts and Nevis", "St Kitts and Nevis"],
    "LC": ["St. Lucia", "St Lucia"], "VC": ["St. Vincent and the Grenadines", "St Vincent and the Grenadines"],
    "UA-Crimea": ["Crimea", "Crimean", "Sevastopol", "Crimea region"],
    "UA-DPR": ["Donetsk", "DNR", "DPR", "Donetsk People's Republic"],
    "UA-LPR": ["Luhansk", "Lugansk", "LNR", "LPR", "Luhansk People's Republic"],
    "UA-Kherson": ["Kherson"], "UA-Zaporizhzhia": ["Zaporizhzhia", "Zaporizhia", "Zaporozhye"],
    "US-NY": ["New York State"], "CA-QC": ["Québec"],
    "CY-North": ["Turkish Republic of Northern Cyprus", "TRNC"],
    None: ["New Jersey", "New Mexico", "New South Wales"],
}
# Abbreviations that must match case-sensitively (otherwise "us" in prose would become the United States).
CASE_SENSITIVE = {"US", "U.S.", "USA", "U.S.A.", "UK", "U.K.", "UAE", "U.A.E.", "DRC", "DPRK", "D.P.R.K.", "DNR", "DPR",
                  "LNR", "LPR", "TRNC"}


def _table():
    rows = []
    for tok, name in list(ISO2.items()) + list(REGIONS.items()):
        rows.append((name, tok))
    for tok, names in ALIASES.items():
        rows.extend((n, tok) for n in names)
    rows.sort(key=lambda r: -len(r[0]))
    out = []
    for name, tok in rows:
        esc = r"\s+".join(re.escape(w) for w in name.split(" "))
        flags = 0 if name in CASE_SENSITIVE else re.I
        out.append((re.compile(r"(?<![A-Za-z])" + esc + r"(?![A-Za-z])", flags), tok))
    return out


_TABLE = _table()
TOKEN_RE = re.compile(r"^[A-Z]{2}(-[A-Za-z]+)?$")


def normalize(text):
    return text.replace("’", "'").replace("‘", "'").replace(" ", " ")


def from_names(text, groups=False):
    """Country/region tokens named in `text`, in order of first appearance, plus the matched spans.
    With groups=True the words "EU"/"European Union" and "EEA"/"European Economic Area" expand to their members."""
    text = normalize(text)
    taken = bytearray(len(text))
    hits = []
    table = list(_TABLE)
    if groups:
        table = [(re.compile(r"(?<![A-Za-z])(European Economic Area|EEA)(?![A-Za-z])"), "@EEA"),
                 (re.compile(r"(?<![A-Za-z])(European Union|EU)(?![A-Za-z])"), "@EU")] + table
    for rx, tok in table:
        for m in rx.finditer(text):
            if any(taken[m.start():m.end()]):
                continue
            taken[m.start():m.end()] = b"\x01" * (m.end() - m.start())
            if tok:
                hits.append((m.start(), tok, m.group(0)))
    hits.sort()
    tokens = []
    for _, tok, _ in hits:
        for t in (GROUPS[tok[1:]] if tok.startswith("@") else (tok,)):
            if t not in tokens:
                tokens.append(t)
    return tokens, [(h[1], h[2]) for h in hits]


def from_codes(text):
    """ISO2 codes and region tokens written as quoted literals in code: 'US', "CA-ON", `IR`."""
    tokens = []
    for m in re.finditer(r"[\"'`]([A-Z]{2}(?:-[A-Za-z]+)?)[\"'`]", text):
        t = m.group(1)
        if (t in ISO2 or t in REGIONS) and t not in tokens:
            tokens.append(t)
    return tokens


def valid(token):
    return token in ISO2 or token in REGIONS
