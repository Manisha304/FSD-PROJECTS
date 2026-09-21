## Git commit conventions (required)

Follow conventional commit-style types for all commits. The commit type can be one of:

- `feat`: Commits which add a new feature.
- `fix`: Commits that fix a bug.
- `refactor`: Commits that rewrite or restructure code without changing behavior.
- `perf`: Commits that improve performance.
- `style`: Commits that do not affect code behavior (formatting, whitespace, semicolons, etc.).
- `test`: Commits that add or correct tests.
- `docs`: Commits that affect documentation only.
- `build`: Commits that affect build system, CI, dependencies, or project version.
- `ops`: Commits that affect operational components (infrastructure, deployment, backups, recovery).
- `chore`: Miscellaneous commits (e.g., modifying .gitignore, small maintenance tasks).

Use concise, descriptive commit messages following this pattern:

<type>(scope?): short description

Examples (dependency updates — MUST be separate commits):

- Backend dependency update (Django/requirements):

  chore: added django-rest-framework to requirements.txt

- Frontend dependency update (npm/package.json):

  chore: added @tanstack/react-query to package.json and updated package-lock.json

