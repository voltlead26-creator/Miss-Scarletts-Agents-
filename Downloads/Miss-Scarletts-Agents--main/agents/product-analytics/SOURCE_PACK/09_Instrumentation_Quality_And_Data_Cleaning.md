# Instrumentation Quality and Data Cleaning

Analytics is only as useful as the instrumentation behind it.

## Core facts

- Event names should be normalized.
- Internal users should often be filtered out of product analysis.
- Client-side event buffering can affect when data appears.

## Practical guidance

- Verify instrumentation before trusting the dashboard.
- Keep a naming guide for events and properties.
- Document how to handle test traffic, staff accounts, and duplicate events.

## Common mistakes

- Letting one event name fragment into many near-duplicates.
- Measuring internal usage as customer usage.
- Ignoring data quality problems because the chart still renders.
