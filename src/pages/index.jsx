import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { projects } from '../../projects.mjs';

export default function HomePage() {
  return (
    <Layout title="Документация" description="Документация сервисов Hotel Booking System">
      <main className="docs-home">
        <header className="docs-home__intro">
          <div className="docs-home__container">
            <h1>Документация<br />Hotel Booking System</h1>
            <p>Локальный запуск сервисов, схемы баз данных и описание API.</p>
          </div>
        </header>

        <section className="docs-home__container docs-home__services" aria-labelledby="services-heading">
          <h2 id="services-heading">Сервисы</h2>
          <ul className="docs-home__service-list">
            {projects.map(({ name, title, description }) => (
              <li key={name}>
                <Link className="docs-home__service" to={`/docs/${name}/`}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="docs-home__repository">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
