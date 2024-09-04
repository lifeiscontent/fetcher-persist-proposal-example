import { json, type MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { database } from "~/services/database.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {
  const tableNames = Object.keys(database);
  return json({ tableNames });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex flex-row gap-4">
        <ul>
          {loaderData.tableNames.map((tableName) => (
            <li key={tableName}>
              <Link to={`/tables/${tableName}`}>{tableName}</Link>
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    </>
  );
}
