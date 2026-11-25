import {ACERVO_ATLETAS_HISTORICOS_MLS} from './acervoAtletasHistoricosMLS.js';
import {ACERVO_ATLETAS_HISTORICOS_EREDIVISIE} from './acervoAtletasHistoricosEredivisie.js';
import {ACERVO_ATLETAS_HISTORICOS_PORTUGAL} from './acervoAtletasHistoricosPortugal.js';

// País no arquivo RSSSF → clube no catálogo → linhas da tabela publicada.
// Ano final, divisão, âncora, conferência, posição, J, V, E, D, GP, GC, Pts, desfecho.
const CAMPANHAS = {
  eng: {
    "Southampton": [
      [2015, "Premier League", "premier", "", 7, 38, 18, 6, 14, 54, 33, 60, ""],
      [2020, "Premier League", "premier", "", 11, 38, 15, 7, 16, 51, 60, 52, ""],
      [2025, "Premier League", "premier", "", 20, 38, 2, 6, 30, 26, 86, 12, ""],
    ],
    "Norwich City": [
      [2020, "Premier League", "premier", "", 20, 38, 5, 6, 27, 26, 75, 21, ""],
      [2022, "Premier League", "premier", "", 20, 38, 5, 7, 26, 23, 84, 22, ""],
      [2025, "Championship", "champ", "", 13, 46, 14, 15, 17, 71, 68, 57, ""],
    ],
    "Sheffield United": [
      [2020, "Premier League", "premier", "", 9, 38, 14, 12, 12, 39, 39, 54, ""],
      [2024, "Premier League", "premier", "", 20, 38, 3, 7, 28, 35, 104, 16, ""],
      [2025, "Championship", "champ", "", 3, 46, 28, 8, 10, 63, 36, 90, ""],
    ],
    "Middlesbrough": [
      [2015, "Championship", "champ", "", 4, 46, 25, 10, 11, 68, 37, 85, ""],
      [2023, "Championship", "champ", "", 4, 46, 22, 9, 15, 84, 56, 75, ""],
      [2025, "Championship", "champ", "", 10, 46, 18, 10, 18, 64, 56, 64, ""],
    ],
    "West Bromwich Albion": [
      [2015, "Premier League", "premier", "", 13, 38, 11, 11, 16, 38, 51, 44, ""],
      [2021, "Premier League", "premier", "", 19, 38, 5, 11, 22, 35, 76, 26, ""],
      [2025, "Championship", "champ", "", 9, 46, 15, 19, 12, 57, 47, 64, ""],
    ],
    "Millwall": [
      [2023, "Championship", "champ", "", 8, 46, 19, 11, 16, 57, 50, 68, ""],
      [2025, "Championship", "champ", "", 8, 46, 18, 12, 16, 47, 49, 66, ""],
    ],
    "Blackburn Rovers": [
      [2010, "Premier League", "premier", "", 10, 38, 13, 11, 14, 41, 55, 50, ""],
      [2023, "Championship", "champ", "", 7, 46, 20, 9, 17, 52, 54, 69, ""],
      [2025, "Championship", "champ", "", 7, 46, 19, 9, 18, 53, 48, 66, ""],
    ],
    "Bristol City": [
      [2019, "Championship", "champ", "", 8, 46, 19, 13, 14, 59, 53, 70, ""],
      [2025, "Championship", "champ", "", 6, 46, 17, 17, 12, 59, 55, 68, ""],
    ],
    "Watford": [
      [2018, "Premier League", "premier", "", 14, 38, 11, 8, 19, 44, 64, 41, ""],
      [2019, "Premier League", "premier", "", 11, 38, 14, 8, 16, 52, 59, 50, ""],
      [2025, "Championship", "champ", "", 14, 46, 16, 9, 21, 53, 61, 57, ""],
    ],
    "Swansea City": [
      [2015, "Premier League", "premier", "", 8, 38, 16, 8, 14, 46, 49, 56, ""],
      [2018, "Premier League", "premier", "", 18, 38, 8, 9, 21, 28, 56, 33, ""],
      [2025, "Championship", "champ", "", 11, 46, 17, 10, 19, 51, 56, 61, ""],
    ],
    "Stoke City": [
      [2010, "Premier League", "premier", "", 11, 38, 11, 14, 13, 34, 48, 47, ""],
      [2015, "Premier League", "premier", "", 9, 38, 15, 9, 14, 48, 45, 54, ""],
      [2025, "Championship", "champ", "", 18, 46, 12, 15, 19, 45, 62, 51, ""],
    ],
    "Preston North End": [
      [2018, "Championship", "champ", "", 7, 46, 19, 16, 11, 57, 46, 73, ""],
      [2020, "Championship", "champ", "", 9, 46, 18, 12, 16, 59, 54, 66, ""],
      [2025, "Championship", "champ", "", 20, 46, 10, 20, 16, 48, 59, 50, ""],
    ],
    "Sheffield Wednesday": [
      [2019, "Championship", "champ", "", 12, 46, 16, 16, 14, 60, 62, 64, ""],
      [2025, "Championship", "champ", "", 12, 46, 15, 13, 18, 60, 69, 58, ""],
    ],
    "Derby County": [
      [2018, "Championship", "champ", "", 6, 46, 20, 15, 11, 70, 48, 75, ""],
      [2019, "Championship", "champ", "", 6, 46, 20, 14, 12, 69, 54, 74, ""],
      [2025, "Championship", "champ", "", 19, 46, 13, 11, 22, 48, 56, 50, ""],
    ],
    "Portsmouth": [
      [2010, "Premier League", "premier", "", 20, 38, 7, 7, 24, 34, 66, 19, ""],
      [2024, "League One", "first", "", 1, 46, 28, 13, 5, 78, 41, 97, "acesso"],
      [2025, "Championship", "champ", "", 16, 46, 14, 12, 20, 58, 71, 54, ""],
    ],
    "Luton Town": [
      [2023, "Championship", "champ", "", 3, 46, 21, 17, 8, 57, 39, 80, ""],
      [2024, "Premier League", "premier", "", 18, 38, 6, 8, 24, 52, 85, 26, ""],
      [2025, "Championship", "champ", "", 22, 46, 13, 10, 23, 45, 69, 49, ""],
    ],
    "Burnley": [
      [2018, "Premier League", "premier", "", 7, 38, 14, 12, 12, 36, 39, 54, ""],
      [2020, "Premier League", "premier", "", 10, 38, 15, 9, 14, 43, 50, 54, ""],
      [2025, "Championship", "champ", "", 2, 46, 28, 16, 2, 69, 16, 100, "acesso"],
    ],
    "Birmingham City": [
      [2010, "Premier League", "premier", "", 9, 38, 13, 11, 14, 38, 47, 50, ""],
      [2015, "Championship", "champ", "", 10, 46, 16, 15, 15, 54, 64, 63, ""],
      [2025, "League One", "first", "", 1, 46, 34, 9, 3, 84, 31, 111, "acesso"],
    ],
    "Bolton Wanderers": [
      [2010, "Premier League", "premier", "", 14, 38, 10, 9, 19, 42, 67, 39, ""],
      [2015, "Championship", "champ", "", 18, 46, 13, 12, 21, 54, 67, 51, ""],
      [2025, "League One", "first", "", 8, 46, 20, 8, 18, 67, 70, 68, ""],
    ],
    "Cardiff City": [
      [2018, "Championship", "champ", "", 2, 46, 27, 9, 10, 69, 39, 90, "acesso"],
      [2019, "Premier League", "premier", "", 18, 38, 10, 4, 24, 34, 69, 34, ""],
      [2025, "Championship", "champ", "", 24, 46, 9, 17, 20, 48, 73, 44, ""],
    ],
    "Charlton Athletic": [
      [2015, "Championship", "champ", "", 12, 46, 14, 18, 14, 54, 60, 60, ""],
      [2020, "Championship", "champ", "", 22, 46, 12, 12, 22, 50, 65, 48, ""],
      [2025, "League One", "first", "", 4, 46, 25, 10, 11, 67, 43, 85, ""],
    ],
    "Lincoln City": [
      [2021, "League One", "first", "", 5, 46, 22, 11, 13, 69, 50, 77, ""],
      [2024, "League One", "first", "", 7, 46, 20, 14, 12, 65, 40, 74, ""],
      [2025, "League One", "first", "", 11, 46, 16, 13, 17, 64, 56, 61, ""],
    ],
    "Queens Park Rangers": [
      [2015, "Premier League", "premier", "", 20, 38, 8, 6, 24, 42, 73, 30, ""],
      [2021, "Championship", "champ", "", 9, 46, 19, 11, 16, 57, 55, 68, ""],
      [2025, "Championship", "champ", "", 15, 46, 14, 14, 18, 53, 63, 56, ""],
    ],
    "Wrexham": [
      [2024, "League Two", "second", "", 2, 46, 26, 10, 10, 89, 52, 88, "acesso"],
      [2025, "League One", "first", "", 2, 46, 27, 11, 8, 67, 34, 92, "acesso"],
    ],
  },
  span: {
    "Real Zaragoza": [
      [2010, "Primera División", "laliga", "", 14, 38, 10, 11, 17, 46, 64, 41, ""],
      [2020, "Segunda División", "segunda", "", 3, 42, 18, 11, 13, 59, 53, 65, ""],
      [2025, "Segunda División", "segunda", "", 18, 42, 13, 12, 17, 56, 63, 51, ""],
    ],
    "Sporting Gijón": [
      [2010, "Primera División", "laliga", "", 15, 38, 9, 13, 16, 36, 51, 40, ""],
      [2015, "Segunda División", "segunda", "", 2, 42, 21, 19, 2, 57, 27, 82, "acesso"],
      [2025, "Segunda División", "segunda", "", 11, 42, 14, 14, 14, 57, 54, 56, ""],
    ],
    "Eibar": [
      [2018, "Primera División", "laliga", "", 9, 38, 14, 9, 15, 44, 50, 51, ""],
      [2019, "Primera División", "laliga", "", 12, 38, 11, 14, 13, 46, 50, 47, ""],
      [2025, "Segunda División", "segunda", "", 9, 42, 15, 13, 14, 44, 41, 58, ""],
    ],
    "Cádiz": [
      [2021, "Primera División", "laliga", "", 12, 38, 11, 11, 16, 36, 58, 44, ""],
      [2023, "Primera División", "laliga", "", 14, 38, 10, 12, 16, 30, 53, 42, ""],
      [2025, "Segunda División", "segunda", "", 13, 42, 14, 13, 15, 55, 53, 55, ""],
    ],
    "Huesca": [
      [2019, "Primera División", "laliga", "", 19, 38, 7, 12, 19, 43, 65, 33, ""],
      [2021, "Primera División", "laliga", "", 18, 38, 7, 13, 18, 34, 53, 34, ""],
      [2025, "Segunda División", "segunda", "", 8, 42, 18, 10, 14, 58, 49, 64, ""],
    ],
    "Granada": [
      [2020, "Primera División", "laliga", "", 7, 38, 16, 8, 14, 52, 45, 56, ""],
      [2021, "Primera División", "laliga", "", 9, 38, 13, 7, 18, 47, 65, 46, ""],
      [2025, "Segunda División", "segunda", "", 7, 42, 18, 11, 13, 65, 54, 65, ""],
    ],
    "Almería": [
      [2010, "Primera División", "laliga", "", 13, 38, 10, 12, 16, 43, 55, 42, ""],
      [2023, "Primera División", "laliga", "", 17, 38, 11, 8, 19, 49, 65, 41, ""],
      [2025, "Segunda División", "segunda", "", 6, 42, 19, 12, 11, 72, 55, 69, ""],
    ],
    "Tenerife": [
      [2010, "Primera División", "laliga", "", 19, 38, 9, 9, 20, 40, 74, 36, ""],
      [2022, "Segunda División", "segunda", "", 5, 42, 20, 9, 13, 53, 37, 69, ""],
      [2025, "Segunda División", "segunda", "", 20, 42, 8, 12, 22, 35, 55, 36, ""],
    ],
    "Albacete": [
      [2019, "Segunda División", "segunda", "", 4, 42, 19, 14, 9, 54, 38, 71, ""],
      [2023, "Segunda División", "segunda", "", 6, 42, 17, 16, 9, 58, 47, 67, ""],
      [2025, "Segunda División", "segunda", "", 10, 42, 15, 13, 14, 57, 57, 58, ""],
    ],
    "Burgos": [
      [2023, "Segunda División", "segunda", "", 11, 42, 13, 15, 14, 33, 35, 54, ""],
      [2024, "Segunda División", "segunda", "", 9, 42, 16, 11, 15, 52, 54, 59, ""],
      [2025, "Segunda División", "segunda", "", 12, 42, 15, 10, 17, 41, 48, 55, ""],
    ],
    "CD Castellón": [
      [2021, "Segunda División", "segunda", "", 21, 42, 11, 8, 23, 35, 54, 41, ""],
      [2025, "Segunda División", "segunda", "", 17, 42, 14, 11, 17, 65, 63, 53, ""],
    ],
    "Eldense": [
      [2024, "Segunda División", "segunda", "", 16, 42, 12, 14, 16, 46, 56, 50, ""],
      [2025, "Segunda División", "segunda", "", 19, 42, 11, 12, 19, 44, 63, 45, ""],
    ],
    "Córdoba": [
      [2010, "Segunda División", "segunda", "", 10, 42, 14, 13, 15, 40, 46, 55, ""],
      [2015, "Primera División", "laliga", "", 20, 38, 3, 11, 24, 22, 68, 20, ""],
      [2025, "Segunda División", "segunda", "", 14, 42, 14, 13, 15, 59, 63, 55, ""],
    ],
    "Cartagena": [
      [2010, "Segunda División", "segunda", "", 5, 42, 18, 11, 13, 58, 49, 65, ""],
      [2023, "Segunda División", "segunda", "", 9, 42, 16, 10, 16, 47, 49, 58, ""],
      [2025, "Segunda División", "segunda", "", 22, 42, 6, 5, 31, 33, 78, 23, ""],
    ],
    "Mirandés": [
      [2015, "Segunda División", "segunda", "", 8, 42, 16, 11, 15, 42, 44, 59, ""],
      [2025, "Segunda División", "segunda", "", 4, 42, 22, 9, 11, 59, 40, 75, ""],
    ],
    "Racing Ferrol": [
      [2024, "Segunda División", "segunda", "", 10, 42, 15, 14, 13, 49, 52, 59, ""],
      [2025, "Segunda División", "segunda", "", 21, 42, 6, 12, 24, 22, 64, 30, ""],
    ],
    "Girona": [
      [2023, "Primera División", "laliga", "", 10, 38, 13, 10, 15, 58, 55, 49, ""],
      [2024, "Primera División", "laliga", "", 3, 38, 25, 6, 7, 85, 46, 81, ""],
      [2025, "Primera División", "laliga", "", 16, 38, 11, 8, 19, 44, 60, 41, ""],
    ],
    "Mallorca": [
      [2010, "Primera División", "laliga", "", 5, 38, 18, 8, 12, 59, 44, 62, ""],
      [2023, "Primera División", "laliga", "", 9, 38, 14, 8, 16, 37, 43, 50, ""],
      [2025, "Primera División", "laliga", "", 10, 38, 13, 9, 16, 35, 44, 48, ""],
    ],
    "Real Oviedo": [
      [2024, "Segunda División", "segunda", "", 6, 42, 17, 13, 12, 55, 39, 64, ""],
      [2025, "Segunda División", "segunda", "", 3, 42, 21, 12, 9, 56, 42, 75, ""],
    ],
    "Real Valladolid": [
      [2019, "Primera División", "laliga", "", 16, 38, 10, 11, 17, 32, 51, 41, ""],
      [2020, "Primera División", "laliga", "", 13, 38, 9, 15, 14, 32, 43, 42, ""],
      [2025, "Primera División", "laliga", "", 20, 38, 4, 4, 30, 26, 90, 16, ""],
    ],
    "Las Palmas": [
      [2018, "Primera División", "laliga", "", 19, 38, 5, 7, 26, 24, 74, 22, ""],
      [2024, "Primera División", "laliga", "", 16, 38, 10, 10, 18, 33, 47, 40, ""],
      [2025, "Primera División", "laliga", "", 19, 38, 8, 8, 22, 40, 61, 32, ""],
    ],
    "Leganés": [
      [2018, "Primera División", "laliga", "", 17, 38, 12, 7, 19, 34, 51, 43, ""],
      [2019, "Primera División", "laliga", "", 13, 38, 11, 12, 15, 37, 43, 45, ""],
      [2025, "Primera División", "laliga", "", 18, 38, 9, 13, 16, 39, 56, 40, ""],
    ],
  },
  ital: {
    "Sampdoria": [
      [2010, "Serie A", "seriea", "", 4, 38, 19, 10, 9, 49, 41, 67, ""],
      [2015, "Serie A", "seriea", "", 7, 38, 13, 17, 8, 48, 42, 56, ""],
      [2025, "Serie B", "serieb", "", 17, 38, 8, 17, 13, 38, 49, 41, ""],
    ],
    "Palermo": [
      [2010, "Serie A", "seriea", "", 5, 38, 18, 11, 9, 59, 47, 65, ""],
      [2015, "Serie A", "seriea", "", 11, 38, 12, 13, 13, 53, 55, 49, ""],
      [2025, "Serie B", "serieb", "", 8, 38, 14, 10, 14, 52, 43, 52, ""],
    ],
    "Bari": [
      [2010, "Serie A", "seriea", "", 10, 38, 13, 11, 14, 49, 49, 50, ""],
      [2023, "Serie B", "serieb", "", 3, 38, 17, 14, 7, 58, 37, 65, ""],
      [2025, "Serie B", "serieb", "", 9, 38, 10, 18, 10, 41, 40, 48, ""],
    ],
    "Cremonese": [
      [2022, "Serie B", "serieb", "", 2, 38, 20, 9, 9, 57, 39, 69, "acesso"],
      [2023, "Serie A", "seriea", "", 19, 38, 5, 12, 21, 36, 69, 27, ""],
      [2025, "Serie B", "serieb", "", 4, 38, 16, 13, 9, 62, 44, 61, ""],
    ],
    "Spezia": [
      [2021, "Serie A", "seriea", "", 15, 38, 9, 12, 17, 52, 72, 39, ""],
      [2022, "Serie A", "seriea", "", 16, 38, 10, 6, 22, 41, 71, 36, ""],
      [2025, "Serie B", "serieb", "", 3, 38, 17, 15, 6, 59, 33, 66, ""],
    ],
    "Catanzaro": [
      [2024, "Serie B", "serieb", "", 5, 38, 17, 9, 12, 59, 50, 60, ""],
      [2025, "Serie B", "serieb", "", 6, 38, 11, 20, 7, 51, 45, 53, ""],
    ],
    "Brescia": [
      [2019, "Serie B", "serieb", "", 1, 36, 18, 13, 5, 69, 42, 67, "acesso"],
      [2020, "Serie A", "seriea", "", 19, 38, 6, 7, 25, 35, 79, 25, ""],
      [2025, "Serie B", "serieb", "", 18, 38, 9, 16, 13, 42, 48, 39, ""],
    ],
    "Modena": [
      [2023, "Serie B", "serieb", "", 10, 38, 13, 9, 16, 47, 53, 48, ""],
      [2024, "Serie B", "serieb", "", 10, 38, 10, 17, 11, 41, 47, 47, ""],
      [2025, "Serie B", "serieb", "", 11, 38, 10, 15, 13, 48, 50, 45, ""],
    ],
    "Sassuolo": [
      [2020, "Serie A", "seriea", "", 8, 38, 14, 9, 15, 69, 63, 51, ""],
      [2021, "Serie A", "seriea", "", 8, 38, 17, 11, 10, 64, 56, 62, ""],
      [2025, "Serie B", "serieb", "", 1, 38, 25, 7, 6, 78, 38, 82, "acesso"],
    ],
    "Frosinone": [
      [2019, "Serie A", "seriea", "", 19, 38, 5, 10, 23, 29, 69, 25, ""],
      [2024, "Serie A", "seriea", "", 18, 38, 8, 11, 19, 44, 69, 35, ""],
      [2025, "Serie B", "serieb", "", 15, 38, 9, 16, 13, 37, 50, 43, ""],
    ],
    "Salernitana": [
      [2022, "Serie A", "seriea", "", 17, 38, 7, 10, 21, 33, 78, 31, ""],
      [2023, "Serie A", "seriea", "", 15, 38, 9, 15, 14, 48, 62, 42, ""],
      [2025, "Serie B", "serieb", "", 16, 38, 11, 9, 18, 37, 47, 42, ""],
    ],
    "Venezia": [
      [2022, "Serie A", "seriea", "", 20, 38, 6, 9, 23, 34, 69, 27, ""],
      [2025, "Serie A", "seriea", "", 19, 38, 5, 14, 19, 32, 56, 29, ""],
    ],
    "Reggiana": [
      [2021, "Serie B", "serieb", "", 18, 38, 9, 7, 22, 31, 57, 34, ""],
      [2024, "Serie B", "serieb", "", 11, 38, 10, 17, 11, 38, 45, 47, ""],
      [2025, "Serie B", "serieb", "", 13, 38, 11, 11, 16, 42, 52, 44, ""],
    ],
    "Cesena": [
      [2025, "Serie B", "serieb", "", 7, 38, 14, 11, 13, 46, 47, 53, ""],
    ],
    "Mantova": [
      [2025, "Serie B", "serieb", "", 14, 38, 10, 14, 14, 47, 56, 44, ""],
    ],
    "Cittadella": [
      [2020, "Serie B", "serieb", "", 5, 38, 17, 7, 14, 49, 49, 58, ""],
      [2021, "Serie B", "serieb", "", 6, 38, 15, 12, 11, 48, 35, 57, ""],
      [2025, "Serie B", "serieb", "", 19, 38, 10, 9, 19, 30, 56, 39, ""],
    ],
    "Udinese": [
      [2023, "Serie A", "seriea", "", 12, 38, 11, 13, 14, 47, 48, 46, ""],
      [2025, "Serie A", "seriea", "", 12, 38, 12, 8, 18, 41, 56, 44, ""],
    ],
    "Torino": [
      [2019, "Serie A", "seriea", "", 7, 38, 16, 15, 7, 52, 37, 63, ""],
      [2024, "Serie A", "seriea", "", 9, 38, 13, 14, 11, 36, 36, 53, ""],
      [2025, "Serie A", "seriea", "", 11, 38, 10, 14, 14, 39, 45, 44, ""],
    ],
    "Bologna": [
      [2023, "Serie A", "seriea", "", 9, 38, 14, 12, 12, 53, 49, 54, ""],
      [2024, "Serie A", "seriea", "", 5, 38, 18, 14, 6, 54, 32, 68, ""],
      [2025, "Serie A", "seriea", "", 9, 38, 16, 14, 8, 57, 47, 62, ""],
    ],
    "Genoa": [
      [2010, "Serie A", "seriea", "", 9, 38, 14, 9, 15, 57, 61, 51, ""],
      [2015, "Serie A", "seriea", "", 6, 38, 16, 11, 11, 62, 47, 59, ""],
      [2025, "Serie A", "seriea", "", 13, 38, 10, 13, 15, 37, 49, 43, ""],
    ],
    "Cagliari": [
      [2010, "Serie A", "seriea", "", 14, 38, 11, 11, 16, 56, 58, 44, ""],
      [2020, "Serie A", "seriea", "", 14, 38, 11, 12, 15, 52, 56, 45, ""],
      [2025, "Serie A", "seriea", "", 15, 38, 9, 9, 20, 40, 56, 36, ""],
    ],
    "Verona": [
      [2020, "Serie A", "seriea", "", 9, 38, 12, 13, 13, 47, 51, 49, ""],
      [2022, "Serie A", "seriea", "", 9, 38, 14, 11, 13, 65, 59, 53, ""],
      [2025, "Serie A", "seriea", "", 14, 38, 10, 7, 21, 34, 66, 37, ""],
    ],
    "Como": [
      [2024, "Serie B", "serieb", "", 2, 38, 21, 10, 7, 58, 40, 73, "acesso"],
      [2025, "Serie A", "seriea", "", 10, 38, 13, 10, 15, 49, 52, 49, ""],
    ],
    "Lecce": [
      [2023, "Serie A", "seriea", "", 16, 38, 8, 12, 18, 33, 46, 36, ""],
      [2024, "Serie A", "seriea", "", 14, 38, 8, 14, 16, 32, 54, 38, ""],
      [2025, "Serie A", "seriea", "", 17, 38, 8, 10, 20, 27, 58, 34, ""],
    ],
    "Pisa": [
      [2022, "Serie B", "serieb", "", 3, 38, 18, 13, 7, 48, 35, 67, ""],
      [2025, "Serie B", "serieb", "", 2, 38, 23, 7, 8, 64, 36, 76, "acesso"],
    ],
    "Monza": [
      [2023, "Serie A", "seriea", "", 11, 38, 14, 10, 14, 48, 52, 52, ""],
      [2024, "Serie A", "seriea", "", 12, 38, 11, 12, 15, 39, 51, 45, ""],
      [2025, "Serie A", "seriea", "", 20, 38, 3, 9, 26, 28, 69, 18, ""],
    ],
  },
  duit: {
    "Hertha Berlim": [
      [2018, "Bundesliga", "1bl", "", 10, 34, 10, 13, 11, 43, 46, 43, ""],
      [2020, "Bundesliga", "1bl", "", 10, 34, 11, 8, 15, 48, 59, 41, ""],
      [2025, "2. Bundesliga", "2bl", "", 11, 34, 12, 8, 14, 49, 51, 44, ""],
    ],
    "Fortuna Düsseldorf": [
      [2019, "Bundesliga", "1bl", "", 10, 34, 13, 5, 16, 49, 65, 44, ""],
      [2020, "Bundesliga", "1bl", "", 17, 34, 6, 12, 16, 36, 67, 30, ""],
      [2025, "2. Bundesliga", "2bl", "", 6, 34, 14, 11, 9, 57, 52, 53, ""],
    ],
    "Kaiserslautern": [
      [2010, "2. Bundesliga", "2bl", "", 1, 34, 19, 10, 5, 56, 28, 67, "acesso"],
      [2015, "2. Bundesliga", "2bl", "", 4, 34, 14, 14, 6, 45, 31, 56, ""],
      [2025, "2. Bundesliga", "2bl", "", 7, 34, 15, 8, 11, 56, 55, 53, ""],
    ],
    "Nürnberg": [
      [2010, "Bundesliga", "1bl", "", 16, 34, 8, 7, 19, 32, 58, 31, ""],
      [2019, "Bundesliga", "1bl", "", 18, 34, 3, 10, 21, 26, 68, 19, ""],
      [2025, "2. Bundesliga", "2bl", "", 10, 34, 14, 6, 14, 60, 57, 48, ""],
    ],
    "Darmstadt 98": [
      [2023, "2. Bundesliga", "2bl", "", 2, 34, 20, 7, 7, 50, 33, 67, "acesso"],
      [2024, "Bundesliga", "1bl", "", 18, 34, 3, 8, 23, 30, 86, 17, ""],
      [2025, "2. Bundesliga", "2bl", "", 12, 34, 11, 9, 14, 56, 55, 42, ""],
    ],
    "Karlsruher SC": [
      [2015, "2. Bundesliga", "2bl", "", 3, 34, 15, 13, 6, 46, 26, 58, ""],
      [2024, "2. Bundesliga", "2bl", "", 5, 34, 15, 10, 9, 68, 48, 55, ""],
      [2025, "2. Bundesliga", "2bl", "", 8, 34, 14, 10, 10, 57, 55, 52, ""],
    ],
    "Hannover 96": [
      [2015, "Bundesliga", "1bl", "", 13, 34, 9, 10, 15, 40, 56, 37, ""],
      [2018, "Bundesliga", "1bl", "", 13, 34, 10, 9, 15, 44, 54, 39, ""],
      [2025, "2. Bundesliga", "2bl", "", 9, 34, 13, 12, 9, 41, 36, 51, ""],
    ],
    "Paderborn": [
      [2015, "Bundesliga", "1bl", "", 18, 34, 7, 10, 17, 31, 65, 31, ""],
      [2020, "Bundesliga", "1bl", "", 18, 34, 4, 8, 22, 37, 74, 20, ""],
      [2025, "2. Bundesliga", "2bl", "", 4, 34, 15, 10, 9, 56, 46, 55, ""],
    ],
    "Magdeburg": [
      [2023, "2. Bundesliga", "2bl", "", 11, 34, 12, 7, 15, 48, 55, 43, ""],
      [2025, "2. Bundesliga", "2bl", "", 5, 34, 14, 11, 9, 64, 52, 53, ""],
    ],
    "Greuther Fürth": [
      [2021, "2. Bundesliga", "2bl", "", 2, 34, 18, 10, 6, 69, 44, 64, "acesso"],
      [2022, "Bundesliga", "1bl", "", 18, 34, 3, 9, 22, 28, 82, 18, ""],
      [2025, "2. Bundesliga", "2bl", "", 13, 34, 10, 9, 15, 45, 59, 39, ""],
    ],
    "Eintracht Braunschweig": [
      [2015, "2. Bundesliga", "2bl", "", 6, 34, 15, 5, 14, 44, 41, 50, ""],
      [2024, "2. Bundesliga", "2bl", "", 15, 34, 11, 5, 18, 37, 53, 38, ""],
      [2025, "2. Bundesliga", "2bl", "", 16, 34, 8, 11, 15, 38, 64, 35, ""],
    ],
    "Preußen Münster": [
      [2024, "3. Liga", "3bl", "", 2, 38, 19, 10, 9, 68, 49, 67, "acesso"],
      [2025, "2. Bundesliga", "2bl", "", 15, 34, 8, 12, 14, 40, 43, 36, ""],
    ],
    "SSV Ulm": [
      [2024, "3. Liga", "3bl", "", 1, 38, 23, 8, 7, 65, 38, 77, "acesso"],
      [2025, "2. Bundesliga", "2bl", "", 17, 34, 6, 12, 16, 36, 48, 30, ""],
    ],
    "Freiburg": [
      [2023, "Bundesliga", "1bl", "", 5, 34, 17, 8, 9, 51, 44, 59, ""],
      [2025, "Bundesliga", "1bl", "", 5, 34, 16, 7, 11, 49, 53, 55, ""],
    ],
    "Hoffenheim": [
      [2018, "Bundesliga", "1bl", "", 3, 34, 15, 10, 9, 66, 48, 55, ""],
      [2020, "Bundesliga", "1bl", "", 6, 34, 15, 7, 12, 53, 53, 52, ""],
      [2025, "Bundesliga", "1bl", "", 15, 34, 7, 11, 16, 46, 68, 32, ""],
    ],
    "Union Berlin": [
      [2022, "Bundesliga", "1bl", "", 5, 34, 16, 9, 9, 50, 44, 57, ""],
      [2023, "Bundesliga", "1bl", "", 4, 34, 18, 8, 8, 51, 38, 62, ""],
      [2025, "Bundesliga", "1bl", "", 13, 34, 10, 10, 14, 35, 51, 40, ""],
    ],
    "Wolfsburg": [
      [2015, "Bundesliga", "1bl", "", 2, 34, 20, 9, 5, 72, 38, 69, ""],
      [2021, "Bundesliga", "1bl", "", 4, 34, 17, 10, 7, 61, 37, 61, ""],
      [2025, "Bundesliga", "1bl", "", 11, 34, 11, 10, 13, 56, 54, 43, ""],
    ],
    "RB Leipzig": [
      [2021, "Bundesliga", "1bl", "", 2, 34, 19, 8, 7, 60, 32, 65, ""],
      [2023, "Bundesliga", "1bl", "", 3, 34, 20, 6, 8, 64, 41, 66, ""],
      [2025, "Bundesliga", "1bl", "", 7, 34, 13, 12, 9, 53, 48, 51, ""],
    ],
    "Mainz 05": [
      [2022, "Bundesliga", "1bl", "", 8, 34, 13, 7, 14, 50, 45, 46, ""],
      [2025, "Bundesliga", "1bl", "", 6, 34, 14, 10, 10, 55, 43, 52, ""],
    ],
    "Augsburg": [
      [2015, "Bundesliga", "1bl", "", 5, 34, 15, 4, 15, 43, 43, 49, ""],
      [2024, "Bundesliga", "1bl", "", 11, 34, 10, 9, 15, 50, 60, 39, ""],
      [2025, "Bundesliga", "1bl", "", 12, 34, 11, 10, 13, 35, 51, 43, ""],
    ],
    "Heidenheim": [
      [2023, "2. Bundesliga", "2bl", "", 1, 34, 19, 10, 5, 67, 36, 67, "acesso"],
      [2024, "Bundesliga", "1bl", "", 8, 34, 10, 12, 12, 50, 55, 42, ""],
      [2025, "Bundesliga", "1bl", "", 16, 34, 8, 5, 21, 37, 64, 29, ""],
    ],
    "St. Pauli": [
      [2024, "2. Bundesliga", "2bl", "", 1, 34, 20, 9, 5, 62, 36, 69, "acesso"],
      [2025, "Bundesliga", "1bl", "", 14, 34, 8, 8, 18, 28, 41, 32, ""],
    ],
    "FC Köln": [
      [2022, "Bundesliga", "1bl", "", 7, 34, 14, 10, 10, 52, 49, 52, ""],
      [2023, "Bundesliga", "1bl", "", 11, 34, 10, 12, 12, 49, 54, 42, ""],
      [2025, "2. Bundesliga", "2bl", "", 1, 34, 18, 7, 9, 53, 38, 61, "acesso"],
    ],
    "Hamburger SV": [
      [2010, "Bundesliga", "1bl", "", 7, 34, 13, 13, 8, 56, 41, 52, ""],
      [2015, "Bundesliga", "1bl", "", 16, 34, 9, 8, 17, 25, 50, 35, ""],
      [2025, "2. Bundesliga", "2bl", "", 2, 34, 16, 11, 7, 78, 44, 59, "acesso"],
    ],
    "Elversberg": [
      [2024, "2. Bundesliga", "2bl", "", 11, 34, 12, 7, 15, 49, 63, 43, ""],
      [2025, "2. Bundesliga", "2bl", "", 3, 34, 16, 10, 8, 64, 37, 58, ""],
    ],
  },
  fran: {
    "Rodez": [
      [2023, "Ligue 2", "l2", "", 14, 38, 11, 13, 14, 41, 44, 46, ""],
      [2025, "Ligue 2", "l2", "", 14, 34, 9, 12, 13, 56, 54, 39, ""],
    ],
    "Laval": [
      [2015, "Ligue 2", "l2", "", 8, 38, 11, 21, 6, 41, 34, 54, ""],
      [2025, "Ligue 2", "l2", "", 7, 34, 14, 8, 12, 44, 38, 50, ""],
    ],
    "Pau FC": [
      [2022, "Ligue 2", "l2", "", 10, 38, 14, 7, 17, 41, 49, 49, ""],
      [2023, "Ligue 2", "l2", "", 13, 38, 12, 11, 15, 40, 52, 47, ""],
      [2025, "Ligue 2", "l2", "", 13, 34, 10, 12, 12, 39, 53, 42, ""],
    ],
    "Amiens": [
      [2018, "Ligue 1", "l1", "", 13, 38, 12, 9, 17, 37, 42, 45, ""],
      [2019, "Ligue 1", "l1", "", 15, 38, 9, 11, 18, 31, 52, 38, ""],
      [2025, "Ligue 2", "l2", "", 11, 34, 13, 4, 17, 38, 50, 43, ""],
    ],
    "Dunkerque": [
      [2021, "Ligue 2", "l2", "", 16, 38, 10, 11, 17, 34, 47, 41, ""],
      [2025, "Ligue 2", "l2", "", 4, 34, 17, 5, 12, 47, 40, 56, ""],
    ],
    "Martigues": [
      [2023, "National", "nat", "", 4, 34, 15, 15, 4, 54, 40, 60, ""],
      [2025, "Ligue 2", "l2", "", 17, 34, 9, 5, 20, 29, 56, 32, ""],
    ],
    "Red Star": [
      [2019, "Ligue 2", "l2", "", 20, 38, 7, 9, 22, 28, 58, 30, ""],
      [2025, "Ligue 2", "l2", "", 15, 34, 9, 11, 14, 37, 51, 38, ""],
    ],
  },
  port: {
    "Académico Viseu": [
      [2023, "Segunda Liga", "liga2", "", 4, 34, 14, 11, 9, 51, 45, 53, ""],
      [2024, "Segunda Liga", "liga2", "", 11, 34, 9, 16, 9, 36, 38, 43, ""],
      [2025, "Segunda Liga", "liga2", "", 10, 34, 11, 12, 11, 43, 41, 45, ""],
    ],
    "Chaves": [
      [2019, "Primeira Liga", "liga1", "", 16, 34, 8, 8, 18, 34, 57, 32, ""],
      [2023, "Primeira Liga", "liga1", "", 7, 34, 12, 10, 12, 35, 40, 46, ""],
      [2025, "Segunda Liga", "liga2", "", 7, 34, 14, 9, 11, 40, 34, 51, ""],
    ],
    "Feirense": [
      [2019, "Primeira Liga", "liga1", "", 18, 34, 3, 11, 20, 27, 64, 20, ""],
      [2022, "Segunda Liga", "liga2", "", 4, 34, 17, 7, 10, 50, 37, 58, ""],
      [2025, "Segunda Liga", "liga2", "", 8, 34, 13, 10, 11, 35, 34, 49, ""],
    ],
    "Leixões": [
      [2010, "Primeira Liga", "liga1", "", 16, 30, 5, 6, 19, 25, 51, 21, ""],
      [2022, "Segunda Liga", "liga2", "", 8, 34, 13, 9, 12, 42, 40, 48, ""],
      [2025, "Segunda Liga", "liga2", "", 13, 34, 10, 11, 13, 37, 42, 41, ""],
    ],
    "Penafiel": [
      [2022, "Segunda Liga", "liga2", "", 7, 34, 14, 9, 11, 38, 38, 51, ""],
      [2023, "Segunda Liga", "liga2", "", 12, 34, 9, 12, 13, 36, 47, 39, ""],
      [2025, "Segunda Liga", "liga2", "", 11, 34, 12, 9, 13, 45, 47, 45, ""],
    ],
    "Torreense": [
      [2024, "Segunda Liga", "liga2", "", 7, 34, 13, 9, 12, 40, 37, 48, ""],
      [2025, "Segunda Liga", "liga2", "", 5, 34, 15, 9, 10, 49, 42, 54, ""],
    ],
    "Estrela da Amadora": [
      [2023, "Segunda Liga", "liga2", "", 3, 34, 16, 15, 3, 55, 35, 63, ""],
      [2024, "Primeira Liga", "liga1", "", 14, 34, 7, 12, 15, 33, 53, 33, ""],
      [2025, "Primeira Liga", "liga1", "", 15, 34, 7, 8, 19, 24, 50, 29, ""],
    ],
    "Famalicão": [
      [2020, "Primeira Liga", "liga1", "", 6, 34, 14, 12, 8, 53, 51, 54, ""],
      [2024, "Primeira Liga", "liga1", "", 8, 34, 10, 12, 12, 37, 41, 42, ""],
      [2025, "Primeira Liga", "liga1", "", 7, 34, 12, 11, 11, 44, 39, 47, ""],
    ],
    "Boavista": [
      [2019, "Primeira Liga", "liga1", "", 8, 34, 13, 5, 16, 34, 40, 44, ""],
      [2023, "Primeira Liga", "liga1", "", 9, 34, 12, 8, 14, 43, 54, 44, ""],
      [2025, "Primeira Liga", "liga1", "", 18, 34, 6, 6, 22, 24, 59, 24, ""],
    ],
    "Vitória de Guimarães": [
      [2019, "Primeira Liga", "liga1", "", 5, 34, 15, 7, 12, 46, 34, 52, ""],
      [2024, "Primeira Liga", "liga1", "", 5, 34, 19, 6, 9, 52, 38, 63, ""],
      [2025, "Primeira Liga", "liga1", "", 6, 34, 14, 12, 8, 47, 37, 54, ""],
    ],
    "Braga": [
      [2010, "Primeira Liga", "liga1", "", 2, 30, 22, 5, 3, 48, 20, 71, ""],
      [2023, "Primeira Liga", "liga1", "", 3, 34, 25, 3, 6, 75, 30, 78, ""],
      [2025, "Primeira Liga", "liga1", "", 4, 34, 19, 9, 6, 55, 30, 66, ""],
    ],
    "Casa Pia": [
      [2024, "Primeira Liga", "liga1", "", 9, 34, 10, 8, 16, 38, 50, 38, ""],
      [2025, "Primeira Liga", "liga1", "", 9, 34, 12, 9, 13, 39, 44, 45, ""],
    ],
    "Rio Ave": [
      [2019, "Primeira Liga", "liga1", "", 7, 34, 12, 9, 13, 50, 52, 45, ""],
      [2020, "Primeira Liga", "liga1", "", 5, 34, 15, 10, 9, 48, 36, 55, ""],
      [2025, "Primeira Liga", "liga1", "", 11, 34, 9, 11, 14, 39, 55, 38, ""],
    ],
    "Moreirense": [
      [2019, "Primeira Liga", "liga1", "", 6, 34, 16, 4, 14, 39, 44, 52, ""],
      [2024, "Primeira Liga", "liga1", "", 6, 34, 16, 7, 11, 36, 35, 55, ""],
      [2025, "Primeira Liga", "liga1", "", 10, 34, 10, 10, 14, 42, 50, 40, ""],
    ],
    "Gil Vicente": [
      [2020, "Primeira Liga", "liga1", "", 10, 34, 11, 10, 13, 40, 44, 43, ""],
      [2022, "Primeira Liga", "liga1", "", 5, 34, 13, 12, 9, 47, 42, 51, ""],
      [2025, "Primeira Liga", "liga1", "", 13, 34, 8, 10, 16, 34, 47, 34, ""],
    ],
    "Arouca": [
      [2023, "Primeira Liga", "liga1", "", 5, 34, 15, 9, 10, 36, 37, 54, ""],
      [2024, "Primeira Liga", "liga1", "", 7, 34, 13, 7, 14, 54, 50, 46, ""],
      [2025, "Primeira Liga", "liga1", "", 12, 34, 9, 11, 14, 35, 49, 38, ""],
    ],
    "Santa Clara": [
      [2021, "Primeira Liga", "liga1", "", 6, 34, 13, 7, 14, 44, 36, 46, ""],
      [2025, "Primeira Liga", "liga1", "", 5, 34, 17, 6, 11, 36, 32, 57, ""],
    ],
    "Nacional": [
      [2010, "Primeira Liga", "liga1", "", 7, 30, 10, 9, 11, 36, 46, 39, ""],
      [2019, "Primeira Liga", "liga1", "", 17, 34, 7, 7, 20, 33, 73, 28, ""],
      [2025, "Primeira Liga", "liga1", "", 14, 34, 9, 7, 18, 32, 50, 34, ""],
    ],
    "Estoril": [
      [2022, "Primeira Liga", "liga1", "", 9, 34, 9, 12, 13, 36, 43, 39, ""],
      [2025, "Primeira Liga", "liga1", "", 8, 34, 12, 10, 12, 48, 53, 46, ""],
    ],
    "AVS": [
      [2024, "Segunda Liga", "liga2", "", 3, 34, 20, 4, 10, 50, 34, 64, ""],
      [2025, "Primeira Liga", "liga1", "", 16, 34, 5, 12, 17, 25, 60, 27, ""],
    ],
    "Tondela": [
      [2020, "Primeira Liga", "liga1", "", 14, 34, 9, 9, 16, 30, 44, 36, ""],
      [2021, "Primeira Liga", "liga1", "", 12, 34, 10, 6, 18, 36, 57, 36, ""],
      [2025, "Segunda Liga", "liga2", "", 1, 34, 17, 13, 4, 58, 35, 64, "acesso"],
    ],
    "Marítimo": [
      [2010, "Primeira Liga", "liga1", "", 5, 30, 11, 8, 11, 42, 43, 41, ""],
      [2022, "Primeira Liga", "liga1", "", 10, 34, 9, 11, 14, 39, 44, 38, ""],
      [2025, "Segunda Liga", "liga2", "", 12, 34, 10, 13, 11, 42, 48, 43, ""],
    ],
    "Alverca": [
      [2025, "Segunda Liga", "liga2", "", 2, 34, 17, 12, 5, 58, 34, 63, "acesso"],
    ],
  },
  usa: {
    "Seattle Sounders": [
      [2018, "MLS", "mls", "Western Conference", 2, 34, 18, 5, 11, 52, 37, 59, ""],
      [2019, "MLS", "mls", "Western Conference", 2, 34, 16, 8, 10, 52, 49, 56, ""],
      [2025, "MLS", "mls", "Western Conference", 5, 34, 15, 10, 9, 58, 48, 55, ""],
    ],
    "Atlanta United": [
      [2018, "MLS", "mls", "Eastern Conference", 2, 34, 21, 6, 7, 70, 44, 69, ""],
      [2019, "MLS", "mls", "Eastern Conference", 2, 34, 18, 4, 12, 58, 43, 58, ""],
      [2025, "MLS", "mls", "Eastern Conference", 14, 34, 5, 13, 16, 38, 63, 28, ""],
    ],
    "LA Galaxy": [
      [2010, "MLS", "mls", "Western Conference", 1, 30, 18, 5, 7, 44, 26, 59, ""],
      [2024, "MLS", "mls", "Western Conference", 2, 34, 19, 7, 8, 69, 50, 64, ""],
      [2025, "MLS", "mls", "Western Conference", 14, 34, 7, 9, 18, 46, 66, 30, ""],
    ],
    "Inter Miami": [
      [2022, "MLS", "mls", "Eastern Conference", 6, 34, 14, 6, 14, 47, 56, 48, ""],
      [2024, "MLS", "mls", "Eastern Conference", 1, 34, 22, 8, 4, 79, 49, 74, ""],
      [2025, "MLS", "mls", "Eastern Conference", 3, 34, 19, 8, 7, 81, 55, 65, ""],
    ],
    "LAFC": [
      [2022, "MLS", "mls", "Western Conference", 1, 34, 21, 4, 9, 66, 38, 67, ""],
      [2024, "MLS", "mls", "Western Conference", 1, 34, 19, 7, 8, 63, 43, 64, ""],
      [2025, "MLS", "mls", "Western Conference", 3, 34, 17, 9, 8, 65, 40, 60, ""],
    ],
    "New York City FC": [
      [2019, "MLS", "mls", "Eastern Conference", 1, 34, 18, 10, 6, 63, 42, 64, ""],
      [2022, "MLS", "mls", "Eastern Conference", 3, 34, 16, 7, 11, 57, 41, 55, ""],
      [2025, "MLS", "mls", "Eastern Conference", 5, 34, 17, 5, 12, 50, 44, 56, ""],
    ],
    "Columbus Crew": [
      [2015, "MLS", "mls", "Eastern Conference", 2, 34, 15, 8, 11, 58, 53, 53, ""],
      [2024, "MLS", "mls", "Eastern Conference", 2, 34, 19, 9, 6, 72, 40, 66, ""],
      [2025, "MLS", "mls", "Eastern Conference", 7, 34, 14, 12, 8, 55, 51, 54, ""],
    ],
    "Philadelphia Union": [
      [2022, "MLS", "mls", "Eastern Conference", 1, 34, 19, 10, 5, 72, 26, 67, ""],
      [2025, "MLS", "mls", "Eastern Conference", 1, 34, 20, 6, 8, 57, 35, 66, ""],
    ],
    "FC Cincinnati": [
      [2023, "MLS", "mls", "Eastern Conference", 1, 34, 20, 9, 5, 57, 39, 69, ""],
      [2024, "MLS", "mls", "Eastern Conference", 3, 34, 18, 5, 11, 58, 48, 59, ""],
      [2025, "MLS", "mls", "Eastern Conference", 2, 34, 20, 5, 9, 52, 40, 65, ""],
    ],
    "Real Salt Lake": [
      [2010, "MLS", "mls", "Western Conference", 2, 30, 15, 11, 4, 45, 20, 56, ""],
      [2024, "MLS", "mls", "Western Conference", 3, 34, 16, 11, 7, 65, 48, 59, ""],
      [2025, "MLS", "mls", "Western Conference", 9, 34, 12, 5, 17, 38, 49, 41, ""],
    ],
    "Minnesota United": [
      [2019, "MLS", "mls", "Western Conference", 4, 34, 15, 8, 11, 52, 43, 53, ""],
      [2025, "MLS", "mls", "Western Conference", 4, 34, 16, 10, 8, 56, 39, 58, ""],
    ],
    "Houston Dynamo": [
      [2010, "MLS", "mls", "Western Conference", 7, 30, 9, 6, 15, 40, 49, 33, ""],
      [2024, "MLS", "mls", "Western Conference", 5, 34, 15, 9, 10, 47, 39, 54, ""],
      [2025, "MLS", "mls", "Western Conference", 12, 34, 9, 10, 15, 43, 56, 37, ""],
    ],
    "Vancouver Whitecaps": [
      [2015, "MLS", "mls", "Western Conference", 2, 34, 16, 5, 13, 45, 36, 53, ""],
      [2025, "MLS", "mls", "Western Conference", 2, 34, 18, 9, 7, 66, 38, 63, ""],
    ],
    "Orlando City": [
      [2023, "MLS", "mls", "Eastern Conference", 2, 34, 18, 9, 7, 55, 39, 63, ""],
      [2024, "MLS", "mls", "Eastern Conference", 4, 34, 15, 7, 12, 59, 50, 52, ""],
      [2025, "MLS", "mls", "Eastern Conference", 9, 34, 14, 11, 9, 63, 51, 53, ""],
    ],
    "Colorado Rapids": [
      [2010, "MLS", "mls", "Western Conference", 5, 30, 12, 10, 8, 44, 32, 46, ""],
      [2024, "MLS", "mls", "Western Conference", 7, 34, 15, 5, 14, 61, 60, 50, ""],
      [2025, "MLS", "mls", "Western Conference", 11, 34, 11, 8, 15, 44, 56, 41, ""],
    ],
    "Portland Timbers": [
      [2015, "MLS", "mls", "Western Conference", 3, 34, 15, 8, 11, 41, 39, 53, ""],
      [2018, "MLS", "mls", "Western Conference", 5, 34, 15, 9, 10, 54, 48, 54, ""],
      [2025, "MLS", "mls", "Western Conference", 8, 34, 11, 11, 12, 41, 48, 44, ""],
    ],
    "Nashville SC": [
      [2021, "MLS", "mls", "Eastern Conference", 3, 34, 12, 18, 4, 55, 33, 54, ""],
      [2022, "MLS", "mls", "Western Conference", 5, 34, 13, 11, 10, 52, 41, 50, ""],
      [2025, "MLS", "mls", "Eastern Conference", 6, 34, 16, 6, 12, 58, 45, 54, ""],
    ],
    "Charlotte FC": [
      [2024, "MLS", "mls", "Eastern Conference", 5, 34, 14, 9, 11, 46, 37, 51, ""],
      [2025, "MLS", "mls", "Eastern Conference", 4, 34, 19, 2, 13, 55, 46, 59, ""],
    ],
  },
  ned: {
    "AZ": [
      [2018, "Eredivisie", "ere", "", 3, 34, 22, 5, 7, 72, 38, 71, ""],
      [2021, "Eredivisie", "ere", "", 3, 34, 21, 8, 5, 75, 41, 71, ""],
      [2025, "Eredivisie", "ere", "", 5, 34, 16, 9, 9, 58, 37, 57, ""],
    ],
    "Twente": [
      [2010, "Eredivisie", "ere", "", 1, 34, 27, 5, 2, 63, 23, 86, "campeao"],
      [2024, "Eredivisie", "ere", "", 3, 34, 21, 6, 7, 69, 36, 69, ""],
      [2025, "Eredivisie", "ere", "", 6, 34, 15, 9, 10, 62, 49, 54, ""],
    ],
    "Utrecht": [
      [2018, "Eredivisie", "ere", "", 5, 34, 14, 12, 8, 58, 53, 54, ""],
      [2025, "Eredivisie", "ere", "", 4, 34, 18, 10, 6, 62, 45, 64, ""],
    ],
    "NEC": [
      [2022, "Eredivisie", "ere", "", 11, 34, 10, 8, 16, 38, 52, 38, ""],
      [2024, "Eredivisie", "ere", "", 6, 34, 14, 11, 9, 68, 51, 53, ""],
      [2025, "Eredivisie", "ere", "", 8, 34, 12, 7, 15, 51, 46, 43, ""],
    ],
    "Go Ahead Eagles": [
      [2024, "Eredivisie", "ere", "", 9, 34, 12, 10, 12, 47, 46, 46, ""],
      [2025, "Eredivisie", "ere", "", 7, 34, 14, 9, 11, 57, 55, 51, ""],
    ],
    "Heerenveen": [
      [2015, "Eredivisie", "ere", "", 7, 34, 13, 11, 10, 53, 46, 50, ""],
      [2023, "Eredivisie", "ere", "", 8, 34, 12, 10, 12, 44, 50, 46, ""],
      [2025, "Eredivisie", "ere", "", 9, 34, 12, 7, 15, 42, 57, 43, ""],
    ],
    "Sparta Rotterdam": [
      [2023, "Eredivisie", "ere", "", 6, 34, 17, 8, 9, 60, 37, 59, ""],
      [2024, "Eredivisie", "ere", "", 8, 34, 14, 7, 13, 51, 48, 49, ""],
      [2025, "Eredivisie", "ere", "", 12, 34, 9, 12, 13, 39, 43, 39, ""],
    ],
    "Groningen": [
      [2019, "Eredivisie", "ere", "", 8, 34, 13, 6, 15, 39, 41, 45, ""],
      [2021, "Eredivisie", "ere", "", 7, 34, 14, 8, 12, 40, 37, 50, ""],
      [2025, "Eredivisie", "ere", "", 13, 34, 10, 9, 15, 40, 53, 39, ""],
    ],
    "Fortuna Sittard": [
      [2021, "Eredivisie", "ere", "", 11, 34, 12, 5, 17, 50, 58, 41, ""],
      [2024, "Eredivisie", "ere", "", 10, 34, 9, 11, 14, 37, 56, 38, ""],
      [2025, "Eredivisie", "ere", "", 11, 34, 11, 8, 15, 37, 54, 41, ""],
    ],
    "PEC Zwolle": [
      [2015, "Eredivisie", "ere", "", 6, 34, 16, 5, 13, 59, 43, 53, ""],
      [2018, "Eredivisie", "ere", "", 9, 34, 12, 8, 14, 42, 54, 44, ""],
      [2025, "Eredivisie", "ere", "", 10, 34, 10, 11, 13, 43, 51, 41, ""],
    ],
    "Excelsior": [
      [2018, "Eredivisie", "ere", "", 11, 34, 11, 7, 16, 41, 56, 40, ""],
      [2023, "Eredivisie", "ere", "", 15, 34, 9, 5, 20, 32, 71, 32, ""],
      [2025, "Eerste Divisie", "eerste", "", 2, 38, 22, 8, 8, 74, 38, 74, "acesso"],
    ],
    "Willem II": [
      [2015, "Eredivisie", "ere", "", 9, 34, 13, 7, 14, 46, 50, 46, ""],
      [2019, "Eredivisie", "ere", "", 10, 34, 13, 5, 16, 58, 72, 44, ""],
      [2025, "Eredivisie", "ere", "", 16, 34, 6, 8, 20, 34, 56, 26, ""],
    ],
    "Cambuur": [
      [2015, "Eredivisie", "ere", "", 12, 34, 11, 8, 15, 46, 56, 41, ""],
      [2022, "Eredivisie", "ere", "", 9, 34, 11, 6, 17, 53, 70, 39, ""],
      [2025, "Eerste Divisie", "eerste", "", 3, 38, 22, 5, 11, 63, 42, 71, ""],
    ],
    "ADO Den Haag": [
      [2018, "Eredivisie", "ere", "", 7, 34, 13, 8, 13, 45, 53, 47, ""],
      [2019, "Eredivisie", "ere", "", 9, 34, 12, 9, 13, 58, 63, 45, ""],
      [2025, "Eerste Divisie", "eerste", "", 4, 38, 20, 10, 8, 69, 47, 70, ""],
    ],
    "Telstar": [
      [2018, "Eerste Divisie", "eerste", "", 6, 38, 16, 13, 9, 66, 63, 61, ""],
      [2023, "Eerste Divisie", "eerste", "", 9, 38, 14, 11, 13, 39, 52, 53, ""],
      [2025, "Eerste Divisie", "eerste", "", 7, 38, 17, 10, 11, 69, 47, 61, ""],
    ],
  },
};

