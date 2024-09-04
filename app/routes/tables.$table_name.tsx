import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { database } from "~/services/database.server";

function eq(a: unknown, b: unknown) {
  return String(a) === String(b);
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { table_name } = params;
  if (table_name !== "users" && table_name !== "posts") {
    throw new Response("Not Found", { status: 404 });
  }

  return json(database[table_name]);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { table_name } = params;
  if (table_name !== "users" && table_name !== "posts") {
    throw new Response("Not Found", { status: 404 });
  }
  const formData = await request.formData();
  const filters = Object.fromEntries(formData.entries());
  const filteredData = database[table_name].filter((row) => {
    return Object.entries(filters).every(([columnName, value]) => {
      return value === ""
        ? true
        : eq(row[columnName as keyof typeof row], value);
    });
  });

  return json(filteredData);
}

export default function Route() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();
  // in a real app, you could imagine having many fetchers with the same key to access the same data
  // but for this example, we're just using one fetcher
  const fetcher = useFetcher<typeof action>({ key: "filters" });

  const data = fetcher.data ?? loaderData;

  return (
    <div>
      <header>
        <h1>{params.table_name}</h1>
        <fetcher.Form method="POST">
          {data[0]
            ? Object.keys(data[0]).map((columnName) => (
                <div key={columnName}>
                  <label htmlFor={columnName}>{columnName}</label>
                  <br />
                  <input name={columnName} type="text" id={columnName} />
                </div>
              ))
            : undefined}
          <button type="submit">Filter</button>
        </fetcher.Form>
      </header>
      <table>
        <thead>
          <tr>
            {data[0]
              ? Object.keys(data[0]).map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))
              : undefined}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {Object.values(row).map((column, index) => (
                <td key={index}>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
