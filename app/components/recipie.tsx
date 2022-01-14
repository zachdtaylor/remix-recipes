import React from "react";
import { useFetcher, useLoaderData } from "remix";

export function Recipie() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  return (
    <div>
      <h1>{data.name}</h1>
      {JSON.stringify(fetcher.data)}
    </div>
  );
}