const fontes = {
  mls: 'https://www.mlssoccer.com/news/mls-cup-winners',
  miami: 'https://www.mlssoccer.com/news/champions-inter-miami-lionel-messi-win-mls-cup-over-vancouver-whitecaps',
  italia: 'https://www.legaseriea.it/serie-a/albo',
  blackburn: 'https://www.premierleague.com/en/news/60236',
};

const CONQUISTAS = {
  'Blackburn Rovers': [[1995, 'Campeão da Premier League', 'O Blackburn ganhou a Premier League 1994/95 por um ponto.', 'blackburn']],
  Sampdoria: [[1991, 'Campeã da Serie A', 'A Sampdoria conquistou o campeonato italiano de 1990/91.', 'italia']],
  Verona: [[1985, 'Campeão da Serie A', 'O Hellas Verona conquistou o campeonato italiano de 1984/85.', 'italia']],
  Torino: [[1976, 'Campeão da Serie A', 'O Torino conquistou o campeonato italiano de 1975/76.', 'italia']],
  Cagliari: [[1970, 'Campeão da Serie A', 'O Cagliari conquistou o campeonato italiano de 1969/70.', 'italia']],
  Bologna: [[1964, 'Campeão da Serie A', 'O Bologna conquistou o campeonato italiano de 1963/64.', 'italia']],
  Genoa: [[1924, 'Campeão italiano', 'O Genoa conquistou o campeonato italiano de 1923/24.', 'italia']],
  'Seattle Sounders': [
    [2016, 'Campeão da MLS Cup', 'Venceu o Toronto FC por 5 a 4 nos pênaltis após 0 a 0 na final.', 'mls'],
    [2019, 'Campeão da MLS Cup', 'Venceu o Toronto FC por 3 a 1 na final.', 'mls'],
  ],
  'Atlanta United': [[2018, 'Campeão da MLS Cup', 'Venceu o Portland Timbers por 2 a 0 na final.', 'mls']],
  'LA Galaxy': [[2014, 'Campeão da MLS Cup', 'Venceu o New England Revolution por 2 a 1 na prorrogação.', 'mls']],
  'Inter Miami': [[2025, 'Campeão da MLS Cup', 'Venceu o Vancouver Whitecaps por 3 a 1 na final.', 'miami']],
  'Vancouver Whitecaps': [[2025, 'Finalista da MLS Cup', 'Disputou a final da edição contra o Inter Miami.', 'miami']],
  'New York City FC': [[2021, 'Campeão da MLS Cup', 'Venceu o Portland Timbers nos pênaltis após 1 a 1 na final.', 'mls']],
  'Columbus Crew': [[2020, 'Campeão da MLS Cup', 'Venceu o Seattle Sounders por 3 a 0 na final.', 'mls']],
  'Real Salt Lake': [[2009, 'Campeão da MLS Cup', 'Venceu o LA Galaxy por 5 a 4 nos pênaltis após 1 a 1 na final.', 'mls']],
  'Houston Dynamo': [[2007, 'Campeão da MLS Cup', 'Venceu o New England Revolution por 2 a 1 na final.', 'mls']],
  'Colorado Rapids': [[2010, 'Campeão da MLS Cup', 'Venceu o FC Dallas por 2 a 1 na prorrogação.', 'mls']],
  'Portland Timbers': [[2015, 'Campeão da MLS Cup', 'Venceu o Columbus Crew por 2 a 1 na final.', 'mls']],
};

