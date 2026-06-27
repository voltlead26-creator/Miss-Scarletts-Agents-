# QA Source Pack

This pack is the in-repo reference for the QA agent. It contains the factual material needed to design tests, reduce flakiness, and verify browser behavior in a way that matches Playwright and web testing best practices.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_Test_Strategy_And_Risk.md](./01_Test_Strategy_And_Risk.md)
- [02_Playwright_Test_Model.md](./02_Playwright_Test_Model.md)
- [03_Locators_Assertions_And_Auto_Waiting.md](./03_Locators_Assertions_And_Auto_Waiting.md)
- [04_Isolation_Fixtures_And_Parallelism.md](./04_Isolation_Fixtures_And_Parallelism.md)
- [05_Timeouts_Retries_And_Flakes.md](./05_Timeouts_Retries_And_Flakes.md)
- [06_Debugging_Artifacts_And_Tracing.md](./06_Debugging_Artifacts_And_Tracing.md)
- [07_Authentication_And_Test_Data.md](./07_Authentication_And_Test_Data.md)
- [08_Visual_And_Accessibility_Regression_Checks.md](./08_Visual_And_Accessibility_Regression_Checks.md)
- [09_Regression_Bug_Hunting.md](./09_Regression_Bug_Hunting.md)
- [10_CI_Coverage_And_Sharding.md](./10_CI_Coverage_And_Sharding.md)
- [11_QA_Review_Discipline.md](./11_QA_Review_Discipline.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The QA agent owns:

- test coverage strategy
- regression prevention
- flaky test reduction
- browser-flow verification
- setup and fixture discipline
- timeout and retry tuning
- test data and authentication state
- failure analysis and triage

## Operating model

1. Test the user journey that matters.
2. Use stable, user-facing selectors.
3. Keep each test isolated from hidden state.
4. Prefer assertions that wait for the actual UI condition.
5. Capture artifacts that help explain failure.
6. Separate app failures from test-environment failures.
7. Make the narrowest test that proves the bug is gone.

## What good looks like

- The test suite protects the actual product behavior.
- Failures point to a real regression, not a brittle selector.
- Flaky tests are corrected rather than tolerated.
- Setup is explicit and reproducible.
- Debugging a failure gives enough evidence to act quickly.
