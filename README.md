# CowinHistory

A historical Django and React experiment that collected Indian vaccination-slot observations and explored near-term availability forecasts.

> This repository documents an earlier project. It is not a current vaccination-booking service, and its forecasts should not be treated as reliable medical or availability guidance. Current compatibility with third-party services has not been verified.

## The idea

Vaccination-slot availability changes over time. CowinHistory explored how historical observations could be collected, presented at the vaccination-center level, and used to estimate near-term availability.

## Project scope

- Vaccination-data collection and parsing workflows.
- Center-level history and forecast presentation.
- An experimental Keras neural network trained on historical observations.
- Telegram integration.

## Technology

**Frontend:** React, Redux, React Router  
**Backend:** Python, Django REST, MySQL  
**Forecasting:** Keras

## Repository layout

- `Frontend/` — frontend application files.
- `slotAnalyzer/` — backend and analysis project files.
- `Backup/` — historical project material.

## Status and limitations

- This is historical, experimental work; no claim of current service availability is made.
- Forecasts were exploratory estimates, not guaranteed slot availability.
- Dependencies, API access, and integrations need review before attempting to run it today. A verified current setup guide is not yet provided.
- No license has been selected for this repository.

[Project context and other work](https://www.mayurkarmakar.com/)
