# GA4 Data API and Dimensions

The Google Analytics Data API reports on dimensions and metrics through report requests.

## Core facts

- Dimensions are qualitative attributes used to group and filter data.
- The API exposes report methods such as `runReport` and `runRealtimeReport`.
- Real-time reporting covers a more limited subset of dimensions and metrics than core reporting.
- The Data API can provide metadata and compatibility checks for report construction.

## Practical guidance

- Use dimensions to segment data by meaningful attributes.
- Check compatibility before building complex reports.
- Expect differences between the API and UI reporting surfaces.

## Common mistakes

- Assuming a dashboard metric is the same as an API metric without checking definitions.
- Using dimensions that do not align with the question.
- Ignoring the limits of real-time reporting.
