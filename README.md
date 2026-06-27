# Gaelic Live

Live scorekeeping and match reporting app for GAA referees.

## What this repo is

Three separate apps that will talk to each other:

| Folder | Who uses it | Purpose |
|--------|-------------|---------|
| `backend/` | Server (not seen by users) | Store match data, stream live scores |
| `mobile/` | Referee on the pitch | Keep score during a match |
| `spectator/` | Public web page | Watch the live score |

They live in one Git repo (a **monorepo**) so you can develop and version them together.

## Current status

**Scaffolding only** — folders are in place; no app code yet.

```
gaelic-live-app/
├── backend/
│   ├── app/                 # Python package (API code will live here)
│   └── requirements.txt     # Python dependencies (empty for now)
├── mobile/                  # Expo / React Native app (not created yet)
├── spectator/               # React web app (not created yet)
├── .gitignore
├── LICENSE
└── README.md
```

## Next steps (in order)

1. **Backend** — add FastAPI, a hello-world endpoint, run it locally
2. **Mobile** — create the Expo app, one screen that calls the backend
3. **Spectator** — create the React web app (later)

## License

See [LICENSE](LICENSE).
