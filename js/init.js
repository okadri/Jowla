// Constant Variables
var SPREAD_SHEET_ID = ""
var UPDATE_SIGNIN_STATUS = 'UPDATE_SIGNIN_STATUS';
var GET_SHEET_ROWS = 'GET_SHEET_ROWS';
var MERGE_SHEET_ROWS = 'MERGE_SHEET_ROWS';
var ADD_VISIT = 'ADD_VISIT';
var UPDATE_NOTE = 'UPDATE_NOTE';
var UPDATE_COUNTRY = 'UPDATE_COUNTRY';
var UPDATE_LANGUAGES = 'UPDATE_LANGUAGES';
var HIDE_PERSON = 'HIDE_PERSON';
var MAP_READY = 'MAP_READY';
var POPULATE_MAP = 'POPULATE_MAP';
var SWITCH_DISPLAY_MODE = 'SWITCH_DISPLAY_MODE';
var FILTER_PEOPLE = 'FILTER_PEOPLE';
var DISPLAY_MODE = { LIST: 0, MAP: 1 };

var countries = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Åland Islands', code: 'AX' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Bouvet Island', code: 'BV' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Indian Ocean Territory', code: 'IO' },
    { name: 'Brunei Darussalam', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cape Verde', code: 'CV' },
    { name: 'Cayman Islands', code: 'KY' },
    { name: 'Central African Republic', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Christmas Island', code: 'CX' },
    { name: 'Cocos (Keeling) Islands', code: 'CC' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros', code: 'KM' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo, The Democratic Republic of the', code: 'CD' },
    { name: 'Cook Islands', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Cote D\'Ivoire', code: 'CI' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Falkland Islands (Malvinas)', code: 'FK' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'French Southern Territories', code: 'TF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
    { name: 'Holy See (Vatican City State)', code: 'VA' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran, Islamic Republic Of', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Isle of Man', code: 'IM' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Democratic People\'s Republic of Korea', code: 'KP' },
    { name: 'Korea, Republic of', code: 'KR' },
    { name: 'Kosovo', code: 'XK' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Lao People\'s Democratic Republic', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libyan Arab Jamahiriya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macao', code: 'MO' },
    { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mayotte', code: 'YT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia, Federated States of', code: 'FM' },
    { name: 'Moldova, Republic of', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Montserrat', code: 'MS' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Netherlands Antilles', code: 'AN' },
    { name: 'New Caledonia', code: 'NC' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Niue', code: 'NU' },
    { name: 'Norfolk Island', code: 'NF' },
    { name: 'Northern Mariana Islands', code: 'MP' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Palestine', code: 'PS' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Pitcairn', code: 'PN' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Puerto Rico', code: 'PR' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Reunion', code: 'RE' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russian Federation', code: 'RU' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Saint Helena', code: 'SH' },
    { name: 'Saint Kitts and Nevis', code: 'KN' },
    { name: 'Saint Lucia', code: 'LC' },
    { name: 'Saint Pierre and Miquelon', code: 'PM' },
    { name: 'Saint Vincent and the Grenadines', code: 'VC' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Sao Tome and Principe', code: 'ST' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Solomon Islands', code: 'SB' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Suriname', code: 'SR' },
    { name: 'Svalbard and Jan Mayen', code: 'SJ' },
    { name: 'Swaziland', code: 'SZ' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Syrian Arab Republic', code: 'SY' },
    { name: 'Taiwan', code: 'TW' },
    { name: 'Tajikistan', code: 'TJ' },
    { name: 'Tanzania, United Republic of', code: 'TZ' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Timor-Leste', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tokelau', code: 'TK' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad and Tobago', code: 'TT' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Turkmenistan', code: 'TM' },
    { name: 'Turks and Caicos Islands', code: 'TC' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'United States', code: 'US' },
    { name: 'United States Minor Outlying Islands', code: 'UM' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Viet Nam', code: 'VN' },
    { name: 'Virgin Islands, British', code: 'VG' },
    { name: 'Virgin Islands, U.S.', code: 'VI' },
    { name: 'Wallis and Futuna', code: 'WF' },
    { name: 'Western Sahara', code: 'EH' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' }
];

var languages = [
    { code: "AB", name: "Abkhaz", nativeName: "аҧсуа" },
    { code: "AA", name: "Afar", nativeName: "Afaraf" },
    { code: "AF", name: "Afrikaans", nativeName: "Afrikaans" },
    { code: "AK", name: "Akan", nativeName: "Akan" },
    { code: "SQ", name: "Albanian", nativeName: "Shqip" },
    { code: "AM", name: "Amharic", nativeName: "አማርኛ" },
    { code: "AR", name: "Arabic", nativeName: "العربية" },
    { code: "AN", name: "Aragonese", nativeName: "Aragonés" },
    { code: "HY", name: "Armenian", nativeName: "Հայերեն" },
    { code: "AS", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "AV", name: "Avaric", nativeName: "авар мацӀ, магӀарул мацӀ" },
    { code: "AE", name: "Avestan", nativeName: "avesta" },
    { code: "AY", name: "Aymara", nativeName: "aymar aru" },
    { code: "AZ", name: "Azerbaijani", nativeName: "azərbaycan dili" },
    { code: "BM", name: "Bambara", nativeName: "bamanankan" },
    { code: "BA", name: "Bashkir", nativeName: "башҡорт теле" },
    { code: "EU", name: "Basque", nativeName: "euskara, euskera" },
    { code: "BE", name: "Belarusian", nativeName: "Беларуская" },
    { code: "BN", name: "Bengali", nativeName: "বাংলা" },
    { code: "BH", name: "Bihari", nativeName: "भोजपुरी" },
    { code: "BI", name: "Bislama", nativeName: "Bislama" },
    { code: "BS", name: "Bosnian", nativeName: "bosanski jezik" },
    { code: "BR", name: "Breton", nativeName: "brezhoneg" },
    { code: "BG", name: "Bulgarian", nativeName: "български език" },
    { code: "MY", name: "Burmese", nativeName: "ဗမာစာ" },
    { code: "CA", name: "Catalan; Valencian", nativeName: "Català" },
    { code: "CH", name: "Chamorro", nativeName: "Chamoru" },
    { code: "CE", name: "Chechen", nativeName: "нохчийн мотт" },
    { code: "NY", name: "Chichewa; Chewa; Nyanja", nativeName: "chiCheŵa, chinyanja" },
    { code: "ZH", name: "Chinese", nativeName: "中文 (Zhōngwén), 汉语, 漢語" },
    { code: "CV", name: "Chuvash", nativeName: "чӑваш чӗлхи" },
    { code: "KW", name: "Cornish", nativeName: "Kernewek" },
    { code: "CO", name: "Corsican", nativeName: "corsu, lingua corsa" },
    { code: "CR", name: "Cree", nativeName: "ᓀᐦᐃᔭᐍᐏᐣ" },
    { code: "HR", name: "Croatian", nativeName: "hrvatski" },
    { code: "CS", name: "Czech", nativeName: "česky, čeština" },
    { code: "DA", name: "Danish", nativeName: "dansk" },
    { code: "DV", name: "Divehi; Dhivehi; Maldivian;", nativeName: "ދިވެހި" },
    { code: "NL", name: "Dutch", nativeName: "Nederlands, Vlaams" },
    { code: "EN", name: "English", nativeName: "English" },
    { code: "EO", name: "Esperanto", nativeName: "Esperanto" },
    { code: "ET", name: "Estonian", nativeName: "eesti, eesti keel" },
    { code: "EE", name: "Ewe", nativeName: "Eʋegbe" },
    { code: "FO", name: "Faroese", nativeName: "føroyskt" },
    { code: "FJ", name: "Fijian", nativeName: "vosa Vakaviti" },
    { code: "FI", name: "Finnish", nativeName: "suomi, suomen kieli" },
    { code: "FR", name: "French", nativeName: "français, langue française" },
    { code: "FF", name: "Fula; Fulah; Pulaar; Pular", nativeName: "Fulfulde, Pulaar, Pular" },
    { code: "GL", name: "Galician", nativeName: "Galego" },
    { code: "KA", name: "Georgian", nativeName: "ქართული" },
    { code: "DE", name: "German", nativeName: "Deutsch" },
    { code: "EL", name: "Greek, Modern", nativeName: "Ελληνικά" },
    { code: "GN", name: "Guaraní", nativeName: "Avañeẽ" },
    { code: "GU", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "HT", name: "Haitian; Haitian Creole", nativeName: "Kreyòl ayisyen" },
    { code: "HA", name: "Hausa", nativeName: "Hausa, هَوُسَ" },
    { code: "HE", name: "Hebrew (modern)", nativeName: "עברית" },
    { code: "HZ", name: "Herero", nativeName: "Otjiherero" },
    { code: "HI", name: "Hindi", nativeName: "हिन्दी, हिंदी" },
    { code: "HO", name: "Hiri Motu", nativeName: "Hiri Motu" },
    { code: "HU", name: "Hungarian", nativeName: "Magyar" },
    { code: "IA", name: "Interlingua", nativeName: "Interlingua" },
    { code: "ID", name: "Indonesian", nativeName: "Bahasa Indonesia" },
    { code: "IE", name: "Interlingue", nativeName: "Originally called Occidental; then Interlingue after WWII" },
    { code: "GA", name: "Irish", nativeName: "Gaeilge" },
    { code: "IG", name: "Igbo", nativeName: "Asụsụ Igbo" },
    { code: "IK", name: "Inupiaq", nativeName: "Iñupiaq, Iñupiatun" },
    { code: "IO", name: "Ido", nativeName: "Ido" },
    { code: "IS", name: "Icelandic", nativeName: "Íslenska" },
    { code: "IT", name: "Italian", nativeName: "Italiano" },
    { code: "IU", name: "Inuktitut", nativeName: "ᐃᓄᒃᑎᑐᑦ" },
    { code: "JA", name: "Japanese", nativeName: "日本語 (にほんご／にっぽんご)" },
    { code: "JV", name: "Javanese", nativeName: "basa Jawa" },
    { code: "KL", name: "Kalaallisut, Greenlandic", nativeName: "kalaallisut, kalaallit oqaasii" },
    { code: "KN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "KR", name: "Kanuri", nativeName: "Kanuri" },
    { code: "KS", name: "Kashmiri", nativeName: "कश्मीरी, كشميري‎" },
    { code: "KK", name: "Kazakh", nativeName: "Қазақ тілі" },
    { code: "KM", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
    { code: "KI", name: "Kikuyu, Gikuyu", nativeName: "Gĩkũyũ" },
    { code: "RW", name: "Kinyarwanda", nativeName: "Ikinyarwanda" },
    { code: "KY", name: "Kirghiz, Kyrgyz", nativeName: "кыргыз тили" },
    { code: "KV", name: "Komi", nativeName: "коми кыв" },
    { code: "KG", name: "Kongo", nativeName: "KiKongo" },
    { code: "KO", name: "Korean", nativeName: "한국어 (韓國語), 조선말 (朝鮮語)" },
    { code: "KU", name: "Kurdish", nativeName: "Kurdî, كوردی‎" },
    { code: "KJ", name: "Kwanyama, Kuanyama", nativeName: "Kuanyama" },
    { code: "LA", name: "Latin", nativeName: "latine, lingua latina" },
    { code: "LB", name: "Luxembourgish, Letzeburgesch", nativeName: "Lëtzebuergesch" },
    { code: "LG", name: "Luganda", nativeName: "Luganda" },
    { code: "LI", name: "Limburgish, Limburgan, Limburger", nativeName: "Limburgs" },
    { code: "LN", name: "Lingala", nativeName: "Lingála" },
    { code: "LO", name: "Lao", nativeName: "ພາສາລາວ" },
    { code: "LT", name: "Lithuanian", nativeName: "lietuvių kalba" },
    { code: "LU", name: "Luba-Katanga", nativeName: "" },
    { code: "LV", name: "Latvian", nativeName: "latviešu valoda" },
    { code: "GV", name: "Manx", nativeName: "Gaelg, Gailck" },
    { code: "MK", name: "Macedonian", nativeName: "македонски јазик" },
    { code: "MG", name: "Malagasy", nativeName: "Malagasy fiteny" },
    { code: "MS", name: "Malay", nativeName: "bahasa Melayu, بهاس ملايو‎" },
    { code: "ML", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "MT", name: "Maltese", nativeName: "Malti" },
    { code: "MI", name: "Māori", nativeName: "te reo Māori" },
    { code: "MR", name: "Marathi (Marāṭhī)", nativeName: "मराठी" },
    { code: "MH", name: "Marshallese", nativeName: "Kajin M̧ajeļ" },
    { code: "MN", name: "Mongolian", nativeName: "монгол" },
    { code: "NA", name: "Nauru", nativeName: "Ekakairũ Naoero" },
    { code: "NV", name: "Navajo, Navaho", nativeName: "Diné bizaad, Dinékʼehǰí" },
    { code: "NB", name: "Norwegian Bokmål", nativeName: "Norsk bokmål" },
    { code: "ND", name: "North Ndebele", nativeName: "isiNdebele" },
    { code: "NE", name: "Nepali", nativeName: "नेपाली" },
    { code: "NG", name: "Ndonga", nativeName: "Owambo" },
    { code: "NN", name: "Norwegian Nynorsk", nativeName: "Norsk nynorsk" },
    { code: "NO", name: "Norwegian", nativeName: "Norsk" },
    { code: "II", name: "Nuosu", nativeName: "ꆈꌠ꒿ Nuosuhxop" },
    { code: "NR", name: "South Ndebele", nativeName: "isiNdebele" },
    { code: "OC", name: "Occitan", nativeName: "Occitan" },
    { code: "OJ", name: "Ojibwe, Ojibwa", nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ" },
    { code: "CU", name: "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic", nativeName: "ѩзыкъ словѣньскъ" },
    { code: "OM", name: "Oromo", nativeName: "Afaan Oromoo" },
    { code: "OR", name: "Oriya", nativeName: "ଓଡ଼ିଆ" },
    { code: "OS", name: "Ossetian, Ossetic", nativeName: "ирон æвзаг" },
    { code: "PA", name: "Panjabi, Punjabi", nativeName: "ਪੰਜਾਬੀ, پنجابی‎" },
    { code: "PI", name: "Pāli", nativeName: "पाऴि" },
    { code: "FA", name: "Persian", nativeName: "فارسی" },
    { code: "PL", name: "Polish", nativeName: "polski" },
    { code: "PS", name: "Pashto, Pushto", nativeName: "پښتو" },
    { code: "PT", name: "Portuguese", nativeName: "Português" },
    { code: "QU", name: "Quechua", nativeName: "Runa Simi, Kichwa" },
    { code: "RM", name: "Romansh", nativeName: "rumantsch grischun" },
    { code: "RN", name: "Kirundi", nativeName: "kiRundi" },
    { code: "RO", name: "Romanian, Moldavian, Moldovan", nativeName: "română" },
    { code: "RU", name: "Russian", nativeName: "русский язык" },
    { code: "SA", name: "Sanskrit (Saṁskṛta)", nativeName: "संस्कृतम्" },
    { code: "SC", name: "Sardinian", nativeName: "sardu" },
    { code: "SD", name: "Sindhi", nativeName: "सिन्धी, سنڌي، سندھی‎" },
    { code: "SE", name: "Northern Sami", nativeName: "Davvisámegiella" },
    { code: "SM", name: "Samoan", nativeName: "gagana faa Samoa" },
    { code: "SG", name: "Sango", nativeName: "yângâ tî sängö" },
    { code: "SR", name: "Serbian", nativeName: "српски језик" },
    { code: "GD", name: "Scottish Gaelic; Gaelic", nativeName: "Gàidhlig" },
    { code: "SN", name: "Shona", nativeName: "chiShona" },
    { code: "SI", name: "Sinhala, Sinhalese", nativeName: "සිංහල" },
    { code: "SK", name: "Slovak", nativeName: "slovenčina" },
    { code: "SL", name: "Slovene", nativeName: "slovenščina" },
    { code: "SO", name: "Somali", nativeName: "Soomaaliga, af Soomaali" },
    { code: "ST", name: "Southern Sotho", nativeName: "Sesotho" },
    { code: "ES", name: "Spanish; Castilian", nativeName: "español, castellano" },
    { code: "SU", name: "Sundanese", nativeName: "Basa Sunda" },
    { code: "SW", name: "Swahili", nativeName: "Kiswahili" },
    { code: "SS", name: "Swati", nativeName: "SiSwati" },
    { code: "SV", name: "Swedish", nativeName: "svenska" },
    { code: "TA", name: "Tamil", nativeName: "தமிழ்" },
    { code: "TE", name: "Telugu", nativeName: "తెలుగు" },
    { code: "TG", name: "Tajik", nativeName: "тоҷикӣ, toğikī, تاجیکی‎" },
    { code: "TH", name: "Thai", nativeName: "ไทย" },
    { code: "TI", name: "Tigrinya", nativeName: "ትግርኛ" },
    { code: "BO", name: "Tibetan Standard, Tibetan, Central", nativeName: "བོད་ཡིག" },
    { code: "TK", name: "Turkmen", nativeName: "Türkmen, Түркмен" },
    { code: "TL", name: "Tagalog", nativeName: "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔" },
    { code: "TN", name: "Tswana", nativeName: "Setswana" },
    { code: "TO", name: "Tonga (Tonga Islands)", nativeName: "faka Tonga" },
    { code: "TR", name: "Turkish", nativeName: "Türkçe" },
    { code: "TS", name: "Tsonga", nativeName: "Xitsonga" },
    { code: "TT", name: "Tatar", nativeName: "татарча, tatarça, تاتارچا‎" },
    { code: "TW", name: "Twi", nativeName: "Twi" },
    { code: "TY", name: "Tahitian", nativeName: "Reo Tahiti" },
    { code: "UG", name: "Uighur, Uyghur", nativeName: "Uyƣurqə, ئۇيغۇرچە‎" },
    { code: "UK", name: "Ukrainian", nativeName: "українська" },
    { code: "UR", name: "Urdu", nativeName: "اردو" },
    { code: "UZ", name: "Uzbek", nativeName: "zbek, Ўзбек, أۇزبېك‎" },
    { code: "VE", name: "Venda", nativeName: "Tshivenḓa" },
    { code: "VI", name: "Vietnamese", nativeName: "Tiếng Việt" },
    { code: "VO", name: "Volapük", nativeName: "Volapük" },
    { code: "WA", name: "Walloon", nativeName: "Walon" },
    { code: "CY", name: "Welsh", nativeName: "Cymraeg" },
    { code: "WO", name: "Wolof", nativeName: "Wollof" },
    { code: "FY", name: "Western Frisian", nativeName: "Frysk" },
    { code: "XH", name: "Xhosa", nativeName: "isiXhosa" },
    { code: "YI", name: "Yiddish", nativeName: "ייִדיש" },
    { code: "YO", name: "Yoruba", nativeName: "Yorùbá" },
    { code: "ZA", name: "Zhuang, Chuang", nativeName: "Saɯ cueŋƅ, Saw cuengh" }
];