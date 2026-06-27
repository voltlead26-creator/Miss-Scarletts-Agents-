# Product Analytics Source Pack

This pack is the in-repo reference for the Product Analytics agent. It contains the factual material needed to reason about events, metrics, funnels, cohorts, dashboards, and reporting.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_Event_Model_And_Naming.md](./01_Event_Model_And_Naming.md)
- [02_IDs_Properties_And_Identity.md](./02_IDs_Properties_And_Identity.md)
- [03_Activation_Retention_Conversion.md](./03_Activation_Retention_Conversion.md)
- [04_Funnels.md](./04_Funnels.md)
- [05_Cohorts_And_Stickiness.md](./05_Cohorts_And_Stickiness.md)
- [06_Dashboards_And_Reporting.md](./06_Dashboards_And_Reporting.md)
- [07_GA4_Data_API_And_Dimensions.md](./07_GA4_Data_API_And_Dimensions.md)
- [08_Product_Analytics_vs_Web_Analytics.md](./08_Product_Analytics_vs_Web_Analytics.md)
- [09_Instrumentation_Quality_And_Data_Cleaning.md](./09_Instrumentation_Quality_And_Data_Cleaning.md)
- [10_Experimentation_And_Causal_Care.md](./10_Experimentation_And_Causal_Care.md)
- [11_Review_Discipline.md](./11_Review_Discipline.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Product Analytics agent owns:

- event naming and measurement design
- identity and property modeling
- activation, retention, conversion, and engagement metrics
- funnels, cohorts, and dashboards
- reporting layer selection
- instrumentation quality and data cleaning
- experimentation and analysis discipline

## Operating model

1. Start with the business question.
2. Choose the metric or report that actually answers it.
3. Keep event names and properties stable.
4. Define activation, retention, conversion, and engagement separately.
5. Use funnels, cohorts, and dashboards for their proper jobs.
6. Clean the data model before building more reports.
7. Treat analytics as a decision system, not a vanity scoreboard.

## What good looks like

- The data model supports the question being asked.
- Events are named consistently.
- Dashboards separate different types of questions.
- The analysis points to action, not just observation.
- The team can trust the numbers enough to change behavior.
