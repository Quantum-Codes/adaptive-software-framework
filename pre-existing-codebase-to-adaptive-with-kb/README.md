# ![RealWorld Example App](logo.png)

> **React / Vite + SWC / Express.js / Sequelize / PostgreSQL codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://realworld.io/) spec and API.**

This codebase was created to demonstrate a fully fledged fullstack application built with **React / Vite + SWC / Express.js / Sequelize / PostgreSQL** including CRUD operations, authentication, routing, pagination, and more.

**[Demo app](https://conduit-realworld-example-app.fly.dev/)&nbsp;&nbsp;|&nbsp;&nbsp;[With Create React App](https://github.com/TonyMckes/conduit-realworld-example-app/tree/create-react-app)&nbsp;&nbsp;|&nbsp;&nbsp;[Other RealWorld Example Apps](https://codebase.show/projects/realworld?category=fullstack)**

> For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

---

## Adaptive Architecture

This app now includes an adaptive software layer that can automatically hide low-utility features per user while keeping them restorable.

### How it is adaptive

1. **Per-user feature schema (Flipper)**
   - Each user stores `adaptiveSchema` in the backend `User` model.
   - Feature checks use synchronous O(1) lookups and default to `true` (failsafe).

2. **Lightweight usage tracking**
   - Frontend tracks interactions using delegated `data-feature-id` clicks.
   - Events are buffered in memory and sent in batches to `POST /api/adaptive/track`.
   - Backend stores time-bucketed usage in `feature_usage_stats` (`userId`, `featureId`, `timeBucket`, `usageCount`).

3. **Periodic adaptation cycle**
   - On authenticated flows, the backend runs a due-check for adaptation.
   - Evaluator uses a rolling 14-day window and per-feature thresholds.
   - Features below threshold are flipped to `false` unless they are locked.

4. **Runtime gating + recovery**
   - Disabled features are gated in both UI and API paths.
   - Users can manually restore hidden features from Settings via the restore panel.

### Current adaptive feature IDs

- `ID_DISCOVERY_POPULAR_TAGS`
- `ID_FEED_PERSONAL`
- `ID_PROFILE_FAVORITED_ARTICLES`
- `ID_ARTICLE_COMMENTS`

### Locked features (never auto-disabled)

- `ID_NAV_TOPBAR`
- `ID_AUTH_LOGIN`
- `ID_AUTH_REGISTER`
- `ID_AUTH_LOGOUT`
- `ID_APP_SETTINGS`
- `ID_RESTORE_HIDDEN_FEATURES`
- `ID_ERROR_BOUNDARY`

### Adaptive artifacts in repo

- Feature registry: [`adaptive_config/feature_registry.json`](adaptive_config/feature_registry.json)
- Initial schema template: [`adaptive_config/initial_metadata_schema.json`](adaptive_config/initial_metadata_schema.json)
- Tagging checklist: [`adaptive_config/tagging_checklist.md`](adaptive_config/tagging_checklist.md)

## Getting Started

These instructions will help you install and run the project on your local machine for development and testing.

### Prerequisites

Before you run the project, make sure that you have the following tools and software installed on your computer:

- Text editor/IDE (e.g., VS Code, Sublime Text, Atom)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) `v18.11.0+`
- [NPM](https://www.npmjs.com/) (usually included with Node.js)
- SQL database

### Installation

To install the project on your computer, follow these steps:

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/TonyMckes/conduit-realworld-example-app.git
   ```

2. Navigate to the project directory.

   ```bash
   cd conduit-realworld-example-app
   ```

3. Install project dependencies by running the command:

   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory of the project
2. Add the required environment variables as specified in the [`.env.example`](backend/.env.example) file
3. (Optional) update the Sequelize configuration parameters in the [`config.js`](backend/config/config.js) file
4. If you are **not** using PostgreSQL, you may also have to install the driver for your database:

   <details>
   <summary>Use one of the following commands to install:</summary><br/>

   > Note: `-w backend` option is used to install it in the backend [`package.json`](backend/package.json).

   ```bash
   npm install -w backend pg pg-hstore  # Postgres (already installed)
   npm install -w backend mysql2
   npm install -w backend mariadb
   npm install -w backend sqlite3
   npm install -w backend tedious       # Microsoft SQL Server
   npm install -w backend oracledb      # Oracle Database
   ```

   > :information_source: Visit [Sequelize - Installing](https://sequelize.org/docs/v6/getting-started/#installing) for more infomation.

   ***

   </details>

5. Create database specified by configuration by executing

   > :warning: Please, make sure you have already created a superuser for your database.

   ```bash
   npm run sqlz -- db:create
   ```

   > :information_source: The command `npm run sqlz` is an alias for `npx -w backend sequelize-cli`.  
   > Execute `npm run sqlz -- --help` to see more of `sequelize-cli` commands availables.

6. Optionally you can run the following command to populate your database with some dummy data:

   ```bash
   npm run sqlz -- db:seed:all
   ```

### Usage

#### Development Server

To run the project, follow these steps:

1. Start the development server by executing the command:

   ```bash
   npm run dev
   ```

2. Open a web browser and navigate to:
   - Home page should be available at [`http://localhost:3000/`](http://localhost:3000).
   - API endpoints should be available at [`http://localhost:3001/api`](http://localhost:3001/api).

#### Running Tests

To run tests, simply run the following command:

```bash
npm run test
```

#### Production

The following command will build the production version of the app:

```bash
npm run start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RealWorld](https://realworld.io/)
- [RealWorld (GitHub)](https://github.com/gothinkster/realworld)
- [CodebaseShow](https://codebase.show/)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
