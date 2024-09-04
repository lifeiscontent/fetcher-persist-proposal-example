# Remix Persist Proposal

with the `persist` key in a fetcher, you would be able to opt-out of persisting the data, and continue to use the same fetcher by key to access the same data.

To illustrate the problem, you can boot up the app, goto the `users` table, and filter by something.

next, if you change tables, you'll notice that the data is stale.

Even if you were to dynamically generate the key from the table name, you'd still have the same problem, in the scenario that the underlining data changes.