const conferencias = {
  'Eastern Conference': 'Conferência Leste',
  'Western Conference': 'Conferência Oeste',
};

function marcoDeCampanha(pais, linha) {
  const [ano, liga, ancora, conferencia, posicao, jogos, vitorias, empates, derrotas, golsPro, golsContra, pontos, resultado] = linha;
  const temporada = pais === 'usa' ? String(ano) : `${ano - 1}/${String(ano).slice(-2)}`;
  const disputa = conferencia ? `${liga} · fase regular · ${conferencias[conferencia]}` : liga;
  const desfecho = resultado === 'campeao' ? ' A tabela registra o título.' :
    resultado === 'acesso' ? ' A tabela registra o acesso.' : '';
  return Object.freeze({
    ano,
    titulo: `${posicao}º lugar · ${disputa} ${temporada}`,
    descricao: `${pontos} pontos em ${jogos} jogos (${vitorias} vitórias, ${empates} empates e ${derrotas} derrotas). ${golsPro} gols marcados e ${golsContra} sofridos.${desfecho}`,
    fonte: `https://www.rsssf.com/tables${pais[0]}/${pais}${ano}.html#${ancora}`,
  });
}

const fichas = Object.fromEntries(Object.entries(CAMPANHAS).flatMap(([pais, clubes]) =>
  Object.entries(clubes).map(([clube, linhas]) => {
    const conquistas = (CONQUISTAS[clube] || []).map(([ano, titulo, descricao, chave]) =>
      Object.freeze({ano, titulo, descricao, fonte: fontes[chave]}));
    const marcos = [...linhas.map(linha => marcoDeCampanha(pais, linha)), ...conquistas]
      .sort((a, b) => a.ano - b.ano);
    const atletasRecentes = ACERVO_ATLETAS_HISTORICOS_EREDIVISIE[clube] || ACERVO_ATLETAS_HISTORICOS_PORTUGAL[clube];
    return [clube, Object.freeze({
      clube, atualizadoEm: atletasRecentes ? '2026-11-25' : '2026-11-24',
      atletas: atletasRecentes || ACERVO_ATLETAS_HISTORICOS_MLS[clube] || Object.freeze([]),
      marcos: Object.freeze(marcos), tecnicos: Object.freeze([]), recordes: Object.freeze([]),
    })];
  })));

// Nomes distintos que o catálogo usa para a mesma instituição em duas divisões.
for (const [alias, nome] of Object.entries({Hamburgo: 'Hamburger SV', 'Köln': 'FC Köln'})) {
  fichas[alias] = Object.freeze({...fichas[nome], clube: alias});
}

export const ACERVO_CLUBES_LOTE38 = Object.freeze(fichas);
