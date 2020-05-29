import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip,Legend,CartesianGrid } from "recharts";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

//Load the full build.
var _ = require("lodash");

export default function Statistics() {
  const query = gql`
    {
      allCompanies {
        companyName
        projectsCount
      }
    }
  `;

  const { loading, error, data } = useQuery(query);

  if (loading)
    // If still loading
    return "Loading...";
  if (error)
    // It there came an error
    return `Error ${error.message}`;

  var result = _(data.allCompanies)
    .groupBy((x) => x.companyName)
    .map((value, key) => ({
      companyName: key,
      projectsCount: _.sumBy(value, "projectsCount"),
    }))
    .value();
  return (
    <div>
      <BarChart
        width={1000}
        height={500}
        data={result}
        margin={{
          top: 5,
          right: 30,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="companyName" />
        <YAxis />
        <Tooltip/>
        <Legend />
        <Bar dataKey="projectsCount" fill="#00c2c7"/>
      </BarChart>
    </div>
  );
}
