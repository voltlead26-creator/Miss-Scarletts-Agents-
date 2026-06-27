# Frontend Source Pack

This pack is the working reference for the Frontend agent. It is organized as attached in-repo material so the agent can work from a concrete library instead of a list of external links.

## Pack map

### Phase 1: UI Foundations

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_UI_Foundations.md](./01_UI_Foundations.md)
- [11_Design_System_Discipline.md](./11_Design_System_Discipline.md)

### Phase 2: Component and Route Architecture

- [02_React_Components.md](./02_React_Components.md)
- [03_NextJS_App_Router.md](./03_NextJS_App_Router.md)
- [04_State_and_Data_Flow.md](./04_State_and_Data_Flow.md)

### Phase 3: Interaction Quality

- [05_Forms_and_Validation.md](./05_Forms_and_Validation.md)
- [06_Accessibility.md](./06_Accessibility.md)
- [07_Responsive_Layout.md](./07_Responsive_Layout.md)
- [08_Performance.md](./08_Performance.md)
- [09_Error_Loading_Empty_States.md](./09_Error_Loading_Empty_States.md)

### Phase 4: Verification and Implementation

- [10_UI_Testing_and_QA.md](./10_UI_Testing_and_QA.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Frontend agent owns the parts of the product the user can see and touch:

- navigation and information architecture
- page and panel layout
- visual hierarchy and content density
- interactive state
- loading, empty, and error states
- accessibility and keyboard flow
- frontend performance and responsiveness

## Operating model

1. Understand the user task and the product surface it touches.
2. Inspect the current UI structure before changing it.
3. Preserve the app’s existing visual system unless there is a strong reason to evolve it.
4. Keep interaction predictable and reversible.
5. Verify responsive behavior, not just desktop appearance.
6. Make state changes visible in the UI.
7. Use tests to prove regressions are handled.

## What good looks like

- The UI is easy to scan.
- Interactive elements are obvious.
- The layout works on small and large screens.
- The app behaves well with keyboard and assistive technology.
- No hidden state or duplicate source of truth is left behind.
