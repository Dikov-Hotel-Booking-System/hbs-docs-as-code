# 📚 Hbs-docs-as-code

> Портал документации Hotel Booking System

---

## 📌 Описание

Документация хранится рядом с кодом сервисов и обновляется через запросы на слияние в их репозиториях. Docusaurus собирает `README.md` и Markdown из `docs/` ветки `master` четырёх сервисов в единый портал с навигацией и Mermaid-диаграммами. Ссылки на исходный код ведут к той же ревизии на GitHub, из которой взяты документы.

---

## 📘 Документация по процессам

- ### [GitHub Flow](docs/github_flow.md)

---

## 🛠️ Стек технологий

- Node.js 24 и pnpm
- Docusaurus и Mermaid
- Nginx, Docker и GitHub Actions

---

## 🚀 Локальный запуск на Windows

Понадобятся Docker Desktop и интернет. Node.js и pnpm устанавливаются внутри сборочного контейнера.

1. Дважды щёлкнуть по `start-docs.cmd` в корне проекта. При первом запуске Docker скачает зависимости и соберёт сайт. Скрипт завершится, когда портал будет готов.
2. Дважды щёлкнуть по `open-docs.cmd`. Портал откроется в браузере по адресу `http://localhost:8081`.

Из PowerShell те же файлы запускаются как `.\start-docs.cmd` и `.\open-docs.cmd`.

Чтобы остановить портал, выполнить `docker compose down` из корня проекта.

---

## ⚙️ Сборка и проверки

GitHub Actions прогоняет юнит-тесты, собирает сайт в `build/` и затем собирает Docker-образ из готового сайта. Локальный запуск загружает актуальный Markdown при сборке контейнера.

---

## 🔗 Полезные ссылки

| Ссылка | Примечание |
|--------|------------|
| [Репозиторий](https://github.com/Dikov-Hotel-Booking-System/hbs-docs-as-code) | Исходный код сервиса |
| [GitHub Actions](https://github.com/Dikov-Hotel-Booking-System/hbs-docs-as-code/actions) | Запуски CI |
